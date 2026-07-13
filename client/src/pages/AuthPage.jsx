import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { STATIC_CLUBS_LIST } from '../translations/dictionary';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [clubId, setClubId] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [clubSearch, setClubSearch] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [showUserExistsModal, setShowUserExistsModal] = useState(false);
  
  // Public Clubs Explorer States
  const [clubs, setClubs] = useState([]);
  const [loadingClubs, setLoadingClubs] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedClub, setSelectedClub] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(false);

  const cardsPerPage = 9;

  const { login, register, user, API_URL } = useAuth();
  const { t, language, setLanguage } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  // Fetch all clubs (public)
  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const res = await fetch(`${API_URL}/clubs`);
        if (res.ok) {
          const data = await res.json();
          setClubs(data);
        }
      } catch (err) {
        console.error('Error fetching clubs in AuthPage:', err);
      } finally {
        setLoadingClubs(false);
      }
    };
    fetchClubs();
  }, [API_URL]);

  // Fetch posts for selected club (public)
  useEffect(() => {
    if (!selectedClub) {
      setPosts([]);
      return;
    }
    const fetchPosts = async () => {
      setLoadingPosts(true);
      try {
        const res = await fetch(`${API_URL}/clubs/${selectedClub.id}/posts`);
        if (res.ok) {
          const data = await res.json();
          setPosts(data);
        }
      } catch (err) {
        console.error('Error fetching posts:', err);
      } finally {
        setLoadingPosts(false);
      }
    };
    fetchPosts();
  }, [selectedClub, API_URL]);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      const from = location.state?.from?.pathname || "/";
      navigate(from, { replace: true });
    }
  }, [user, navigate, location]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      const dropdownEl = document.getElementById('club-dropdown-container');
      if (dropdownEl && !dropdownEl.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!email || !password || (!isLogin && (!name || !clubId))) {
      setErrorMsg(t('formValErrAll'));
      return;
    }

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(name, email, password, clubId);
        setSuccessMsg(t('profileSuccess'));
      }
    } catch (err) {
      if (err.message === 'User already exists') {
        setShowUserExistsModal(true);
      } else {
        setErrorMsg(err.message || 'Authentication failed. Please try again.');
      }
    }
  };

  const toggleTab = (loginTab) => {
    setIsLogin(loginTab);
    setErrorMsg('');
    setSuccessMsg('');
  };

  const toggleLanguage = () => {
    setLanguage(language === 'bn' ? 'en' : 'bn');
  };

  const getSelectedClubName = () => {
    if (!clubId) return t('authPlaceholderClub');
    const club = STATIC_CLUBS_LIST.find(c => c.id === parseInt(clubId, 10));
    return club ? club.name[language] : t('authPlaceholderClub');
  };

  const filteredClubs = STATIC_CLUBS_LIST.filter(club => 
    club.name[language].toLowerCase().includes(clubSearch.toLowerCase())
  );

  const filteredClubsList = clubs.filter(club => {
    const nameMatch = club.name[language]?.toLowerCase().includes(searchQuery.toLowerCase());
    const descMatch = club.shortDescription[language]?.toLowerCase().includes(searchQuery.toLowerCase());
    const locMatch = club.location[language]?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSearch = nameMatch || descMatch || locMatch;
    
    if (categoryFilter === 'all') return matchesSearch;
    return club.category === categoryFilter && matchesSearch;
  });

  const totalPages = Math.ceil(filteredClubsList.length / cardsPerPage);
  const paginatedClubs = filteredClubsList.slice(
    (currentPage - 1) * cardsPerPage,
    currentPage * cardsPerPage
  );

  const handlePageChange = (pageNum) => {
    setCurrentPage(pageNum);
    const gridEl = document.getElementById('public-clubs-section');
    if (gridEl) gridEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div style={{
      minHeight: '100vh',
      padding: '24px',
      position: 'relative',
      overflow: 'hidden',
      backgroundColor: 'var(--bg-secondary)',
      transition: 'background-color var(--transition-normal)'
    }}>
      {/* Decorative Glow Circles */}
      <div style={{
        position: 'absolute',
        top: '-10%',
        right: '-10%',
        width: '50vw',
        height: '50vw',
        background: 'radial-gradient(circle, var(--glow-color) 0%, transparent 70%)',
        pointerEvents: 'none',
        zIndex: 1
      }}></div>
      <div style={{
        position: 'absolute',
        bottom: '-20%',
        left: '-10%',
        width: '40vw',
        height: '40vw',
        background: 'radial-gradient(circle, rgba(217, 119, 6, 0.04) 0%, transparent 70%)',
        pointerEvents: 'none',
        zIndex: 1
      }}></div>

      {/* Floating Language & Theme Controls */}
      <div style={{
        position: 'absolute',
        top: '24px',
        right: '24px',
        display: 'flex',
        gap: '12px',
        zIndex: 10
      }}>
        <button 
          onClick={toggleLanguage}
          style={{
            padding: '10px 16px',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'var(--bg-primary)',
            border: '1px solid var(--border-color)',
            color: 'var(--text-primary)',
            fontWeight: '600',
            cursor: 'pointer',
            fontFamily: 'var(--font-english)',
            transition: 'all var(--transition-fast)'
          }}
        >
          {language === 'bn' ? 'English' : 'বাংলা'}
        </button>
        <button 
          onClick={() => {
            document.body.classList.toggle('dark-theme');
            const isDark = document.body.classList.contains('dark-theme');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
          }}
          style={{
            width: '44px',
            height: '44px',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'var(--bg-primary)',
            border: '1px solid var(--border-color)',
            color: 'var(--text-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all var(--transition-fast)'
          }}
          aria-label="Theme Toggle"
        >
          <i className="fa-solid fa-circle-half-stroke"></i>
        </button>
      </div>

      {/* Center Auth Card Section */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '85vh',
        padding: '60px 0',
        zIndex: 2,
        position: 'relative'
      }}>
        <div style={{
          width: '100%',
          maxWidth: '460px',
          backgroundColor: 'var(--glass-bg)',
          backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid var(--glass-border)',
        borderRadius: 'var(--radius-lg)',
        padding: '40px',
        boxShadow: 'var(--card-shadow)',
        position: 'relative',
        zIndex: 2,
        transition: 'background-color var(--transition-normal)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '60px',
            height: '60px',
            borderRadius: 'var(--radius-circle)',
            backgroundColor: 'var(--primary-color)',
            color: '#fff',
            fontSize: '1.8rem',
            marginBottom: '16px',
            boxShadow: '0 8px 20px rgba(15, 118, 110, 0.25)'
          }}>
            <i className="fa-solid fa-hand-holding-heart"></i>
          </div>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '8px' }}>{t('authWelcome')}</h2>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>{t('authSubtitle')}</p>
        </div>

        {/* Tab Selection */}
        <div style={{
          display: 'flex',
          backgroundColor: 'var(--bg-secondary)',
          padding: '6px',
          borderRadius: 'var(--radius-sm)',
          marginBottom: '28px',
          border: '1px solid var(--border-color)'
        }}>
          <button
            onClick={() => toggleTab(true)}
            style={{
              flex: 1,
              padding: '10px 0',
              borderRadius: 'var(--radius-sm)',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all var(--transition-fast)',
              backgroundColor: isLogin ? 'var(--primary-color)' : 'transparent',
              color: isLogin ? '#ffffff' : 'var(--text-secondary)'
            }}
          >
            {t('authTabLogin')}
          </button>
          <button
            onClick={() => toggleTab(false)}
            style={{
              flex: 1,
              padding: '10px 0',
              borderRadius: 'var(--radius-sm)',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all var(--transition-fast)',
              backgroundColor: !isLogin ? 'var(--primary-color)' : 'transparent',
              color: !isLogin ? '#ffffff' : 'var(--text-secondary)'
            }}
          >
            {t('authTabRegister')}
          </button>
        </div>

        {/* Messages */}
        {errorMsg && (
          <div style={{
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            color: '#ef4444',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            padding: '12px',
            borderRadius: 'var(--radius-sm)',
            marginBottom: '20px',
            textAlign: 'center',
            fontSize: '0.95rem'
          }}>
            <i className="fa-solid fa-triangle-exclamation" style={{ marginRight: '8px' }}></i>
            {errorMsg}
          </div>
        )}
        {successMsg && (
          <div style={{
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            color: '#10b981',
            border: '1px solid rgba(16, 185, 129, 0.2)',
            padding: '12px',
            borderRadius: 'var(--radius-sm)',
            marginBottom: '20px',
            textAlign: 'center',
            fontSize: '0.95rem'
          }}>
            <i className="fa-solid fa-circle-check" style={{ marginRight: '8px' }}></i>
            {successMsg}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  fontWeight: '600',
                  fontSize: '0.95rem',
                  marginBottom: '8px',
                  color: 'var(--text-primary)'
                }}>{t('authLabelName')}</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t('formPlaceholderName')}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'var(--bg-secondary)',
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-primary)',
                    fontSize: '0.95rem'
                  }}
                  required
                />
              </div>

              <div id="club-dropdown-container" style={{ marginBottom: '20px', position: 'relative' }}>
                <label style={{
                  display: 'block',
                  fontWeight: '600',
                  fontSize: '0.95rem',
                  marginBottom: '8px',
                  color: 'var(--text-primary)'
                }}>{t('authLabelClub')}</label>
                
                {/* Trigger Button */}
                <div 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'var(--bg-secondary)',
                    border: '1px solid var(--border-color)',
                    color: clubId ? 'var(--text-primary)' : 'var(--text-secondary)',
                    fontSize: '0.95rem',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    userSelect: 'none'
                  }}
                >
                  <span>{getSelectedClubName()}</span>
                  <i className={`fa-solid fa-chevron-${isDropdownOpen ? 'up' : 'down'}`} style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}></i>
                </div>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    marginTop: '4px',
                    backgroundColor: 'var(--bg-primary)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-sm)',
                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.4)',
                    zIndex: 999,
                    overflow: 'hidden'
                  }}>
                    {/* Search Input inside Dropdown */}
                    <div style={{ padding: '8px', borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-secondary)' }}>
                      <input
                        type="text"
                        value={clubSearch}
                        onChange={(e) => setClubSearch(e.target.value)}
                        placeholder={language === 'bn' ? 'ক্লাব খুঁজুন...' : 'Search club...'}
                        onClick={(e) => e.stopPropagation()} // Prevent closing dropdown when clicking inside input
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          borderRadius: '4px',
                          backgroundColor: 'var(--bg-primary)',
                          border: '1px solid var(--border-color)',
                          color: 'var(--text-primary)',
                          fontSize: '0.85rem'
                        }}
                      />
                    </div>
                    
                    {/* Options List */}
                    <div style={{ maxHeight: '180px', overflowY: 'auto' }}>
                      {filteredClubs.length > 0 ? (
                        filteredClubs.map(club => (
                          <div 
                            key={club.id}
                            onClick={() => {
                              setClubId(club.id);
                              setIsDropdownOpen(false);
                              setClubSearch('');
                            }}
                            className="dropdown-option"
                            style={{
                              padding: '10px 16px',
                              fontSize: '0.9rem',
                              color: 'var(--text-primary)',
                              cursor: 'pointer',
                              transition: 'background var(--transition-fast)',
                            }}
                          >
                            {club.name[language]}
                          </div>
                        ))
                      ) : (
                        <div style={{ padding: '12px 16px', fontSize: '0.85rem', color: 'var(--text-secondary)', textAlign: 'center' }}>
                          {language === 'bn' ? 'কোনো ক্লাব পাওয়া যায়নি' : 'No clubs found'}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              fontWeight: '600',
              fontSize: '0.95rem',
              marginBottom: '8px',
              color: 'var(--text-primary)'
            }}>{t('authLabelEmail')}</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@example.com"
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)',
                fontSize: '0.95rem'
              }}
              required
            />
          </div>

          <div style={{ marginBottom: '28px' }}>
            <label style={{
              display: 'block',
              fontWeight: '600',
              fontSize: '0.95rem',
              marginBottom: '8px',
              color: 'var(--text-primary)'
            }}>{t('authLabelPassword')}</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)',
                fontSize: '0.95rem'
              }}
              required
            />
          </div>

          <button
            type="submit"
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: 'var(--radius-sm)',
              background: 'linear-gradient(135deg, var(--primary-color), var(--primary-hover))',
              color: '#ffffff',
              fontSize: '1.05rem',
              fontWeight: '700',
              cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(15, 118, 110, 0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'all var(--transition-fast)'
            }}
          >
            {isLogin ? t('authBtnLogin') : t('authBtnRegister')}
            <i className="fa-solid fa-arrow-right"></i>
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.95rem' }}>
          {isLogin ? (
            <p style={{ color: 'var(--text-secondary)' }}>
              {t('promptRegister') || t('authPromptRegister')}{' '}
              <button 
                onClick={() => toggleTab(false)}
                style={{
                  color: 'var(--primary-color)',
                  fontWeight: '600',
                  cursor: 'pointer',
                  backgroundColor: 'transparent',
                  border: 'none'
                }}
              >
                {t('linkRegister') || t('authLinkRegister')}
              </button>
            </p>
          ) : (
            <p style={{ color: 'var(--text-secondary)' }}>
              {t('promptLogin') || t('authPromptLogin')}{' '}
              <button 
                onClick={() => toggleTab(true)}
                style={{
                  color: 'var(--primary-color)',
                  fontWeight: '600',
                  cursor: 'pointer',
                  backgroundColor: 'transparent',
                  border: 'none'
                }}
              >
                {t('linkLogin') || t('authLinkLogin')}
              </button>
            </p>
          )}
        </div>
      </div>
      </div>

      {/* User Already Exists Modal */}
      {showUserExistsModal && (
        <div className="modal-overlay active" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div className="modal-content" style={{
            maxWidth: '400px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--bg-glass)',
            backdropFilter: 'blur(20px)',
            border: '1px solid var(--border-color)',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.3)',
            padding: '30px',
            textAlign: 'center',
            animation: 'none'
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              backgroundColor: 'rgba(217, 119, 6, 0.1)',
              color: '#d97706',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem',
              marginBottom: '20px'
            }}>
              <i className="fa-solid fa-user-check"></i>
            </div>
            
            <h3 style={{ fontSize: '1.4rem', marginBottom: '12px', fontWeight: '700' }}>
              {language === 'bn' ? 'অ্যাকাউন্ট ইতিমধ্যেই রয়েছে!' : 'Account Already Exists!'}
            </h3>
            
            <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginBottom: '24px', lineHeight: 1.5 }}>
              {language === 'bn' 
                ? 'এই ইমেইল ঠিকানা দিয়ে ইতিপূর্বে একটি অ্যাকাউন্ট তৈরি করা হয়েছে। অনুগ্রহ করে লগইন করুন।' 
                : 'An account with this email address is already registered. Please log in instead.'}
            </p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button 
                onClick={() => {
                  setShowUserExistsModal(false);
                  toggleTab(true); // Switch to login tab
                }}
                className="btn btn-primary"
                style={{ width: '100%', padding: '12px' }}
              >
                {language === 'bn' ? 'লগইন করুন' : 'Log In Now'} <i className="fa-solid fa-right-to-bracket" style={{ marginLeft: '8px' }}></i>
              </button>
              
              <button 
                onClick={() => setShowUserExistsModal(false)}
                className="btn"
                style={{ 
                  width: '100%', 
                  padding: '12px', 
                  backgroundColor: 'var(--bg-secondary)', 
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border-color)' 
                }}
              >
                {language === 'bn' ? 'বন্ধ করুন' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthPage;
