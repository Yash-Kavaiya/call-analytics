import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { adminDb } from '@/lib/firebase-admin';
import { Organization, OrganizationMember } from '@/types';

// GET current organization
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

    const orgData = orgDoc.data() as Organization;

    // Get members
    const membersSnapshot = await adminDb
      .collection('organizations')
      .doc(session.user.organizationId)
      .collection('members')
      .get();

    const members: OrganizationMember[] = membersSnapshot.docs.map(
      (doc) => doc.data() as OrganizationMember
    );

    return NextResponse.json({
      success: true,
      data: {
        ...orgData,
        members,
      },
    });
  } catch (error) {
    console.error('Get organization error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get organization data' },
      { status: 500 }
    );
  }
}

// UPDATE organization (only owner/admin)
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if user is owner or admin
    if (session.user.role !== 'owner' && session.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Only owners and admins can update organization settings' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { name } = body;

    // Only allow updating specific fields
    const updateData: Partial<Organization> = {};
    if (name) updateData.name = name;
    updateData.updatedAt = new Date();

    await adminDb
      .collection('organizations')
      .doc(session.user.organizationId)
      .update(updateData);

    return NextResponse.json({
      success: true,
      data: updateData,
    });
  } catch (error) {
    console.error('Update organization error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update organization' },
      { status: 500 }
    );
  }
}
