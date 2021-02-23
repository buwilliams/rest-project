const fs = require('fs').promises;
const parse = require('csv-parse/lib/sync');
const _ = require('lodash');

module.exports = async function(path) {
    const content = await fs.readFile(__dirname + '/' + path, 'utf-8');
    let records = parse(content);

    let cols = _.first(records);
    cols = _.map(cols, col => {
        return col.replace(/-/g, '');
    });

    let rows = records.slice(1);

    let parsed = _.map(rows, (row, rowIdx) => {
        let out = {};
        _.each(cols, (col, colIdx) => {
            let value = rows[rowIdx][colIdx];

            if(col === 'postid') {
                out[col] = parseInt(value);
            } else if(col === 'date') {
                out[col] = value;
            } else {
                out[col] = value;
            }
        });
        return out;
    });

    return parsed;
};