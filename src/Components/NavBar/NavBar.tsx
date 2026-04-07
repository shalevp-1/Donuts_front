import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import './NavBar.css'
import { INavItem } from "./NavItemsData";
import { clearCartCookie } from "../../Utils/cartCookie";
import api from "../../Utils/apiClient";

function StatusIcon() {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className="statusIcon">
            <circle cx="12" cy="8" r="3.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
            <path d="M5.5 19c1.5-3.2 4-4.8 6.5-4.8s5 1.6 6.5 4.8" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
    );
}

export default function NavBar(props: { items: INavItem[] }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [accountName, setAccountName] = useState('');
    const [accountRole, setAccountRole] = useState('');
    const menuRef = useRef<HTMLDivElement>(null);
    const accountRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    const location = useLocation();

    const alwaysVisibleItems = useMemo(() => {
        const baseItems = props.items.filter((item) =>
            ["/", "/aboutus", "/donuts"].includes(item.urlStr.toLowerCase())
        );

        if (isAuthenticated && accountRole === 'admin') {
            return [
                ...baseItems,
                { displayStr: "My Perks", urlStr: "/my-perks" },
                { displayStr: "Manage", urlStr: "/donutsv" },
                { displayStr: "Users", urlStr: "/users" }
            ];
        }

        if (isAuthenticated) {
            return [
                ...baseItems,
                { displayStr: "My Perks", urlStr: "/my-perks" }
            ];
        }

        return baseItems;
    }, [accountRole, isAuthenticated, props.items]);

    const menuItems = useMemo(() => {
        const labels = new Map(props.items.map((item) => [item.urlStr.toLowerCase(), item.displayStr]));

        return [
            { label: labels.get("/cart") || "My Cart", url: "/cart", type: "link" as const },
            isAuthenticated
                ? { label: "Log Out", url: "/logout", type: "logout" as const }
                : { label: labels.get("/login") || "Login", url: "/login", type: "link" as const },
            ...(!isAuthenticated
                ? [{ label: labels.get("/signup") || "Sign Up", url: "/signup", type: "link" as const }]
                : [])
        ];
    }, [isAuthenticated, props.items]);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await api.get('/me');
                if (res.data.status === "Success") {
                    setIsAuthenticated(true);
                    setAccountName(res.data.name || 'Connected');
                    setAccountRole(res.data.role || 'user');
                } else {
                    setIsAuthenticated(false);
                    setAccountName('');
                    setAccountRole('');
                }
            } catch {
                setIsAuthenticated(false);
                setAccountName('');
                setAccountRole('');
            }
        };

        checkAuth();
    }, [location.pathname]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }

            if (accountRef.current && !accountRef.current.contains(event.target as Node)) {
                setIsAccountMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleLogout = async () => {
        try {
            await api.post("/logout");
        } catch {
            // Keep UX smooth even if logout cleanup fails server-side.
        } finally {
            clearCartCookie();
            setIsAuthenticated(false);
            setAccountName('');
            setAccountRole('');
            setIsMenuOpen(false);
            setIsAccountMenuOpen(false);
            navigate('/');
        }
    };

    return (
        <div className="NavBar">
            <div className="navBtns">
                <div className="navLeftGroup">
                    <Link to={'/'} className="brandMark">
                        <img src='/donut.png' alt="A delicious donut" className='logo' />
                    </Link>

                    {isAuthenticated && (
                        <div className={`accountWrap ${isAccountMenuOpen ? 'open' : ''}`} ref={accountRef}>
                            <button
                                type="button"
                                className="accountToggle"
                                onClick={() => setIsAccountMenuOpen((prev) => !prev)}
                                aria-label="Open account menu"
                                aria-expanded={isAccountMenuOpen}
                            >
                                <StatusIcon />
                                <span className="accountStatusDot" />
                            </button>
                            <div className="accountPanel">
                                <p className="accountPanelLabel">Connected as</p>
                                <strong>{accountName}</strong>
                                <span className="accountRoleBadge">{accountRole || 'user'}</span>
                                <button type="button" className="accountLogoutBtn" onClick={handleLogout}>
                                    Log out
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <div className="navMainLinks">
                    {alwaysVisibleItems.map((curr) => {
                        return (
                            <Link to={curr.urlStr} className="navMainLink" key={curr.urlStr}>
                                {curr.displayStr}
                            </Link>
                        )
                    })}
                </div>

                <div className={`menuWrap ${isMenuOpen ? 'open' : ''}`} ref={menuRef}>
                    <button
                        className="menuToggle"
                        aria-label="Open navigation menu"
                        aria-expanded={isMenuOpen}
                        type="button"
                        onClick={() => setIsMenuOpen((prev) => !prev)}
                    >
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                    <div className="menuPanel">
                        {menuItems.map((curr) => {
                            if (curr.type === "logout") {
                                return (
                                    <button
                                        type="button"
                                        className="menuLink menuActionBtn"
                                        key={curr.label}
                                        onClick={handleLogout}
                                    >
                                        {curr.label}
                                    </button>
                                );
                            }

                            return (
                                <Link
                                    to={curr.url}
                                    className="menuLink"
                                    key={curr.url}
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    {curr.label}
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}
