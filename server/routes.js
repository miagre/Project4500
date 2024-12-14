const { Pool, types } = require("pg");
const config = require("./config.json");

// Override the default parsing for BIGINT (PostgreSQL type ID 20)
types.setTypeParser(20, (val) => parseInt(val, 10)); //DO NOT DELETE THIS

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

// Gets a map of all states and the total popular vote each candidate received in each state
const popular_vote_map = async function (req, res) {
  connection.query(
    `
    SELECT 
      S.state_name, 
      C.candidate_name, 
      C.candidate_party,
      E.popular_vote
    FROM 
      ELECTION_STATE_RESULTS E
      JOIN STATES S ON E.state_id = S.state_id
      JOIN CANDIDATES C ON E.candidate_id = C.candidate_id
    ORDER BY S.state_name, E.popular_vote DESC
  `,
    (err, data) => {
      if (err) {
        console.log(err);
        res.json([]);
      } else {
        res.json(data.rows);
      }
    }
  );
};

// Gets the number of electoral votes for each state
const electoral_votes_map = async function (req, res) {
  connection.query(
    `
    SELECT state_abbreviation, electoral_votes FROM STATES
  `,
    (err, data) => {
      if (err) {
        console.log(err);
        res.json([]);
      } else {
        res.json(data.rows);
      }
    }
  );
};

// Gets the total popular vote for each candidate in a specific state
const popular_vote_by_state = async function (req, res) {
  connection.query(
    `
    SELECT 
      C.candidate_name, 
      C.candidate_party,
      E.popular_vote
    FROM 
      ELECTION_STATE_RESULTS E
      JOIN CANDIDATES C ON E.candidate_id = C.candidate_id
      JOIN STATES S ON E.state_id = S.state_id
    WHERE S.state_name = '${req.params.state_name}'
    ORDER BY E.popular_vote DESC
  `,
    (err, data) => {
      if (err) {
        console.log(err);
        res.json([]);
      } else {
        res.json(data.rows);
      }
    }
  );
};

// Gets the top 5 states by total contributions received
const top_state_contributions = async function (req, res) {
  connection.query(
    `
    SELECT state_name, total_contributions FROM (
      SELECT 
        S.state_name, 
        SUM(C.amount) AS total_contributions,
        RANK() OVER (ORDER BY SUM(C.amount) DESC) AS rank
      FROM 
        CONTRIBUTIONS C
        JOIN CONTRIBUTORS CO ON C.contributor_id = CO.contributor_id
        JOIN STATES S ON CO.state_id = S.state_id
      GROUP BY S.state_name
    ) ranked_contributions 
    WHERE rank <= 5;
  `,
    (err, data) => {
      if (err) {
        console.log(err);
        res.json([]);
      } else {
        res.json(data.rows);
      }
    }
  );
};

// Gets the party contributions for each state
const state_contributions_map = async function (req, res) {
  connection.query(
    `
    SELECT 
      S.state_name, 
      CA.candidate_party, 
      SUM(C.amount) AS total_contributions
    FROM 
      CONTRIBUTIONS C
      JOIN CANDIDATES CA ON C.candidate_id = CA.candidate_id
      JOIN CONTRIBUTORS CO ON C.contributor_id = CO.contributor_id
      JOIN STATES S ON CO.state_id = S.state_id
    GROUP BY S.state_name, CA.candidate_party
    ORDER BY S.state_name, total_contributions DESC
  `,
    (err, data) => {
      if (err) {
        console.log(err);
        res.json([]);
      } else {
        res.json(data.rows);
      }
    }
  );
};

// Gets the contribution sum for a specific state
const contributions_by_state = async function (req, res) {
  connection.query(
    `
    SELECT 
      S.state_name, 
      SUM(C.amount) AS total_contributions
    FROM 
      CONTRIBUTIONS C
      JOIN CONTRIBUTORS CO ON C.contributor_id = CO.contributor_id
      JOIN STATES S ON CO.state_id = S.state_id
    WHERE S.state_name = '${req.params.state_name}'
    GROUP BY S.state_name
  `,
    (err, data) => {
      if (err) {
        console.log(err);
        res.json([]);
      } else {
        res.json(data.rows);
      }
    }
  );
};

// Gets the top 5 contributors in a state by total contribution amount
const contributors_by_state = async function (req, res) {
  connection.query(
    `
    SELECT 
      CO.first_name, 
      CO.last_name, 
      SUM(C.amount) AS total_contributions
    FROM 
      CONTRIBUTIONS C
      JOIN CONTRIBUTORS CO ON C.contributor_id = CO.contributor_id
      JOIN STATES S ON CO.state_id = S.state_id
    WHERE S.state_name = '${req.params.state_name}'
      AND EXISTS (
        SELECT 1 FROM STATES WHERE state_name = '${req.params.state_name}'
      )
    GROUP BY CO.first_name, CO.last_name
    ORDER BY total_contributions DESC
    LIMIT 5
  `,
    (err, data) => {
      if (err) {
        console.log(err);
        res.json([]);
      } else {
        res.json(data.rows);
      }
    }
  );
};

// Gets the top 5 employers by total contribution amount
const employer_contributions = async function (req, res) {
  connection.query(
    `
    SELECT 
      CO.employer, 
      SUM(C.amount) AS total_contributions
    FROM 
      CONTRIBUTIONS C
      JOIN CONTRIBUTORS CO ON C.contributor_id = CO.contributor_id
    GROUP BY CO.employer
    ORDER BY total_contributions DESC
    LIMIT 5
  `,
    (err, data) => {
      if (err) {
        console.log(err);
        res.json([]);
      } else {
        res.json(data.rows);
      }
    }
  );
};

// Gets the top 5 occupations by total contribution amount
const occupation_contributions = async function (req, res) {
  connection.query(
    `
    SELECT 
      CO.occupation, 
      SUM(C.amount) AS total_contributions
    FROM 
      CONTRIBUTIONS C
      JOIN CONTRIBUTORS CO ON C.contributor_id = CO.contributor_id
    GROUP BY CO.occupation
    ORDER BY total_contributions DESC
    LIMIT 5
  `,
    (err, data) => {
      if (err) {
        console.log(err);
        res.json([]);
      } else {
        res.json(data.rows);
      }
    }
  );
};

module.exports = {
  popular_vote_map,
  popular_vote_by_state,
  top_state_contributions,
  state_contributions_map,
  contributions_by_state,
  contributors_by_state,
  employer_contributions,
  occupation_contributions,
};
