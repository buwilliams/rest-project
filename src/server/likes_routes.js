const _ = require('lodash');
const { body, query, validationResult } = require('express-validator');
const { DateTime } = require('luxon');
const summaryPopularDays = require('./data/summary/popular_days.js');
const summaryStreaks = require('./data/summary/streaks.js');
const popular = require('./data/summary/popular.js');
const fans = require('./data/summary/fans.js');
const popularDays = require('./data/summary/popular_days.js');
const streaks = require('./data/summary/streaks.js');

module.exports = function(app) {
    function popularSummary(req, res, limit) {
        if (limit) {
            res.json(_.slice(app.locals.popular, 0, limit));
        } else {
            res.json(app.locals.popular);
        }
    }

    function fansSummary(req, res, limit) {
        if (limit) {
            res.json(_.slice(app.locals.fans, 0, limit));
        } else {
            res.json(app.locals.fans);
        }
    }

    function popularDaysSummary(req, res, timezone) {
        if(timezone) {
            res.json(summaryPopularDays(app.locals.store, timezone));
        } else {
            res.json(app.locals.popularDays);
        }
    }

    function streaksSummary(req, res, timezone) {
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

    function updateStore(store) {
        app.locals.store = store;
        app.locals.popular = popular(store);
        app.locals.fans = fans(store);
        app.locals.popularDays = popularDays(store);
        app.locals.streaks = streaks(store);
    }

    app.get('/users/:userId/likes',
        query('summary', 'summary must be one of: all, popular, fans, popularDays, streaks').isIn(['all', 'popular', 'fans', 'popularDays', 'streaks']).optional(),
        query('limit', 'limit must be a number').isNumeric().optional(),
        query('timezone', 'timezone must be a valid timezone').custom((value) => {
            let bogus = DateTime.local().setZone(value);
            return bogus.isValid;
        }).optional(),
        function (req, res) {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            let summary = req.query.summary;
            let timezone = req.query.timezone;
            let limit = req.query.limit;
            if (limit) limit = parseInt(limit);

            if (summary === 'popular') {
                popularSummary(req, res, limit);
            } else if (summary === 'fans') {
                fansSummary(req, res, limit);
            } else if (summary === 'popularDays') {
                popularDaysSummary(req, res, timezone);
            } else if (summary === 'streaks') {
                streaksSummary(req, res, timezone);
            } else {
                all(req, res, limit);
            }
        });

    app.post('/users/:userId/likes',
        body('postid', 'postid must be a number').exists().isNumeric(),
        body('user', 'user must be present').exists().notEmpty(),
        body('date', 'date must be a valid iso date').exists().isISO8601(),
        function (req, res) {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            let store = [...app.locals.store];

            let newlike = {
                postid: parseInt(req.body.postid),
                user: req.body.user,
                date: req.body.date,
            };
            store.push(newlike);

            updateStore(store);

            res.json(newlike);
        });

    app.patch('/users/:userId/likes',
        body().isArray(),
        body('*.postid', 'postid must be a number').exists().isNumeric(),
        body('*.user', 'user must be present').exists().notEmpty(),
        body('*.date', 'date must be a valid iso date').exists().isISO8601(),
        function (req, res) {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            let store = [...app.locals.store];
            let likes = req.body;
            _.each(likes, like => {
                let index = _.findIndex(store, { postid: like.postid, user: like.user });
                if(index > -1) store[index].date = like.date;
            });
            updateStore(store);
            
            res.json(req.body);
        });
};