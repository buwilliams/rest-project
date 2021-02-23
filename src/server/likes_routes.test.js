const express = require('express');
const bodyParser = require('body-parser');
const request = require('supertest');
const _ = require('lodash');
const ingest = require('./data/ingest.js');
const popular = require('./data/summary/popular.js');
const fans = require('./data/summary/fans.js');
const popularDays = require('./data/summary/popular_days.js');
const streaks = require('./data/summary/streaks.js');
const likesRoutes = require('./likes_routes.js');
const app = express();

app.use(bodyParser.json());
likesRoutes(app);

beforeAll(async () => {
    const store = await ingest('testdata.csv');
    app.locals.store = store;
    app.locals.popular = popular(store);
    app.locals.fans = fans(store);
    app.locals.popularDays = popularDays(store);
    app.locals.streaks = streaks(store);
});

test('should return all likes', async () => {
    const { body } = await request(app).get('/users/1/likes');
    expect(body).toEqual(expect.any(Array));
    expect(body.length).toEqual(21);
});

test('should return validation error on bad summary param', async () => {
    const resp = await request(app).get('/users/1/likes?summary=foo');
    expect(resp.status).toEqual(400);
    expect(resp.body.errors[0].param).toEqual('summary');
});

test('should not return validation error', async () => {
    const resp = await request(app).get('/users/1/likes?summary=all');
    expect(resp.status).toEqual(200);
});

test('should return validation error on bad limit param', async () => {
    const resp = await request(app).get('/users/1/likes?limit=hello');
    expect(resp.status).toEqual(400);
    expect(resp.body.errors[0].param).toEqual('limit');
});

test('should return ok on good limit param', async () => {
    const resp = await request(app).get('/users/1/likes?limit=10');
    expect(resp.status).toEqual(200);
});

test('should return validation error on bad timezone', async () => {
    const resp = await request(app).get('/users/1/likes?timezone=10');
    expect(resp.status).toEqual(400);
    expect(resp.body.errors[0].param).toEqual('timezone');
});

test('should return ok on good timezone parameter', async () => {
    const resp = await request(app).get('/users/1/likes?timezone=America/New_York');
    expect(resp.status).toEqual(200);
});

test('should add a new like resource', async () => {
    let newLike = { postid: 1, user: 'buddy', date: new Date().toISOString() };
    const resp = await request(app).post('/users/1/likes').send(newLike);
    expect(resp.status).toEqual(200);
    let last = _.last(app.locals.store);
    expect(last).toEqual(newLike);
});

test('should return validation error when adding invalid like resource', async () => {
    let newLike = { postid: 'foo', user: '', date: 'foo' };
    const resp = await request(app).post('/users/1/likes').send(newLike);
    expect(resp.status).toEqual(400);
    expect(resp.body.errors.length).toEqual(3);
});