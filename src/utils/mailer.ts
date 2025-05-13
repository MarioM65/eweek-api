// utils/mailer.ts
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'sistemadedetacaoealertadeacide@gmail.com',
    pass: 'ulih etge izhy crrg',
  },
});

interface EmailData {
  para: string;
  user: string;
  data: string;
  hora: string;
  localizacao: string;
}

export async function enviarEmail(data: EmailData) {
  const html = `
    <div style="font-family: Arial, sans-serif; color: #333;">
      <h2 style="color: #e53935;">🚨 Alerta de Acidente Detectado!</h2>

      <p>Olá,</p>

      <p>O sistema <strong>SDA - Sistema de Detecção de Acidentes</strong> identificou um possível acidente com o veículo registrado.</p>

      <h3>📍 Detalhes:</h3>
      <ul>
        <li><strong>Data:</strong> ${data.data}</li>
        <li><strong>Hora:</strong> ${data.hora}</li>
        <li><strong>Localização:</strong> ${data.localizacao}</li>
        <li><strong>Condutor:</strong> ${data.user}</li>
      </ul>

      <p>As autoridades e os contatos de emergência estão sendo notificados automaticamente.</p>

      <p style="margin-top: 40px; font-size: 12px; color: #888;">Este é um e-mail automático enviado pelo SDA. Não é necessário responder.</p>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: '"SDA - Detecção de Acidentes" <sistemadedetacaoealertadeacide@gmail.com>',
      to: data.para,
      subject: '🚨 Acidente Detectado - Sistema SDA',
      html,
    });
    console.log('Email enviado com sucesso!');
  } catch (error:any) {
    console.error('Erro ao enviar email:', error);
    throw new Error('Erro ao enviar email: ' + error.message);
  }
}