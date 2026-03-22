import NavbarTransferts from "../components/NavbarTransferts";
import { Routes, Route } from "react-router-dom";
import Conduction from "./transferts/Conduction";
import Convection from "./transferts/Convection";
import Rayonnement from "./transferts/Rayonnement";
import EnergieTemperature from "./transferts/EnergieTemperature";

export default function Transferts() {
  return (
    <div>
      <h1>Transferts Thermiques</h1>
      <NavbarTransferts />
      <Routes>
        <Route path="conduction" element={<Conduction />} />
        <Route path="convection" element={<Convection />} />
        <Route path="rayonnement" element={<Rayonnement />} />
        <Route path="EnergieTemperature" element={<EnergieTemperature />} />
      </Routes>
    </div>
  );
}