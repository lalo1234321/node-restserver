require('./config/config.js');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
app.get('/usuario',(req, res)=> {
  res.json('get Usuario');
});
app.post('/usuario',(req,res)=>
{
    let persona=req.body;
    if(persona.nombre===undefined)
    {
        res.status(400).json(
            {
                ok:false,
                mensaje:'No se pudo guardar el nombre'
            })
    }else
    {
       res.json({persona}); 
    }
    
}); 
app.put('/usuario/:id',(req,res)=>
{
    let id=req.params.id;
    res.json(
        {
            id
        })
}); 
app.delete('/usuario',(req,res)=>
{
    res.json('delete Usuario');
}); 
app.listen(process.env.PORT,()=>
{
    console.log('Escuchando el puerto ',process.env.PORT);
});