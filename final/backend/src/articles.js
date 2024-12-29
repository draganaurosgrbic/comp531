const mongoose = require('mongoose');
const stream = require('stream');
const cloudinary = require('cloudinary');

const profileSchema = require('./schemas/profileSchema');
const Profile = mongoose.mongoose.model('profile', profileSchema);

const articleSchema = require('./schemas/articleSchema');
const Article = mongoose.mongoose.model('article', articleSchema);

const PAGE_SIZE = 10;

const createArticle = (req, res) => {
    const username = req.username;
    const text = req.body.text;

    if (!username || !text) {
        return res.sendStatus(400);
    }

    const saveArticle = async (image) => {
        const user = await Profile.findOne({ username });
        if (!user) {
            return res.sendStatus(400);
        }

        const pid = await Article.countDocuments() + 1;
        const article = {
            pid,
            date: new Date(),
            author: username,
            text,
            image,
        }

        await Article.create(article);
        const articles = await Article.find({
            author: { "$in": [username].concat(user.followedUsers) }
        }, [], {
            limit: PAGE_SIZE,
            sort: { date: -1 }
        });

        const totalCount = await Article.countDocuments({ author: { "$in": [username].concat(user.followedUsers) } });
        return res.send({ articles, totalCount });
    };

    if (req.file) {
        const uploadStream = cloudinary.uploader.upload_stream(result => saveArticle(result.url));
        const s = new stream.PassThrough();
        s.end(req.file.buffer);
        s.pipe(uploadStream);
        s.on('end', uploadStream.end);
    } else {
        saveArticle(null);
    }
}

const getArticles = (req, res) => {
    const username = req.username;
    const id = req.params.id;
    const page = req.query.page || 0;

    if (!username) {
        return res.sendStatus(400);
    }

    let articles;
    let article;
    let totalCount;

    (async () => {
        if (!id) {
            const user = await Profile.findOne({ username });
            if (!user) {
                return res.sendStatus(400);
            }

            articles = await Article.find({
                author: { "$in": [username].concat(user.followedUsers) }
            }, [], {
                skip: page * PAGE_SIZE,
                limit: PAGE_SIZE,
                sort: { date: -1 },
            });
            totalCount = await Article.countDocuments({ author: { "$in": [username].concat(user.followedUsers) } });

        } else {
            if (!isNaN(id)) {
                article = await Article.findOne({ pid: id });
            }

            if (!article) {
                articles = await Article.find({
                    author: id
                }, [], {
                    skip: page * PAGE_SIZE,
                    limit: PAGE_SIZE,
                    sort: { date: -1 },
                });
            } else {
                articles = [article];
            }
        }

        return res.send({ articles, totalCount });
    })();
}

const updateArticle = (req, res) => {
    const username = req.username;
    const text = req.body.text;
    const id = req.params.id;

    if (!username || !text || !id) {
        return res.sendStatus(400);
    }

    const commentId = req.body.commentId;
    const page = req.query.page || 0;

    (async () => {
        const user = await Profile.findOne({ username });
        if (!user) {
            return res.sendStatus(400);
        }

        const article = await Article.findOne({ pid: id });
        if (!article) {
            return res.sendStatus(400);
        }

        if (!commentId) {
            if (article.author !== username) {
                return res.sendStatus(403);
            }
            await Article.findOneAndUpdate({ pid: id }, { text });
        } else {
            const comments = article.comments || [];
            if (commentId === -1) {
                const comment = {
                    id: comments.length + 1,
                    author: username,
                    text,
                };
                comments.push(comment);
            } else {
                for (const comment of comments) {
                    if (comment.id === commentId) {
                        if (comment.author !== username) {
                            return res.sendStatus(403);
                        }
                        comment.text = text;
                        break;
                    }
                }
            }
            await Article.findOneAndUpdate({ pid: id }, { comments });
        }

        const articles = await Article.find({
            author: { "$in": [username].concat(user.followedUsers) }
        }, [], {
            skip: page * PAGE_SIZE,
            limit: PAGE_SIZE,
            sort: { date: -1 },
        });
        totalCount = await Article.countDocuments({ author: { "$in": [username].concat(user.followedUsers) } });
        return res.send({ articles, totalCount });
    })();
}

module.exports = app => {
    app.post('/article', createArticle);
    app.get('/articles/:id?', getArticles);
    app.put('/articles/:id', updateArticle);
}