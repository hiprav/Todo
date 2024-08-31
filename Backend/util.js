const jwt=require('jsonwebtoken')

function authtoken(req,res,next){
    console.log("authtoken")
    const authhead=req.headers['authorization'];
    const token = authhead && authhead.split(" ")[1];

    if (!token) return res.sendStatus(401);

    jwt.verify(token,process.env.ACCESS_TOKEN_SECREATE,(err,user)=>{
        if(err) return res.sendStatus(401);
        req.user=user;
        next();
    })
}

module.exports={authtoken,}