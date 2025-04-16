import { Outlet, Link, useLocation } from "react-router-dom";
import "./index.css";

function SidebarLayout() {
  const location = useLocation();
  const menu = [
    { to: "/explore", label: "모임" },
    { to: "/account", label: "계정" },
  ];

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <div
        style={{
          width: "280px",
          background: "#eee",
          padding: "40px",
          boxSizing: "border-box",
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div>
          <div style={{ textAlign: "center", marginBottom: "20px" }}>
            <div
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                background: "#ccc",
                margin: "50px auto 20px auto",
              }}
            ></div>
            <h3 style={{ marginBottom: "40px" }}>Name</h3>
          </div>
          <nav>
            <ul style={{ listStyle: "none", padding: 0 }}>
              {menu.map(({ to, label }) => (
                <li key={to} style={{ margin: "10px 0" }}>
                  <Link
                    to={to}
                    style={{
                      background:
                        location.pathname === to ? "#fbe9a9" : "transparent",
                      padding: "10px 20px",
                      borderRadius: "500px",
                      display: "inline-block",
                      textDecoration: "none",
                      color: "#333",
                    }}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <Link
          to="/club/create"
          style={{
            marginTop: "20px",
            width: "85%",
            backgroundColor: "#444",
            color: "#fff",
            border: "none",
            padding: "10px 16px",
            borderRadius: "4px",
            textAlign: "center",
            textDecoration: "none",
            display: "block",
          }}
        >
          모임 생성
        </Link>
      </div>
      <div style={{ flex: 1, padding: "20px", overflowY: "auto" }}>
        <Outlet />
      </div>
    </div>
  );
}

export default SidebarLayout;
