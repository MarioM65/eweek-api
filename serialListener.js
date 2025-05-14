const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline'); // Importação correta do parser
const axios = require('axios');

// Defina a porta serial que você deseja usar (ajuste conforme necessário)
const portName = 'COM3'; // Ajuste conforme a sua porta serial
const baudRate = 9600;

// Crie a instância da porta serial
const port = new SerialPort({
  path: portName,
  baudRate: baudRate,
});

// Crie o parser para ler os dados de forma linha por linha
const parser = port.pipe(new ReadlineParser({ delimiter: '\n' }));

// Escute por eventos de erro na porta serial
port.on('error', (err) => {
  console.error('Erro na porta serial: ', err.message);
});

// Escute os dados recebidos da porta serial
parser.on('data', async (data) => {
  console.log('Comando recebido da porta serial: ', data.trim());

  // Exemplo de lógica para enviar dados para o servidor com base no comando recebido
  const comando = data.trim();

  if (comando === 'enviar_dados') {
    try {
      // Envie uma requisição para a API para registrar o acidente, ou qualquer outra ação necessária
      const resposta = await axios.post('http://localhost:3000/api/acidentes', {
        // Dados a serem enviados para a API
        localizacao: 'Rua ABC', // Exemplo de dado fixo
        tipo: 'Acidente de Trânsito', // Exemplo de tipo
        gravidade: 'Alta', // Exemplo de gravidade
        confirmado: true, // Exemplo de confirmação
        itemId: 1, // Exemplo de item ID
        usuarioId: 123, // Exemplo de ID do usuário
      });

      console.log('Dados enviados com sucesso:', resposta.data);
    } catch (error) {
      console.error('Erro ao enviar dados para a API:', error.message);
    }
  } else {
    console.log(`Comando desconhecido: ${comando}`);
  }
});
