// src/routes/email.routes.ts
import { FastifyInstance } from 'fastify';
import { enviarEmail } from '../utils/mailer';
interface EmailData {
  para: string;
  user: string;
  data: string;
  hora: string;
  localizacao: string;
}
export default async function emailRoutes(app: FastifyInstance) {
app.post('/enviar-email', async (request, reply) => {
  const { emailData } = request.body as { emailData: EmailData };

  try {
    await enviarEmail(emailData);  // Passando o objeto correto
    reply.send({ sucesso: true, mensagem: 'Email enviado com sucesso' });
  } catch (error) {
    console.error(error);
    reply.status(500).send({ sucesso: false, mensagem: 'Erro ao enviar email' });
  }
});

}
