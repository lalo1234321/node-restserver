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
   URLDB='mongodb+srv://lalo24:123@cluster0-xrqkw.mongodb.net/test1?retryWrites=true&w=majority';
}
process.env.url=URLDB;
//'mongodb+srv://lalo24:'