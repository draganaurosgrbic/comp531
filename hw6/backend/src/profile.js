const mongoose = require('mongoose');

const profileSchema = require('./schemas/profileSchema');
const Profile = mongoose.mongoose.model('profile', profileSchema);

const getFieldValue = (req, res, fieldName) => {
    const username = req.params.user || req.username;

    if (!username) {
        return res.sendStatus(400);
    }

    (async () => {
        const profile = await Profile.findOne({ username });
        if (!profile) {
            return res.sendStatus(400);
        }

        return res.send({
            username,
            [fieldName]: profile[fieldName],
        });
    })();
}

const updateFieldValue = (req, res, fieldName) => {
    const username = req.username;
    const fieldValue = req.body[fieldName];

    if (!username || !fieldValue) {
        return res.sendStatus(400);
    }

    (async () => {
        const profile = await Profile.findOneAndUpdate({ username }, { [fieldName]: fieldValue });
        if (!profile) {
            return res.sendStatus(400);
        }

        return res.send({
            username,
            [fieldName]: fieldValue,
        });
    })();
}


module.exports = app => {
    app.get('/headline/:user?', (req, res) => getFieldValue(req, res, 'headline'));
    app.put('/headline', (req, res) => updateFieldValue(req, res, 'headline'));

    app.get('/email/:user?', (req, res) => getFieldValue(req, res, 'email'));
    app.put('/email', (req, res) => updateFieldValue(req, res, 'email'));

    app.get('/zipcode/:user?', (req, res) => getFieldValue(req, res, 'zipcode'));
    app.put('/zipcode', (req, res) => updateFieldValue(req, res, 'zipcode'));

    app.get('/phone/:user?', (req, res) => getFieldValue(req, res, 'phone'));
    app.put('/phone', (req, res) => updateFieldValue(req, res, 'phone'));

    app.get('/dob/:user?', (req, res) => getFieldValue(req, res, 'dob'));

    app.get('/avatar/:user?', (req, res) => getFieldValue(req, res, 'avatar'));
    app.put('/avatar', (req, res) => updateFieldValue(req, res, 'avatar'));
}