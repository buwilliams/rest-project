# SocialMedia

## Project Description

Implement a JSON REST-style API that analyzes data from SocialMedia, a totally
legit social media platform.

## Instructions

* You've been added as a collaborator on our private project repository.
  Fulfill the requirements below. Let us know when you're done and open
  a PR for review. Good luck!

## Requirements

* Tools are up to you. Use whatever language/framework you’re most
  familiar with.

* SocialMedia is a little behind the times so its API serves data in CSV instead
  of JSON. The accompanying [socialmedia.csv](socialmedia.csv) file contains data
  about the "likes" that your posts have received.

* Ingest the CSV and expose four REST-style `GET` routes that return the following data:

    * Your most popular post(s)

    * Your biggest fan(s) (the person who has "liked" your posts the most times)

    * The day(s) of the week when you got the most "likes"

    * All streaks of days when more likes were received than the day before
      (ignore days with no likes). For example, if you received 3 likes on
      03/02, 4 likes on 03/05, 8 likes on 03/06, and 7 likes on 03/09,
      then there was a single streak from 03/02 to 03/06. Streaks should be at
      least 2 days long.

* The actual schema of the returned JSON doesn’t really matter as long
  as it represents the data in a clear manner to any client that might consume
  your API.

* There are no requirements around data persistence. Whether you use a real
  database, an in-memory database, an in-memory data structure, or have no
  persistence at all is up to you.

* Write some unit tests for your logic. Don’t bother with integration tests
  unless you really feel like it.

* Please leave comments in places where you weren’t quite sure if you
  were solving the problem correctly to let us know that you've thought about it
  and made a conscious decision.

* Please provide working instructions for how to run your application and
  make sure that the application will actually run on someone else’s machine.

* We will be reviewing your solution commit-by-commit so that we can
  understand your thought process. So instead of putting everything in a single
  giant commit, please make frequent cohesive commits so we
  can see what your work progression looks like.