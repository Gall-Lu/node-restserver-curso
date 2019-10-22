const express = require('express');
let { verificaToken, verificaAdminRol } = require('../middlewares/autentificacion');

let app = express();
let Categoria = require('../models/categoria');


//=========================================
// Mostrar todas las categorias
//=========================================
// El populate rebisa que ID o ObjectID existen en la
// categoría solicitada y permite cargar información.
// propiedad sort permite ordenar el resultado.
app.get('/categoria', verificaToken, (req, res) => {
    Categoria.find({})
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, categorias) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                categorias
            });
        });
});


//=========================================
// Mostrar una categoria por ID
//=========================================
app.get('/categoria/:id', verificaToken, (req, res) => {

    let id = req.params.id;

    Categoria.findById(id, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No se encontro la categoría.'
                }
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });

});


//=========================================
// Crear una nueva categoría
//=========================================
app.post('/categoria', verificaToken, (req, res) => {

    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save((err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }


        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });

});


//=========================================
// Actualizar categoria
//=========================================
app.put('/categoria/:id', verificaToken, (req, res) => {
    let id = req.params.id;

    let body = req.body;

    let descCategoria = {
        descripcion: body.descripcion
    }

    Categoria.findByIdAndUpdate(id, descCategoria, { new: true, runValidators: true }, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });
});



//=========================================
// Eliminar categoría
//=========================================
app.delete('/categoria/:id', [verificaToken, verificaAdminRol], (req, res) => {
    // Solo un administrador puede borrar una categoría
    // Eliminar físicamente la categoría

    let id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoriaBorrada) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaBorrada) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Categoría no encontrada.'
                }
            });
        }
        res.json({
            ok: true,
            message: 'Categoría borrada.'
        });
    });

});


// Grabar en postma

module.exports = app;