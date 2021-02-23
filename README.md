# SocialMedia

JSON REST-style API that analyzes data from SocialMedia, a totally
legit social media platform. You may view [original project instructions here.](INSTRUCTIONS.md) Additionally, to view the [developer notes go here.](DESIGN.md)

## Screenshot

![Screenshot](screenshot.png)

## Features and Developer Notes

- Proper HTTP response codes (200, 400, 404, 500)
- Request rate limiting to reduce abuse
- Use express-validator to validate query/body request parameters
- Map -> Reduce style in-memory data manager for performance
- In-memory store is initialized at server start so that the data summarization overhead is not incurred on each request with the notable exception of timezone calculation
- Project organized so that the codebase may grow as needed
- Unit tests for ingesting and summarizing CSV data, decoupled app CSV from test CSV for experiments
- Built with flexibility in mind so that the codebase may grow as needed
- Dates are stored in-memory as UTC strings and converted to DateTime objects via the `luxon` module
- Where summaries of dates are needed timezone support is added via `timezone` request parameter. If the parameter is left unspecified then it will default to `'America/New_York'`
- For summaries with dates, only the default timezone summary is cached. If another timezone is supplied, the summary data will be calculated on that request thread. This could be further optimized.
- All requests are sorted so that the greatest result is first. For example, the [most popular request](http://localhost:3000/users/1/likes?summary=popular) has the most liked post first in the resulting array
- [Simple UI](http://localhost:3001/) to work with backend. It uses [JAMStack architecture](https://jamstack.org/).

## Getting Started

- `npm install`
- `npm run test` run Jest unit tests and integration tests
- `npm run dev:server` start express server on [http://localhost:3000](http://localhost:3000)
- `npm run dev:ui` start nuxt server on [http://localhost:3001](http://localhost:3001)

## Available HTTP Requests

**Likes**
- GET [/users/1/likes](http://localhost:3000/users/1/likes) All likes
- GET [/users/1/likes?limit=3](http://localhost:3000/users/1/likes?limit=3) limit likes to three
- POST [/users/1/likes](http://localhost:3000/users/1/likes) create a new like
- PATCH [/users/1/likes](http://localhost:3000/users/1/likes) update like(s)

**Most popular posts**
- GET [/users/1/likes?summary=popular](http://localhost:3000/users/1/likes?summary=popular) top popular posts
- GET [/users/1/likes?summary=popular&limit=3](http://localhost:3000/users/1/likes?summary=popular&limit=3) top three popular posts

**Biggest Fans**

- GET [/users/1/likes?summary=fans](http://localhost:3000/users/1/likes?summary=fans) all fans
- GET [/users/1/likes?summary=fans&limit=3](http://localhost:3000/users/1/likes?summary=fans&limit=3) top three fans

**Most popular days for posts**
- GET [/users/1/likes?summary=popularDays](http://localhost:3000/users/1/likes?summary=popularDays) shows total likes by day of the week by timezone, default timezone is `America/New_York`
- GET [/users/1/likes?summary=popularDays&timezone=America/Los_Angeles](http://localhost:3000/users/1/likes?summary=popularDays&timezone=America/Los_Angeles) shows total likes by day of the week with timezone provided by request

**Streaks**
- GET [/users/1/likes?summary=streaks](http://localhost:3000/users/1/likes?summary=streaks) shows all streaks by default New_York timezone
- GET [/users/1/likes?summary=streaks&timezone=America/Los_Angeles](http://localhost:3000/users/1/likes?summary=streaks&timezone=America/Los_Angeles) shows all streaks adjusted for timezone

**HTTP Responses**
- GET [200](http://localhost:3000/)
- GET [404](http://localhost:3000/someplace)
- GET [400, Malformed Query Parameters](http://localhost:3000/users/1/likes?summary=foo)
- GET [500](http://localhost:3000/error)

## Learn More

- [Project Instructions](INSTRUCTIONS.md) original project instructions
- [Design](DESIGN.md) notes on overall design and tasks to stay organized