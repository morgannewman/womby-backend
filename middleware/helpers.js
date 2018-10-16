/**
 * Constructs a valid location header for newly created items.
 * @param {Object} req - the req object passed by Express.
 * @param {Object} res - the database response object containing an ID.
 * @returns {string} with the URL of a new location.
 * @example res.status(201).location(constructLocationHeader(req, dbResponse)).json(dbResponse);
 */
const constructLocationHeader = (req, res) => {
  let url = req.originalUrl;
  const lastIndex = url.length - 1;
  if (url[lastIndex] === '/') url = url.slice(0, lastIndex);
  return `${url}/${res.id}`;
};

/**
 * Contructs an object from the request body using an array of possible fields. Disallows fields with falsy values. Ensures userId is present in object body.
 * @param {string[]} fields - An array of possible fields in req.body.
 * @param {Object} req - The req object given by Express.
 * @returns {Object} an object with the correct userId and defined fields in req.body.
 */
const constructObject = (fields, request) => {
  const body = request.body;
  const userId = request.user.id;
  const result = { userId };
  for (const field of fields) {
    if (body[field] && field in body) {
      result[field] = body[field];
    }
  }
  return result;
};

module.exports = {constructLocationHeader, constructObject};