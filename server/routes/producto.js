const express=require('express');
const{verificarToken}=require('../middlewares/autenticacion');
const app=express();
const Producto=require('../models/producto');
const _=require('underscore');


app.get('/producto',(req,res)=>
{
    Producto.find({disponible:true})
            .sort('nombre')
            .populate('usuario','nombre email google')
            .populate('categoria')
            .exec((err,productoDB)=>
            {
                if(err)
                {
                    return res.status(500).json(
                        {
                            ok:false,
                            err:'Hubo un error al extraer los productos'
                        })
                }
                res.json(
                    {
                        ok:true,
                        productos:productoDB
                    })
            }) 
})

app.get('/producto/:id',verificarToken,(req,res)=>
{
    let id=req.params.id;
    Producto.findById(id)
            .populate('usuario','nombre email google')
            .populate('categoria')
            .exec((err,productoDB)=>
            {
                if(err)
                {
                    return res.status(500).json(
                        {
                            ok:false,
                            err:'Hubo un error al extraer los productos'
                        })
                }
                res.json(
                    {
                        ok:true,
                        producto:productoDB
                    })
            })
})
app.get('/producto/buscar/:termino',(req,res) => 
{
    let termino=req.params.termino;
    let regex=new RegExp(termino,'i');
    Producto.find({nombre:regex})
            .populate('Categoria','nombre')
            .exec((err,productoDB)=>
            {
                if(err)
                {
                    return res.status(500).json(
                        {
                            ok:false,
                            err:'Hubo un error al extraer los productos'
                        })
                }
                res.json(
                    {
                        ok:true,
                        producto:productoDB
                    })
            })
})



app.post('/producto',verificarToken,(req,res)=>
{
    //grabar usuario
    //grabar la  categoria a la que perenece
    let body=req.body;
    //let us=req.usuario._id
    produc=new Producto(
        {
            nombre:body.nombre,
            precioUni:body.precioUni,
            descripcion:body.descripcion,
            disponible:true,
            categoria:body.categoria,
            usuario:req.usuario._id
        });
    produc.save((err,productoDB)=>
    {
        if(err)
        {
            return res.status(500).json(
                {
                    ok:false,
                    err:'No se pudo insertar la información del producto'
                });
        }
        res.json(
            {
                ok:true,
                producto:productoDB
            })
    })
})
app.put('/producto/:id',(req,res)=>
{
    let id=req.params.id;
    let body=_.pick(req.body,['nombre','precioUni','descripcion']);
    Producto.findByIdAndUpdate(id,body,{new:true,runValidators:true},(err,productoDB)=>
    {
        if(err)
        {
            return res.status(500).json(
                {
                    ok:false,
                    err:'No se pudo insertar la información del producto'
                });
        }
        if(!productoDB)
        {
            return res.status(500).json(
                {
                    ok:false,
                    err:'Error al ingresar el id, no existe el id'
                })
        }
        res.json(
            {
                ok:true,
                producto:productoDB,
                message:'Cambio realizados'
            })

    })
            
})
app.delete('/producto/:id',(req,res)=>
{
    let id=req.params.id;
    let cambioDisponible={
        disponible:false
    }
    Producto.findByIdAndUpdate(id,cambioDisponible,{new:true},(err,productoDB)=>
    {
        if(err)
        {
            return res.status(500).json(
                {
                    ok:false,
                    err:'No se pudo insertar la información del producto'
                });
        }
        res.json(
            {
                ok:true,
                producto:productoDB,
                message:'Cambio realizados'
            })
    })
    //let body=_.pick(req.body,['estado'])
})
module.exports=app;