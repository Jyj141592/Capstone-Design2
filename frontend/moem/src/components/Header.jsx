import React from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import styles from "./Header.module.css";

export default function Header() {
  const authContext = useAuth();
  const navigate = useNavigate();

  return (
    <div>
      <header className={styles.siteHeader}>
        <div className={styles.headerInner}>
          <Link to="/" className={styles.logo}>
            MOEM
          </Link>

          <nav className={styles.navLinks}>
            {authContext.isAuthenticated ? (
              <>
                <Link to="/mypage">내 정보</Link>
                <button onClick={()=>{authContext.logout(); navigate('/')}}>로그아웃</button>
              </>
            ) : (
              <>
                <Link to="/login">로그인</Link>
                <Link to="/register">회원가입</Link>
              </>
            )}
          </nav>
        </div>
      </header>
      <Outlet/>
    </div>
  );
}
