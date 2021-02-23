const _ = require('lodash');
const ingest = require('../ingest.js');
const summaryFans = require('./fans.js');

test('fans should return an array of objects', async () => {
    const json = await ingest('testdata.csv');
    const fans = await summaryFans(json);
    const first = _.first(fans);
    // console.log(fans);
    expect(_.isArray(fans)).toBe(true);
    expect(_.isObject(first)).toBe(true);
    expect(_.isArray(first)).toBe(false);
});

test('all fans should return four results', async () => {
    const json = await ingest('testdata.csv');
    const fans = await summaryFans(json);
    expect(fans.length).toBe(4);
});

test('likes should be a number', async () => {
    const json = await ingest('testdata.csv');
    const fans = await summaryFans(json);
    const first = _.first(fans);
    expect(_.isNumber(first.likes)).toBe(true);
});

test('biggest fans should be cthulhu', async () => {
    const json = await ingest('testdata.csv');
    const fans = await summaryFans(json);
    const first = _.first(fans);
    expect(first.user).toBe('cthulhu');
    expect(first.likes).toBe(6);
});

test('least fans should be dukat', async () => {
    const json = await ingest('testdata.csv');
    const fans = await summaryFans(json);
    const last = _.last(fans);
    expect(last.user).toBe('dukat');
    expect(last.likes).toBe(5);
});