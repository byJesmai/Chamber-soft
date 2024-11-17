const mysql = require('mysql2');

// Configuración de la conexión
const connection = mysql.createConnection({
  host: 'localhost', // Cambia por la dirección de tu servidor
  user: 'root',      // Cambia por tu usuario
  password: '',      // Cambia por tu contraseña
  database: 'chamber-soft' // Cambia por el nombre de tu base de datos
});

// Establecer conexión
connection.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err.message);
    return;
  }
  console.log('Conexión exitosa a la base de datos.');
});

module.exports = connection;
