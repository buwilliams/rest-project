const _ = require('lodash');
const { query, validationResult } = require('express-validator');
const { DateTime } = require('luxon');
const summaryPopularDays = require('./data/summary/popular_days.js');
const summaryStreaks = require('./data/summary/streaks.js');

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

    app.get('/users/:userId/likes',
        query('summary').isIn(['all', 'popular', 'fans', 'popularDays', 'streaks']).optional(),
        query('limit').isNumeric().optional(),
        query('timezone').custom((value) => {
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
                popular(req, res, limit);
            } else if (summary === 'fans') {
                fans(req, res, limit);
            } else if (summary === 'popularDays') {
                popularDays(req, res, timezone);
            } else if (summary === 'streaks') {
                streaks(req, res, timezone);
            } else {
                all(req, res, limit);
            }
        });
};