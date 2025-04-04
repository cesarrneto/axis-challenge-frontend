import React from "react";
import { Outlet, Link } from "react-router-dom";
import logo from "../images/axis-mobfintek-logo.png";

const Layout = () => {
  return (
    <div>
      <nav className="navbar">
        <div className="container">
          <img src={logo} alt="Axis Logo" className="logo" />
          <ul className="nav-links">
            <li><Link to="/">Início</Link></li>
            <li><Link to="/listacooperativa">Cooperativas</Link></li>
            <li><Link to="/listacooperado">Cooperados</Link></li>
            <li><Link to="/listacontatofavorito">Contatos Favoritos</Link></li>
        </ul>
        </div>
      </nav>

      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
