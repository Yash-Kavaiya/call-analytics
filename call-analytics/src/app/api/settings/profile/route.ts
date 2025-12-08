import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { adminDb, adminAuth } from '@/lib/firebase-admin';
import { Timestamp } from 'firebase-admin/firestore';

// GET profile settings
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

    const userData = userDoc.data();

    return NextResponse.json({
      success: true,
      data: {
        id: session.user.id,
        email: userData?.email,
        name: userData?.name,
        avatar: userData?.avatar,
        notifications: userData?.notifications || {
          email: true,
          callProcessed: true,
          weeklyReport: true,
          usageAlerts: true,
        },
        createdAt: userData?.createdAt?.toDate?.()?.toISOString() || null,
      },
    });
  } catch (error) {
    console.error('Get profile error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get profile' },
      { status: 500 }
    );
  }
}

// UPDATE profile settings
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
    const { name, avatar, notifications } = body;

    const updateData: Record<string, unknown> = {
      updatedAt: Timestamp.now(),
    };

    if (name !== undefined) updateData.name = name;
    if (avatar !== undefined) updateData.avatar = avatar;
    if (notifications !== undefined) updateData.notifications = notifications;

    await adminDb.collection('users').doc(session.user.id).update(updateData);

    // Update name in organization members if changed
    if (name) {
      await adminDb
        .collection('organizations')
        .doc(session.user.organizationId)
        .collection('members')
        .doc(session.user.id)
        .update({ name });
    }

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
    });
  } catch (error) {
    console.error('Update profile error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}

// DELETE account
export async function DELETE() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if user is owner - owners must transfer ownership first
    if (session.user.role === 'owner') {
      return NextResponse.json(
        { success: false, error: 'Organization owners must transfer ownership before deleting their account' },
        { status: 400 }
      );
    }

    // Remove from organization members
    await adminDb
      .collection('organizations')
      .doc(session.user.organizationId)
      .collection('members')
      .doc(session.user.id)
      .delete();

    // Delete user document
    await adminDb.collection('users').doc(session.user.id).delete();

    // Delete Firebase Auth user
    await adminAuth.deleteUser(session.user.id);

    return NextResponse.json({
      success: true,
      message: 'Account deleted successfully',
    });
  } catch (error) {
    console.error('Delete account error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete account' },
      { status: 500 }
    );
  }
}
