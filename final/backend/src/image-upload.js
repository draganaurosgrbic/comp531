const multer = require('multer');

const uploadImage = imageId => (req, res, next) => {
    multer().single(imageId)(req, res, () => next());
}

const imageMiddleware = (req, res, next) => {
    if (req.method === 'POST' && req.url === '/avatar') {
        return uploadImage('avatar')(req, res, next);
    } if (req.method === 'POST' && req.url === '/article') {
        return uploadImage('image')(req, res, next);
    }
    return next();
}

module.exports = app => {
    app.use(imageMiddleware);
}
