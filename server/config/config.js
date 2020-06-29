//puerto
process.env.PORT=process.env.PORT || 3000;

//Entorno
process.env.NODE_ENV=process.env.NODE_ENV || 'dev';
 
//Caducidad
process.env.CADUCIDAD_TOKEN=60*60*24*30

//SEED de autenticación
process.env.SEED=process.env.SEED || 'este-es-el-seed-de-desarrollo';
//BASE DE DATOS

let URLDB;

if(process.env.NODE_ENV==='dev')
{
   URLDB='mongodb://localhost:27017/cafe';
}else
{
   URLDB=process.env.MONGO_URI
}
process.env.url=URLDB;
//'mongodb+srv://lalo24:'

//Id del cliente de google
process.env.CLIENT_ID=process.env.CLIENT_ID || '541892723282-udlcnpnr75ol155l0vtu7ca2497gc4kr.apps.googleusercontent.com'