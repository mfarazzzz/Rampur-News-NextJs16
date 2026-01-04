import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { Menu, X, Search, Facebook, Twitter, Youtube, Instagram } from "lucide-react";
import { categories } from "@/data/categories";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const location = useLocation();

  const mainNavItems = categories.slice(0, 8);
  const moreNavItems = categories.slice(8);

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-card shadow-sm">
      {/* Top Bar */}
      <div className="bg-news-dark text-primary-foreground">
        <div className="container flex items-center justify-between py-2 text-sm">
          <div className="flex items-center gap-4">
            <span className="hidden md:inline">
              {new Date().toLocaleDateString("hi-IN", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <a href="#" className="hover:text-primary transition-colors" aria-label="Facebook">
              <Facebook size={16} />
            </a>
            <a href="#" className="hover:text-primary transition-colors" aria-label="Twitter">
              <Twitter size={16} />
            </a>
            <a href="#" className="hover:text-primary transition-colors" aria-label="Youtube">
              <Youtube size={16} />
            </a>
            <a href="#" className="hover:text-primary transition-colors" aria-label="Instagram">
              <Instagram size={16} />
            </a>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-primary text-primary-foreground px-3 py-2 rounded">
              <span className="text-2xl md:text-3xl font-bold">रामपुर</span>
            </div>
            <span className="text-2xl md:text-3xl font-bold text-foreground">न्यूज़</span>
          </Link>

          {/* Desktop Search */}
          <div className="hidden lg:flex items-center gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="खबर खोजें..."
                className="w-64 pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 bg-background"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 hover:bg-muted rounded-lg"
              aria-label="Search"
            >
              <Search size={24} />
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 hover:bg-muted rounded-lg"
              aria-label="Menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        {isSearchOpen && (
          <div className="lg:hidden mt-4 animate-fade-in">
            <div className="relative">
              <input
                type="text"
                placeholder="खबर खोजें..."
                className="w-full pl-10 pr-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 bg-background"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="border-t border-border bg-card">
        <div className="container">
          {/* Desktop Navigation */}
          <ul className="hidden lg:flex items-center gap-1 overflow-x-auto py-1">
            <li>
              <Link
                to="/"
                className={`px-4 py-2 text-sm font-medium transition-colors hover:text-primary ${
                  isActive("/") ? "text-primary border-b-2 border-primary" : "text-foreground"
                }`}
              >
                होम
              </Link>
            </li>
            {mainNavItems.map((item) => (
              <li key={item.id}>
                <Link
                  to={item.path}
                  className={`px-4 py-2 text-sm font-medium transition-colors hover:text-primary whitespace-nowrap ${
                    isActive(item.path) ? "text-primary border-b-2 border-primary" : "text-foreground"
                  }`}
                >
                  {item.titleHindi}
                </Link>
              </li>
            ))}
            {/* More Categories Dropdown */}
            {moreNavItems.length > 0 && (
              <li className="relative group">
                <button className="px-4 py-2 text-sm font-medium text-foreground hover:text-primary flex items-center gap-1">
                  अन्य
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <ul className="absolute top-full left-0 bg-card shadow-lg rounded-lg py-2 min-w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 border border-border">
                  {moreNavItems.map((item) => (
                    <li key={item.id}>
                      <Link
                        to={item.path}
                        className="block px-4 py-2 text-sm hover:bg-muted hover:text-primary transition-colors"
                      >
                        {item.titleHindi}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
            )}
            {/* About Dropdown */}
            <li className="relative group">
              <button className="px-4 py-2 text-sm font-medium text-foreground hover:text-primary flex items-center gap-1">
                हमारे बारे में
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <ul className="absolute top-full right-0 bg-card shadow-lg rounded-lg py-2 min-w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 border border-border">
                <li>
                  <Link to="/about" className="block px-4 py-2 text-sm hover:bg-muted hover:text-primary transition-colors">
                    हमारे बारे में
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="block px-4 py-2 text-sm hover:bg-muted hover:text-primary transition-colors">
                    संपर्क करें
                  </Link>
                </li>
                <li>
                  <Link to="/editorial-policy" className="block px-4 py-2 text-sm hover:bg-muted hover:text-primary transition-colors">
                    संपादकीय नीति
                  </Link>
                </li>
                <li>
                  <Link to="/ownership" className="block px-4 py-2 text-sm hover:bg-muted hover:text-primary transition-colors">
                    स्वामित्व प्रकटीकरण
                  </Link>
                </li>
                <li>
                  <Link to="/grievance" className="block px-4 py-2 text-sm hover:bg-muted hover:text-primary transition-colors">
                    शिकायत निवारण
                  </Link>
                </li>
              </ul>
            </li>
          </ul>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="lg:hidden py-4 animate-fade-in">
              <ul className="space-y-1">
                <li>
                  <Link
                    to="/"
                    onClick={() => setIsMenuOpen(false)}
                    className={`block px-4 py-3 text-base font-medium rounded-lg transition-colors ${
                      isActive("/") ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                    }`}
                  >
                    होम
                  </Link>
                </li>
                {categories.map((item) => (
                  <li key={item.id}>
                    <Link
                      to={item.path}
                      onClick={() => setIsMenuOpen(false)}
                      className={`block px-4 py-3 text-base font-medium rounded-lg transition-colors ${
                        isActive(item.path) ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                      }`}
                    >
                      {item.titleHindi}
                    </Link>
                  </li>
                ))}
                {/* Mobile About Section */}
                <li className="pt-4 border-t border-border mt-4">
                  <span className="px-4 text-xs font-semibold text-muted-foreground uppercase">हमारे बारे में</span>
                </li>
                <li>
                  <Link
                    to="/about"
                    onClick={() => setIsMenuOpen(false)}
                    className={`block px-4 py-3 text-base font-medium rounded-lg transition-colors ${
                      isActive("/about") ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                    }`}
                  >
                    हमारे बारे में
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contact"
                    onClick={() => setIsMenuOpen(false)}
                    className={`block px-4 py-3 text-base font-medium rounded-lg transition-colors ${
                      isActive("/contact") ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                    }`}
                  >
                    संपर्क करें
                  </Link>
                </li>
                <li>
                  <Link
                    to="/editorial-policy"
                    onClick={() => setIsMenuOpen(false)}
                    className={`block px-4 py-3 text-base font-medium rounded-lg transition-colors ${
                      isActive("/editorial-policy") ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                    }`}
                  >
                    संपादकीय नीति
                  </Link>
                </li>
              </ul>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
