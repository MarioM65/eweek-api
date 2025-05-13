import { FastifyInstance } from 'fastify';

export default async function voiceXml(app: FastifyInstance) {
  app.get('/voice', (req, reply) => {
    reply
      .header('Content-Type', 'text/xml')
      .send(`
        <Response>
          <Say voice="alice" language="pt-BR">Alerta de acidente detectado! O condutor precisa de assistência imediata.</Say>
        </Response>
      `);
  });
}