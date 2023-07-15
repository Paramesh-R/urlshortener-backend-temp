const jwt = require('jsonwebtoken');
const User = require('../models/UserModel')
var cookies = require("cookie-parser");



exports.isAuthenticated = async (req, res, next) => {
    console.log("isAuthenticated")
    const token = req.cookies.token;
    // Cookies that have not been signed
    console.log('Cookies: ', req.cookies)

    // Cookies that have been signed
    console.log('Signed Cookies: ', req.signedCookies)

    if (!token) return res.status(401).json({ message: 'Access denied. No token provided.' })

    try {
        const decodedToken = await jwt.verify(token, process.env.JWT_SECRET);
        next();

    } catch (error) {
        res.status(402).json({ error: error });
    }

    // Old method to verify JWT token
    // const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
    // req.user = await User.findById(decodedToken.id)

    //  #2nd  Method to verify JWT token
    // jwt
    //     .verify(token, process.env.JWT_SECRET, async (err, data) => {
    //         if (err) {

    //             return res.json({ message: "Invalid Token", error: err })

    //         } else {

    //             const user = await User.findById(data.id)

    //             if (user) {
    //                 return res.json({ status: true, user: user.email })
    //             } else {
    //                 return res.json({ status: false })
    //             }
    //         }
    //     }
    //     );

    // next()
}