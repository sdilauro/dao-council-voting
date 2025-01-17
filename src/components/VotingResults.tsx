import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Typography,
  Box,
  Link,
} from "@mui/material";
import { fetchSortedResults } from "../api/votingResults";
import { trackEvent } from "../analytics";

interface SortedResult {
  id: string;
  name: string;
  yes: number;
  no: number;
  abstain: number;
  yes_wins: boolean;
  totalVotes: number;
  yesPercentage: number;
  thresholdStatus: string;
  link: string
}

const VotingResults: React.FC = () => {
  const [results, setResults] = useState<SortedResult[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const sortedResults = await fetchSortedResults();
        setResults(sortedResults);
      } catch (err) {
        console.error("Error fetching results:", err);
        setError("Failed to fetch voting results. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  const handleClick = (value:string) => {
    trackEvent("Click", "Link", value);
  };

  if (loading)
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );

  if (error)
    return (
      <Box textAlign="center" mt={5}>
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Box>
    );

  return (
    <Box p={3} maxWidth={1000} margin={'auto'}>
      <Typography variant="h4" gutterBottom >
      <Box
      component="img"
      sx={{
        width: 40,
        height: 'auto', 
      }}
      alt="DAO"
      src="https://dclexplorer.com/static/media/dao-icon.19f5ee2d0bd3898f190e.png"
    />
     Voting Results
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell >#</TableCell>
              <TableCell >Name</TableCell>
              <TableCell align="right" >Yes Votes </TableCell>
              <TableCell align="right" >Yes %</TableCell>
              <TableCell align="center" >Threshold Status</TableCell>
              <TableCell align="center" >Yes {">"} No</TableCell>
              <TableCell align="right" >No Votes</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {results.map((result, index) => (
              <TableRow key={result.id}>
                <TableCell >{index + 1}</TableCell>
                <TableCell ><Link href={result.link} target="_blank" rel="noopener noreferrer" underline="none" onClick={()=>{handleClick(result.name)}}>{result.name}</Link></TableCell>
                <TableCell  align="right">{result.yes.toLocaleString()}</TableCell>
                <TableCell  align="right">
                  {result.yesPercentage.toFixed(1)}%
                </TableCell>
                <TableCell  align="center">{result.thresholdStatus}</TableCell>
                <TableCell  align="center">
                  {result.yes_wins ? "True" : "False"}
                </TableCell>
                <TableCell  align="right">{result.no.toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default VotingResults;