import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { adminAuth } from '@/lib/firebase-admin';

export async function POST() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Create a custom token for the user
    const customToken = await adminAuth.createCustomToken(session.user.id, {
      email: session.user.email,
      role: session.user.role,
      organizationId: session.user.organizationId,
    });

    return NextResponse.json({ token: customToken });
  } catch (error) {
    console.error('Firebase token generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate token' },
      { status: 500 }
    );
  }
}
