const https = require('https');
const path = require('path');

exports.handler = async (event) => {
  const p = event.rawPath || event.path || '/metrics';
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS'
  };

  if (p.includes('/nfl-scores') || p.includes('/scores')) {
    return new Promise((resolve) => {
      const req = https.request({
        hostname: 'api.mysportsfeeds.com',
        port: 443,
        path: '/v2.1/pull/nfl/scoreboard.json?fordate=' + new Date().toISOString().split('T')[0],
        method: 'GET',
        headers: {
          'Authorization': 'Basic ' + Buffer.from('0bd7ce11-4a9b-4b8c-98f0-198816:').toString('base64')
        }
      }, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            const json = JSON.parse(data);
            const game = json.scoreboard?.games?.[0] || {};
            resolve({
              statusCode: 200,
              headers,
              body: JSON.stringify({
                nfl: {
                  away: (game.awayTeam?.abbreviation || 'Away') + ': ' + (game.awayScore || 0),
                  home: (game.homeTeam?.abbreviation || 'Home') + ': ' + (game.homeScore || 0),
                  status: game.gameStatus || 'No Game',
                  clock: game.quarterSummary?.currentClock || ''
                }
              })
            });
          } catch(e) {
            resolve({ statusCode: 200, headers, body: JSON.stringify({ nfl: { away: 'N/A', home: 'N/A', status: 'Loading...' } }) });
          }
        });
      });
      req.on('error', () => resolve({ statusCode: 500, headers, body: JSON.stringify({ error: 'API fetch failed' }) }));
      req.end();
    });
  }

  // Your existing /metrics & /chaos code here...
  if (p.includes('/metrics')) {
    return { statusCode: 200, headers, body: JSON.stringify({ requestsPerSec: 1247, errorRate: 0.002, latencyP95: 187 }) };
  }

  return { statusCode: 404, headers, body: JSON.stringify({ error: 'Route not found' }) };
};

if (event.rawPath === '/prod/nfl-scores' || event.rawPath === '/nfl-scores') {
  try {
    const key = process.env.SPORTSDATA_KEY || '669e5a8a43b3423692bd42be989af571';
    const res = await fetch(`https://nfl.sportsdata.io/v3/nfl/scores/json/Scores/2026POST?key=${key}`);
    const data = await res.json();
    const game = data.find(g => g.Status === 'InProgress') || data[0] || {};
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        home: `${game.HomeTeam || 'N/A'}: ${game.HomeScore || 0}`,
        away: `${game.AwayTeam || 'N/A'}: ${game.AwayScore || 0}`,
        status: game.Status || 'No games'
      })
    };
  } catch (e) {
    return {statusCode: 500, body: JSON.stringify({error: e.message})};
  }
}

const fetch = require('node-fetch');

exports.handler = async (event) => {
  if (event.rawPath === '/prod/nfl-scores' || event.rawPath === '/nfl-scores') {
    try {
      const key = process.env.SPORTSDATA_KEY || '669e5a8a43b3423692bd42be989af571';
      const res = await fetch(`https://nfl.sportsdata.io/v3/nfl/scores/json/Scores/2026POST?key=${key}`);
      const data = await res.json();
      const game = data.find(g => g.Status === 'InProgress') || data[0] || {};
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({
          home: `${game.HomeTeam || 'N/A'}: ${game.HomeScore || 0}`,
          away: `${game.AwayTeam || 'N/A'}: ${game.AwayScore || 0}`,
          status: game.Status || 'No games'
        })
      };
    } catch (e) {
      return { statusCode: 500, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }, body: JSON.stringify({error: e.message}) };
    }
  }
  // Your existing routes...
  return { statusCode: 404, body: JSON.stringify({error: 'Route not found'}) };
};
