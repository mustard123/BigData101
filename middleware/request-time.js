module.exports = function (req, res, next) {
    req.requestTime = Date.now();
    next();
};