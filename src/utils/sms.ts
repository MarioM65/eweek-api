import { Vonage } from '@vonage/server-sdk'
import { Auth } from '@vonage/auth'
import dotenv from 'dotenv'

dotenv.config()

const vonage = new Vonage(
  new Auth({
    apiKey: process.env.VONAGE_API_KEY!,
    apiSecret: process.env.VONAGE_API_SECRET!,
  })
)

export async function enviarSMS(to: string, message: string) {
  try {
    const response = await vonage.sms.send({
      to,
      from: 'Vonage',
      text: message,
    })

    const status = response.messages[0].status
    if (status === '0') {
      console.log('Mensagem enviada com sucesso!')
    } else {
      console.error('Erro ao enviar SMS:', response.messages[0].errorText
)
    }

    return response
  } catch (error) {
    console.error('Erro no envio de SMS:', error)
    throw error
  }
}
