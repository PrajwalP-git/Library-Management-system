const jwt = require("jsonwebtoken");
const JWT_SECRET= process.env.JWT_SECRET || "supersecretkey";

exports.authMiddleware= (req, res, next)=>{
    const token = req.headers.authorization?.split(" ")[1];
    if(!token) return res.status(401).json({message:"No token provided"});

    try{
        const decoded= jwt.verify(token, JWT_SECRET);
        req.user= decoded;
        next();
    }
    catch(error){
        return res.status(401).json({message:"Invalid token"});
    }
};

exports.adminMiddleware = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        return res.status(403).json({ message: "Access denied. Admin role required." });
    }
};