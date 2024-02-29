//Create and send token and save in the cookie.

const jwt = require("jsonwebtoken")

const createToken =(_id)=>{
    return jwt.sign({_id},'gghgbjkdbbmmnmcfhjlsdjla',{expiresIn: '3d'})
}

module.exports = createToken;
