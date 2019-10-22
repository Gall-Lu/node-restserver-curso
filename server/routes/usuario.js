const express = require('express');
const Usuario = require('../models/usuario');
const app = express();
const bcrypt = require('bcryptjs');
const _ = require('underscore');
const { verificaToken, verificaAdminRol } = require('../middlewares/autentificacion');


// PETICIONES A UTLIZAR
// Los middleware pueden ir como segundo parametro en esto tipo de servicios
// usando lo que es Express.
app.get('/usuario', verificaToken, (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);
    let limite = req.query.limite || 5;
    limite = Number(limite);

    let condicion = { estado: true };

    // Función de mongoose
    Usuario.find({ estado: true }, 'nombre email role estado google img')
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });

            }

            Usuario.countDocuments({ estado: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    usuarios,
                    encontrados: conteo
                });
            });

        });
});


// El post sirve mas que nada para crear nuevos registros.
app.post('/usuario', [verificaToken, verificaAdminRol], function(req, res) {
    /*Para procesar la información recibida y serializarla en un objecto json
    se utilizá el siguiente paquete body-parser npm*/
    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    // save palabra reservada de mogoose
    usuario.save((err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        usuarioDB.password = null;


        res.json({
            ok: true,
            usuario: usuarioDB
        });

    });

    // if (body.nombre === undefined) {
    //     res.status(400).json({
    //         ok: false,
    //         mensaje: 'El nombre es necesario.'
    //     });
    // } else {
    //     res.json({
    //         persona: body
    //     });
    // }

});


// El PUT es muy utilizado para actualizar data
app.put('/usuario/:id', [verificaToken, verificaAdminRol], function(req, res) {
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);



    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        // Trabajando con formato JSON
        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });

});


// El delete mas que nada para inabilidar registros.
app.delete('/usuario/:id', [verificaToken, verificaAdminRol], function(req, res) {

    let id = req.params.id;

    //Eliminación física
    //--------------------------------------------------------
    // Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
    // if (err) {
    //     return res.status(400).json({
    //         ok: false,
    //         err
    //     });
    // }

    // if (!usuarioBorrado) {
    //     return res.status(400).json({
    //         ok: false,
    //         err: {
    //             message: 'Usuario no encontrado.'
    //         }
    //     });
    // }

    //     res.json({
    //         ok: true,
    //         usuario: usuarioBorrado
    //     });
    // });
    //--------------------------------------------------------

    //Actualizando el estado a false
    //--------------------------------------------------------
    let body = _.pick(req.body, ['estado']); // Borrado con body

    Usuario.findByIdAndUpdate(id, body, { new: true }, (err, usuarioBorrado) => { // Borrado con body

        // let cambiaEstado = { estado: false };
        // Usuario.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, usuarioBorrado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado.'
                }
            });
        }

        usuarioBorrado.estado = false;
        usuarioBorrado.save();

        // Trabajando con formato JSON
        res.json({
            ok: true,
            usuario: usuarioBorrado
        });
    });
    //--------------------------------------------------------
});

module.exports = app;