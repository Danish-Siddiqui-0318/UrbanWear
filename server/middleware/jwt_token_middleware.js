const jwt=require("jsonwebtoken");

const UserModel=require("./models/UserModel");

async function jwtMiddleWear(req, res,next){
    try{
        const authHeader = req.headers.authorization;
        if(!authHeader){
            return res.status(401).json({message:"Not authorized,no token"});
        }

        const token=authHeader.split(' ')[1];

        const decoded=jwt.verify(token,process.env.JWT_SECRET);

        const user=await UserModel.findById(decoded._id).select("-password");
        if(!user){
            return res.status(401).json({ message: "User not found" });
        }

        req.user=user;
        next();
    }catch(e){
        return res.status(401).json({message:"Token invalid or expired"});
    }
}

module.exports=jwtMiddleWear;