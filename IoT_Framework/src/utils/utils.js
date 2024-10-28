const jwt = require('jsonwebtoken');
const moment = require('moment');
const dotenv = require('dotenv');
dotenv.config();
const secret = process.env.SECRET || '';
    
 const createToken = (obj) => {
    let payload = {
        id: obj.id,
        username: obj.username,
        iat: moment().unix(),
        exp: moment().add(1, 'day').unix()
    };
    return jwt.sign(payload, secret);
};
    
module.exports = createToken;

    