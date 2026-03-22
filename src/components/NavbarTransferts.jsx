import { Link } from "react-router-dom";

export default function NavbarTransferts() {
  return (
    <nav style={{ padding: "5px 20px", background: "#ddd" }}>
      <Link to="/transferts/conduction" style={{ margin: "10px" }}>Conduction</Link>
      <Link to="/transferts/convection" style={{ margin: "10px" }}>Convection</Link>
      <Link to="/transferts/rayonnement" style={{ margin: "10px" }}>Rayonnement</Link>
      <Link to="/transferts/EnergieTemperature" style={{ margin: "10px" }}>Energie et Temperature</Link>
    </nav>
  );
}