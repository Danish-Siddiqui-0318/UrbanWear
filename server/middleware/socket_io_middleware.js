const socketIOMiddleware = (io) => (req, res, next) => {
    req.io = io;
    next();
};

module.exports = socketIOMiddleware;
