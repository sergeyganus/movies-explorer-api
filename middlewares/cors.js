const allowedCors = [
  'http://localhost:3000',
];
const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';

module.exports = (req, res, next) => {
  const { origin } = req.headers;
  const { method } = req;
  const requestHeaders = req.headers['access-control-request-headers'];

  if (allowedCors.includes(origin)) {
    req.header('Access-Control-Allow-Origin', origin);
    req.header('Access-Control-Allow-Credentials', true);
  }

  if (method === 'OPTIONS') {
    req.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    req.header('Access-Control-Allow-Headers', requestHeaders);

    return res.end();
  }

  return next();
};
