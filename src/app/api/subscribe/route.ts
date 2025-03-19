import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { sendWelcomeEmail, sendAdminNotification } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    console.log('Received subscription request for email:', email);

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Insert into Supabase
    const { error: dbError } = await supabase
      .from('subscribers')
      .insert([{ email }]);

    console.log('Database response:', dbError ? 'Error: ' + dbError.message : 'Success');

    // Send emails regardless of whether the email is already registered
    try {
      console.log('Attempting to send emails...');
      const emailResults = await Promise.all([
        sendWelcomeEmail(email).then(() => console.log('Welcome email sent successfully')),
        sendAdminNotification(email).then(() => console.log('Admin notification sent successfully'))
      ]);
      console.log('Emails sent successfully:', emailResults);
    } catch (emailError) {
      console.error('Error sending emails:', emailError);
      // Don't fail the request if email sending fails
    }

    // Handle database response after sending emails
    if (dbError) {
      if (dbError.code === '23505') { // Unique violation
        console.log('Email already registered, returning 409');
        return NextResponse.json(
          { error: 'This email is already registered', emailsSent: true },
          { status: 409 }
        );
      }
      throw dbError;
    }

    return NextResponse.json(
      { message: 'Subscription successful' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Subscription error:', error);
    return NextResponse.json(
      { error: 'An error occurred while processing your request' },
      { status: 500 }
    );
  }
}