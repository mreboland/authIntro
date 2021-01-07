const { verifyToken } = require("../tokens/tokenService.js");

exports.verifyToken = async (req, res, next) => {

    const { cookies } = req;
    try {
        if (!cookies || !cookies.token) {
            res.status(403).json({ message: "authorization required" });
            return;
        }
    
        const token = cookies.token;
        const userToken = await verifyToken(token);

        req.user = userToken;
        next();
    
    } catch (err) {
        console.log(err, "error?");
        res.status(403).json({ message: "invalid or expired token" });
    }    
};