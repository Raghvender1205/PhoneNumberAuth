const { ACCESS_DENIED_ERR } = require('../errors');

module.exports = (req, res, next) => {
    const currUser = res.locals.user;
    if (!currUser) {
        return next({status: 401, message: ACCESS_DENIED_ERR});
    }

    if (currUser.data == 'admin') {
        return next();
    }

    return next({ status: 401, message: ACCESS_DENIED_ERR });
}; 