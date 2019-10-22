const express = require('express');
const fs = require('fs');
let app = express();
const path = require('path');
const { verificaTokenImg } = require('../middlewares/autentificacion');


app.get('/imagen/:tipo/:img', verificaTokenImg, (req, res) => {
    let tipo = req.params.tipo;
    let img = req.params.img;



    // Cada argumento del resolve son segmentos del paht a construir
    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${img}`);

    // Se confirma si el pathImagen existe
    if (fs.existsSync(pathImagen)) {
        res.sendFile(pathImagen);
    } else {
        let noimagePath = path.resolve(__dirname, '../assets/no-image.jpg');
        res.sendFile(noimagePath);
    }
});

module.exports = app;