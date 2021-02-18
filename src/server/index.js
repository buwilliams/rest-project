const _ = require("lodash");
const express = require("express");
const rateLimit = require("express-rate-limit");
const port = 3000;
const likesRoutes = require("./likes_routes.js");
const ingest = require("./data/ingest.js");
const popular = require("./data/summary/popular.js");
const fans = require("./data/summary/fans.js");
const popularDays = require("./data/summary/popular_days.js");
const streaks = require("./data/summary/streaks.js");

const app = express();

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
});

app.use(limiter);

app.get("/", function (req, res) {
    res.json({ status: "ok" });
});

likesRoutes(app);

app.get("/error", function (req, res) {
    throw new Error("generic error");
});

app.use(function (req, res, next) {
    res.status(404).json({ status: "not found" });
});

app.use(function (err, req, res, next) {
    console.error(err, err.stack);
    res.status(500).json({ status: "error" });
});

app.listen(port, async () => {
    const store = await ingest("friendface.csv");
    app.locals.store = store;
    app.locals.popular = popular(store);
    app.locals.fans = fans(store);
    app.locals.popularDays = popularDays(store);
    app.locals.streaks = streaks(store);

    console.log(`Listening at http://localhost:${port}`);
});
