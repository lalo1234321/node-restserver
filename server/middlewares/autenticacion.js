//Verificar token
const jwt=require('jsonwebtoken');
let verificarToken=(req,res,next)=>
{
    let token=req.get('token');//Autenticación
    jwt.verify(token,process.env.SEED,(err,decoded)=>
    {
        //decoded es el payload
        if(err)
        {
            return res.status(401).json(
                {
                    ok:false,
                    err
                });
        }
        req.usuario=decoded.usuario
        
    })
    next();
    //console.log(token);
    
    // res.json(
    //     {
    //         token:token
    //     });
}
let verificarADMIN_ROLE=(req,res,next)=>
{
    let usuario=req.usuario;
    if(usuario.role==='ADMIN_ROLE')
    {
        next();
    }else{
        return res.json(
        {
            ok:false,
            err:{
                persona:`${usuario.nombre} no es admin?`,
                message:'El usuario no es administrador'
            }
        })
    }
    
}
//Verifica token para la imagen
let verificaTokenImg=(req,res,next)=>
{
    let token=req.query.token;
    jwt.verify(token,process.env.SEED,(err,decoded)=>
    {
        //decoded es el payload
        if(err)
        {
            return res.status(401).json(
                {
                    ok:false,
                    err
                });
        }
        req.usuario=decoded.usuario
        
    })
    next();
}
module.exports=
{
    verificarToken,
    verificarADMIN_ROLE,
    verificaTokenImg
}