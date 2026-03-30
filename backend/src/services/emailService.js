const nodemailer = require('nodemailer');
const { resetPasswordTemplate } = require('./resetPasswordTemplate');
const SystemConfig = require('../models/SystemConfig');

class EmailService {
  constructor() {
    this.transporter = null;
    this.initialized = false;
    this.appName = 'MODACOLOMBIA';
    this.heroImageUrl = 'https://images.pexels.com/photos/8386654/pexels-photo-8386654.jpeg?auto=compress&cs=tinysrgb&w=1200&h=500&dpr=1';
  }

  /**
   * Inicializar transporter
   * En desarrollo usa Ethereal automáticamente si no hay SMTP configurado
   */
  async init() {
    if (this.initialized) {
      console.log('📧 [EmailService] Transport ya inicializado');
      return;
    }

    // Obtener config de env en este momento (no en constructor)
    const smtpUser = process.env.SMTP_USER;
    const smtpHost = process.env.SMTP_HOST;
    const emailFrom = process.env.EMAIL_FROM;
    const frontendUrl = process.env.FRONTEND_URL;
    const configuredAppName = process.env.APP_NAME;
    const configuredHeroImageUrl = process.env.EMAIL_HERO_IMAGE_URL;
    try {
      const dbAppName = await SystemConfig.getValue('app_name');
      this.appName = dbAppName || configuredAppName || this.appName;
    } catch (error) {
      this.appName = configuredAppName || this.appName;
    }
    this.heroImageUrl = configuredHeroImageUrl || this.heroImageUrl;

    console.log('📧 [EmailService] Inicializando transport...');
    console.log('📧 [EmailService] SMTP_HOST:', smtpHost || 'smtp.gmail.com (default)');
    console.log('📧 [EmailService] SMTP_PORT:', process.env.SMTP_PORT || '587 (default)');
    console.log('📧 [EmailService] SMTP_USER configurado:', Boolean(smtpUser));

    if (!smtpUser) {
      console.log('📧 [EmailService] Modo desarrollo: usando Ethereal');
      const testAccount = await nodemailer.createTestAccount();
      
      this.transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass
        }
      });
      
      this.from = testAccount.user;
      this.initialized = true;
      console.log('📧 [EmailService] Ethereal listo:', testAccount.user);
      return;
    }

    this.transporter = nodemailer.createTransport({
      host: smtpHost || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_PORT === '465',
      auth: {
        user: smtpUser,
        pass: process.env.SMTP_PASS
      }
    });

    this.from = emailFrom || smtpUser;
    this.frontendUrl = frontendUrl || 'http://localhost:5173';
    this.initialized = true;
    console.log('📧 [EmailService] SMTP real listo. From:', this.from);
  }

  /**
   * Enviar email genérico
   */
  async sendEmail({ to, subject, html }) {
    console.log('📧 [EmailService] sendEmail() inicio');
    console.log('📧 [EmailService] Destino:', to);
    console.log('📧 [EmailService] Asunto:', subject);

    await this.init();

    const mailOptions = {
      from: this.from,
      to,
      subject,
      html
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      
      const previewUrl = nodemailer.getTestMessageUrl(info);
      console.log('📧 [EmailService] Email enviado OK. MessageId:', info.messageId);
      if (previewUrl) {
        console.log('📧 [EmailService] Preview URL (Ethereal):', previewUrl);
      }
      return { success: true, messageId: info.messageId, previewUrl };
    } catch (error) {
      console.error('❌ Error enviando email:', error.message);
      console.error('❌ [EmailService] Error code:', error.code || 'N/A');
      console.error('❌ [EmailService] Error response:', error.response || 'N/A');
      return { success: false, error: error.message };
    }
  }

  /**
   * Enviar email de reset password
   */
  async sendResetPasswordEmail({ email, token, userName }) {
    console.log('📧 [EmailService] sendResetPasswordEmail() para:', email);
    const frontendUrl = this.frontendUrl || process.env.FRONTEND_URL || 'http://localhost:5173';
    const resetUrl = `${frontendUrl}/reset-password?token=${token}`;
    console.log('📧 [EmailService] URL reset generada:', resetUrl);
    
    const html = resetPasswordTemplate({
      userName,
      resetUrl,
      expiresIn: '15 minutos',
      appName: this.appName,
      heroImageUrl: this.heroImageUrl
    });
    console.log('📧 [EmailService] Template HTML generado. Longitud:', html.length);

    return this.sendEmail({
      to: email,
      subject: `Restablece tu contraseña - ${this.appName}`,
      html
    });
  }
}

// Exportar la clase (no singleton) para que se instance después de dotenv
module.exports = EmailService;
