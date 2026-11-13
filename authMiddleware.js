const jwt = require("jsonwebtoken");
const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith("Bearer ")){
        return res.status(400).json({
            message: "Header is not found",
        })
    }

    const token = authHeader.split(" ")[1];

    try{
        const decode = jwt.verify(token,process.env.JWT_SECRET);

        req.user = {
            id: decode.id
        }

        next();


    }catch(error){
        return res.status(401).json({
            message: "Invalid or expired token"
        })
    }
}

module.exports = authMiddleware;