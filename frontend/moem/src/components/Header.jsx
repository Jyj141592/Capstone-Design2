import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import "./Header.css";

export default function Header() {
  const authContext = useAuth();

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link to="/" className="logo">
          MOEM
        </Link>

        <nav className="nav-links">
          {authContext.isAuthenticated ? (
            <>
              <Link to="/mypage">내 정보</Link>
              <button onClick={authContext.logout}>로그아웃</button>
            </>
          ) : (
            <>
              {/* <Link to="/login">로그인</Link>
              <Link to="/register">회원가입</Link> */}
              <Link to="/mypage">내 정보</Link>
              <button onClick={authContext.logout}>로그아웃</button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
