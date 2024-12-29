const mongoose = require('mongoose');
const md5 = require('md5');

const userSchema = require('./schemas/userSchema');
const User = mongoose.mongoose.model('user', userSchema);

const profileSchema = require('./schemas/profileSchema');
const Profile = mongoose.mongoose.model('profile', profileSchema);

const COOKIE_KEY = 'sid';
const SESSION_MAP = {};

const isLoggedIn = (req, res, next) => {
    if (!req.cookies) {
        return res.sendStatus(401);
    }

    const sid = req.cookies[COOKIE_KEY];
    if (!sid) {
        return res.sendStatus(401);
    }

    const username = SESSION_MAP[sid];
    if (!username) {
        return res.sendStatus(401);
    }

    req.username = username;
    next();
}

const register = (req, res) => {
    const username = req.body.username;
    const email = req.body.email;
    const zipcode = req.body.zipcode;
    const phone = req.body.phone;
    const dob = req.body.dob;
    let password = req.body.password;

    if (!username || !email || !zipcode || !phone || !dob || !password) {
        return res.sendStatus(400);
    }

    const salt = username + new Date().getTime();
    password = md5(password + salt);

    (async () => {
        const user = await Profile.findOne({ username });
        if (user) {
            return res.sendStatus(400);
        }

        await Profile.create({
            username,
            email,
            zipcode,
            phone,
            dob,
            headline: 'Default headline',
            avatar: '',
            followedUsers: []
        });

        await User.create({
            username,
            salt,
            password,
        });

        return res.send({
            username,
            result: 'success',
        });

    })();
}

const login = (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.sendStatus(400);
    }

    (async () => {
        const user = await User.findOne({ username });
        if (!user) {
            return res.sendStatus(401);
        }

        if (user.password !== md5(password + user.salt)) {
            return res.sendStatus(401);
        }

        const sid = username + new Date().toString();
        SESSION_MAP[sid] = username;
        res.cookie(COOKIE_KEY, sid, {
            maxAge: 3600 * 1000,
            httpOnly: true,
            secure: true,
            sameSite: 'none',
        });

        return res.send({
            username,
            result: 'success',
        });
    })();
}

const updatePassword = (req, res) => {
    const username = req.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.sendStatus(400);
    }

    (async () => {
        const user = await User.findOneAndUpdate({ username }, { password });
        if (!user) {
            return res.sendStatus(400);
        }

        return res.send({
            username,
            password,
        });
    })();
}

const logout = (req, res) => {
    delete SESSION_MAP[req.cookies[COOKIE_KEY]];
    res.clearCookie(COOKIE_KEY);
    return res.send();
}

module.exports = app => {
    app.post('/login', login);
    app.post('/register', register);

    app.use(isLoggedIn);

    app.put('/logout', logout);
    app.put('/password', updatePassword);
}
