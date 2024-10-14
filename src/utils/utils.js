
    const jwt = require('jsonwebtoken');
    require('dotenv').config();
    const secret = process.env.SECRET || '';
    const moment = require('moment');

    const createToken = (obj) => {
        let payload = {
        id: obj.id,
        username: obj.username,
        iat: moment().unix(),
        exp: moment().add(1, 'day').unix()
        };
        return jwt.encode(payload, secret);
    };

    const jwtMethods = {
        createToken
    };

    export default jwtMethods;

    