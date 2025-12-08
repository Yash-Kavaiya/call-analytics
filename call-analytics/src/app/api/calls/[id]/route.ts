import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { adminDb } from '@/lib/firebase-admin';

// GET - Get single call details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;

    const callDoc = await adminDb
      .collection('organizations')
      .doc(session.user.organizationId)
      .collection('calls')
      .doc(id)
      .get();

    if (!callDoc.exists) {
      return NextResponse.json(
        { success: false, error: 'Call not found' },
        { status: 404 }
      );
    }

    const callData = callDoc.data();

    return NextResponse.json({
      success: true,
      data: {
        id: callDoc.id,
        ...callData,
        createdAt: callData?.createdAt?.toDate?.()?.toISOString() || null,
        processedAt: callData?.processedAt?.toDate?.()?.toISOString() || null,
      },
    });
  } catch (error) {
    console.error('Get call error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch call' },
      { status: 500 }
    );
  }
}

// PATCH - Update call record
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();

    // Only allow updating specific fields
    const allowedFields = [
      'status',
      'audioUrl',
      'duration',
      'transcript',
      'sentiment',
      'sentimentScore',
      'topics',
      'summary',
      'keywords',
      'qualityScore',
      'analysis',
      'error',
      'processedAt',
      'phoneNumber',
      'customerName',
    ];

    const updateData: Record<string, unknown> = {};
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
      }
    }

    await adminDb
      .collection('organizations')
      .doc(session.user.organizationId)
      .collection('calls')
      .doc(id)
      .update(updateData);

    return NextResponse.json({
      success: true,
      data: updateData,
    });
  } catch (error) {
    console.error('Update call error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update call' },
      { status: 500 }
    );
  }
}

// DELETE - Delete call record
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Only owners and admins can delete
    if (session.user.role !== 'owner' && session.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Only owners and admins can delete calls' },
        { status: 403 }
      );
    }

    const { id } = await params;

    await adminDb
      .collection('organizations')
      .doc(session.user.organizationId)
      .collection('calls')
      .doc(id)
      .delete();

    return NextResponse.json({
      success: true,
      message: 'Call deleted successfully',
    });
  } catch (error) {
    console.error('Delete call error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete call' },
      { status: 500 }
    );
  }
}
