require('./config/config.js');
const express = require('express');
const app = express();
//librería que resuelve el path
const path=require('path');
//Libreria para establecer conexión con mongoDB
const mongoose=require('mongoose');
//Forma actual
//mongoose.connect('mongodb://localhost:27017/test', {useNewUrlParser: true, useUnifiedTopology: true});
//Forma obsoleta
mongoose.connect(process.env.url, (err,res)=>
{
    if(err) throw err;
    console.log('Conexión establecida con la base de datos'); 
    //console.log(res);
});
//lIBRERIA PARA EL X-WWW-FORM-URLENCODED
const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
//habilitar la carpeta public
app.use(express.static(path.resolve(__dirname,'../public')));
//configuración de rutas globales
app.use(require('./routes/index'));
// app.use(require('./routes/usuario'));
// app.use(require('./routes/login'));
app.listen(process.env.PORT,()=>
{
    console.log('Escuchando el puerto ',process.env.PORT);
});