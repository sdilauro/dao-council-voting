import React from "react";
import VotingResults from "./components/VotingResults"
import { Link, Typography } from "@mui/material";
import FavoriteTwoToneIcon from '@mui/icons-material/FavoriteTwoTone';

const App: React.FC = () => {
  return (
    <div style={{ padding: "20px" }}>
      <VotingResults />
      <Typography gutterBottom align="center" >
        Made by{' '}
        <Link href="https://decentraland.org/governance/proposal/?id=8ce24f4d-ed98-421b-a04e-dd71876bf9a2" target="_blank" rel="noopener noreferrer" underline="none">
          Protocol Squad
        </Link>
        {' '}to avoid opening and comparing 20 tabs
      </Typography>
      <Typography gutterBottom align="center" >
        <FavoriteTwoToneIcon />
      </Typography>
      
    </div>
  );
};

export default App;