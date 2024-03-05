const fs = require('fs');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const app = express();

app.use(bodyParser.json());

// Aquí es donde colocas el código
app.use(express.static('public'));

// Crear la carpeta si no existe
const dir = './Base de datos Json';
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}

app.post('/registrar', (req, res) => {
    const usuario = req.body;

    // Validar los datos del usuario
    if (!usuario.nombre || !usuario.email || !usuario.password) {
        return res.status(400).send('Faltan datos del usuario.');
    }

    // Encriptar la contraseña
    bcrypt.hash(usuario.password, 10, (err, hash) => {
        if (err) throw err;
        usuario.password = hash;

        // Crear un archivo JSON para el usuario
        const filePath = path.join(dir, `${usuario.email}.json`);
        usuario.comentario = 'Datos validados';
        fs.writeFile(filePath, JSON.stringify(usuario), (err) => {
            if (err) throw err;
            res.send('El usuario ha sido registrado con éxito.');
        });
    });
});

app.listen(3001, () => console.log('Servidor escuchando en el puerto 3001.'));