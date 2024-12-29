const mongoose = require('mongoose');

const profileSchema = require('./schemas/profileSchema');
const Profile = mongoose.mongoose.model('profile', profileSchema);

const articleSchema = require('./schemas/articleSchema');
const Article = mongoose.mongoose.model('article', articleSchema);

const createArticle = (req, res) => {
    const username = req.username;
    const text = req.body.text;

    if (!username || !text) {
        return res.sendStatus(400);
    }

    (async () => {
        const user = await Profile.findOne({ username });
        if (!user) {
            return res.sendStatus(400);
        }

        const articlesCount = await Article.countDocuments();
        const article = {
            pid: articlesCount + 1,
            date: new Date(),
            author: username,
            text,
        }

        await Article.create(article);
        const articles = (await Article.find({ author: { "$in": [username].concat(user.followedUsers) } })).sort((a, b) => b.date.getTime() - a.date.getTime());
        return res.send({ articles });
    })();
}

const getArticles = (req, res) => {
    const username = req.username;
    const id = req.params.id;

    if (!username) {
        return res.send(400);
    }

    let articles;
    let article;

    (async () => {
        if (!id) {
            const user = await Profile.findOne({ username });
            if (!user) {
                return res.sendStatus(400);
            }

            articles = await Article.find({ author: { "$in": [username].concat(user.followedUsers) } });
        } else {
            if (!isNaN(id)) {
                article = await Article.findOne({ pid: id });
            }

            if (!article) {
                articles = await Article.find({ author: id });
            } else {
                articles = [article];
            }
        }

        articles = articles.sort((a, b) => b.date.getTime() - a.date.getTime());
        return res.send({ articles });
    })();
}

module.exports = app => {
    app.post('/article', createArticle);
    app.get('/articles/:id?', getArticles);
}