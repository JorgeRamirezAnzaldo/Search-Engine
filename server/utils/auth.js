//Import jsonwebtoken
const jwt = require('jsonwebtoken');

//Establish token secret and expiration
const secret = 'mysecretsshhhhh';
const expiration = '2h';

//Export authentication functions
module.exports = {
  // función para nuestras rutas autenticadas
  authMiddleware: function ({req}) {
    // permite que el token se envíe a través de req.query o encabezados
    let token = req.body.token || req.query.token || req.headers.authorization;

    // ["Bearer", "<tokenvalue>"]
    if (req.headers.authorization) {
      token = token.split(' ').pop().trim();
    }

    if (!token) {
      return req;
    }

    // verificar el token y obtener datos del usuario de él
    try {
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      req.user = data;
    } catch {
      console.log('Invalid token');
    }
    return req;
  },
  //Function to sign token using jsonwebtoken
  signToken: function ({ username, email, _id }) {
    const payload = { username, email, _id };

    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },
};
