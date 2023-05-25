import jwt from 'jsonwebtoken';

//generar token 
export async function Signtoken (user) {
    return jwt.sign({_id: user._id, User: user.Usuario, Pasw: user.Contraseña }, process.env.JWTKEY, {expiresIn: '2h'})
}

// verificar el token
export async function Verifytoken(token){
    try {
        return jwt.verify(token, process.env.JWTKEY)
    }catch(e){
        return null
    }
}

//middleware 
export async function checkauth(req,res,next){
    const token = req.headers.authorization.split(' ').pop()
    const tokendata = await Verifytoken(token)
    if (!tokendata){
        res.status(409).json("token no valido")
    }else{
    if (tokendata._id){
        next()
    }else{
        res.status(409).json("token no valido")
    }
    }
}
