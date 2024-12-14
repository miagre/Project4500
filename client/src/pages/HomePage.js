import { useEffect, useState } from "react";
import { Container, Button, ButtonGroup, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  Annotation,
} from "react-simple-maps";
import { scaleQuantile } from "d3-scale";

const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

const stateLabels = [
  { name: "AL", coordinates: [-86.9023, 32.3182] },
  { name: "AK", coordinates: [-153.3694, 63.3883] },
  { name: "AZ", coordinates: [-111.0937, 34.0489] },
  { name: "AR", coordinates: [-92.3809, 34.9697] },
  { name: "CA", coordinates: [-119.4179, 36.7783] },
  { name: "CO", coordinates: [-105.7821, 39.5501] },
  { name: "CT", coordinates: [-72.7273, 41.6032] },
  { name: "DE", coordinates: [-75.5277, 39.3185] },
  { name: "FL", coordinates: [-81.5158, 27.6648] },
  { name: "GA", coordinates: [-83.6487, 32.1656] },
  { name: "HI", coordinates: [-157.5311, 21.0945] },
  { name: "ID", coordinates: [-114.742, 44.2405] },
  { name: "IL", coordinates: [-89.3985, 40.6331] },
  { name: "IN", coordinates: [-86.2816, 39.8494] },
  { name: "IA", coordinates: [-93.214, 42.0329] },
  { name: "KS", coordinates: [-98.3804, 38.5266] },
  { name: "KY", coordinates: [-84.27, 37.6681] },
  { name: "LA", coordinates: [-91.9623, 31.1695] },
  { name: "ME", coordinates: [-69.3977, 44.6939] },
  { name: "MD", coordinates: [-76.6413, 39.0458] },
  { name: "MA", coordinates: [-71.5314, 42.2373] },
  { name: "MI", coordinates: [-85.6024, 44.3148] },
  { name: "MN", coordinates: [-93.9196, 45.6945] },
  { name: "MS", coordinates: [-89.3985, 32.7416] },
  { name: "MO", coordinates: [-92.458, 38.4561] },
  { name: "MT", coordinates: [-110.3626, 46.9219] },
  { name: "NE", coordinates: [-99.9018, 41.4925] },
  { name: "NV", coordinates: [-117.0554, 38.8026] },
  { name: "NH", coordinates: [-71.5724, 43.1939] },
  { name: "NJ", coordinates: [-74.5089, 40.0583] },
  { name: "NM", coordinates: [-106.2371, 34.5199] },
  { name: "NY", coordinates: [-75.4452, 42.9538] },
  { name: "NC", coordinates: [-79.0193, 35.7596] },
  { name: "ND", coordinates: [-100.4793, 47.5515] },
  { name: "OH", coordinates: [-82.7937, 40.4173] },
  { name: "OK", coordinates: [-97.5164, 35.5851] },
  { name: "OR", coordinates: [-120.5542, 44.1419] },
  { name: "PA", coordinates: [-77.8446, 40.8721] },
  { name: "RI", coordinates: [-71.5314, 41.6762] },
  { name: "SC", coordinates: [-80.9066, 33.8569] },
  { name: "SD", coordinates: [-100.2263, 44.2998] },
  { name: "TN", coordinates: [-86.7489, 35.7478] },
  { name: "TX", coordinates: [-99.9018, 31.9686] },
  { name: "UT", coordinates: [-111.891, 40.1135] },
  { name: "VT", coordinates: [-72.7273, 44.0459] },
  { name: "VA", coordinates: [-78.6569, 37.4316] },
  { name: "WA", coordinates: [-120.7401, 47.7511] },
  { name: "WV", coordinates: [-80.9543, 38.5976] },
  { name: "WI", coordinates: [-89.6385, 44.2563] },
  { name: "WY", coordinates: [-107.2085, 42.7475] },
];

const formatNumber = (num) => {
  return num.toLocaleString("en-US");
};

const formatDollars = (num) => {
  return `$${num.toLocaleString("en-US")}`;
};

const getColoredValue = (value1, value2, prefix = "") => {
  const val1 = Number(value1);
  const val2 = Number(value2);
  const color = val1 > val2 ? "green" : "red";
  return `<span style="color: ${color}">${prefix}${formatNumber(val1)}</span>`;
};

const getContributionsPerVote = (contributions, electoralVotes) => {
  if (!contributions) return 0;
  return contributions / electoralVotes;
};

