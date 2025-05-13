// src/routes/twilio.routes.ts
import { FastifyInstance } from 'fastify';
import { enviarSMS, fazerLigacao } from '../utils/twilioClient';

export default async function twilioRoutes(app: FastifyInstance) {
  app.post('/sms', async (req, res) => {
    const { para, mensagem } = req.body as { para: string; mensagem: string };
    await enviarSMS(para, mensagem);
    res.send({ sucesso: true });
  });

  app.post('/chamada', async (req, res) => {
    const { para } = req.body as { para: string };
const url = 'http://localhost:3000/api/voice';
    await fazerLigacao(para, url);
    res.send({ sucesso: true });
  });
}
