//================================
// Puerto
//================================

process.env.PORT = process.env.PORT || 3000;


//================================
// Entorno
//================================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


//================================
// Base de datos
//================================

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = 'mongodb+srv://Gall421:VdrfMsRbyYntTd3X@cluster0-vtquv.mongodb.net/cafe'
}

process.env.URLDB = urlDB;