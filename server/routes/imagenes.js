const express=require('express');
const {verificaTokenImg}=require('../middlewares/autenticacion.js');
const fs=require('fs');
const path=require('path');
let app=express();

app.get('/imagen/:tipo/:img',verificaTokenImg,(req,res)=>
{
    let tipo=req.params.tipo;
    let img=req.params.img;
    let pathImagen=path.resolve(__dirname,`../../upload/${tipo}/${img}`);
    let noImagePath=path.resolve(__dirname,'../assets/no-image.jpg');
    if(fs.existsSync(pathImagen))
    {
        res.sendFile(pathImagen);
    }else{
        res.sendFile(noImagePath);
    }
    
    
})

module.exports=app;