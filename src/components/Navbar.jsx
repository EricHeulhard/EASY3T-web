import { Link } from "react-router-dom";
import "../styles/Navbar.css"

export default function Navbar() {
  return (
    <nav className="navbar">
      <ul className="nav-list">
        <li>
          <Link to="/thermodynamique">Thermodynamique</Link>
        </li>
        <li>
          <Link to="/transferts">Transferts thermiques</Link>
        </li>
      </ul>
    </nav>
  );
}