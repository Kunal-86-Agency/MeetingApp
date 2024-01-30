const jwt = require('jsonwebtoken');
require('dotenv').config();
const JWT_SECRET = process.env.JSON_SECRET;


const Authentication = async (req, res, next) => {

    try {
        const token = req.headers?.authorization?.split(" ")[1];
        if (!token) return res.status(401).send({ message: "Authentication Failed. Token Not Found" })

        jwt.verify(token, JWT_SECRET, (err, decoded) => {
            if (err) return res.json({ message: err.message, status: "error" })
            req.headers.userID = decoded.id;
            req.headers.role = decoded.role;
            next();
        })
    } catch (error) {
        res.status(500).send({ message: "Something went wrong while authorizing user", "err": error })
    }

}

module.exports = Authentication;