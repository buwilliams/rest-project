# Design

## Overall approach

- Use `map -> reduce` to create summaries of data for speed and flexibility.
- Use `summary` query parameter to distingish between data summaries
- Use maps where possible to avoid loops
- Endpoint: `/users/1/likes` (assume a user id, accept any id)
- Use Nuxt.js as the frontend

## Endpoints and Parameters

**Parameters**
- `summary`(String) possible values: popular, fans, popularDays, and streaks
- `limit`(Number) reduces the number of results returned on some requests
- `timezone`(String) supplies desires timezone summary data for some requests

**Requests**
- GET `/users/1/likes` return all likes
- POST `/users/1/likes` create new like
- PATCH `/users/1/likes` update like(s)
- GET `/users/1/likes?limit=1` return limited likes
- GET `/users/1/likes?summary=popular`
- GET `/users/1/likes?summary=popular&limit=1`
- GET `/users/1/likes?summary=fans`
- GET `/users/1/likes?summary=fans&limit=1`
- GET `/users/1/likes?summary=popularDays`
- GET `/users/1/likes?summary=popularDays&timezone=America/Los_Angeles`
- GET `/users/1/likes?summary=streaks`
- GET `/users/1/likes?summary=streaks&timezone=America/Los_Angeles`

## Data Structures

**Ingested CSV Data Structure**
```javascript
[
    { 
        postid: 1,
        user: 'alice',
        date: '2015-01-01T01:00:00.000Z'
    },
    // ...
]
```

**Most popular posts**
```javascript
[
    {
        postid: 1,
        likes: 3
    },
    // ...
],
```

**Biggest Fans**
```javascript
[
    {
        user: 'alice':
        likes: 3,
    }
    // ...
]
```

**Popular posts by days of the week**
```javascript
{
    'monday': 3,
    // ...
}
```

**Streaks**
```javascript
[
    {
        from: new Date(),
        to: new Date(),
        likes: 12
    },
    {
        //...
    }
]
```

# Todo

## Backlog

- Limit streaks by `to` and `from` dates for large datasets
- Choose sorting order at request level via `sort` query parameter

## Todo List


## Done

- Write TODO list (to be organized and think out various concerns)
- Setup `package.json` with scripts for starting server and running tests
- Install dependencies: `express.js`, `express-rate-limit` (since it's a REST API), `csv` (parser), `jest` (for unit testing)
- Organize project (/src/server/* dir, move socialmedia.csv to /src/server/data/*)
- Setup express server with a basic route and rate limiting
- Handle 500 and 404 http errors
- Write first test (ensure test framework is running correctly)
- code/tests for ingesting CSV into an in-memory data structure (for speed)
- Add store to app.locals when express server starts
- Add route to return all likes
- Add `testdata.csv` and use that in tests for flexibility
- `summary=popular&limit=1` code/route/tests for summary of: Your most popular post(s) `requires limit parameter, default to 1`
- Handle 400 http errors from bad/malformed query parameters
- Moved likes route into a separate file `likes_route.js` to make it easier to read the code
- `summary=fans&limit=1` code/route/tests for summary of: Your biggest fan(s) (the person who has "liked" your posts the most times) `requires limit parameter, default to 1`
- `summary=popularDays` code/route/tests for summary of: The day(s) of the week when you got the most "likes"
- `summary=streaks` code/route/tests for summary of: All streaks of days when more likes were received than the day before (ignore days with no likes) `requres from and to`
- Write Getting Started instrucions to README (include other markdown files)
- Additional tests are needed for streaks to ensure precision
- Think over possible gaps and refine
- Delete repo and fresh clone to ensure works on first try
- Add nuxt.js to project to demonstrate UI skills
- Create initial layout of page
- Create menu for page for each request
- Create output window to show JSON response
- Create an editor for modifying the likes resource
- Added express-validator to help validate/sanitize user input
- Added Supertest for integration tests
- Use express-validator to validation query parameters for likes resource
- Write unit tests for query parameter validation
- Validate input from html form
- Submit form to backend via HTTP appropreiate methods (POST, PUT)
- Endpoint: POST http method for like resource, validate parameters
- Endpoint: PUT http method for like resource, validate parameters
- Reload in-memory store on updates
- Reload Vue memory on updates