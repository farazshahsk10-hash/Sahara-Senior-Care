import crypto from 'crypto';
import { Request, Response, NextFunction } from 'express';
import { eq } from 'drizzle-orm';
import { adminAuth } from '../lib/firebase-admin.ts';
import { db } from '../db/index.ts';
import { users } from '../db/schema.ts';

export type AppRole = 'super_admin' | 'admin' | 'family' | 'caregiver' | 'doctor';

export interface AuthenticatedPrincipal {
  uid: string;
  email: string;
  role: AppRole;
  isDemo: boolean;
  userId?: number;
  fullName: string;
}

export interface AuthRequest extends Request {
  principal?: AuthenticatedPrincipal;
}

// Runtime secret for signing short-lived demo workspace tokens (never hardcoded)
const DEMO_SIGNING_KEY =
  process.env.SESSION_SECRET || crypto.randomBytes(32).toString('hex');

const ADMIN_EMAILS = new Set(['farazshahsk10@gmail.com']);

export function createDemoToken(role: Exclude<AppRole, 'super_admin'>): string {
  const payload = {
    demo: true,
    role,
    exp: Date.now() + 1000 * 60 * 60 * 6, // 6 hours
  };
  const encoded = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const sig = crypto
    .createHmac('sha256', DEMO_SIGNING_KEY)
    .update(encoded)
    .digest('base64url');
  return `demo.${encoded}.${sig}`;
}

function verifyDemoToken(token: string): AuthenticatedPrincipal | null {
  if (!token.startsWith('demo.')) return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  const [, encoded, sig] = parts;
  const expectedSig = crypto
    .createHmac('sha256', DEMO_SIGNING_KEY)
    .update(encoded)
    .digest('base64url');

  const sigBuf = Buffer.from(sig);
  const expBuf = Buffer.from(expectedSig);
  if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
    return null;
  }

  try {
    const parsed = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8'));
    if (!parsed.demo || typeof parsed.exp !== 'number' || Date.now() > parsed.exp) {
      return null;
    }
    const role = parsed.role as AppRole;
    if (!['admin', 'family', 'caregiver', 'doctor'].includes(role)) {
      return null;
    }
    const labelMap: Record<string, { uid: string; email: string; fullName: string }> = {
      admin: {
        uid: 'demo-admin',
        email: 'admin.demo@saharacare.example',
        fullName: 'Sara Mansoor (Demo Admin)',
      },
      family: {
        uid: 'demo-family',
        email: 'family.demo@saharacare.example',
        fullName: 'Zara Tariq (Demo Family)',
      },
      caregiver: {
        uid: 'demo-caregiver',
        email: 'caregiver.demo@saharacare.example',
        fullName: 'Ayesha Siddiqui (Demo Caregiver)',
      },
      doctor: {
        uid: 'demo-doctor',
        email: 'doctor.demo@saharacare.example',
        fullName: 'Dr. Sana Iqbal (Demo GP)',
      },
    };
    const meta = labelMap[role];
    return {
      uid: meta.uid,
      email: meta.email,
      fullName: meta.fullName,
      role,
      isDemo: true,
    };
  } catch {
    return null;
  }
}

export async function getOrCreateDbUser(
  uid: string,
  email: string,
  fullName?: string
) {
  const defaultRole: AppRole = ADMIN_EMAILS.has(email.toLowerCase()) ? 'admin' : 'family';
  const existing = await db.select().from(users).where(eq(users.uid, uid)).limit(1);
  if (existing.length > 0) {
    return existing[0];
  }
  const inserted = await db
    .insert(users)
    .values({
      uid,
      email,
      fullName: fullName || email.split('@')[0],
      role: defaultRole,
      status: 'Active',
    })
    .onConflictDoUpdate({
      target: users.uid,
      set: { email },
    })
    .returning();
  return inserted[0];
}

export const requireAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  const token = authHeader.slice('Bearer '.length).trim();

  // Check signed demo token first (explicitly scoped to demo mode)
  const demoPrincipal = verifyDemoToken(token);
  if (demoPrincipal) {
    req.principal = demoPrincipal;
    return next();
  }

  // Otherwise verify real Firebase ID Token
  try {
    const decoded = await adminAuth.verifyIdToken(token);
    const email = decoded.email || `${decoded.uid}@user.local`;
    const dbUser = await getOrCreateDbUser(
      decoded.uid,
      email,
      typeof decoded.name === 'string' ? decoded.name : undefined
    );
    req.principal = {
      uid: decoded.uid,
      email: dbUser.email,
      fullName: dbUser.fullName,
      role: dbUser.role as AppRole,
      isDemo: false,
      userId: dbUser.id,
    };
    return next();
  } catch (err) {
    console.error('Token verification failed:', err);
    return res.status(401).json({ error: 'Invalid or expired authentication token' });
  }
};

export const requireRole = (...allowedRoles: AppRole[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.principal) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    if (!allowedRoles.includes(req.principal.role)) {
      return res
        .status(403)
        .json({ error: 'Insufficient role permissions for this resource' });
    }
    return next();
  };
};
