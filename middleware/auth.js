var jwt = require("jsonwebtoken");

const verifyAuth = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, process.env.SECRET_KEY, (err, decodedToken) => {
      if (err) {
        const response = {
          redirect: true,
        };
        res.send(response);
      } else {
        next();
      }
    });
  } else {
    const response = {
      redirect: true,
    };
    res.send(response);
  }
};

module.exports = {
  verifyAuth,
};
