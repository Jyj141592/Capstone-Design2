import { Outlet, Link, useLocation } from "react-router-dom";

function SidebarLayout() {
  const location = useLocation();
  const menu = [
    { to: "/explore", label: "동아리" },
    { to: "/account", label: "계정" },
  ];

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <div
        style={{
          width: "280px",
          background: "#eee",
          padding: "20px",
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
                margin: "0 auto",
              }}
            ></div>
            <h3>Name</h3>
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
                      padding: "5px 10px",
                      borderRadius: "5px",
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
        <button
          style={{
            marginTop: "20px",
            width: "100%",
            backgroundColor: "#444",
            color: "#fff",
            border: "none",
            padding: "10px 16px",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          동아리 생성
        </button>
      </div>
      <div style={{ flex: 1, padding: "20px", overflowY: "auto" }}>
        <Outlet />
      </div>
    </div>
  );
}

export default SidebarLayout;
