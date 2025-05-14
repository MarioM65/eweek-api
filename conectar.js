const { Client } = require('pg');

const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'eweek',
  password: '1234',
  port: 5432,
});

client.connect()
  .then(() => console.log('✅ Conectado ao banco eweek'))
  .catch(err => console.error('❌ Erro na conexão:', err));