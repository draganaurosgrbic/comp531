const mongoose = require('mongoose');

const profileSchema = require('./schemas/profileSchema');
const Profile = mongoose.mongoose.model('profile', profileSchema);

const getFollowedUsers = (req, res) => {
    const username = req.params.user || req.username;
    if (!username) {
        return res.sendStatus(400);
    }

    (async () => {
        const user = await Profile.findOne({ username });
        if (!user) {
            return res.sendStatus(400);
        }

        user.followedUsers = user.followedUsers.filter(u => u !== user.username);
        await Profile.findOneAndUpdate({ username }, { followedUsers: user.followedUsers });

        return res.send({
            username,
            following: user.followedUsers,
        });
    })();
}

const addFollowedUser = (req, res) => {
    const username = req.username;
    const followedUsername = req.params.user;

    if (!username || !followedUsername || username === followedUsername) {
        return res.status(400).send({ details: 'You can\'t follow yourself.' });
    }

    (async () => {
        const user = await Profile.findOne({ username });
        const followedUser = await Profile.findOne({ username: followedUsername });

        if (!user || !followedUser) {
            return res.status(400).send({ details: 'Entered user does not exist.' });
        }
        if (user.followedUsers.includes(followedUsername)) {
            return res.status(400).send({ details: 'You are already following this user.' });
        }

        user.followedUsers.push(followedUsername);
        await user.save();

        return res.send({
            username,
            following: user.followedUsers,
        });
    })();
}

const removeFollowedUser = (req, res) => {
    const username = req.username;
    const followedUsername = req.params.user;

    if (!username || !followedUsername || username === followedUsername) {
        return res.sendStatus(400);
    }

    (async () => {
        const user = await Profile.findOne({ username });
        const followedUser = await Profile.findOne({ username: followedUsername });

        if (!user || !followedUser || !user.followedUsers.includes(followedUsername)) {
            return res.sendStatus(400);
        }

        user.followedUsers = user.followedUsers.filter(u => u !== followedUsername);
        await user.save();

        return res.send({
            username,
            following: user.followedUsers,
        });
    })();
}

module.exports = app => {
    app.get('/following/:user?', getFollowedUsers);
    app.put('/following/:user', addFollowedUser);
    app.delete('/following/:user', removeFollowedUser);
}