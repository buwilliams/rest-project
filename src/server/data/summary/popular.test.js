const _ = require('lodash');
const ingest = require('../ingest.js');
const summaryPopular = require('./popular.js');

test('popular should return an array of objects', async () => {
    const json = await ingest('testdata.csv');
    const popular = await summaryPopular(json);
    const first = _.first(popular);
    // console.log(popular);
    expect(_.isArray(popular)).toBe(true);
    expect(_.isObject(first)).toBe(true);
    expect(_.isArray(first)).toBe(false);
});

test('most popular most should return six results', async () => {
    const json = await ingest('testdata.csv');
    const popular = await summaryPopular(json);
    expect(popular.length).toBe(6);
});

test('popular should return multiple results', async () => {
    const json = await ingest('testdata.csv');
    const popular = await summaryPopular(json);
    expect(popular.length).toBe(6);
});

test('most popular should be four', async () => {
    const json = await ingest('testdata.csv');
    const popular = await summaryPopular(json);
    const first = _.first(popular);
    expect(first.likes).toBe(4);
});

test('least popular should be two', async () => {
    const json = await ingest('testdata.csv');
    const popular = await summaryPopular(json);
    const last = _.last(popular);
    expect(last.likes).toBe(2);
});

test('postid and likes should be a number', async () => {
    const json = await ingest('testdata.csv');
    const popular = await summaryPopular(json);
    const first = _.first(popular);
    expect(_.isNumber(first.postid)).toBe(true);
    expect(_.isNumber(first.likes)).toBe(true);
});