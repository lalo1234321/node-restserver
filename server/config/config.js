//puerto
process.env.PORT=process.env.PORT || 3000;

//Entorno
process.env.NODE_ENV=process.env.NODE_ENV || 'dev';
 
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