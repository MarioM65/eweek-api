import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  // Criptografando a senha
  const hashedPassword = await bcrypt.hash("12345678", 10) // Substitua pela senha real

  // Criando um usuário
  const user = await prisma.user.create({
    data: {
      vc_pnome: 'Mário',
      vc_mnome: 'José',
      vc_unome: 'Silva',
      vc_telefone: '923456789',
      vc_bi: '1234567890',
      vc_email: 'mario@example.com',
      password: hashedPassword, // Usando a senha criptografada
      img_perfil: 'https://link-da-imagem.com',
      contatos: {
        create: [
          {
            vc_nome: 'Mãe',
            vc_telefone: '923123456',
            parentesco: 'Mãe'
          },
          {
            vc_nome: 'Pai',
            vc_telefone: '923654321',
            parentesco: 'Pai'
          }
        ]
      },
      veiculos: {
        create: [
          {
            vc_matricula: 'ABC1234',
            modelo: 'Modelo 1',
            item: {
              create: {
                vc_nome: 'Carro de Teste',
                txt_descricao: 'Veículo de teste',
                tipo_item: 'Carro'
              }
            },
            seguro: {
              create: {
                vc_nome: 'Seguro Vida',
                fl_preco: 100.0,
                txt_descricao: 'Seguro de vida',
                usuarios: {
                  create: [
                    {
                      user: {
                        connect: { id: 1 }
                      }
                    }
                  ]
                }
              }
            }
          }
        ]
      },
      seguros: {
        create: [
          {
            seguro: {
              create: {
                vc_nome: 'Seguro Auto',
                fl_preco: 200.0,
                txt_descricao: 'Seguro para automóveis'
              }
            }
          }
        ]
      },
      seguradoras: {
        create: [
          {
            seguradora: {
              create: {
                vc_nome: 'Seguradora XYZ',
                logo: 'https://logo.com',
                txt_descricao: 'Seguradora renomada no mercado'
              }
            }
          }
        ]
      }
    }
  })

  console.log('Dados de exemplo inseridos!')
}

main()
  .catch(e => {
    throw e
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
