const ingest = require("./ingest.js");
const _ = require("lodash");

test('ingest should return an array', async () => {
    const json = await ingest("testdata.csv");
    // console.log(json);
    expect(_.isArray(json)).toBe(true);
});

test('ingest should return an array of objects', async () => {
    const json = await ingest("testdata.csv");
    let firstRow = _.first(json);
    // console.log('json', firstRow);
    expect(_.isObject(firstRow)).toBe(true);
    expect(_.isArray(firstRow)).toBe(false);
});

test('should have 21 records', async () => {
    const json = await ingest("testdata.csv");
    expect(json.length).toBe(21);
});

test('first row should have 3 keys', async () => {
    const json = await ingest("testdata.csv");
    let firstRow = _.first(json);
    let keys = _.keys(firstRow);
    expect(keys.length).toBe(3);
});

test('postid, user, and date should have correct types', async () => {
    const json = await ingest("testdata.csv");
    let firstRow = _.first(json);

    let postId = firstRow.postid;
    expect(_.isNumber(postId)).toBe(true);

    let user = firstRow.user;
    expect(_.isString(user)).toBe(true);

    let date = firstRow.date;
    expect(_.isString(date)).toBe(true);
});