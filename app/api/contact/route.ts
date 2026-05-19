import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  try {
    const { name, email, company, jurisdiction, budget, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Name, email, and message are required.' }, { status: 400 });
    }

    const host = process.env.SMTP_HOST || '';
    const port = parseInt(process.env.SMTP_PORT || '587');
    const user = process.env.SMTP_USER || '';
    const pass = process.env.SMTP_PASS || '';

    const mailOptions = {
      from: `Sudonex Contact Form <${user || 'hello@sudonex.com'}>`,
      to: 'sudonexofficial@gmail.com',
      subject: `New iGaming Project Inquiry from ${name}`,
      text: `
Name: ${name}
Email: ${email}
Company: ${company || 'N/A'}
Jurisdiction: ${jurisdiction || 'N/A'}
Budget: ${budget || 'N/A'}

Message:
${message}
      `,
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333; max-width: 600px; border: 1px solid #eee; border-radius: 8px;">
          <h2 style="color: #7a3fff; border-bottom: 2px solid #7a3fff; padding-bottom: 8px;">New Sudonex Project Inquiry</h2>
          <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
            <tr>
              <td style="padding: 6px 0; font-weight: bold; width: 120px;">Name:</td>
              <td style="padding: 6px 0;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; font-weight: bold;">Email:</td>
              <td style="padding: 6px 0;"><a href="mailto:${email}">${email}</a></td>
            </tr>
            <tr>
              <td style="padding: 6px 0; font-weight: bold;">Company:</td>
              <td style="padding: 6px 0;">${company || 'N/A'}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; font-weight: bold;">Jurisdiction:</td>
              <td style="padding: 6px 0;">${jurisdiction || 'N/A'}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; font-weight: bold;">Budget:</td>
              <td style="padding: 6px 0;">${budget || 'N/A'}</td>
            </tr>
          </table>
          <h3 style="color: #06b6d4; margin-top: 20px; border-bottom: 1px solid #eee; padding-bottom: 4px;">Message</h3>
          <p style="white-space: pre-wrap; line-height: 1.6; color: #555;">${message}</p>
        </div>
      `,
    };

    if (host && user && pass) {
      const transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: { user, pass },
      });
      await transporter.sendMail(mailOptions);
      console.log('Email sent successfully via SMTP.');
    } else {
      console.warn('SMTP settings missing in environment variables. Logging mail options instead:');
      console.log(JSON.stringify(mailOptions, null, 2));
    }

    return NextResponse.json({ success: true, message: 'Inquiry sent successfully!' });
  } catch (error: any) {
    console.error('Error sending email:', error);
    return NextResponse.json({ error: error.message || 'Failed to send inquiry.' }, { status: 500 });
  }
}
