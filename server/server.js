const express = require('express');
const cors = require('cors');
const config = require('./config');
const routes = require('./routes');

const app = express();
app.use(cors({
  origin: '*',
}));

app.set('case sensitive routing', true);

// We use express to define our various API endpoints and
// provide their handlers that we implemented in routes.js
app.get('/popular_vote_map/', routes.popular_vote_map);
app.get('/popular_vote_by_state/:state', routes.popular_vote_by_state);
app.get('/state_contributions_map/', routes.state_contributions_map);
app.get('/contributors_by_state', routes.contributors_by_state);
app.get('/employer_contributors', routes.employer_contributions);

app.listen(config.server_port, () => {
  console.log(`Server running at http://${config.server_host}:${config.server_port}/`)
});

module.exports = app;
