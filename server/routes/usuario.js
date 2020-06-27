const express = require('express');
const bcrypt=require('bcrypt');
const _=require('underscore');
const app = express();
const Usuario=require('../models/usuario.js');
app.get('/usuario',(req, res)=> 
{
    // let condicion=
    // {
    //     estado:true
    // }
    let desde=req.query.desde||0;
    desde=Number(desde);
    let limite=req.query.limite||5;
    limite=Number(limite);
    Usuario.find({estado:true},'nombre email estado')
            .skip(desde)
            .limit(limite)
            .exec((err,usuarios)=>
            {
                if(err)
                {
                    return res.status(400).json(
                    {
                        ok:false,
                        err
                    });
                }
                Usuario.count({estado:true},(err,conteo)=>
                {
                        res.json(
                            {
                                ok:true,
                                usuarios,
                                conteo
                            });
                })
                
            })
});
  app.post('/usuario',(req,res)=>
  {
      let persona=req.body;
      let usuario=new Usuario(
          {
              nombre:persona.nombre,
              email:persona.email,
              password:bcrypt.hashSync(persona.password,10),
              img:persona.password,
              role:persona.role
          });
       usuario.save((err,usuarioDB)=>
       {
           if(err)
           {
                return res.status(400).json(
                    {
                        ok:false,
                        err
                    })
            }
            //usuarioDB.password=null;
            res.json(
                {
                    ok:true,
                    usuario:usuarioDB
                }); 
       })   
      
         
      
      
  }); 
  app.put('/usuario/:id',(req,res)=>
  {
      let id=req.params.id;
      let body=_.pick(req.body,['nombre','email','img','role','estado']);
      Usuario.findByIdAndUpdate(id,body,{new:true,runValidators:true},(err,usuarioDB)=>
      {
          if(err)
          {
              return  res.status(400).json(
                    {
                        ok:false,
                        err 
                    });
          }
          res.json(
              {
                  ok:true,
                  usuario:usuarioDB
              });
      });
      
  }); 
  app.delete('/usuario/:id',(req,res)=>
  {
      let id=req.params.id;
      let cambiaEstado=
      {
          estado:false
      }
      Usuario.findByIdAndUpdate(id,cambiaEstado,{new:true},(err,usuarioModificadoEstado)=>
      {
            if(err)
            {
                return  res.status(400).json(
                    {
                        ok:false,
                        err 
                    });
            }
            // if(ususarioBorrado===null)
            // {
            //     return  res.status(400).json(
            //         {
            //             ok:false,
            //             error:{
            //                 message:'Usuario no encontrado'
            //             }
            //         });
            // }
            
            res.json(
                {
                    ok:true,
                    usuario:usuarioModificadoEstado
                });
      })
  }); 

module.exports=app;