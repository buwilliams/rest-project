const _ = require('lodash');
const { DateTime } = require("luxon");

module.exports = function(json, timezone) {
    timezone = timezone || 'America/New_York';
    let sum = [0, 0, 0, 0, 0, 0, 0]

    let bogus = DateTime.local().setZone(timezone);
    if(!bogus.isValid) throw new Error("Invalid timezone " + timezone);

    // count likes by day
    _.each(json, row => {
        let utcDate = DateTime.fromISO(row.date, { zone: "utc" });
        let local = utcDate.setZone(timezone);
        let day = local.toFormat('E') - 1;
        sum[day]++;
    });

    let out = {
        'monday': 0,
        'tuesday': 0,
        'wednesday': 0,
        'thursday': 0,
        'friday': 0,
        'saturday': 0,
        'sunday': 0,
        'timezone': timezone
    }
    let keys = _.keys(out);

    _.each(sum, (value, idx) => {
        let key = keys[idx];
        out[key] = value;
    });

    return out;
}