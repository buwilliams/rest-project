const _ = require("lodash");
const ingest = require("../ingest.js");
const streaks = require("./streaks.js");

test('invalid timezone should throw an error', () => {
    const json = [{date:'2015-01-01T01:00:00.000Z'}];
    expect(() => { streaks(json, 'bogus'); }).toThrow();
});

test('two dates should return one streak', async () => {
    const json = [
        {date:'2015-01-01T01:00:00.000Z'},
        {date:'2015-01-02T01:00:00.000Z'},
        {date:'2015-01-02T01:00:00.000Z'}
    ];
    const result = await streaks(json);
    expect(result.length).toBe(1);
    expect(result[0].likes).toBe(3);
});

test('two dates that should not return streaks', async () => {
    const json = [
        {date:'2015-01-01T01:00:00.000Z'},
        {date:'2015-01-01T01:00:00.000Z'},
        {date:'2015-01-02T01:00:00.000Z'},
    ];
    const result = await streaks(json);
    expect(result.length).toBe(0);
});

test('should return streak when ending on streak', async () => {
    const json = [
        {date:'2015-01-01T01:00:00.000Z'},
        {date:'2015-01-02T01:00:00.000Z'},
        {date:'2015-01-02T01:00:00.000Z'},
        {date:'2015-01-02T01:00:00.000Z'},
        {date:'2015-01-02T01:00:00.000Z'},
        {date:'2015-01-02T01:00:00.000Z'},
        {date:'2015-01-02T01:00:00.000Z'},
        {date:'2015-01-03T01:00:00.000Z'},
        {date:'2015-01-03T01:00:00.000Z'},
        {date:'2015-01-03T01:00:00.000Z'},
    ];
    const result = await streaks(json);
    expect(result.length).toBe(1);
});

test('testdata should return two streaks', async () => {
    const json = await ingest("testdata.csv");
    const result = await streaks(json);
    expect(result.length).toBe(2);
    expect(result[0].likes).toBe(6);
    expect(result[1].likes).toBe(3);
});

test('testdata should return one streak in utc timezone', async () => {
    const json = [
        {date:'2015-01-01T01:00:00.000Z'},
        {date:'2015-01-02T01:00:00.000Z'},
        {date:'2015-01-02T01:00:00.000Z'},
        {date:'2015-01-02T01:00:00.000Z'},
        {date:'2015-01-02T01:00:00.000Z'},
        {date:'2015-01-03T01:00:00.000Z'},
        {date:'2015-01-03T01:00:00.000Z'},
    ];
    const result = await streaks(json, "utc");
    // console.log(result)
    expect(result.length).toBe(1);
    expect(result[0].likes).toBe(5);
});

test('testdata should return two streaks in utc timezone', async () => {
    const json = [
        {date:'2015-01-01T01:00:00.000Z'},
        {date:'2015-01-02T01:00:00.000Z'},
        {date:'2015-01-02T01:00:00.000Z'},
        {date:'2015-01-02T01:00:00.000Z'},
        {date:'2015-01-02T01:00:00.000Z'},
        {date:'2015-01-03T01:00:00.000Z'},
        {date:'2015-01-03T01:00:00.000Z'},
        {date:'2015-01-04T01:00:00.000Z'},
        {date:'2015-01-04T01:00:00.000Z'},
        {date:'2015-01-04T01:00:00.000Z'},
        {date:'2015-01-05T01:00:00.000Z'},
        {date:'2015-01-05T01:00:00.000Z'},
        {date:'2015-01-05T01:00:00.000Z'},
        {date:'2015-01-05T01:00:00.000Z'},
    ];
    const result = await streaks(json, "utc");
    expect(result.length).toBe(2);
    expect(result[0].likes).toBe(9);
    expect(result[1].likes).toBe(5);
});