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
    //console.log(token);
    next();
    // res.json(
    //     {
    //         token:token
    //     });
};
let verificarADMIN_ROLE=(req,res,next)=>
{
    let usuario=req.usuario;
    if(usuario.role==='ADMIN__ROLE')
    {
        next();
    }else{
        return res.json(
        {
            ok:false,
            err:{
                message:'El usuario no es administrador'
            }
        })
    }
    
}
module.exports=
{
    verificarToken,
    verificarADMIN_ROLE
}