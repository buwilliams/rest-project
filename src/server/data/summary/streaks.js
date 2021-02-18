const _ = require('lodash');
const { DateTime } = require("luxon");

module.exports = function(json, timezone) {
    timezone = timezone || 'America/New_York';
    let dates = {};

    let bogus = DateTime.local().setZone(timezone);
    if(!bogus.isValid) throw new Error("Invalid timezone " + timezone);

    // impossible to have a streak with less than three dates
    if(json.length < 3) return [];

    // count likes by date and timezone
    _.each(json, row => {
        let utcDate = DateTime.fromISO(row.date, { zone: "utc" });
        let local = utcDate.setZone(timezone);
        let key = local.toFormat('yyyy-MM-dd').toString();
        if(dates[key]) dates[key]++;
        else dates[key] = 1;
    });

    // convert to array
    let sortedDates = _.map(_.keys(dates), key => ({ "date": key, "likes": dates[key] }));
    sortedDates = _.orderBy(sortedDates, 'date', 'asc');
    //console.log(sortedDates);

    // calculate streaks
    let streaks = [];
    let minimumDaysForStreak = 2;
    let streakCount = 0;
    let totalLikes = 0;
    let from = null;
    let to = null;

    for(let i=0; i<sortedDates.length; i++) {
        let current = sortedDates[i];
        let next = sortedDates[i+1] || {}; // will become out of bounds

        // let isEnd = _.keys(next).length === 0;
        let isStreak = current.likes < next.likes;
        let shouldAddStreak = streakCount >= minimumDaysForStreak;
        let isEndOfStreak = !isStreak && shouldAddStreak;

        if(isStreak) {
            // console.log('isStreak', current, next);
            if(streakCount === 0) {
                from = current.date;
                streakCount = 2;
            } else {
                streakCount += 1;
            }
            totalLikes += current.likes;
        } else if (isEndOfStreak) {
            // console.log('isEndOfStreak', current, next);
            to = current.date;
            totalLikes += current.likes;
            streaks.push({
                from,
                to,
                likes: totalLikes,
                timezone
            });
        }
        
        // reset counters
        if (!isStreak) {
            // console.log('notStreak', current, next);
            from = null;
            to = null;
            totalLikes = 0;
            streakCount = 0;
        }
    }

    streaks = _.orderBy(streaks, 'to', 'desc');

    //return { sortedDates, streaks };
    return streaks;
}