const getHeatmapColor = (value, minValue, maxValue) => {
  if (!value) return "#DDD";
  const intensity = (value - minValue) / (maxValue - minValue);
  return `rgb(255, ${Math.round(255 - 155 * intensity)}, 100)`;
};

export default function HomePage() {
  const [stateData, setStateData] = useState({});
  const [viewType, setViewType] = useState("contributions");
  const [electoralVotes, setElectoralVotes] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:8080/popular_vote_map")
      .then((response) => response.json())
      .then((data) => {
        const stateVoteData = {};
        data.forEach(({ state_name, candidate_name, popular_vote }) => {
          if (!stateVoteData[state_name]) {
            stateVoteData[state_name] = {
              votes: {},
              leadingParty: null,
              contributions: {},
              totalContributions: 0,
            };
          }
          stateVoteData[state_name].votes[candidate_name] = popular_vote;
          const votes = stateVoteData[state_name].votes;
          const leadingParty = Object.keys(votes).reduce((a, b) =>
            votes[a] > votes[b] ? a : b
          );
          stateVoteData[state_name].leadingParty = leadingParty;
        });
        setStateData(stateVoteData);
      });

    fetch("http://localhost:8080/state_contributions_map")
      .then((response) => response.json())
      .then((data) => {
        setStateData((prevStateData) => {
          const updatedStateData = { ...prevStateData };
          data.forEach(
            ({ state_name, candidate_party, total_contributions }) => {
              if (!updatedStateData[state_name]) {
                updatedStateData[state_name] = {
                  votes: {},
                  leadingParty: null,
                  contributions: {},
                  totalContributions: 0,
                };
              }
              updatedStateData[state_name].contributions[candidate_party] =
                total_contributions;
              updatedStateData[state_name].totalContributions +=
                total_contributions;
            }
          );
          return updatedStateData;
        });
      });

    fetch("http://localhost:8080/electoral_votes_map")
      .then((response) => response.json())
      .then((data) => {
        const votesMap = {};
        data.forEach(({ state_abbreviation, electoral_votes }) => {
          votesMap[state_abbreviation] = electoral_votes;
        });
        setElectoralVotes(votesMap);
      });
  }, []);

  const getColor = (stateName) => {
    const state = stateData[stateName];
    if (!state) return "#DDD";

    switch (viewType) {
      case "contributions":
        const dem = state.contributions["Democratic"] || 0;
        const rep = state.contributions["Republican"] || 0;
        return dem > rep ? "#ADD8E6" : "#FFB3B2";

      case "votes":
        return state.leadingParty === "Joe Biden" ? "#ADD8E6" : "#FFB3B2";

      case "heatmap":
        const stateAbbrev = stateLabels.find((s) => s.name === stateName)?.name;
        const votes = electoralVotes[stateAbbrev] || 1;
        const contributionsPerVote = getContributionsPerVote(
          state.totalContributions,
          votes
        );

        // Get min and max values for all states
        const allValues = Object.keys(stateData)
          .map((state) => {
            const abbrev = stateLabels.find((s) => s.name === state)?.name;
            const ev = electoralVotes[abbrev] || 1;
            return getContributionsPerVote(
              stateData[state].totalContributions,
              ev
            );
          })
          .filter((val) => val > 0);

        const minValue = Math.min(...allValues);
        const maxValue = Math.max(...allValues);

        return getHeatmapColor(contributionsPerVote, minValue, maxValue);

      default:
        return "#DDD";
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box
        sx={{
          mb: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ButtonGroup
          variant="contained"
          aria-label="view selection button group"
        >
          <Button
            onClick={() => setViewType("contributions")}
            color={viewType === "contributions" ? "primary" : "inherit"}
            sx={{
              backgroundColor:
                viewType === "contributions" ? "#1976d2" : "#e0e0e0",
              "&:hover": {
                backgroundColor:
                  viewType === "contributions" ? "#1565c0" : "#d5d5d5",
              },
            }}
          >
            Campaign Contributions
          </Button>
          <Button
            onClick={() => setViewType("votes")}
            color={viewType === "votes" ? "primary" : "inherit"}
            sx={{
              backgroundColor: viewType === "votes" ? "#1976d2" : "#e0e0e0",
              "&:hover": {
                backgroundColor: viewType === "votes" ? "#1565c0" : "#d5d5d5",
              },
            }}
          >
            Popular Vote
          </Button>
          <Button
            onClick={() => setViewType("heatmap")}
            color={viewType === "heatmap" ? "primary" : "inherit"}
            sx={{
              backgroundColor: viewType === "heatmap" ? "#1976d2" : "#e0e0e0",
              "&:hover": {
                backgroundColor: viewType === "heatmap" ? "#1565c0" : "#d5d5d5",
              },
            }}
          >
            Contributions per Vote
          </Button>
        </ButtonGroup>
      </Box>

      {viewType === "heatmap" && (
        <Box
          sx={{
            mb: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 1,
          }}
        >
          <Typography variant="body2" sx={{ mb: 1 }}>
            Campaign dollars per electoral vote (shows which states received
            disproportionately high campaign contributions relative to their
            electoral votes)
          </Typography>
          <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <div
                style={{
                  width: 20,
                  height: 20,
                  backgroundColor: "rgb(255, 255, 100)",
                  marginRight: 5,
                }}
              />
              <Typography variant="body2">
                Fewer Dollars per Electoral Vote
              </Typography>
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <div
                style={{
                  width: 20,
                  height: 20,
                  backgroundColor: "rgb(255, 100, 100)",
                  marginRight: 5,
                }}
              />
              <Typography variant="body2">
                More Dollars per Electoral Vote
              </Typography>
            </div>
          </div>
        </Box>
      )}

      <div
        id="tooltip"
        style={{
          position: "absolute",
          backgroundColor: "white",
          padding: "10px",
          border: "1px solid black",
          borderRadius: "4px",
          pointerEvents: "none",
        }}
      ></div>
      <ComposableMap projection="geoAlbersUsa">
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const stateName = geo.properties.name;
              console.log(geo.properties);
              const fillColor = getColor(stateName);
              const stateVotes = stateData[stateName]?.votes || {};
              const stateContributions =
                stateData[stateName]?.contributions || {};
              const totalContributions =
                stateData[stateName]?.totalContributions || 0;

              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={fillColor}
                  stroke="#FFF"
                  style={{
                    default: { fill: fillColor, outline: "none" },
                    hover: { fill: "#AAA", outline: "none" },
                    pressed: { fill: "#888", outline: "none" },
                  }}
                  onClick={() => navigate(`/state/${stateName}`)}
                  onMouseEnter={(evt) => {
                    const tooltip = document.querySelector("#tooltip");
                    const stateAbbrev = stateLabels.find(
                      (s) => s.name === stateName
                    )?.name;
                    const stateElectoralVotes =
                      electoralVotes[stateAbbrev] || 0;

                    // Get vote values
                    const bidenVotes = Number(stateVotes["Joe Biden"] || 0);
                    const trumpVotes = Number(stateVotes["Donald Trump"] || 0);

                    // Get contribution values
                    const demContributions = Number(
                      stateContributions["Democratic"] || 0
                    );
                    const repContributions = Number(
                      stateContributions["Republican"] || 0
                    );

                    tooltip.innerHTML = `
                      <div style="font-weight: bold; margin-bottom: 5px">
                        ${stateName} (${stateElectoralVotes} electoral votes)
                      </div>
                      <div style="margin-bottom: 5px">
                        <div><u>Votes</u></div>
                        Joe Biden: ${getColoredValue(bidenVotes, trumpVotes)}
                        <br/>
                        Donald Trump: ${getColoredValue(trumpVotes, bidenVotes)}
                      </div>
                      <div>
                        <div><u>Contributions</u></div>
                        Democratic: ${getColoredValue(
                          demContributions,
                          repContributions,
                          "$"
                        )}
                        <br/>
                        Republican: ${getColoredValue(
                          repContributions,
                          demContributions,
                          "$"
                        )}
                        <br/>
                        <div style="margin-top: 5px">
                          Total: ${formatDollars(totalContributions)}
                        </div>
                      </div>
                    `;

                    // Position tooltip near mouse
                    tooltip.style.left = `${evt.clientX + 10}px`;
                    tooltip.style.top = `${evt.clientY + 10}px`;
                  }}
                  onMouseLeave={() => {
                    const tooltip = document.querySelector("#tooltip");
                    tooltip.innerHTML = "";
                  }}
                />
              );
            })
          }
        </Geographies>

        {stateLabels.map(({ name, coordinates }) => (
          <Annotation
            key={name}
            subject={coordinates}
            dx={0}
            dy={0}
            connectorProps={{}}
          >
            <text
              x={4}
              y={4}
              fontSize={10}
              textAnchor="middle"
              alignmentBaseline="middle"
              fill="#333"
            >
              {`${name} (${electoralVotes[name] || 0})`}
            </text>
          </Annotation>
        ))}
      </ComposableMap>
    </Container>
  );
}
