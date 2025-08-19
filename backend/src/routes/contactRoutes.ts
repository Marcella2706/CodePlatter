import { Router, Request, Response } from "express";
import sgMail from "@sendgrid/mail";

const router = Router();

sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

router.post("/", async (req: Request, res: Response) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const msg = {
    to: process.env.EMAIL_FROM as string,      
    from: process.env.EMAIL_FROM as string,  
    replyTo: email,                          
    subject: `[CodePlatter Contact] ${subject}`,
    text: `
      New contact form submission:
      Name: ${name}
      Email: ${email}
      Subject: ${subject}
      Message: ${message}
    `,
    html: `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <p><strong>Message:</strong><br/>${message}</p>
    `,
  };

  try {
    await sgMail.send(msg);
    return res.status(200).json({ message: "Message sent successfully" });
  } catch (error) {
    console.error("SendGrid error:", error);
    return res.status(500).json({ error: "Failed to send message" });
  }
});

export default router;
