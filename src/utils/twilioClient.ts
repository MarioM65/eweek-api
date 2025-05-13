import 'dotenv/config';  // Carrega o arquivo .env automaticamente
import twilio from 'twilio';

// Garantindo que as variáveis de ambiente estejam definidas
const TWILIO_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_PHONE = process.env.TWILIO_PHONE  as string;  // Valor padrão

if (!TWILIO_SID || !TWILIO_AUTH_TOKEN || !TWILIO_PHONE) {
  throw new Error('As variáveis de ambiente TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN e TWILIO_PHONE devem ser definidas');
}

const client = twilio(TWILIO_SID, TWILIO_AUTH_TOKEN);

export async function enviarSMS(to: string, message: string) {
  const result = await client.messages.create({
    body: message,
    from: TWILIO_PHONE, // Número da Twilio
    to,
  });
  return result;
}

export async function fazerLigacao(to: string, urlXML: string) {
  const result = await client.calls.create({
    url: urlXML, // URL para o XML que diz o que será falado na chamada
    from: TWILIO_PHONE,
    to,
  });
  return result;
}
