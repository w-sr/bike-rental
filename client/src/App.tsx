import { ApolloProvider } from "@apollo/client";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import client from "./utils/ApiClient";
import { BrowserRouter } from "react-router-dom";
import "./App.css";
import routes, { renderRoutes } from "./routes";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
  },
});

function App() {
  return (
    <ApolloProvider client={client}>
      <ThemeProvider theme={theme}>
        <BrowserRouter>{renderRoutes(routes)}</BrowserRouter>
      </ThemeProvider>
    </ApolloProvider>
  );
}

export default App;
