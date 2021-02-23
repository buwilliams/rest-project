const _ = require('lodash');

module.exports = function(json) {
    // TODO: handle duplicate likes from the
    //       same user (if we have bad data)

    // count likes
    let sum = {};
    _.each(json, row => {
        if(sum[row.postid]) {
            sum[row.postid] = sum[row.postid] + 1;
        } else {
            sum[row.postid] = 1;
        }
    });

    // sort likes
    let out = _.map(sum, (value, prop) => ({ 'postid': parseInt(prop), 'likes': value}));
    out = _.orderBy(out, 'likes', 'desc');

    return out;
};