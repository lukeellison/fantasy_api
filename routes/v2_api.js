const express = require("express");
const router = express.Router();

const ROOT = "https://api2.fantasy.nfl.com/v2";
const APP_KEY = process.env.APP_KEY_V2;
const AUTH_TOKEN = process.env.AUTH_TOKEN;
const LEAGUE_ID = process.env.LEAGUE_ID;

router.get("/leagues", async (req, res) => {
  // Route to get my fantasy leagues
  const response = await fetch(`${ROOT}/user/leagues?appKey=${APP_KEY}`, {
    headers: {
      Authorization: `Bearer ${AUTH_TOKEN}`,
    },
  });
  const data = await response.json();
  res.json(data);
});

router.get("/players", async (req, res) => {
  // Route to get all players
  const response = await fetch(
    `${ROOT}/league/players?appKey=${APP_KEY}&count=5000`,
    {
      headers: {
        Authorization: `Bearer ${AUTH_TOKEN}`,
      },
    }
  );
  const data = await response.json();
  res.json(data);
});

router.get("/players/v3_to_v2", async (req, res) => {
  // Route to get all players v3 ids to v2 ids
  const response = await fetch(
    `${ROOT}/league/players?appKey=${APP_KEY}&count=5000`,
    {
      headers: {
        Authorization: `Bearer ${AUTH_TOKEN}`,
      },
    }
  );
  const data = await response.json();
  const firstGameId = Object.keys(data.games)[0];
  const v3_to_v2 = Object.values(data.games[firstGameId].players).reduce(
    (acc, player) => {
      acc[player.nflGlobalEntityId] = player.playerId;
      return acc;
    },
    {}
  );
  res.json(v3_to_v2);
});

router.get("/players/timed", async (req, res) => {
  // Route to get players stats split into time chunks
  const response = await fetch(
    `${ROOT}/players/weektimestats?appKey=${APP_KEY}&timezone=UTC&week=11`
  );
  const data = await response.json();
  const firstGameId = Object.keys(data.games)[0];
  const chunks = data.games[firstGameId].playerTimeStats;
  res.json(chunks);
});

router.get("/players/:playerId", async (req, res) => {
  // Route to get a single player details
  const playerId = req.params.playerId;
  const response = await fetch(
    `${ROOT}/player/details?appKey=${APP_KEY}&playerId=${playerId}&leagueId=${LEAGUE_ID}`
  );
  const data = await response.json();
  res.json(data);
});

module.exports = router;
