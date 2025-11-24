import React, { useState, useEffect } from "react";
import { ShoppingCart, Menu, User, Tag, Info, Phone, X } from "lucide-react";
import { useCart } from "../../context/CartContext";
import LoginModal from "./LoginModal";
import { useAuth } from "../../hooks/useAuth";
import { Link, useLocation } from "react-router-dom";
import logo from "../../assets/logo.webp";

export default function Header() {
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const { user } = useAuth();
  const { cart } = useCart();
  const [activeLink, setActiveLink] = useState("");
  const location = useLocation();

  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const scrollThreshold = 100;

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  useEffect(() => {
    const path = location.pathname;
    if (path.includes("products") || path.includes("productdetail")) {
      setActiveLink("productos");
    } else if (path === "/cart" || path.includes("cart")) {
      setActiveLink("carrito");
    } else if (path.includes("profile")) {
      setActiveLink("perfil");
    } else if (path.includes("about")) {
      setActiveLink("about");
    } else if (path.includes("contact")) {
      setActiveLink("contact");
    } else {
      setActiveLink("");
    }
  }, [location]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY && window.scrollY > scrollThreshold) {
        setIsHeaderVisible(false);
      } else if (
        window.scrollY < lastScrollY ||
        window.scrollY <= scrollThreshold
      ) {
        setIsHeaderVisible(true);
      }
      setLastScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);

  const handleModalClose = () => {
    setLoginModalOpen(false);
    const path = location.pathname;
    if (path.includes("products") || path.includes("productdelait")) {
      setActiveLink("productos");
    } else if (path.includes("cart")) {
      setActiveLink("carrito");
    } else if (path.includes("profile")) {
      setActiveLink("perfil");
    } else if (path.includes("about")) {
      setActiveLink("about");
    } else if (path.includes("contact")) {
      setActiveLink("contact");
    } else {
      setActiveLink("");
    }
  };

  const handleSideMenuToggle = () => {
    setIsSideMenuOpen(!isSideMenuOpen);
  };

  const handleLinkClick = (linkName) => {
    setActiveLink(linkName);
    setIsSideMenuOpen(false);
  };

  const renderNavLinks = (isMobile = false) => {
    const linkClass = isMobile
      ? "block px-4 py-3 text-base font-medium w-full text-left mb-4"
      : "px-3 py-2 text-sm font-medium flex items-center whitespace-nowrap";

    const links = [
      { to: "/products", icon: Tag, text: "Productos", name: "productos" },
      { to: "/about", icon: Info, text: "Quienes Somos", name: "about" },
      { to: "/contact", icon: Phone, text: "Contáctanos", name: "contact" },
    ];

    return (
      <>
        {links.map((link) => (
          <Link
            key={link.name}
            to={link.to}
            className={`${linkClass} ${
              activeLink === link.name
                ? "active-link"
                : "text-white hover:text-white hover-link"
            }`}
            onClick={() => handleLinkClick(link.name)}
            aria-label={`Ir a ${link.text}`}
          >
            <link.icon
              className={`${isMobile ? "h-5 w-5 mr-3 inline" : "h-4 w-4 mr-1"}`}
              aria-hidden="true"
            />
            {link.text}
          </Link>
        ))}
        {user ? (
          <>
            <Link
              to="/profile"
              className={`${linkClass} ${
                activeLink === "perfil"
                  ? "active-link"
                  : "text-white hover:text-white hover-link"
              }`}
              onClick={() => handleLinkClick("perfil")}
              aria-label="Ir al perfil de usuario"
            >
              <User
                className={`${
                  isMobile ? "h-5 w-5 mr-3 inline" : "h-4 w-4 mr-1"
                }`}
                aria-hidden="true"
              />
              Perfil
            </Link>
            {!isMobile && (
              <Link
                to="/cart"
                className={`relative text-white ${
                  activeLink === "carrito"
                    ? "px-3 py-2 text-sm font-medium flex items-center whitespace-nowrap active-link"
                    : "px-3 py-2 text-sm font-medium flex items-center whitespace-nowrap hover:text-white hover-link"
                }`}
                aria-label="Ir al carrito de compras"
              >
                <ShoppingCart className="h-5 w-5" aria-hidden="true" />
                {totalItems > 0 && (
                  <span
                    className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center"
                    aria-label={`Productos en el carrito: ${totalItems}`}
                  >
                    {totalItems}
                  </span>
                )}
              </Link>
            )}
          </>
        ) : (
          <button
            onClick={() => {
              setActiveLink("login");
              setLoginModalOpen(true);
              setIsSideMenuOpen(false);
            }}
            className={`${linkClass} ${
              activeLink === "login"
                ? "active-link"
                : "text-white hover:text-white hover-link"
            }`}
            aria-label="Iniciar sesión"
          >
            <User
              className={`${isMobile ? "h-5 w-5 mr-3 inline" : "h-4 w-4 mr-1"}`}
              aria-hidden="true"
            />
            Iniciar Sesión
          </button>
        )}
      </>
    );
  };

  return (
    <>
      <header
        className={`bg-black shadow-md fixed top-0 left-0 right-0 z-50 lg:mb-3 transition-transform duration-300 ${
          isHeaderVisible ? "translate-y-0" : "-translate-y-[110px]"
        }`}
        style={{ transition: "transform 0.6s ease-in-out" }}
      >
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 bg-black">
          <div className="flex items-center justify-between h-20 lg:h-28">
            <div className="flex items-center lg:mr-auto w-full justify-between lg:justify-start">
              <Link to="/" onClick={() => handleLinkClick("")}>
                <img
                  src={logo}
                  alt="Logo de la tienda - Enlace a la página de inicio"
                  className="h-auto max-h-16 w-auto"
                  width="128"
                  height="48"
                />
              </Link>
            </div>

            <div className="lg:hidden flex items-center ml-auto space-x-4">
              {user && (
                <Link
                  to="/cart"
                  className="relative text-white"
                  aria-label="Ir al carrito de compras"
                >
                  <ShoppingCart className="h-5 w-5" aria-hidden="true" />
                  {totalItems > 0 && (
                    <span
                      className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center"
                      aria-label={`Productos en el carrito: ${totalItems}`}
                    >
                      {totalItems}
                    </span>
                  )}
                </Link>
              )}
              <button
                className="p-2 rounded-full text-white hover:text-white"
                onClick={handleSideMenuToggle}
                aria-label="Abrir menú"
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>

            <div className="hidden lg:flex flex-col items-center justify-center ml-auto w-auto">
              <div className="text-center text-white text-sm font-medium">
                <span>
                  POR COMPRAS SUPERIORES A $200.000
                  <br />
                  ENVÍO GRATIS EN BOGOTÁ
                </span>
              </div>

              <nav className="hidden lg:flex items-center space-x-4">
                {renderNavLinks()}
              </nav>
            </div>
          </div>
        </div>
      </header>

      <div
        className={`fixed inset-0 z-50 transition-opacity duration-300 ${
          isSideMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        role="dialog"
        aria-modal="true"
      >
        <div
          className={`fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300 ${
            isSideMenuOpen ? "opacity-100" : "opacity-0"
          }`}
          aria-hidden="true"
          onClick={handleSideMenuToggle}
        ></div>
        <nav
          className={`fixed top-0 right-0 bottom-0 flex flex-col w-80 max-w-sm py-8 px-6 bg-black transform transition-transform duration-300 ${
            isSideMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-white">Menú</h2>
            <button
              className="rounded-full p-2 text-white hover:text-white focus:outline-none focus:ring-2 focus:ring-gray-600"
              onClick={handleSideMenuToggle}
              aria-label="Cerrar menú"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          {renderNavLinks(true)}
        </nav>
      </div>

      <LoginModal isOpen={isLoginModalOpen} onClose={handleModalClose} />
    </>
  );
}
