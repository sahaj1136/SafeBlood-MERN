    import React, { useState, useEffect, useContext } from "react";
    import logo from "../../assets/logo.png";
    import { Outlet, Link, useLocation } from "react-router-dom";
    import DropDown from "../Util/DropDown";
    import axios from "../Api";
    import AuthContext from "../context/AuthContext";

    const Navbar = (props) => {
        const s1 =
            "bg-white-900 drop-shadow-lg px-6 py-2 rounded-md text-base font-medium hover:drop-shadow-xl hover:px-8 dark:hover:bg-midnight dark:hover:drop-shadow-dark-lg transition-all";
        const { getLoggedIn } = useContext(AuthContext);
        const [theme, setTheme] = useState(0);
        const doc = document.documentElement.classList;

        useEffect(() => {
            const t = parseInt(localStorage.getItem("theme") || "0");
            setTheme(t);
            if (t === 1) doc.add("dark");
            else doc.remove("dark");
        }, []);

        const toggleTheme = () => {
            const newTheme = theme === 1 ? 0 : 1;
            localStorage.setItem("theme", newTheme);
            setTheme(newTheme);
            if (newTheme === 1) doc.add("dark");
            else doc.remove("dark");
        };

        return (
            <>
                <nav className="p-3 bg-white/70 backdrop-blur-md sticky top-0 z-20 shadow-sm dark:bg-gray-bg/70">
                    <div className="flex items-center justify-between">
                        <Link to="/" className="flex items-center ml-6">
                            <img
                                className="h-14 w-auto"
                                src={logo}
                                draggable={false}
                                alt="SafeBlood Logo"
                            />
                            
                            <div className="ml-2">
                                <div className="text-2xl font-bold text-blood">SafeBlood</div>

                                <div className="text-sm text-gray-600 dark:hidden">
                                    Donate Blood. Save Lives.
                                </div>

                                <div className="text-sm text-white-300 hidden dark:block">
                                    Donate Blood. Save Lives.
                                </div>
                            </div>

                        </Link>

                        {/* NAVIGATION */}
                        <div className="flex items-center gap-4 mr-6">
                            {!props.logIn && (
                                <>
                                    <DropDown
                                        title="Find Blood"
                                        children={["Recipient Login", "Directory"]}
                                        links={["/register/patient", "/bloodDirect"]}
                                    />
                                    <DropDown
                                        title="Become a Donor"
                                        children={["Donor Login", "Camps", "About Blood Donation"]}
                                        links={["/register/donor", "/bloodCamps", "/aboutBloodDonation"]}
                                    />
                                    <DropDown
                                        title="Blood Bank"
                                        children={["Login", "Add"]}
                                        links={["/login/bank", "/register/bank"]}
                                    />
                                </>
                            )}

                            <DropDown
                                title="About"
                                children={["About Us", "Contact Us"]}
                                links={["/about", "/contactUs"]}
                            />

                            {props.logIn && (
                                <>
                                    <Link
                                        to={`/${props.user || "user"}/profile`}
                                        className={s1}
                                        aria-label="User Profile"
                                    >
                                        <i className="fa-solid fa-user"></i>
                                    </Link>
                                    <Link
                                        to="/"
                                        onClick={async () => {
                                            await axios.get("/auth/logout", {
                                                withCredentials: true,
                                            });
                                            await getLoggedIn();
                                        }}
                                        className={s1}
                                        aria-label="Logout"
                                    >
                                        Log Out
                                    </Link>
                                </>
                            )}

                            <button
                                className="px-3 py-2 rounded-full hover:shadow-lg transition"
                                onClick={toggleTheme}
                                aria-label="Toggle Theme"
                            >
                                <i
                                    className={`fa-solid fa-lg fa-${theme === 0 ? "sun" : "moon"} dark:text-white-900`}
                                ></i>
                            </button>
                        </div>
                    </div>
                </nav>
                <Outlet />
            </>
        );
    };

    export default Navbar;
