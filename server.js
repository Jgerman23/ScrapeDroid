var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");
var path = require("path");
var axios = require("axios");
var cheerio = require("cheerio");

var db = require("./models");

var PORT = process.env.PORT || 8080;

var app = express();


app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
mongoose.connect(MONGODB_URI);

// mongoose.connect("mongodb://localhost/ScrapeDroid", { useNewUrlParser: true });
mongoose.set('useFindAndModify', false);

app.get("/", function (request, response) {
    response.sendFile(path.join(__dirname, "index.html"));
});

app.get("/display-saved", function (request, response) {
    db.Article.find({ saved: true }
    ).then(function (data) {
        response.json(data);
    })
        .catch(function (err) {
            console.log(err);
        })
});

app.get("/saved-articles", function (request, response) {
    response.sendFile(path.join(__dirname, "/public/html/saved.html"));
})


app.get("/scraped", function (req, res) {
    res.sendFile(path.join(__dirname, "/public/html/scraped.html"));
    db.Article.collection.drop();
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


app.put("/save-article/:id", function (req, res) {
    db.Article.findByIdAndUpdate({ "_id": req.params.id }, {
        $set: { saved: true }
    }).then(function (data) {
        res.json(data);
    });
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

app.delete("/delete-note/:article_id/:note_id", function (req, res) {
    db.Note.findOneAndRemove({ "_id": req.params.note_id }).then(function (results) {
        console.log(results);
    }).then(function (data) {
        db.Article.findOneAndUpdate({ '_id': req.params.article_id }, { $set: { 'note': '' } });
    }).then(function (data) {
        res.json(results);
    }).catch(function (err) { res.json(err) });
});


app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
});
