import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase-admin';
import { registerSchema } from '@/lib/validations/auth';
import { PLAN_LIMITS } from '@/types';
import { Timestamp } from 'firebase-admin/firestore';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validationResult = registerSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { success: false, error: validationResult.error.issues[0].message },
        { status: 400 }
      );
    }

    const { name, email, password, organizationName } = validationResult.data;

    // Check if user already exists
    try {
      await adminAuth.getUserByEmail(email);
      return NextResponse.json(
        { success: false, error: 'An account with this email already exists' },
        { status: 400 }
      );
    } catch {
      // User doesn't exist, continue with registration
    }

    // Create Firebase Auth user
    const userRecord = await adminAuth.createUser({
      email,
      password,
      displayName: name,
    });

    const now = Timestamp.now();

    // Create organization in Firestore
    const orgRef = adminDb.collection('organizations').doc();
    const organizationData = {
      id: orgRef.id,
      name: organizationName,
      plan: 'starter' as const,
      ownerId: userRecord.uid,
      callsThisMonth: 0,
      callsLimit: PLAN_LIMITS.starter.calls,
      createdAt: now,
      updatedAt: now,
    };
    await orgRef.set(organizationData);

    // Create user in Firestore
    const userData = {
      id: userRecord.uid,
      email,
      name,
      role: 'owner' as const,
      organizationId: orgRef.id,
      createdAt: now,
      updatedAt: now,
    };
    await adminDb.collection('users').doc(userRecord.uid).set(userData);

    // Add user as organization member
    await adminDb
      .collection('organizations')
      .doc(orgRef.id)
      .collection('members')
      .doc(userRecord.uid)
      .set({
        userId: userRecord.uid,
        email,
        name,
        role: 'owner',
        joinedAt: now,
      });

    return NextResponse.json({
      success: true,
      data: {
        userId: userRecord.uid,
        organizationId: orgRef.id,
      },
    });
  } catch (error: unknown) {
    console.error('Registration error:', error);
    
    // Provide more specific error messages
    let errorMessage = 'Failed to create account. Please try again.';
    
    if (error instanceof Error) {
      console.error('Error details:', error.message);
      
      // Firebase Admin SDK errors
      if (error.message.includes('INVALID_ARGUMENT')) {
        errorMessage = 'Invalid input provided. Please check your details.';
      } else if (error.message.includes('EMAIL_EXISTS')) {
        errorMessage = 'An account with this email already exists.';
      } else if (error.message.includes('WEAK_PASSWORD')) {
        errorMessage = 'Password is too weak. Please use a stronger password.';
      } else if (error.message.includes('PERMISSION_DENIED')) {
        errorMessage = 'Database permission denied. Please contact support.';
      } else if (error.message.includes('private key')) {
        errorMessage = 'Server configuration error. Please contact support.';
      }
    }
    
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
