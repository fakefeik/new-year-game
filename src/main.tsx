import React from 'react'
import ReactDOM from 'react-dom/client'
import { GameContainer } from "./GameContainer";
import {BrowserRouter} from "react-router-dom";

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
      <BrowserRouter>
          <GameContainer />
      </BrowserRouter>
  </React.StrictMode>
)
