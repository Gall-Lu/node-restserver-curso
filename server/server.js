require('./config/config');
const express = require('express');
// Using Node.js `require()`
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
    // Los app.use son Middleware: funciones que se disparan cada vez
    // que pasa el código por aqui.
    // parse application/json
app.use(bodyParser.json())

// Configuración global de rutas
app.use(require('./routes/index'));


mongoose.set('useUnifiedTopology', true);
mongoose.connect(process.env.URLDB, { useNewUrlParser: true, useCreateIndex: true }, (err, res) => {
    // useNewUrlParser: true,
    // useUnifiedTopology: true

    if (err) throw err;

    console.log('Base de datos ONLINE');
});



app.listen(process.env.PORT, () => console.log(`Escuchando el puerto ${3000}.`));