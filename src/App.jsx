import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Thermodynamique from "./pages/Thermodynamique";
import Transferts from "./pages/Transferts";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/thermodynamique" element={<Thermodynamique />} />
        <Route path="/transferts/*" element={<Transferts />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;