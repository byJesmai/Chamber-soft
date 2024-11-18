
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

app.post("/create_proyect", (req, res) => {
    // Imprimir el contenido recibido en el cuerpo de la solicitud
    console.log('Datos recibidos en el servidor:', req.body);

    const { nameproyect, propietarioproyect, creationDateFromCampaignIni, creationDateToCampaignFin} = req.body;

    // Validación de campos
    if (!nameproyect || !propietarioproyect || !creationDateFromCampaignIni || !creationDateToCampaignFin ) {
        return res.status(400).json({ message: "Por favor, complete todos los campos" });
    }

    // Verificar si el proyecto ya existe
    const checkProyectQuery = "SELECT * FROM proyectos WHERE nombre = ?";
    connection.query(checkProyectQuery, [nameproyect], (err, results) => {
        if (err) {
            console.error("Error en la consulta:", err.message);
            return res.status(500).json({ message: "Error interno del servidor" });
        }

        if (results.length > 0) {
            return res.status(400).json({ message: "El proyecto ya existe" });
        }

        // Insertar el proyecto
        const insertProyectQuery =
            "INSERT INTO proyectos (nombre, propietario, fecha_creacion, fecha_fin) VALUES (?, ?, ?, ? )";
        const fechaCreacion = creationDateFromCampaignIni || new Date().toISOString().split("T")[0]; // Fecha proporcionada por el cliente
        const fechaFin = creationDateToCampaignFin || "2025-01-30"; // Fecha proporcionada por el cliente o fecha fija

        connection.query(
            insertProyectQuery,
            [nameproyect, propietarioproyect, fechaCreacion, fechaFin],
            (err, results) => {
                if (err) {
                    console.error("Error al insertar el proyecto:", err.message);
                    return res.status(500).json({ message: "Error interno del servidor" });
                }

                res.json({
                    message: "Proyecto registrado exitosamente",
                    proyectId: results.insertId, // Devuelve el ID del proyecto creado
                });
            }
        );
    });
});

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
  });