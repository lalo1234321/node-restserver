const express=require('express');
const app=express();
let {verificarToken} =require('../middlewares/autenticacion.js');
const Categoria=require('../models/categoria');
const _=require('underscore');
//Mostrar todas las categorías
app.get('/categoria',verificarToken,(req,res)=>
{
    let desde=req.query.desde||0;
    desde=Number(desde);
    let limite=req.query.limite||5;
    limite=Number(limite);
    Categoria.find()            
            .skip(desde)
            .limit(limite)
            .sort('descripcion')
            .populate('usuario','nombre email google')
            .exec((err,categoria)=>
            {
                if(err)
                {
                    return res.status(500).json(
                    {
                        ok:false,
                        err
                    });
                }
                res.json(
                    {
                        ok:true,
                        categoria                        
                    });
            });
});
//Mostrar una categoría por ID
app.get('/categoria/:id',verificarToken,(req,res)=>
{
    let id=req.params.id;
    Categoria.findById(id)
            .exec((err,categoria)=>
            {
                if(err)
                {
                    return res.status(500).json(
                        {
                            ok:false,
                            err
                        });
                }
                res.json(
                    {
                        ok:true,
                        categoria
                    })
            })
           
});

//Crear una nueva categoría
app.post('/categoria',verificarToken,(req,res)=>
{
    //Regresa la nueva categoría
    //req.usuario._id
    let cat=req.body;
    let user=req.usuario._id;
    let categoria=new Categoria(
        {
            usuario:req.usuario._id,
            descripcion:cat.descripcion
        });
    categoria.save((err,categoriaDB)=>
    {
        if(err)
        {
            return res.status(500).json(
                {
                    ok:false,
                    message:`Por esto falla ${user}`,
                    err:'No se pudo insertar la información de la categoría'
                });
        }
        res.json(
            {
                ok:true,
                categoria:categoriaDB
            })
    })
});
app.put('/categoria/:id',verificarToken,(req,res)=>
{
    //Actualizar la descripción de la categoría
    let id=req.params.id;
    let body=_.pick(req.body,['nombre','descripcion']);
    Categoria.findByIdAndUpdate(id,body,{new:true,runValidators:true},(err,categoriaDB)=>
    {
        if(err)
        {
            return  res.status(500).json(
                {
                    ok:false,
                    err 
                });
        }
        res.json(
            {
                ok:true,
                categoria:categoriaDB,
                message:'Cambios realizado'
            });
        // res.json(
        //     {
        //         usuario:req.usuario,
        //         nombre:req.usuario.nombre,
        //         email:req.usuario.email
        //     });    
    });
});
app.delete('/categoria/:id',verificarToken,(req,res)=>
{
    //Solo un administrador puede borar categorías
    //Categoria.findByIdAndRemove
    let id=req.params.id;
    Categoria.findByIdAndDelete(id,(err,categoriaBorrada)=>
    {
        if(err)
        {
            return  res.status(500).json(
                {
                    ok:false,
                    err 
                });
        }
        res.json(
            {
                ok:true,
                categoriaBorrada,
                
            });
    })
})
module.exports=app;

