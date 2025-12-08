import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase-admin';
import { forgotPasswordSchema } from '@/lib/validations/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validationResult = forgotPasswordSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { success: false, error: validationResult.error.issues[0].message },
        { status: 400 }
      );
    }

    const { email } = validationResult.data;

    // Check if user exists
    try {
      await adminAuth.getUserByEmail(email);
    } catch {
      // Don't reveal if user exists or not for security
      return NextResponse.json({ success: true });
    }

    // Generate password reset link
    const resetLink = await adminAuth.generatePasswordResetLink(email);

    // In production, send this link via email service (SendGrid, Resend, etc.)
    // For now, we'll just log it
    console.log('Password reset link:', resetLink);

    // TODO: Send email with reset link
    // await sendEmail({
    //   to: email,
    //   subject: 'Reset your password',
    //   html: `Click here to reset your password: ${resetLink}`,
    // });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send reset email. Please try again.' },
      { status: 500 }
    );
  }
}
