import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { adminDb } from '@/lib/firebase-admin';
import { Timestamp } from 'firebase-admin/firestore';
import { PLAN_LIMITS } from '@/types';

// GET - List calls for organization
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');
    const status = searchParams.get('status');

    let query = adminDb
      .collection('organizations')
      .doc(session.user.organizationId)
      .collection('calls')
      .orderBy('createdAt', 'desc')
      .limit(limit);

    if (status) {
      query = query.where('status', '==', status);
    }

    const snapshot = await query.get();

    const calls = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || null,
      processedAt: doc.data().processedAt?.toDate?.()?.toISOString() || null,
    }));

    return NextResponse.json({
      success: true,
      data: calls,
    });
  } catch (error) {
    console.error('Get calls error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch calls' },
      { status: 500 }
    );
  }
}

// POST - Create new call record
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check plan limits
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
    const plan = (orgData?.plan as 'starter' | 'professional' | 'enterprise') || 'starter';
    const planLimits = PLAN_LIMITS[plan];

    if (orgData?.callsThisMonth >= planLimits.calls) {
      return NextResponse.json(
        { success: false, error: 'Monthly call limit reached. Please upgrade your plan.' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { fileName, fileSize, mimeType, phoneNumber, customerName } = body;

    // Create call document
    const callRef = adminDb
      .collection('organizations')
      .doc(session.user.organizationId)
      .collection('calls')
      .doc();

    const callData = {
      id: callRef.id,
      fileName,
      fileSize,
      mimeType,
      phoneNumber: phoneNumber || null,
      customerName: customerName || null,
      status: 'uploading',
      agentId: session.user.id,
      agentName: session.user.name,
      organizationId: session.user.organizationId,
      createdAt: Timestamp.now(),
    };

    await callRef.set(callData);

    return NextResponse.json({
      success: true,
      data: {
        ...callData,
        createdAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Create call error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create call record' },
      { status: 500 }
    );
  }
}
