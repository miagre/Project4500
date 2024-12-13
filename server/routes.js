const { Pool, types } = require('pg');
const config = require('./config.json')

// Override the default parsing for BIGINT (PostgreSQL type ID 20)
types.setTypeParser(20, val => parseInt(val, 10)); //DO NOT DELETE THIS

// Create PostgreSQL connection using database credentials provided in config.json
// Do not edit. If the connection fails, make sure to check that config.json is filled out correctly
const connection = new Pool({
  host: config.rds_host,
  user: config.rds_user,
  password: config.rds_password,
  port: config.rds_port,
  database: config.rds_db,
  ssl: {
    rejectUnauthorized: false,
  },
});
connection.connect((err) => err && console.log(err));

/******************
 * WARM UP ROUTES *
 ******************/

const popular_vote_map = async function(req, res) {
  connection.query(`
    SELECT 
        s.state_name, 
        s.state_abbreviation, 
        es.popular_vote_dem, 
        es.popular_vote_rep,
        es.winner
    FROM election_state_results es 
    JOIN states s ON es.state_id = s.state_id 
    WHERE es.year = 2020
  `, (err, data) => {
    if (err) {
      console.log(err);
      res.json({});
    } else {
      res.json(data.rows);
    }
  });
}

const popular_vote_by_state = async function(req, res) {
  const { state } = req.params;
  connection.query(`
    SELECT 
        s.state_name,
        es.popular_vote_dem, 
        es.popular_vote_rep,
        es.winner
    FROM election_state_results es 
    JOIN states s ON es.state_id = s.state_id 
    WHERE s.state_name = '${state}'
  `, (err, data) => {
    if (err) {
      console.log(err);
      res.json({});
    } else {
      res.json(data.rows[0]);
    }
  });
}

// Gets the top 5 states by contribution sum total
const top_state_contributions = async function(req, res) {
  res.json({})
}

// Gets the party contributions for each state
const state_contributions_map = async function(req, res) {
  res.json({});
}

// Gets the contribution sum for one state
const contributions_by_state = async function(req, res) {
  res.json({});
}

// Gets the cities with the highest contributions
const top_cities = async function(req, res) {
  res.json({});
}

// Gets the top 5 contributors in a state
const contributors_by_state = async function(req, res) {
  res.json({});
}

// Gets the top 5 employers by sum contributions
const employer_contributions = async function(req, res) {
  res.json({});
}

// Gets the top 5 occupations by sum contributions
const occupation_contributions = async function(req, res) {
  res.json({});
}

module.exports = {
  popular_vote_map,
  popular_vote_by_state,
  top_state_contributions,
  state_contributions_map,
  contributions_by_state,
  top_cities,
  contributors_by_state,
  employer_contributions,
  occupation_contributions
}
