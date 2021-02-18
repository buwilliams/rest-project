const _ = require("lodash");
const summaryPopularDays = require("./data/summary/popular_days.js");
const summaryStreaks = require("./data/summary/streaks.js");

module.exports = function(app) {
    function popular(req, res, limit) {
        if (limit) {
            res.json(_.slice(app.locals.popular, 0, limit));
        } else {
            res.json(app.locals.popular);
        }
    }

    function fans(req, res, limit) {
        if (limit) {
            res.json(_.slice(app.locals.fans, 0, limit));
        } else {
            res.json(app.locals.fans);
        }
    }

    function popularDays(req, res, timezone) {
        if(timezone) {
            res.json(summaryPopularDays(app.locals.store, timezone));
        } else {
            res.json(app.locals.popularDays);
        }
    }

    function streaks(req, res, timezone) {
        if(timezone) {
            res.json(summaryStreaks(app.locals.store, timezone));
        } else {
            res.json(app.locals.streaks);
        }
    }

    function all(req, res, limit) {
        if (limit) {
            res.json(_.slice(app.locals.store, 0, limit));
        } else {
            res.json(app.locals.store);
        }
    }

    function malformed(req, res) {
        res.status(422).json({ status: "error", desc: "malformed query parameters" });
    }

    app.get("/users/:userId/likes", function (req, res) {
        let summary = req.query.summary;
        let timezone = req.query.timezone;
        let limit = req.query.limit;
        if (limit) limit = parseInt(limit);
        let isMalformedQueryParams = _.keys(req.query).length >= 2 || (_.keys(req.query).length === 1 && !req.query.limit);

        if (summary === "popular") {
            popular(req, res, limit);
        } else if (summary === "fans") {
            fans(req, res, limit);
        } else if (summary === "popularDays") {
            popularDays(req, res, timezone);
        } else if (summary === "streaks") {
            streaks(req, res, timezone);
        } else if (isMalformedQueryParams) {
            malformed(req, res);
        } else {
            all(req, res, limit);
        }
    });
}