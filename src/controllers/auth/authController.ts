import { FastifyRequest, FastifyReply } from 'fastify';
import prisma from '../../../plugins/prisma';
import * as bcrypt from 'bcrypt';
import { z } from 'zod';

const loginSchema = z.object({
  credential: z.string(),  // Nome corrigido
  password: z.string(),
  device: z.string().optional()
});
interface JwtPayload {
  id: number;
  vc_email: string;
}
export class AuthController {
  static async login(request: FastifyRequest<{ Body: z.infer<typeof loginSchema> }>, reply: FastifyReply) {
  try {
    const { credential, password } = loginSchema.parse(request.body);

    // Buscar usuário por email, username ou telefone, incluindo o perfil
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { vc_email: credential },
          { vc_telefone: credential }
        ]
      }
    });

    if (!user) {
      return reply.code(401).send({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    // Verificar senha
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return reply.code(401).send({
        success: false,
        message: 'Senha incorreta'
      });
    }

    // Gerar Token JWT
    const token: string = await reply.jwtSign(
      {
        id: user.id,
        email: user.vc_email ?? ""
      },
      { expiresIn: "7d" }
    );
    
    // Definir data de expiração
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    
    // Salvar token no banco de dados
    await prisma.userToken.create({
      data: {
        token,
        userId: user.id,
        expiresAt
      }
    });

    return reply.code(200).send({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          vc_email: user.vc_email,
          vc_telefone: user.vc_telefone,
          vc_pnome: user.vc_pnome,
          vc_mnome: user.vc_mnome,
          vc_unome: user.vc_unome,

        }
      }
    });
  } catch (error) {
    return reply.code(500).send({
      success: false,
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

  static async logout(request: FastifyRequest, reply: FastifyReply) {
    try {
      const authHeader = request.headers.authorization
      if (!authHeader) {
        return reply.code(401).send({
          success: false,
          message: 'No token provided'
        })
      }
  
      const token = authHeader.split(' ')[1]
  
      // Buscar o token no banco de dados para garantir que ele pertence a um usuário válido
      const userToken = await prisma.userToken.findUnique({
        where: { token }
      })
  
      if (!userToken) {
        return reply.code(401).send({
          success: false,
          message: 'Invalid token'
        })
      }
  
      // Revogar o token no banco de dados
      await prisma.userToken.update({
        where: { token },
        data: { revoked: true }
      })
  
      return reply.code(200).send({
        success: true,
        message: 'Logged out successfully'
      })
    } catch (error) {
      return reply.code(500).send({
        success: false,
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }
}
