import { ChakraProvider } from "@chakra-ui/react";
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import Context from "./context/ChatContext";
import "./index.css";

ReactDOM.render(
  <BrowserRouter>
    <Context>
      <ChakraProvider>
        <App />
      </ChakraProvider>
    </Context>
  </BrowserRouter>,
  document.getElementById("root")
);
