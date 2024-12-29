const mongoose = require('mongoose');
const md5 = require('md5');

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const session = require('express-session');

const userSchema = require('./schemas/userSchema');
const User = mongoose.mongoose.model('user', userSchema);

const profileSchema = require('./schemas/profileSchema');
const Profile = mongoose.mongoose.model('profile', profileSchema);

const articleSchema = require('./schemas/articleSchema');
const Article = mongoose.mongoose.model('article', articleSchema);

const COOKIE_KEY = 'sid';
const SESSION_MAP = {};


passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));


passport.use(new GoogleStrategy({
    clientID: '738133052596-0shpob2dtk1c7pdv7lust1jshuvuv58f.apps.googleusercontent.com',
    clientSecret: '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',
    // callbackURL: '/auth/google/callback',
    callbackURL: 'https://dg76-comp531-final-backend-675d566f1e2b.herokuapp.com/auth/google/callback',
},
    (accessToken, refreshToken, profile, done) => {
        const user = {
            email: profile.emails && profile.emails[0].value,
            name: `${profile.name.givenName} ${profile.name.familyName}`,
            id: profile.id,
            token: accessToken,
        };

        return done(null, user);
    })
);



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

    (async () => {
        const user = await Profile.findOne({ username });
        if (user) {
            return res.sendStatus(400);
        }

        const salt = username + new Date().getTime();
        password = md5(password + salt);

        await Profile.create({
            username,
            email,
            zipcode,
            phone,
            dob,
            headline: 'Hey there!',
        });

        await User.create({
            username,
            salt,
            password,
        });

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

const login = (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    let oauth_id;

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

        if (req.cookies && req.cookies[COOKIE_KEY]) {
            oauth_id = SESSION_MAP[req.cookies[COOKIE_KEY]];
        }

        if (oauth_id) {
            await User.deleteOne({ oauth_id });
            await Profile.deleteOne({ oauth_id });

            await User.findOneAndUpdate({ username }, { oauth_id });
            await Profile.findOneAndUpdate({ username }, { oauth_id });

            await Article.updateMany({ author: oauth_id }, { author: username });
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
        const user = await User.findOne({ username });
        if (!user) {
            return res.sendStatus(400);
        }

        await User.findOneAndUpdate({ username }, { password: md5(password + user.salt) });

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

const isAccountLinked = (req, res) => {
    const username = req.username;
    if (!username) {
        return res.sendStatus(400);
    }

    (async () => {
        const user = await User.findOne({ username });
        if (!user) {
            return res.sendStatus(400);
        }

        return res.send({
            username,
            accountLinked: user.oauth_id && user.username !== user.oauth_id,
        });
    })();
}

const isOauthLogin = (req, res) => {
    const username = req.username;
    if (!username) {
        return res.sendStatus(400);
    }

    (async () => {
        const user = await User.findOne({ username });
        if (!user) {
            return res.sendStatus(400);
        }

        return res.send({
            username,
            oauthLogin: !!user.oauth_id,
        });
    })();
}

const unlinkAccount = (req, res) => {
    const username = req.username;
    if (!username) {
        return res.sendStatus(400);
    }

    (async () => {
        const user = await User.findOne({ username });
        if (!user) {
            return res.sendStatus(400);
        }

        const profile = await Profile.findOne({ username });
        if (!profile) {
            return res.sendStatus(400);
        }

        await User.findOneAndUpdate({ username }, { oauth_id: null });
        await Profile.findOneAndUpdate({ username }, { oauth_id: null });

        return res.send();
    })();
}

const googleCallback = (req, res) => {
    if (req.user) {
        const oauth_id = req.user.id;
        let username;

        if (req.cookies && req.cookies[COOKIE_KEY]) {
            username = SESSION_MAP[req.cookies[COOKIE_KEY]];
        }

        (async () => {
            let user = await User.findOne({ oauth_id });
            if (!user) {
                user = await User.create({ oauth_id, username: oauth_id });
            }

            const profile = await Profile.findOne({ oauth_id });
            if (!profile) {
                await Profile.create({ oauth_id, username: oauth_id, headline: 'Hey there!' });
            }

            if (username) {
                await User.deleteOne({ oauth_id });
                await Profile.deleteOne({ oauth_id });

                user = await User.findOneAndUpdate({ username }, { oauth_id });
                await Profile.findOneAndUpdate({ username }, { oauth_id });

                await Article.updateMany({ author: oauth_id }, { author: username });
            }

            const sid = user.username + new Date().toString();
            SESSION_MAP[sid] = user.username;
            res.cookie(COOKIE_KEY, sid, {
                maxAge: 3600 * 1000,
                httpOnly: true,
                secure: true,
                sameSite: 'none',
            });
            // res.redirect('http://localhost:4200/main');
            res.redirect('https://dg76-comp531-final-frontend.surge.sh/main');
        })();

    } else {
        res.clearCookie(COOKIE_KEY);
        res.redirect('/');
    }
}

module.exports = app => {
    app.use(session({
        secret: 'doNotGuessTheSecret',
        resave: true,
        saveUninitialized: true,
    }));
    app.use(passport.initialize());
    app.use(passport.session());

    app.get('/auth/google', passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login'] }));
    app.get('/auth/google/callback', passport.authenticate('google'), googleCallback);


    app.post('/login', login);
    app.post('/register', register);

    app.use(isLoggedIn);

    app.put('/logout', logout);
    app.put('/password', updatePassword);

    app.get('/oauth-login', isOauthLogin);
    app.get('/account-linked', isAccountLinked);

    app.get('/unlink-account', unlinkAccount);
}
