const mysql = require('mysql2');

// Criar pool de conexões
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'koenma_sushi_nw',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Promisify para usar async/await
const promisePool = pool.promise();

// Testar conexão
const testConnection = async () => {
  try {
    const connection = await promisePool.getConnection();
    console.log('✅ Conectado ao MySQL com sucesso!');
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ Erro ao conectar ao MySQL:', error.message);
    return false;
  }
};

module.exports = {
  pool: promisePool,
  testConnection
};