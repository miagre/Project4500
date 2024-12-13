import { useEffect } from "react";
import { Container } from "@mui/material";
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

export default function HomePage() {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <ComposableMap projection="geoAlbersUsa">
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill="#DDD"
                stroke="#FFF"
                style={{
                  default: {
                    fill: "#DDD",
                    outline: "none",
                  },
                  hover: {
                    fill: "#AAA",
                    outline: "none",
                  },
                  pressed: {
                    fill: "#888",
                    outline: "none",
                  },
                }}
              />
            ))
          }
        </Geographies>
        {/* Add state labels */}
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
              {name}
            </text>
          </Annotation>
        ))}
      </ComposableMap>
    </Container>
  );
}
