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

// add the routes
app.get('/popular_vote_map', routes.popular_vote_map);
app.get('/popular_vote_by_state/:state_name', routes.popular_vote_by_state);
app.get('/top_state_contributions', routes.top_state_contributions);
app.get('/state_contributions_map', routes.state_contributions_map);
app.get('/contributions_by_state/:state', routes.contributions_by_state);
app.get('/contributors_by_state/:state', routes.contributors_by_state);
app.get('/employer_contributions', routes.employer_contributions);
app.get('/occupation_contributions', routes.occupation_contributions);
app.get('/all_employer_stats', routes.all_employer_stats);
app.get('/filtered_employer_stats', routes.filtered_employer_stats);
app.get('/all_occupation_stats', routes.all_occupation_stats);

app.listen(config.server_port, () => {
  console.log(`Server running at http://${config.server_host}:${config.server_port}/`)
});

module.exports = app;
