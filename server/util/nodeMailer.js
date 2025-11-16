import nodemailer from 'nodemailer';

let transporter;

// creates a test user 
export async function initMailer() {
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
            user: testAccount.user,
            pass: testAccount.pass,
        },
    });
    console.log("Ethereal mail account created:", testAccount.user);
}

// checks for test user and sends email
export async function resetEmail(toEmail, resetLink) {
    if (!transporter) {
        throw new Error("Transporter not initialized. Call initMailer() first.");
    }

    const info = await transporter.sendMail({
        from: '"Din App" <no-reply@dinapp.com>',
        to: toEmail,
        subject: "Nulstil dit password",
        html: `<p>Klik på linket nedenfor for at nulstille dit password:</p>
               <a href="${resetLink}">${resetLink}</a>`,
    });

    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}
