import React from 'react'
import ReactDOM from 'react-dom/client'
import {Game} from "./Game";

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
      <Game width={640} height={480} />
  </React.StrictMode>
)
