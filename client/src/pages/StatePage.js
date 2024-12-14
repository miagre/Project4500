import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";

export default function StatePage() {
  const { stateName } = useParams();
  const [stateData, setStateData] = useState({
    popularVotes: [],
    contributions: [],
    topContributors: []
  });

  useEffect(() => {
    // Fetch the popular vote for each candidate in this state
    fetch(`http://localhost:8080/popular_vote_by_state/${stateName}`)
      .then(response => response.json())
      .then(data => {
        setStateData(prevData => ({ ...prevData, popularVotes: data }));
      });

    // Fetch the contributions for each candidate in this state
    fetch(`http://localhost:8080/contributions_by_state/${stateName}`)
      .then(response => response.json())
      .then(data => {
        console.log(data);
        setStateData(prevData => ({ ...prevData, contributions: data }));
      });

    // Fetch the top 5 contributors for this state
    fetch(`http://localhost:8080/contributors_by_state/${stateName}`)
      .then(response => response.json())
      .then(data => {
        setStateData(prevData => ({ ...prevData, topContributors: data }));
      });
  }, [stateName]);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h3" gutterBottom>{stateName}</Typography>
      
      <Typography variant="h5" gutterBottom>Popular Vote</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Candidate</TableCell>
              <TableCell align="right">Popular Vote</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {stateData.popularVotes.map(({ candidate_name, popular_vote }) => (
              <TableRow key={candidate_name}>
                <TableCell>{candidate_name}</TableCell>
                <TableCell align="right">{popular_vote.toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      
      <Typography variant="h5" gutterBottom>Contributions</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Party</TableCell>
              <TableCell align="right">Total Contributions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {stateData.contributions.map(({ candidate_party, total_contributions }) => (
              <TableRow key={candidate_party}>
                <TableCell>{candidate_party}</TableCell>
                <TableCell align="right">${total_contributions.toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      
      <Typography variant="h5" gutterBottom>Top Contributors</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Contributor</TableCell>
              <TableCell align="right">Total Contributions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {stateData.topContributors.map(({ first_name, last_name, total_contributions }) => (
              <TableRow key={`${first_name}-${last_name}`}>
                <TableCell>{first_name} {last_name}</TableCell>
                <TableCell align="right">${total_contributions.toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}
