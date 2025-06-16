import React, { useState } from 'react'; 
import { Link } from 'react-router-dom'; 
import './Navbar.css'; 
import { useAuth } from '../../context/AuthContext';
import { useBookContext } from '../../context/BookContext';
import logo from '../Images/IQRAA__1_-removebg-preview.png'; 
import cart_icon from '../Images/shopping-cart.png'; 
import bell from '../Images/bell.png'; 
import search from '../Images/search-interface-symbol.png';  

const Navbar = () => {     
    const [activeMenu, setActiveMenu] = useState("Home");
    const [showUserMenu, setShowUserMenu] = useState(false);
    const { cart } = useBookContext();
    const { user, logout } = useAuth();
    const [menuOpen, setMenuOpen] = useState(false);

    const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    const handleLogout = () => {
        logout();
        setShowUserMenu(false);
        setMenuOpen(false);
    };

    const scrollToAbout = () => {
        const aboutSection = document.getElementById('about');
        if (aboutSection) {
            aboutSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const scrollToFooter = () => {
        const footerSection = document.getElementById('footer');
        if (footerSection) {
            footerSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (         
        <div className='navbar'>             

            <div className='nav-logo'>                 
                <img src={logo} alt="Logo" />             
            </div>   

            <ul className={`nav-menu ${menuOpen ? "open" : ""}`}>
                <li onClick={() => { setActiveMenu("Home"); setMenuOpen(false); }}>
                    <Link style={{ textDecoration: 'none', color: '#3e7a48' }} to='/'>Home</Link>
                    {activeMenu === "Home" && <hr className="active-line" />}
                </li>                 
                <li onClick={() => { setActiveMenu("About"); scrollToAbout(); setMenuOpen(false); }}>
                    <a style={{ textDecoration: 'none', color: '#3e7a48' }}>About</a>
                    {activeMenu === "About" && <hr className="active-line" />}
                </li>                 
                <li onClick={() => { setActiveMenu("My Books"); setMenuOpen(false); }}>
                    <Link style={{ textDecoration: 'none', color: '#3e7a48' }} to='/my-books'>My Books</Link>
                    {activeMenu === "My Books" && <hr className="active-line" />}
                </li>                 
                <li onClick={() => { setActiveMenu("Contact"); scrollToFooter(); setMenuOpen(false); }}>
                    <a style={{ textDecoration: 'none', color: '#3e7a48' }}>Contact</a>
                    {activeMenu === "Contact" && <hr className="active-line" />}
                </li>             

          {/*mobile*/}
                <li className="mobile-only">
                    {user ? (
                        <div className="user-menu-container-mobile">
                            <button
                                className="user-menu-button"
                                onClick={() => setShowUserMenu(!showUserMenu)}
                            >
                                {user.name}
                            </button>
                            {showUserMenu && (
                                <div className="user-menu-dropdown">
                                    <Link to="/profile" className="menu-item" onClick={() => setMenuOpen(false)}>Profile</Link>
                                    <Link to="/my-books" className="menu-item" onClick={() => setMenuOpen(false)}>My Books</Link>
                                    <button onClick={handleLogout} className="menu-item logout">Logout</button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Link to='/login' onClick={() => setMenuOpen(false)}>
                            <button className="login-orange">Login</button>
                        </Link>
                    )}
                </li>
            </ul>

            {/* desktop*/}
            <div className='search-box'>                 
                <img src={search} alt="Search" />                 
                <input type='text' placeholder='Search' />                 
                
                <Link to='/cart' className="nav-icon-link">                     
                    <img src={cart_icon} alt="Cart" />
                    {cartItemCount > 0 && (
                        <span className="cart-badge">{cartItemCount}</span>
                    )}
                </Link>                  

                <img src={bell} alt="Notifications" />

                {/* menu*/}
                <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>

                {/*desktop*/}
                <div className="desktop-user-menu desktop-only">
                    {user ? (
                        <div className="user-menu-container">
                            <button 
                                className="user-menu-button"
                                onClick={() => setShowUserMenu(!showUserMenu)}
                            >
                                {user.name}
                            </button>
                            {showUserMenu && (
                                <div className="user-menu-dropdown">
                                    <Link to="/profile" className="menu-item">Profile</Link>
                                    <Link to="/my-books" className="menu-item">My Books</Link>
                                    <button onClick={handleLogout} className="menu-item logout">Logout</button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Link to='/login'>
                            <button className="login-orange">Login</button>
                        </Link>
                    )}
                </div>
            </div>         
        </div>     
    ); 
};

export default Navbar; 
