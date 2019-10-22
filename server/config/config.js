//================================
// Puerto
//================================
process.env.PORT = process.env.PORT || 3000;


//================================
// Entorno
//================================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


//================================
// Vencimiento del token
//================================
// 60s * 60mnt * 24hrs * 30d
process.env.CADUCIDAD_TOKEN = '48h';


//================================
// SEED de autentificación
//================================
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo'


//================================
// Base de datos
//================================

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URL;
}

process.env.URLDB = urlDB;


//================================
// Google Client
//================================

process.env.CLIENT_ID = process.env.CLIENT_ID || '304632288727-7usji0q882uv41ads0meqq48kc1709lg.apps.googleusercontent.com';