# Fantasy NFL API
## Description
A small proxy for the NFL's fantasy API found [here](https://apidocs.fantasy.nfl.com/).  
Written with Node and Express.

## Run
Node and npm are requirements. Then run `npm install` to install dependencies.
- Prod: `node app.js`
- Dev: `npx nodemon app.js`

## Env
Expected environment variables in `.env` file in root:
- APP_KEY_V3
- APP_KEY_V2
- AUTH_TOKEN
- LEAGUE_ID