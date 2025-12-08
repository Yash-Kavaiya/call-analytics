import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { adminDb } from '@/lib/firebase-admin';
import { User } from '@/types';

// GET current user
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userDoc = await adminDb.collection('users').doc(session.user.id).get();
    
    if (!userDoc.exists) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    const userData = userDoc.data() as User;

    return NextResponse.json({
      success: true,
      data: userData,
    });
  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get user data' },
      { status: 500 }
    );
  }
}

// UPDATE current user
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, avatar } = body;

    // Only allow updating specific fields
    const updateData: Partial<User> = {};
    if (name) updateData.name = name;
    if (avatar !== undefined) updateData.avatar = avatar;
    updateData.updatedAt = new Date();

    await adminDb.collection('users').doc(session.user.id).update(updateData);

    // Also update in organization members
    await adminDb
      .collection('organizations')
      .doc(session.user.organizationId)
      .collection('members')
      .doc(session.user.id)
      .update({ name: name || session.user.name });

    return NextResponse.json({
      success: true,
      data: updateData,
    });
  } catch (error) {
    console.error('Update user error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update user' },
      { status: 500 }
    );
  }
}
