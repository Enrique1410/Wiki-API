const express = require('express');
const body = require('body-parser');
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(body.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.set('strictQuery', true);
mongoose.connect("mongodb://0.0.0.0:27017/wikiDB");

const articleSchema = {
    title: String,
    content: String
};

const Article = mongoose.model("Article", articleSchema);

app.route("/articles")
    .get((req, res) => {
        Article.find((err, foundArticles) => {
            if (!err) {
                res.send(foundArticles);
            } else {
                res.send(err);
            }
        });
    })
    .post((req, res) => {
        const newArticle = new Article({
            title: req.body.title,
            content: req.body.content
        });

        newArticle.save((err) => {
            if (!err) {
                res.send("Successfully added a new article.");
            } else {
                res.send(err);
            }
        });
    })
    .delete((req, res) => {
        Article.deleteMany((err) => {
            if (!err) {
                res.send("Successfully deleted all the articles.");
            } else {
                res.send(err);
            }
        });
    });

app.route("/articles/:articleTitle")
    .get((req, res) => {
        Article.findOne({ title: req.params.articleTitle }, (err, foundArticle) => {
            if (foundArticle) {
                res.send(foundArticle);
            } else {
                res.send("No articles matching that title was found.");
            }
        });
    });

app.listen(3000, () => {
    console.log("Server started on port 3000");
});