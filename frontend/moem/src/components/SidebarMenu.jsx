import React from "react";
import { Link } from "react-router-dom";

const SidebarMenu = () => {
  return (
    <div className="sidebar">
      <div className="profile">
        <div className="avatar" />
        <p>Name</p>
      </div>
      <ul>
        <li>
          <Link to="/clubs">동아리</Link>
        </li>
        <li>
          <Link to="/account">계정</Link>
        </li>
      </ul>
    </div>
  );
};

export default SidebarMenu;
