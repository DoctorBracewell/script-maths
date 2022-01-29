import { Grid, Typography, Box } from "@material-ui/core";

import Converter from "./Converter";

function App() {
  return (
    <Box m={3}>
      <Grid container spacing={3} direction="column">
        <Grid item container xs={12}>
          <Box mx="auto" my={5}>
            <Typography variant="h1">Equation Converter</Typography>
          </Box>
        </Grid>
        <Grid item container xs={12}>
          <Box mx="auto" maxWidth="65%">
            <Typography component="span" variant="body1">
              Welcome! This generator is for converting 'normal' mathematical
              equations into nested function statements that WynnScript can
              understand (as chaining operators is not allowed in the language).
              <br />
              Here are some important notes to remember:
              <ul>
                <li>
                  As well as using explicit symbols (<code>*, ⋅, ✕, ...</code>),
                  multiplication can be indicated <em>implicitly</em>, such as
                  co-efficients of variables (<code>5a = 5*a</code>) or spaces (
                  <code>a a = a*a</code>).
                </li>
                <li>
                  To use functions, simply type the name of the function (
                  <code>math.</code> is not required), and pass in your
                  arguments as usual, e.g <code>sin(a)</code>.
                </li>
                <li>
                  Unary operators are supported, such as <code>+a</code> which
                  will be converted to <code>math.add(0, a)</code> or{" "}
                  <code>±a</code> to <code>math.mul(a, -1)</code>
                </li>
                <li>
                  You can include constants from the <code>math</code>{" "}
                  namespaces by prefacing them with <code>math.</code>, such as{" "}
                  <code>math.pi</code> - and any function that takes 0
                  parameters will have its brackets removed, e.g{" "}
                  <code>pi()</code> to <code>math.pi</code>.
                </li>
              </ul>
            </Typography>
          </Box>
        </Grid>
        <Converter />
      </Grid>
    </Box>
  );
}

export default App;
