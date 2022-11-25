const express = require("express");
const router = express.Router();

const ROOT = "https://stage.api.fantasy.nfl.com/v3/";
const ROOT_2 = "https://staging-api2.fantasy.nfl.com/v3";
const ROOT_LIVE = "https://api.fantasy.nfl.com/v3";
const APP_KEY = process.env.APP_KEY_V3;
const TEAMS_DATA = require("../fixtures/teams.json");
const PLAYERS_V3_TO_V2 = require("../fixtures/players_v3_to_v2.json");

router.get("/teams_fixed", async (req, res) => {
  const response = await fetch(`${ROOT}nflgames?appKey=${APP_KEY}`);
  const data = await response.json();
  const teams = data.included.reduce((acc, item) => {
    acc[item.id] = {
      id: item.id,
      name: item.attributes.fullName,
      abbr: item.attributes.abbr,
    };
    return acc;
  }, {});
  res.json(teams);
});

router.get("/games", async (req, res) => {
  let url = `${ROOT}nflgames?appKey=${APP_KEY}`;
  if (req.query.week) {
    url += `&filter[week]=${req.query.week}`;
  }
  const response = await fetch(url);
  const data = await response.json();
  const games = data.data.reduce((acc, item) => {
    acc[item.id] = {
      id: item.id,
      status: item.attributes.gameStatus,
      homeTeam: TEAMS_DATA[item.relationships.homeTeam.data.id],
      awayTeam: TEAMS_DATA[item.relationships.awayTeam.data.id],
    };
    return acc;
  }, {});
  res.json(games);
});

router.get("/game/:gameId", async (req, res) => {
  const gameId = req.params.gameId;
  let url = `${ROOT}nflgames?appKey=${APP_KEY}`;
  if (req.query.week) {
    url += `&filter[week]=${req.query.week}`;
  }
  const response = await fetch(url);
  const data = await response.json();
  const game = data.data.find((item) => item.id === gameId);
  if (!game) {
    res.json({ error: "Game not found" });
  }
  res.json({
    id: game.id,
    status: game.attributes.gameStatus,
    homeTeam: TEAMS_DATA[game.relationships.homeTeam.data.id],
    awayTeam: TEAMS_DATA[game.relationships.awayTeam.data.id],
    gameDatetime: game.attributes.gameDateAndTime,
    onTheFieldPlayers: game.relationships.onTheFieldPlayers.data.map(
      (player) => player.id
    ),
  });
});

router.get("/players", async (req, res) => {
  const response = await fetch(`${ROOT_LIVE}/players?appKey=${APP_KEY}`);
  const data = await response.json().data;
  res.json(data);
});

router.get("/players/filtered", async (req, res) => {
  // Route to get a filtered list of players
  // FILTERS:
  const teams = req.query.teams.split(",");
  let positions = ["QB", "RB", "WR", "TE", "K", "DEF"];
  if (req.query.positions) {
    positions = req.query.positions.split(",");
  }

  // FETCH PLAYERS
  const response = await fetch(`${ROOT_LIVE}/players?appKey=${APP_KEY}`);
  const data = await response.json();
  const players = data.data.reduce((acc, player) => {
    if (
      teams.includes(player.relationships.nflTeam.data?.id) &&
      positions.includes(player.attributes.position)
    ) {
      acc[player.id] = {
        id: player.id,
        name: player.attributes.name,
        firstName: player.attributes.firstName,
        lastName: player.attributes.lastName,
        imageUrl: player.attributes.imageUrl,
        jerseyNumber: player.attributes.jerseyNumber,
        position: player.attributes.position,
        team: TEAMS_DATA[player.relationships.nflTeam.data.id],
        v2id: PLAYERS_V3_TO_V2[player.id],
      };
    }
    return acc;
  }, {});
  res.json(players);
});

router.get("/plays/:gameId", async (req, res) => {
  const gameId = req.params.gameId;
  const response = await fetch(
    `${ROOT}nflgames/${gameId}/plays?appKey=${APP_KEY}`
  );
  const data = await response.json();
  const plays = data.data.map((item) => item.attributes);
  res.json(plays);
});

// router.get('/player/stats', async (req, res) => {
//     const playerId = req.query.playerId;
//     const response = await fetch(`${ROOT_2}players/${playerId}/stats?appKey=${APP_KEY}`)
//     const data = await response.json()
//     res.json(data);
// });

module.exports = router;
