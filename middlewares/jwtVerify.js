const jwt = require('jsonwebtoken');
module.exports = (req, res, next)=> {
// invalid token - synchronous
    try {
        const authorization = req.headers.authorization;
        const parts = (authorization) ? authorization.split(" ") : [];
        if(parts[1]){
            const decoded = jwt.verify(parts[1], 'jwt secret dhjasdkajs');
            req.publisher = decoded;
            next();
        }else {
            res.status(401).json({
                msg: 'invalid JWT provided'
            });
        }
    } catch(err) {
        res.status(401).json({
            msg: err.toString()
        })
    }
}