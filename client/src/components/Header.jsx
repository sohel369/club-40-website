import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const ADMIN_EMAIL = 'sohel0130844@gmail.com';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user, logout, updateProfile, API_URL } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const pollRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Poll unread message count every 30s
  useEffect(() => {
    if (!user || !API_URL) return;
    const isAdmin = user.role === 'super_admin' && user.email === ADMIN_EMAIL;

    const fetchUnread = async () => {
      const token = localStorage.getItem('token');
      try {
        if (isAdmin) {
          // Admin: count conversations with unread messages
          const r = await fetch(`${API_URL}/messages/conversations`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (r.ok) {
            const convs = await r.json();
            setUnreadCount(convs.reduce((acc, c) => acc + (c.unread || 0), 0));
          }
        } else {
          const r = await fetch(`${API_URL}/messages/inbox`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (r.ok) {
            const d = await r.json();
            setUnreadCount(d.unread || 0);
          }
        }
      } catch (_) {}
    };

    fetchUnread();
    pollRef.current = setInterval(fetchUnread, 30000);
    return () => clearInterval(pollRef.current);
  }, [user, API_URL]);

  const handleLanguageToggle = async () => {
    const nextLang = language === 'bn' ? 'en' : 'bn';
    setLanguage(nextLang);
    
    // Persist to backend if user is authenticated
    if (user) {
      try {
        await updateProfile({ preferredLanguage: nextLang });
      } catch (err) {
        console.error('Failed to sync language preference to DB:', err);
      }
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isProfilePage = location.pathname === '/profile';

  return (
    <header className={`header ${scrolled ? 'scrolled' : ''}`}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'between', height: '80px' }}>
        <Link to="/" className="logo" style={{ textDecoration: 'none' }}>
          <i className="fa-solid fa-hand-holding-heart"></i>
          <span>{t('logoText')}</span>
          <span className="logo-dot"></span>
        </Link>

        <nav className={`nav-menu ${mobileMenuOpen ? 'active' : ''}`} style={{
          left: mobileMenuOpen ? '0' : '-100%'
        }}>
          {isProfilePage ? (
            <>
              <Link to="/#home" className="nav-link" onClick={() => setMobileMenuOpen(false)}>{t('navHome')}</Link>
            </>
          ) : (
            <>
              <a href="#home" className="nav-link active" onClick={() => setMobileMenuOpen(false)}>{t('navHome')}</a>
            </>
          )}
          {user && (
            <Link 
              to="/profile" 
              className={`nav-link ${isProfilePage ? 'active' : ''}`} 
              onClick={() => setMobileMenuOpen(false)}
              style={{
                borderLeft: '1px solid var(--border-color)',
                paddingLeft: '16px',
                color: 'var(--primary-color)',
                fontWeight: '600'
              }}
            >
              <i className="fa-regular fa-circle-user" style={{ marginRight: '6px' }}></i>
              {user.name}
            </Link>
          )}
          {user && user.role === 'super_admin' && (
            <Link 
              to="/admin" 
              className={`nav-link ${location.pathname === '/admin' ? 'active' : ''}`} 
              onClick={() => setMobileMenuOpen(false)}
              style={{
                color: 'var(--primary-color)',
                fontWeight: '600'
              }}
            >
              <i className="fa-solid fa-lock-open" style={{ marginRight: '6px' }}></i>
              {t('navAdmin')}
            </Link>
          )}
        </nav>

        <div className="nav-actions">
          {/* Language Toggle Button */}
          <button 
            className="theme-toggle" 
            onClick={handleLanguageToggle}
            style={{ fontWeight: '600', fontSize: '0.9rem', fontFamily: 'var(--font-english)' }}
            aria-label="Language Toggle"
          >
            {language === 'bn' ? 'EN' : 'বাং'}
          </button>

          {/* Theme Toggler */}
          <button 
            className="theme-toggle" 
            onClick={() => {
              document.body.classList.toggle('dark-theme');
              const isDark = document.body.classList.contains('dark-theme');
              localStorage.setItem('theme', isDark ? 'dark' : 'light');
            }} 
            aria-label="Theme Toggle"
          >
            <i className="fa-solid fa-circle-half-stroke"></i>
          </button>

          {/* Message Bell */}
          {user && (
            <Link
              to="/messages"
              className="theme-toggle"
              style={{ position: 'relative', color: unreadCount > 0 ? 'var(--primary-color)' : undefined, textDecoration: 'none' }}
              title={language === 'bn' ? 'বার্তা' : 'Messages'}
              onClick={() => setUnreadCount(0)}
            >
              <i className="fa-solid fa-comment-dots" />
              {unreadCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-4px', right: '-4px',
                  background: '#ef4444',
                  color: '#fff',
                  borderRadius: '50px',
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  minWidth: '16px',
                  height: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0 4px',
                  lineHeight: 1,
                }}>
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </Link>
          )}

          {/* Logout Button */}
          {user && (
            <button
              className="theme-toggle"
              onClick={handleLogout}
              title={t('navLogout')}
              style={{ color: '#ef4444' }}
            >
              <i className="fa-solid fa-right-from-bracket" />
            </button>
          )}

          {/* Mobile Menu Hamburger */}
          <button 
            className="menu-toggle" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Mobile Menu Toggle"
          >
            <span style={{ transform: mobileMenuOpen ? 'translateY(8px) rotate(45deg)' : '' }}></span>
            <span style={{ opacity: mobileMenuOpen ? 0 : 1 }}></span>
            <span style={{ transform: mobileMenuOpen ? 'translateY(-8px) rotate(-45deg)' : '' }}></span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
