
/**
 * Determines the protocol and hostname, and returns the inteded url with the given endpoint.
 * @param {*} req the request object
 * @param {string} endpoint the url endpoint
 * @param {number | string} port optional port number
 * @returns the intended url link
 */
const getUrlByEnvironment = (req, endpoint, port) => {
  let protocol = 'http';
  if (process.env.NODE_ENV === 'production')
    protocol += 's';

  let host = req.hostname;
  if (process.env.NODE_ENV !== 'production')
    host += `:${port || process.env.PORT}`;
  // console.log('\nhost', host);

  return `${protocol}://${host}/${endpoint}`;
}

module.exports.getUrlByEnvironment = getUrlByEnvironment;
