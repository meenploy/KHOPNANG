import React from "react";
import { BrowserRouter, Route, Routes} from "react-router-dom";

import Index from "./page/index"

function App() {
  return (
  <BrowserRouter>
    <Routes>
      <Route path="/" exact element={<Index/>} />
    </Routes>
  </BrowserRouter>)
}

export default App