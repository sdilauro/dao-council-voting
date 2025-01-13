import React from "react";
import VotingResults from "./components/VotingResults"
import { Typography } from "@mui/material";

const App: React.FC = () => {
  return (
    <div style={{ padding: "20px" }}>
      <VotingResults />
      <Typography gutterBottom align="center" >
        Made by Protocol Squad to avoid opening and comparing 20 tabs {'<'}3
      </Typography>
    </div>
  );
};

export default App;