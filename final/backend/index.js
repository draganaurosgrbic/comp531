const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const mongoose = require('mongoose');

const auth = require('./src/auth');
const profile = require('./src/profile');
const articles = require('./src/articles');
const following = require('./src/following');
const imageUpload = require('./src/image-upload');

const dbConnectionString = "mongodb+srv://dg76:fxV7PjJR7rXePe73@cluster0.o7qmvm2.mongodb.net/?retryWrites=true&w=majority";

const corsConfig = {
    origin: ['http://localhost:4200', 'https://dg76-comp531-final-frontend.surge.sh'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}

const app = express();

app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors(corsConfig));

auth(app);
imageUpload(app);

profile(app);
articles(app);
following(app);

const port = process.env.PORT || 3000;

mongoose.connect(dbConnectionString).then(() => {
    const server = app.listen(port, () => {
        const address = server.address();
        console.log(corsConfig);
        console.log(`Server listening at http://${address.address}:${address.port}`);
    });
});
