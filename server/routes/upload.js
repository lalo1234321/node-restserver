const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const Usuario=require('../models/usuario.js');
const Producto=require('../models/producto.js');
const fs=require('fs');
const path=require('path');
// default options
app.use(fileUpload());

app.put('/upload/:tipo/:id',(req,res)=>
{
    let tipo=req.params.tipo;
    let id=req.params.id;
    if(!req.files)
    {
        return res.status(400).json(
            {
                ok:false,
                err:{
                    message:'No se ha seleccionado un archivo'
                }
            })
    }
    //VALIDA TIPOS
    let tiposValidos=['usuarios','productos'];
    if(tiposValidos.indexOf(tipo)<0)
    {
        res.status(400).json(
            {
                ok:false,
                err:{
                    message:'Los tipos válidos son: '+tiposValidos.join(', ')
                }
            })
    }

    let archivo=req.files.archivo;
    let nombreCortado=archivo.name.split('.');
    let extension=nombreCortado[nombreCortado.length-1];
    let validarExtensiones=['jpg','pdf','gif','jpeg'];
    if(validarExtensiones.indexOf(extension)<0)
    {
        return res.status(400).json(
            {
                ok:false,
                err:{
                    message:'Extensiones validas: '+validarExtensiones.join(', ')
                }
            })
    }
    //Cambiar nombre al archivo
    let nombreArchivo=`${id}-${new Date().getMilliseconds()}.${extension}`;

    archivo.mv(`upload/${tipo}/${nombreArchivo}`, (err)=> {
        if (err)
          return res.status(500).json(
              {
                  ok:false,
                  err
              });
        //IMAGEN CARGADA AQUI
        if(tipo==='usuarios')
        {
            imagenUsario(id,res,nombreArchivo);
        }
        else{
            imagenProducto(id,res,nombreArchivo);
        }
      });

    function imagenUsario(id,res,nombreArchivo)
    {
        Usuario.findById(id,(err,usuarioDB)=>
        {
            if(err)
            {
                borrarArchivo(nombreArchivo,'usuarios');
                return res.status(500).json(
                    {
                        ok:false,
                        err
                    });
            }
            if(!usuarioDB)
            {
                borrarArchivo(nombreArchivo,'usuarios');
                return res.status(400).json(
                    {
                        ok:false,
                        err:{
                            message:'No se encontró el usuario'
                        }
                    })
            }
            // let pathImagen=path.resolve(__dirname,`../../upload/usuarios/${usuarioDB.img}`);
            // if(fs.existsSync(pathImagen))
            // {
            //     fs.unlinkSync(pathImagen);
            // }       
            borrarArchivo(usuarioDB.img,'usuarios');
            usuarioDB.img=nombreArchivo;
            usuarioDB.save((err,usuarioGuardado)=>
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
                        usuario:usuarioGuardado,
                        img:nombreArchivo
                    });
            })
        })
    }
    function imagenProducto(id,res,nombreArchivo)
    {
        Producto.findById(id,(err,productoBD)=>
        {
            if(err)
            {
                borrarArchivo(nombreArchivo,'productos');
                return res.status(500).json(
                    {
                        ok:false,
                        err
                    });
            }
            if(!productoBD)
            {
                borrarArchivo(nombreArchivo,'productos');
                return res.status(400).json(
                    {
                        ok:false,
                        message:'No se encontró producto en la base de datos'
                    })
            }
            borrarArchivo(productoBD.img,'productos');
            productoBD.img=nombreArchivo;
            productoBD.save((err,productoGuardado)=>
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
                        producto:productoGuardado,
                        img:nombreArchivo
                    });
            })
        })
    }
    function borrarArchivo(nombreImagen,tipo)
    {
        let pathImagen=path.resolve(__dirname,`../../upload/${tipo}/${nombreImagen}`);
        if(fs.existsSync(pathImagen))
        {
            fs.unlinkSync(pathImagen);
        }                   
    }
})
module.exports=app;