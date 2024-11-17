
const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());


// Configuración de la base de datos
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "chamber-soft", // Cambia por tu base de datos
});

// Conexión a la base de datos
connection.connect((err) => {
  if (err) {
    console.error("Error al conectar a la base de datos:", err.message);
    process.exit(1);
  }
  console.log("Conexión exitosa a la base de datos.");
});

// Ruta de inicio de sesión
app.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res
            .status(400)
            .json({ message: "Por favor, ingrese todos los campos" });
    }

    // Verificar si el usuario existe
    const checkUserQuery = "SELECT * FROM usuarios WHERE email = ?";
    connection.query(checkUserQuery, [username], (err, results) => {
        if (err) {
            console.error("Error en la consulta:", err.message);
            return res.status(500).json({ message: "Error interno del servidor" });
        }

        if (results.length === 0) {
            return res.status(400).json({ message: "Correo o contraseña incorrectos" });
        }

        const user = results[0];

        // Compara directamente la contraseña sin cifrar
        if (user.password !== password) {
            return res.status(400).json({ message: "Correo o contraseña incorrectos" });
        }

        // Si la contraseña es correcta, autenticación exitosa
        res.json({ message: "Autenticación exitosa", user });
    });
});

// Ruta de registro
app.post("/register", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Por favor, complete todos los campos" });
    }

    // Verificar si el usuario ya existe
    const checkUserQuery = "SELECT * FROM usuarios WHERE email = ?";
    connection.query(checkUserQuery, [username], (err, results) => {
        if (err) {
            console.error("Error en la consulta:", err.message);
            return res.status(500).json({ message: "Error interno del servidor" });
        }

        if (results.length > 0) {
            return res.status(400).json({ message: "El usuario ya existe" });
        }

        // Insertar el nuevo usuario sin cifrar la contraseña
        const insertUserQuery =
            "INSERT INTO usuarios (email, password) VALUES (?, ?)";
        connection.query(
            insertUserQuery,
            [username, password],
            (err, results) => {
                if (err) {
                    console.error("Error al insertar el usuario:", err.message);
                    return res.status(500).json({ message: "Error interno del servidor" });
                }

                res.json({ message: "Usuario registrado exitosamente" });
            }
        );
    });
});
