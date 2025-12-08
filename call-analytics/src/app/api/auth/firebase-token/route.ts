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
        // We use the user's ID as the potential Firebase UID
        const customToken = await adminAuth.createCustomToken(session.user.id, {
            organizationId: session.user.organizationId,
            role: session.user.role || 'user'
        });

        return NextResponse.json({ token: customToken });

    } catch (error) {
        console.error('Error creating custom token:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
