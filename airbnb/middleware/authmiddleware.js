const jwt=require('jsonwebtoken');
const secretkey =require('../config')
function verifyToken(req,res,next){
    const token =req.header('Authorization');
    //acees denied k liye code hai 401
    if(!token) return res.status(401).json({error:'access denied'});
    try{
        const decoded =jwt.verify(token,secretkey.secret);
        req.userId=decoded.userId;
        next();
    }
    catch(error)
    {
        res.status(401).json({error:'invalid token'});
    }
    };
    module.exports=verifyToken;
