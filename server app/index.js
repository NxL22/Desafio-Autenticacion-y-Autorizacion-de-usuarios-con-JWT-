express = require('express');
const cors = require('cors');
const jwt = require("jsonwebtoken")
const { secretKey } = require("./secretKey");
const app = express();
const path = require('path');
const { verificarCredenciales } = require('./consultas');
const { userRouter } = require('./routes/user.routes');
const port = 3001;


// Levanto el servidor.
app.listen(3001, console.log(`Servidor en funcionamiento en el puerto: ${port}`))

// Middleware:
app.use(express.json());

// Habilitar CORS para todas las rutas
app.use(cors());


/* 
!Ruta GET para devolver la página web, "aqui uni el back con el front",
!lo hice por medio de usar el mismo PORT, y npm estar en ambas consolas (el front y el back).
app.get('/', (req, res) => {
    res.sendFile(__dirname + '../client app/public/index.html');
});
*/


// Establecer la ruta base '/usuarios' y asociarla con el enrutador 'userRouter'.
app.use(`/usuarios`, userRouter);

// Establecer una ruta GET para la página principal del sitio web.
app.get('/', (req, res) => {
    // Obtener la ruta completa del archivo 'index.html' dentro de la carpeta 'client app/public'.
    const filePath = path.join(__dirname, '../client app/public/index.html');

    // Enviar el archivo 'index.html' como respuesta al cliente.
    res.sendFile(filePath);
});

// Establecer una ruta POST para el proceso de inicio de sesión (login).
app.post("/login", async (req, res) => {
    try {
        // Extraer el correo electrónico y la contraseña del cuerpo de la solicitud.
        const { email, password } = req.body;

        // Imprimir en la consola el cuerpo de la solicitud.
        console.log(req.body);

        // Verificar las credenciales del usuario (correo electrónico y contraseña).
        await verificarCredenciales(email, password);

        // Si las credenciales son válidas, generar un token JWT y enviarlo como respuesta.
        const token = jwt.sign({ email }, secretKey);
        res.send(token);
    } catch ({ code, message }) {
        // Si ocurre un error durante el proceso de inicio de sesión, enviar el código de error y el mensaje.
        res.status(code).send(message);
    }
});


// PROBANDO.
/*
app.get("/holaMundo", (req, res) => {
    res.send("holaMundo");
});
*/