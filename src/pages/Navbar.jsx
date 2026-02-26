import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav style={{ padding: "10px", background: "#333", color: "#fff", display: "flex", gap: "15px" }}>
      <Link to="/" style={{ color: "white", textDecoration: "none" }}>Upload</Link>
      <Link to="/admin" style={{ color: "white", textDecoration: "none" }}>Admin</Link>
      <Link to="/check" style={{ color: "white", textDecoration: "none" }}>Check Status</Link>
    </nav>
  );
};

export default Navbar;