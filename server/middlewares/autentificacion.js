const jwt = require('jsonwebtoken');

// =========================
// Verificar Token
// =========================

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

module.exports = {
    verificaToken,
    verificaAdminRol
}