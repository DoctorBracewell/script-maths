import {
  Grid,
  TextField,
  Paper,
  Box,
  CircularProgress,
  Typography,
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { convertInput } from "./parser";
import { useState, useEffect } from "react";

export default function Converter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("Waiting for input...");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    setInput(localStorage.getItem("input"));
  }, []);

  useEffect(() => {
    if (!input) return setLoading(false);

    const timeOutId = setTimeout(() => {
      setError(false);
      localStorage.setItem("input", input ?? "");

      try {
        setOutput(convertInput(input));
      } catch (error) {
        // Return custom parser error message
        if (error?.type === "parser-error") {
          setOutput(
            `Input Error | ${error.errorType} at: {start: ${error.start}, end: ${error.end}}`
          );
        } else {
          // Otherwise something else went wrong
          console.log(error);
          setError(error);
        }
      }

      setLoading(false);
    }, 500);
    return () => clearTimeout(timeOutId);
  }, [input]);

  return (
    <Grid item container spacing={3} xs={12} direction="row">
      <Grid item xs={12} md={6}>
        <TextField
          multiline
          variant="outlined"
          fullWidth
          label="Equation"
          onChange={(event) => {
            setInput(event.target.value ?? "");
            setLoading(true);
          }}
          value={input}
          rows={10}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <Paper
          elevation={0}
          variant="outlined"
          style={{ height: "100%", flexDirection: "column", display: "flex" }}
        >
          <Box m={2} display="flex" flexGrow={1}>
            {loading ? (
              <Box m="auto">
                <CircularProgress size="4em" />
              </Box>
            ) : error ? (
              <Alert severity="error">
                Oops, something went wrong on my side. Send DrBracewell this
                error on discord: {error.message}
              </Alert>
            ) : (
              <code
                style={{
                  padding: "20px",
                  width: "100%",
                  whiteSpace: "pre-wrap",
                }}
              >
                {output}
              </code>
            )}
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
}
