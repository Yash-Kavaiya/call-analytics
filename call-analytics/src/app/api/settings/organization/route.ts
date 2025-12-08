import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { adminDb, adminAuth } from '@/lib/firebase-admin';
import { Timestamp } from 'firebase-admin/firestore';

// GET organization settings
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const orgDoc = await adminDb
      .collection('organizations')
      .doc(session.user.organizationId)
      .get();

    if (!orgDoc.exists) {
      return NextResponse.json(
        { success: false, error: 'Organization not found' },
        { status: 404 }
      );
    }

    const orgData = orgDoc.data();

    return NextResponse.json({
      success: true,
      data: {
        id: session.user.organizationId,
        name: orgData?.name,
        plan: orgData?.plan,
        ownerId: orgData?.ownerId,
        createdAt: orgData?.createdAt?.toDate?.()?.toISOString() || null,
      },
    });
  } catch (error) {
    console.error('Get organization error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get organization' },
      { status: 500 }
    );
  }
}

// UPDATE organization settings
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Only owner/admin can update
    if (session.user.role !== 'owner' && session.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Only owners and admins can update organization' },
        { status: 403 }
      );
    }

    const { name } = await request.json();

    if (!name || name.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: 'Organization name must be at least 2 characters' },
        { status: 400 }
      );
    }

    await adminDb
      .collection('organizations')
      .doc(session.user.organizationId)
      .update({
        name: name.trim(),
        updatedAt: Timestamp.now(),
      });

    return NextResponse.json({
      success: true,
      message: 'Organization updated successfully',
    });
  } catch (error) {
    console.error('Update organization error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update organization' },
      { status: 500 }
    );
  }
}

// DELETE organization (owner only)
export async function DELETE() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Only owner can delete
    if (session.user.role !== 'owner') {
      return NextResponse.json(
        { success: false, error: 'Only the organization owner can delete it' },
        { status: 403 }
      );
    }

    const orgId = session.user.organizationId;

    // Get all members
    const membersSnapshot = await adminDb
      .collection('organizations')
      .doc(orgId)
      .collection('members')
      .get();

    // Delete all member documents and their user accounts
    const batch = adminDb.batch();
    const userIds: string[] = [];

    membersSnapshot.docs.forEach((doc) => {
      userIds.push(doc.id);
      batch.delete(doc.ref);
    });

    // Delete all calls
    const callsSnapshot = await adminDb
      .collection('organizations')
      .doc(orgId)
      .collection('calls')
      .get();

    callsSnapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });

    // Delete all orders
    const ordersSnapshot = await adminDb
      .collection('organizations')
      .doc(orgId)
      .collection('orders')
      .get();

    ordersSnapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });

    // Delete all payments
    const paymentsSnapshot = await adminDb
      .collection('organizations')
      .doc(orgId)
      .collection('payments')
      .get();

    paymentsSnapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });

    // Delete organization document
    batch.delete(adminDb.collection('organizations').doc(orgId));

    // Commit batch
    await batch.commit();

    // Delete user documents and Firebase Auth users
    for (const userId of userIds) {
      await adminDb.collection('users').doc(userId).delete();
      try {
        await adminAuth.deleteUser(userId);
      } catch (e) {
        console.error(`Failed to delete auth user ${userId}:`, e);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Organization deleted successfully',
    });
  } catch (error) {
    console.error('Delete organization error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete organization' },
      { status: 500 }
    );
  }
}
