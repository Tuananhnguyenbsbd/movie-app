import React, { useRef, useEffect } from "react";
import "./header.scss";
import { useLocation, Link } from "react-router-dom";
import logo from "../../assets/logo/logo.png";
import Button from "../button/Button";
const headerNav = [
    {
        display: "Home",
        path: "/"
    },
    {
        display: "Movies",
        path: "/movie"
    },
    {
        display: "TV Series",
        path: "/tv"
    }
];
const Header = () => {
    const { pathname } = useLocation();
    const headerRef = useRef(null);
    useEffect(() => {
        const shrinkHeader = () => {
            if (
                document.body.scrollTop > 100 ||
                document.documentElement.scrollTop > 100
            ) {
                headerRef.current.classList.add("shrink");
            } else {
                headerRef.current.classList.remove("shrink");
            }
        };
        window.addEventListener("scroll", shrinkHeader);
        return () => {
            window.removeEventListener("scroll", shrinkHeader);
        };
    }, []);
    const active = headerNav.findIndex((e) => e.path === pathname);
    return (
        <div ref={headerRef} className="header">
            <div className="header__wrap container">
                <div className="logo">
                    <img src={logo} alt="TA-MOVIE" />
                    <Link to="/">TA-MOVIE</Link>
                </div>
                <ul className="header__nav">
                    {headerNav.map((e, i) => (
                        <li
                            key={i}
                            className={`${i === active ? "active" : ""}`}
                        >
                            <Link to={e.path}>{e.display}</Link>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};
export default Header;
