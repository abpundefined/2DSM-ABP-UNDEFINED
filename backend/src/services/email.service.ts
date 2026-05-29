import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "sandbox.smtp.mailtrap.io",
  port: parseInt(process.env.SMTP_PORT || "2525", 10),
  auth: {
    user: process.env.SMTP_USER || "",
    pass: process.env.SMTP_PASS || "",
  },
});

export const emailService = {
  async sendResetPasswordEmail(to: string, code: string) {
    const mailOptions = {
      from: '"Secretaria Digital Fatec" <no-reply@fatec.sp.gov.br>',
      to,
      subject: "Recuperação de Senha - Secretaria Digital Fatec",
      text: `Olá!\n\nVocê solicitou a recuperação da sua senha. Seu código de verificação é: ${code}\n\nEste código expira em 15 minutos.\n\nSe você não solicitou isso, ignore este e-mail.`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #bf0000;">Recuperação de Senha</h2>
          <p>Olá!</p>
          <p>Você solicitou a recuperação da sua senha. O seu código de verificação é:</p>
          <div style="font-size: 24px; font-weight: bold; padding: 10px; background-color: #f4f4f4; display: inline-block; border-radius: 6px; letter-spacing: 2px;">
            ${code}
          </div>
          <p>Este código expira em <strong>15 minutos</strong>.</p>
          <p style="font-size: 12px; color: #777; margin-top: 30px;">Se você não solicitou a alteração de senha, ignore este e-mail.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
  },
};
