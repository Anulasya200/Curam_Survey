import { Link, Outlet, useLocation } from "react-router-dom";

export default function App() {
  const { pathname } = useLocation();
  return (
    <div style={{ fontFamily: "Arial", padding: 20 }}>
      <header style={{ marginBottom: 16 }}>
        <Link to="/surveys"><h1>Survey Admin</h1></Link>
        <nav>
          <Link to="/surveys" style={{ marginRight: 12, fontWeight: pathname.startsWith("/surveys") ? 700 : 400 }}>
            Surveys
          </Link>
          <Link to="/surveys/new">Add Survey</Link>
        </nav>
      </header>
      <Outlet />
    </div>
  );
}
