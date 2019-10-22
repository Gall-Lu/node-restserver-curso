const jwt = require('jsonwebtoken');

// =================================================
// Verificar Token
// =================================================
// El next permite continuar con la ejecución del programa.
let verificaToken = (req, res, next) => {

    let token = req.get('token');

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no valido.'
                }
            });
        }
        req.usuario = decoded.usuario;
        next();
    });
};


// =================================================
// Verifica que el rol de usuario sea Admistrador
// =================================================
let verificaAdminRol = (req, res, next) => {
    let usuario = req.usuario;

    if (!(usuario.role === 'ADMIN_ROLE')) {
        return res.json({
            ok: false,
            err: {
                message: 'El usuario no es administradro.'
            }
        });
    }

    next();
    return;
}


// =================================================
// Verifica token para la imagen
// =================================================
let verificaTokenImg = (req, res, next) => {
    let token = req.query.token;

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no valido.'
                }
            });
        }
        req.usuario = decoded.usuario;
        next();
    });
    return;
}
module.exports = {
    verificaToken,
    verificaAdminRol,
    verificaTokenImg
}