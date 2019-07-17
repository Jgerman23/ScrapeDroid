var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");

var axios = require("axios");
var cheerio = require("cheerio");

var db = require("./models");

var PORT = 8080;

var app = express();


app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

mongoose.connect("mongodb://localhost/ScrapeDroid", { useNewUrlParser: true });


app.get("/scrape", function (req, res) {
    axios.get("https://www.androidpolice.com/").then(function (response) {
        var $ = cheerio.load(response.data);

        $("div.post").each(function (i, element) {
            var result = {};

            result.title = $(this).find("header").find("h2").text();
            result.link = $(this).find("header").find("h2").find("a").attr("href");
            result.summary = $(this).find("div.post-content").find("p").text();

            db.Article.create(result)
                .then(function (dbArticle) {
                    console.log(dbArticle);
                })
                .catch(function (err) {
                    console.log(err);
                });
        });
        res.send("Scrape Complete");
    });
});


app.get("/articles", function (req, res) {    
    db.Article.find({})
        .then(function (dbArticle) {
            res.json(dbArticle);
        })
        .catch(function (err) {
            res.json(err);
        })
});


app.get("/articles/:id", function (req, res) {                    

    db.Article.find({ "_id": req.params.id })
        .populate("note")
        .then(function (dbArticle) {
            res.json(dbArticle[0]);
        })
        .catch(function (err) {
            res.json(err);
        })
});


app.post("/articles/:id", function (req, res) {                    

    db.Note.create(req.body)
        .then(function (dbNote) {
            return db.Article.findOneAndUpdate({ "_id": req.params.id }, { $set: { note: dbNote._id } }, { new: true });
        })
        .then(function (dbArticle) {
            res.json(dbArticle);
        })
        .catch(function (err) {
            res.json(err);
        });

});

app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
});
