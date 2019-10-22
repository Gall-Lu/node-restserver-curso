const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const Usuario = require('../models/usuario');
const Producto = require('../models/producto');
const fs = require('fs');
const path = require('path');


app.use(fileUpload());

app.put('/uploads/:tipo/:id', function(req, res) {

    let tipo = req.params.tipo;
    let id = req.params.id;


    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No se ha seleccionada ningun archivo.'
            }
        });
    }

    // Validar tipo
    let tiposValidos = ["products", "users"];

    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            err: { message: 'Los tipos permitidos son: ' + tiposValidos.join(', ') + '.' },
            tipo
        });
    }

    let archivo = req.files.archivo;
    let nombreArchivoCortado = archivo.name.split('.');
    let extension = nombreArchivoCortado[nombreArchivoCortado.length - 1];

    // Extensiones permitidas
    let extensionesValidas = ['png', 'jpg', 'gif', 'jpeg', 'pdf', 'docx'];

    if (extensionesValidas.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            err: { message: 'La extensiones validas son: ' + extensionesValidas.join(', ') + '.' },
            ext: extension
        });
    }

    // Cambiar nombre al archivo.

    let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`;

    archivo.mv(`uploads/${tipo}/${nombreArchivo}`, function(err) {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        // Aqui, imagen cargada.
        cargarImagen(id, res, nombreArchivo, tipo);

    });
});


function cargarImagen(id, res, nombreArchivo, tipo) {

    if (tipo === 'users') {
        Usuario.findById(id, (err, usuarioDB) => {

            if (err) {
                borrarArchivo(nombreArchivo, tipo);
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            if (!usuarioDB) {
                borrarArchivo(nombreArchivo, tipo);
                return res.status(400).json({
                    ok: false,
                    err: { message: 'El usuario no existe.' }
                })
            }

            borrarArchivo(usuarioDB.img, tipo);

            usuarioDB.img = nombreArchivo;

            usuarioDB.save((err, usuarioGuardado) => {
                res.json({
                    ok: true,
                    usuario: usuarioGuardado,
                    img: usuarioGuardado.img
                })
            });

        });
    } else {
        Producto.findById(id, (err, productoDB) => {

            if (err) {
                borrarArchivo(nombreArchivo, tipo);
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            if (!productoDB) {
                borrarArchivo(nombreArchivo, tipo);
                return res.status(400).json({
                    ok: false,
                    err: { message: 'El ID del producto no existe.' }
                })
            }

            borrarArchivo(productoDB.img, tipo);

            productoDB.img = nombreArchivo;

            productoDB.save((err, productoGuardado) => {
                res.json({
                    ok: true,
                    producto: productoGuardado,
                    img: productoGuardado.img
                })
            });
        });
    }
}

// function imagenProducto() {

// }

function borrarArchivo(nombreImg, tipo) {
    // Cada argumento del resolve son segmentos del paht a construir
    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImg}`);

    // Se confirma si el pathImagen existe
    if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen); // Borrar imagen.
    }
}

module.exports = app;