const ingest = require("../ingest.js");
const summaryPopularDays = require("./popular_days.js");

test('invalid timezone should throw an error', () => {
    const json = [{date:'2015-01-01T01:00:00.000Z'}];
    expect(() => { summaryPopularDays(json, 'bogus'); }).toThrow();
});

test('popular days should return the correct count for ISO timestamp by timezone', () => {
    const ny = summaryPopularDays([
        { date: '2021-02-05T05:00:00.000Z' }
    ]);
    expect(ny.monday).toBe(0);
    expect(ny.tuesday).toBe(0);
    expect(ny.wednesday).toBe(0);
    expect(ny.thursday).toBe(0);
    expect(ny.friday).toBe(1);
    expect(ny.saturday).toBe(0);
    expect(ny.sunday).toBe(0);

    const la = summaryPopularDays([
        { date: '2021-02-05T05:00:00.000Z' }
    ], "America/Los_Angeles");
    expect(la.monday).toBe(0);
    expect(la.tuesday).toBe(0);
    expect(la.wednesday).toBe(0);
    expect(la.thursday).toBe(1);
    expect(la.friday).toBe(0);
    expect(la.saturday).toBe(0);
    expect(la.sunday).toBe(0);
});

test('popular days should return the correct count for multiple days', () => {
    let ny = summaryPopularDays([
        { date: '2021-02-05T05:00:00.000Z' },
        { date: '2021-02-05T05:00:00.000Z' },
        { date: '2021-02-05T05:00:00.000Z' }
    ]);
    expect(ny.monday).toBe(0);
    expect(ny.tuesday).toBe(0);
    expect(ny.wednesday).toBe(0);
    expect(ny.thursday).toBe(0);
    expect(ny.friday).toBe(3);
    expect(ny.saturday).toBe(0);
    expect(ny.sunday).toBe(0);
});

test('popular days should return the correct count for testdata with NY timezone', async () => {
    const json = await ingest("testdata.csv");
    let ny = summaryPopularDays(json);
    expect(ny.monday).toBe(1);
    expect(ny.tuesday).toBe(3);
    expect(ny.wednesday).toBe(6);
    expect(ny.thursday).toBe(1);
    expect(ny.friday).toBe(7);
    expect(ny.saturday).toBe(2);
    expect(ny.sunday).toBe(1);
});

test('popular days should return the correct count for testdata with LA timezone', async () => {
    const json = await ingest("testdata.csv");
    let la = summaryPopularDays(json, "America/Los_Angeles");
    expect(la.monday).toBe(2);
    expect(la.tuesday).toBe(4);
    expect(la.wednesday).toBe(4);
    expect(la.thursday).toBe(4);
    expect(la.friday).toBe(4);
    expect(la.saturday).toBe(2);
    expect(la.sunday).toBe(1);
});