# Epic Collection
[![Build Status](https://travis-ci.org/andreasf/epic-collection.svg?branch=master)](https://travis-ci.org/andreasf/epic-collection)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://github.com/andreasf/epic-collection/blob/master/LICENSE)

*Epic Collection helps you reclaim space in your Spotify library when you have
reached the limit of 10000 tracks. It interactively moves albums to playlists,
keeping all your music around.*

I made this app to work around Spotify's library limit, and as an example React application
with a traditional layered architecture, removing the complexity that state-management libraries bring.


## Repository layout

You'll find the frontend application itself in the `frontend` directory. At the
top level, there is a Gradle project used for browser-based acceptance tests.


## Building & Testing

All tests can be run with:

```
CI=1 MOZ_HEADLESS=1 ./gradlew clean npm_install npm_test test
```

Most tests are in `frontend` where they can be run with `CI=1 npm test`.


## Deploying

The app can be deployed to CloudFoundry (Staticfile buildpack) by manually running `deploy.sh`.
The script expects `cf-cli` to be present, logged in and targeting the right space.

Deploying anywhere else should be pretty straight-forward:
* `npm run build`
* `index.html` should be served as a fallback for all paths
* `service-worker.js` should never be cached
