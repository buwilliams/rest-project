const _ = require('lodash');

module.exports = function(json) {
    // count likes
    let sum = {};
    _.each(json, row => {
        if(sum[row.user]) {
            sum[row.user] = sum[row.user] + 1;
        } else {
            sum[row.user] = 1;
        }
    });

    // sort likes
    let out = _.map(sum, (value, prop) => ({ 'user': prop, 'likes': value}));
    out = _.orderBy(out, 'likes', 'desc');

    return out;
};