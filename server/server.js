require('./config/config');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
    // Los app.use son Middleware: funciones que se disparan cada vez
    // que pasa el código por aqui.
    // parse application/json
app.use(bodyParser.json())


// PETICIONES A UTLIZAR

app.get('/usuario', function(req, res) {
    // Trabajando con formato JSON
    res.json('get usuario')
})

// El post sirve mas que nada para crear nuevos registros.
app.post('/usuario', function(req, res) {
    /*Para procesar la información recibida y serializarla en un objecto json
    se utilizá el siguiente paquete body-parser npm*/
    let body = req.body;

    if (body.nombre === undefined) {
        res.status(400).json({
            ok: false,
            mensaje: 'El nombre es necesario.'
        });
    } else {
        res.json({
            persona: body
        });
    }

})

// El PUT es muy utilizado para actualizar data
app.put('/usuario/:id', function(req, res) {
    let id = req.params.id;
    // Trabajando con formato JSON
    res.json({
        id: id
    });
})

// El delete mas que nada para inabilidar registros.
app.delete('/usuario', function(req, res) {

    // Trabajando con formato JSON
    res.json('put usuario');
})


app.listen(process.env.PORT, () => console.log(`Escuchando el puerto ${3000}.`));