"use client";
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { TESTIMONIALS_TRANSLATIONS, FAQS_TRANSLATIONS, STATIC_CLUBS_LIST } from '../translations/dictionary';

const Dashboard = () => {
  const { API_URL, user } = useAuth();
  const { t, language } = useLanguage();

  const getUserClubName = () => {
    if (!user || !user.clubId) return '';
    const club = STATIC_CLUBS_LIST.find(c => c.id === user.clubId);
    return club ? club.name[language] : '';
  };

  // State Management
  const [clubs, setClubs] = useState([]);
  const [loadingClubs, setLoadingClubs] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [activeFaq, setActiveFaq] = useState(null);
  const [selectedClub, setSelectedClub] = useState(null);
  
  // Posts State Management
  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');
  const [postAlert, setPostAlert] = useState({ text: '', type: '' });
  
  // Testimonials Slider state
  const [currentSlide, setCurrentSlide] = useState(0);
  const sliderTimer = useRef(null);

  // Form State
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formCategory, setFormCategory] = useState('');
  const [formMsgText, setFormMsgText] = useState('');
  const [formAlert, setFormAlert] = useState({ text: '', type: '' });

  const cardsPerPage = 8;

  // 1. Fetch Clubs on mount
  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const res = await fetch(`${API_URL}/clubs`);
        if (res.ok) {
          const data = await res.json();
          setClubs(data);
        } else {
          const errText = await res.text();
          console.error('Clubs fetch failed:', res.status, errText);
        }
      } catch (err) {
        console.error('Error fetching clubs:', err);
      } finally {
        setLoadingClubs(false);
      }
    };
    fetchClubs();
  }, [API_URL]);

  // Fetch posts for the selected club
  useEffect(() => {
    if (!selectedClub) {
      setPosts([]);
      return;
    }

    const fetchPosts = async () => {
      setLoadingPosts(true);
      const token = localStorage.getItem('token');
      try {
        const res = await fetch(`${API_URL}/clubs/${selectedClub.id}/posts`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
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

    // Reset post form states
    setPostTitle('');
    setPostContent('');
    setPostAlert({ text: '', type: '' });

    fetchPosts();
  }, [selectedClub, API_URL]);

  // Handle post submission
  const handlePostSubmit = async (e) => {
    e.preventDefault();
    setPostAlert({ text: '', type: '' });

    if (!postTitle.trim() || !postContent.trim()) {
      setPostAlert({ text: t('formValErrAll'), type: 'error' });
      return;
    }

    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/clubs/${selectedClub.id}/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title: postTitle.trim(), content: postContent.trim() })
      });

      const data = await res.json();

      if (res.ok) {
        setPosts(prev => [data, ...prev]);
        setPostTitle('');
        setPostContent('');
        setPostAlert({ text: t('postSuccessMsg'), type: 'success' });
      } else {
        setPostAlert({ text: data.message || 'Failed to submit post', type: 'error' });
      }
    } catch (err) {
      console.error('Error submitting post:', err);
      setPostAlert({ text: 'Server error. Please try again.', type: 'error' });
    }
  };

  // 2. Carousel Auto Play Logic
  const startSlider = () => {
    sliderTimer.current = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % TESTIMONIALS_TRANSLATIONS[language].length);
    }, 5000);
  };

  const stopSlider = () => {
    if (sliderTimer.current) clearInterval(sliderTimer.current);
  };

  useEffect(() => {
    startSlider();
    return () => stopSlider();
  }, [language]);

  // Reset slider on manual click
  const handleSlideChange = (index) => {
    stopSlider();
    setCurrentSlide(index);
    startSlider();
  };

  // 3. Search and Filtering Logic
  const filteredClubs = clubs.filter(club => {
    const nameMatch = club.name[language]?.toLowerCase().includes(searchQuery.toLowerCase()) || false;
    const descMatch = club.shortDescription[language]?.toLowerCase().includes(searchQuery.toLowerCase()) || false;
    const locMatch = club.location[language]?.toLowerCase().includes(searchQuery.toLowerCase()) || false;
    const catMatch = club.categoryName[language]?.toLowerCase().includes(searchQuery.toLowerCase()) || false;
    const searchMatch = searchQuery === '' || nameMatch || descMatch || locMatch || catMatch;

    const categoryMatch = categoryFilter === 'all' || club.category === categoryFilter;

    return searchMatch && categoryMatch;
  });

  // Paginated clubs
  const totalPages = Math.ceil(filteredClubs.length / cardsPerPage);
  const paginatedClubs = filteredClubs.slice(
    (currentPage - 1) * cardsPerPage,
    currentPage * cardsPerPage
  );

  const handlePageChange = (pageNum) => {
    setCurrentPage(pageNum);
    const gridEl = document.getElementById('clubs');
    if (gridEl) gridEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Trigger from footer category click
  const handleCategorySelect = (category) => {
    setCategoryFilter(category);
    setCurrentPage(1);
  };

  // 4. Form Submission
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormAlert({ text: '', type: '' });

    if (!formName || !formEmail || !formPhone || !formCategory || !formMsgText) {
      setFormAlert({ text: t('formValErrAll'), type: 'error' });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formEmail)) {
      setFormAlert({ text: t('formValErrEmail'), type: 'error' });
      return;
    }

    const bdPhoneRegex = /^01[3-9]\d{8}$/;
    if (!bdPhoneRegex.test(formPhone)) {
      setFormAlert({ text: t('formValErrPhone'), type: 'error' });
      return;
    }

    try {
      const res = await fetch(`${API_URL}/applications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: formName,
          email: formEmail,
          mobile: formPhone,
          field: formCategory,
          whyJoin: formMsgText
        }),
      });

      if (!res.ok) {
        setFormAlert({ text: language === 'bn' ? 'সার্ভার সমস্যা, পরে চেষ্টা করুন।' : 'Server error, try again.', type: 'error' });
        return;
      }

      setFormAlert({ text: t('formSuccess'), type: 'success' });
      setFormName('');
      setFormEmail('');
      setFormPhone('');
      setFormCategory('');
      setFormMsgText('');
    } catch (err) {
      setFormAlert({ text: language === 'bn' ? 'নেটওয়ার্ক সমস্যা।' : 'Network error.', type: 'error' });
    }
  };

  return (
    <div>
      {/* HEADER */}
      <Header />

      {/* HERO SECTION */}
      <section className="hero" id="home">
        <div className="hero-bg-glow"></div>
        <div className="hero-bg-glow-2"></div>
        <div className="container">
          <div className="hero-content">
            {user && (
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                borderRadius: '30px',
                backgroundColor: 'var(--border-color)',
                fontSize: '0.9rem',
                fontWeight: '600',
                color: 'var(--primary-color)',
                marginBottom: '16px',
                width: 'fit-content'
              }}>
                <i className="fa-solid fa-circle-user"></i>
                {language === 'bn' ? `স্বাগতম, ${user.name} | সদস্য: ${getUserClubName()}` : `Welcome, ${user.name} | Member of ${getUserClubName()}`}
              </div>
            )}
            <span className="hero-subtitle">{t('heroSubtitle')}</span>
            <h1>
              {t('heroTitlePart1')}
              <span>{t('heroTitleHighlight')}</span>
              {t('heroTitlePart2')}
            </h1>
            <p className="hero-description">{t('heroDescription')}</p>
            <div className="hero-buttons">
              <a href="#clubs" className="btn btn-primary">{t('heroCtaClubs')} <i className="fa-solid fa-arrow-right"></i></a>
              <a href="#join" className="btn btn-secondary">{t('heroCtaJoin')} <i className="fa-solid fa-users"></i></a>
            </div>
            <div className="hero-stats">
              <div className="stat-item">
                <span className="stat-number">{t('statClubs')}</span>
                <span className="stat-label">{t('statClubsLabel')}</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{t('statImpact')}</span>
                <span className="stat-label">{t('statImpactLabel')}</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{t('statVolunteers')}</span>
                <span className="stat-label">{t('statVolunteersLabel')}</span>
              </div>
            </div>
          </div>
          
          <div className="hero-image-wrapper">
            <div className="hero-image-card">
              <img src="/assets/hero_bg.png" alt="Community Social Service and Education" />
            </div>
            <div className="hero-badge-float">
              <div className="hero-badge-icon">
                <i className="fa-solid fa-book-open"></i>
              </div>
              <div className="hero-badge-text">
                <h4>{t('heroBadgeTitle')}</h4>
                <p>{t('heroBadgeDesc')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CLUBS SECTION */}
      <section className="clubs-section section-padding" id="clubs">
        <div className="container">
          <div className="section-header">
            <h2>{t('navClubs')}</h2>
            <p>{language === 'bn' ? 'নিচের ক্যাটাগরি ফিল্টার এবং সার্চ বার ব্যবহার করে আপনার পছন্দের ক্লাব ও তাদের কার্যক্রম সম্পর্কে জানুন।' : 'Use the filters and search bar below to find your preferred clubs and read about their campaigns.'}</p>
          </div>

          {/* Search & Filters */}
          <div className="clubs-controls">
            <div className="search-bar-wrapper">
              <i className="fa-solid fa-magnifying-glass search-icon"></i>
              <input 
                type="text" 
                className="search-input" 
                placeholder={t('searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
            
            <div className="filter-tabs">
              {[
                { key: 'all', label: t('filterAll'), icon: null },
                { key: 'education', label: t('filterEducation'), icon: 'fa-graduation-cap' },
                { key: 'welfare', label: t('filterWelfare'), icon: 'fa-hands-holding-child' },
                { key: 'environment', label: t('filterEnvironment'), icon: 'fa-leaf' },
                { key: 'health', label: t('filterHealth'), icon: 'fa-house-medical' },
                { key: 'skills', label: t('filterSkills'), icon: 'fa-gear' }
              ].map(tab => (
                <button 
                  key={tab.key}
                  className={`filter-tab ${categoryFilter === tab.key ? 'active' : ''}`}
                  onClick={() => handleCategorySelect(tab.key)}
                >
                  {tab.icon && <i className={`fa-solid ${tab.icon}`} style={{ marginRight: '6px' }}></i>}
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Clubs Grid */}
          {loadingClubs ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--primary-color)' }}>
              <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: '3rem', marginBottom: '16px' }}></i>
              <h3>লোড করা হচ্ছে...</h3>
            </div>
          ) : (
            <>
              <div className="clubs-grid">
                {paginatedClubs.length > 0 ? (
                  paginatedClubs.map((club, idx) => (
                    <div key={club.id} className="club-card" style={{ animationDelay: `${idx * 0.04}s` }}>
                      <div className="club-image-wrapper">
                        <span className="club-badge">{club.categoryName[language]}</span>
                        <img 
                          src={club.image} 
                          alt={club.name[language]} 
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/' + club.fallbackImage;
                          }}
                        />
                      </div>
                      <div className="club-info">
                        <h3 className="club-title">{club.name[language]}</h3>
                        <p className="club-desc">{club.shortDescription[language]}</p>
                        <div className="club-meta">
                          <div className="meta-item">
                            <span className="meta-label">{t('lblEstablished')}</span>
                            <span className="meta-value">{club.established[language]}</span>
                          </div>
                          <div className="meta-item">
                            <span className="meta-label">{t('lblLocation')}</span>
                            <span className="meta-value">{club.location[language].split(',')[0]}</span>
                          </div>
                        </div>
                        <Link href={`/clubs/${club.id}`} className="club-btn" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                          {t('btnDetails')} <i className="fa-solid fa-arrow-up-right-from-square"></i>
                        </Link>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="no-results" style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px' }}>
                    <i className="fa-solid fa-folder-open" style={{ fontSize: '3rem', marginBottom: '16px', color: 'var(--border-color)' }}></i>
                    <h3>{t('noClubsFound')}</h3>
                    <p style={{ marginTop: '8px' }}>{t('noClubsFoundDesc')}</p>
                  </div>
                )}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="clubs-pagination">
                  <div className="pagination-controls">
                    <button 
                      className="pagination-btn" 
                      disabled={currentPage === 1}
                      onClick={() => handlePageChange(currentPage - 1)}
                    >
                      <i className="fa-solid fa-chevron-left"></i>
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(num => (
                      <button 
                        key={num}
                        className={`pagination-btn ${currentPage === num ? 'active' : ''}`}
                        onClick={() => handlePageChange(num)}
                      >
                        {num}
                      </button>
                    ))}
                    <button 
                      className="pagination-btn" 
                      disabled={currentPage === totalPages}
                      onClick={() => handlePageChange(currentPage + 1)}
                    >
                      <i className="fa-solid fa-chevron-right"></i>
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* DETAIL MODAL */}
      {selectedClub && (
        <div className="modal-overlay active" onClick={(e) => e.target.classList.contains('modal-overlay') && setSelectedClub(null)}>
          <div className="modal-content">
            <button className="modal-close" onClick={() => setSelectedClub(null)} aria-label="Close Modal">
              <i className="fa-solid fa-xmark"></i>
            </button>
            <div className="modal-hero">
              <img 
                src={selectedClub.image} 
                alt={selectedClub.name[language]} 
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/' + selectedClub.fallbackImage;
                }}
              />
              <div className="modal-hero-overlay"></div>
              <div className="modal-badge">{selectedClub.categoryName[language]}</div>
            </div>
            <div className="modal-body">
              <h3 className="modal-title">{selectedClub.name[language]}</h3>
              
              <div className="modal-grid-meta">
                <div className="modal-meta-item">
                  <span className="modal-meta-label"><i className="fa-regular fa-calendar-check"></i> {t('lblEstablished')}</span>
                  <span className="modal-meta-value">{selectedClub.established[language]}</span>
                </div>
                <div className="modal-meta-item">
                  <span className="modal-meta-label"><i className="fa-solid fa-people-group"></i> {t('lblMembers')}</span>
                  <span className="modal-meta-value">{selectedClub.members[language]}</span>
                </div>
                <div className="modal-meta-item">
                  <span className="modal-meta-label"><i className="fa-solid fa-chart-line"></i> {t('lblImpact')}</span>
                  <span className="modal-meta-value">{selectedClub.impact[language]}</span>
                </div>
              </div>

              <h4 className="modal-desc-title">{t('modalDescriptionTitle')}</h4>
              <p className="modal-full-desc">{selectedClub.longDescription[language]}</p>

              <div className="modal-contact-box">
                <h4 className="modal-contact-title">{t('modalContactTitle')}</h4>
                <div className="modal-contact-grid">
                  <div className="modal-contact-item">
                    <div className="modal-contact-icon"><i class="fa-solid fa-location-dot"></i></div>
                    <div className="modal-contact-info">
                      <span className="modal-contact-label">{t('lblLocation')}</span>
                      <span className="modal-contact-value">{selectedClub.location[language]}</span>
                    </div>
                  </div>
                  <div className="modal-contact-item">
                    <div className="modal-contact-icon"><i class="fa-solid fa-envelope"></i></div>
                    <div className="modal-contact-info">
                      <span className="modal-contact-label">{t('lblEmail')}</span>
                      <a href={`mailto:${selectedClub.email}`} className="modal-contact-value">{selectedClub.email}</a>
                    </div>
                  </div>
                  <div className="modal-contact-item">
                    <div className="modal-contact-icon"><i class="fa-solid fa-phone"></i></div>
                    <div className="modal-contact-info">
                      <span className="modal-contact-label">{t('lblPhone')}</span>
                      <a href={`tel:${selectedClub.phone[language]}`} className="modal-contact-value">{selectedClub.phone[language]}</a>
                    </div>
                  </div>
                </div>
              </div>

              {/* POSTS AND UPDATES SECTION */}
              <hr style={{ margin: '32px 0', borderColor: 'var(--border-color)', opacity: 0.5 }} />
              
              <h4 className="modal-desc-title" style={{ marginBottom: '20px' }}>{t('lblPostsSectionTitle')}</h4>
              
              {loadingPosts ? (
                <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--primary-color)' }}>
                  <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: '2rem', marginBottom: '12px' }}></i>
                  <p>{language === 'bn' ? 'আপডেট লোড হচ্ছে...' : 'Loading updates...'}</p>
                </div>
              ) : (
                <div>
                  {/* Posts List Feed */}
                  <div style={{ maxHHeight: '300px', overflowY: 'auto', paddingRight: '4px' }}>
                    {posts.length > 0 ? (
                      posts.map(post => (
                        <div key={post.id || post._id} style={{
                          backgroundColor: 'var(--bg-secondary)',
                          border: '1px solid var(--border-color)',
                          borderRadius: 'var(--radius-sm)',
                          padding: '20px',
                          marginBottom: '16px'
                        }}>
                          <h5 style={{ fontSize: '1.15rem', marginBottom: '8px', color: 'var(--primary-color)' }}>{post.title}</h5>
                          <p style={{ fontSize: '0.95rem', color: 'var(--text-primary)', marginBottom: '12px', whiteSpace: 'pre-line' }}>{post.content}</p>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-secondary)', flexWrap: 'wrap', gap: '8px' }}>
                            <span><i className="fa-regular fa-user" style={{ marginRight: '6px' }}></i> {t('lblPostAuthor')}: {post.authorName}</span>
                            <span><i className="fa-regular fa-clock" style={{ marginRight: '6px' }}></i> {t('lblPostDate')}: {new Date(post.createdAt).toLocaleDateString(language === 'bn' ? 'bn-BD' : 'en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '20px 0', fontStyle: 'italic' }}>
                        {t('lblNoPosts')}
                      </p>
                    )}
                  </div>

                  {/* Restricted Creation Form for Club Members */}
                  {user && user.clubId === selectedClub.id && (
                    <div style={{
                      marginTop: '32px',
                      padding: '24px',
                      backgroundColor: 'var(--bg-secondary)',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-md)'
                    }}>
                      <h5 style={{ fontSize: '1.2rem', marginBottom: '16px' }}>
                        <i className="fa-regular fa-pen-to-square" style={{ color: 'var(--primary-color)', marginRight: '8px' }}></i> 
                        {t('lblCreatePostTitle')}
                      </h5>
                      <form onSubmit={handlePostSubmit}>
                        {postAlert.text && (
                          <div className={`form-message ${postAlert.type}`} style={{ display: 'block', marginBottom: '16px' }}>
                            {postAlert.text}
                          </div>
                        )}
                        <div className="form-group">
                          <label className="form-label">{t('lblPostTitleInput')}</label>
                          <input 
                            type="text" 
                            className="form-input" 
                            value={postTitle}
                            onChange={(e) => setPostTitle(e.target.value)}
                            required 
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label">{t('lblPostContentInput')}</label>
                          <textarea 
                            className="form-textarea" 
                            value={postContent}
                            onChange={(e) => setPostContent(e.target.value)}
                            style={{ height: '80px' }}
                            required
                          ></textarea>
                        </div>
                        <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                          {t('lblPostSubmitBtn')} <i className="fa-solid fa-paper-plane" style={{ marginLeft: '8px' }}></i>
                        </button>
                      </form>
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>
        </div>
      )}

      {/* TESTIMONIALS SECTION */}
      <section className="testimonials-section section-padding" id="testimonials">
        <div className="container">
          <div className="section-header">
            <h2>{t('testimonialTitle')}</h2>
            <p>{t('testimonialSubtitle')}</p>
          </div>

          <div className="carousel-container" onMouseEnter={stopSlider} onMouseLeave={startSlider}>
            <div className="carousel-track-wrapper">
              <div 
                className="carousel-track" 
                style={{ 
                  transform: `translateX(-${currentSlide * 100}%)`,
                  display: 'flex',
                  transition: 'transform var(--transition-slow)'
                }}
              >
                {TESTIMONIALS_TRANSLATIONS[language].map(testimonial => (
                  <div key={testimonial.id} className="carousel-slide">
                    <div className="testimonial-card">
                      <p className="testimonial-quote">"{testimonial.quote}"</p>
                      <div className="testimonial-author">
                        <div className="testimonial-avatar">
                          <img 
                            src={
                              testimonial.id === 1 ? "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&h=150&q=80" :
                              testimonial.id === 2 ? "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&h=150&q=80" :
                              testimonial.id === 3 ? "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=150&h=150&q=80" :
                              "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80"
                            } 
                            alt={testimonial.name} 
                          />
                        </div>
                        <h4 className="testimonial-name">{testimonial.name}</h4>
                        <span className="testimonial-role">{testimonial.role}</span>
                        <span className="testimonial-club-tag"><i className="fa-solid fa-hands-holding-heart"></i> {testimonial.club}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <button 
              className="carousel-btn carousel-btn-prev" 
              onClick={() => handleSlideChange((currentSlide - 1 + TESTIMONIALS_TRANSLATIONS[language].length) % TESTIMONIALS_TRANSLATIONS[language].length)}
              aria-label="Previous Slide"
            >
              <i className="fa-solid fa-chevron-left"></i>
            </button>
            <button 
              className="carousel-btn carousel-btn-next" 
              onClick={() => handleSlideChange((currentSlide + 1) % TESTIMONIALS_TRANSLATIONS[language].length)}
              aria-label="Next Slide"
            >
              <i className="fa-solid fa-chevron-right"></i>
            </button>

            <div className="carousel-dots">
              {TESTIMONIALS_TRANSLATIONS[language].map((_, idx) => (
                <div 
                  key={idx} 
                  className={`carousel-dot ${currentSlide === idx ? 'active' : ''}`}
                  onClick={() => handleSlideChange(idx)}
                ></div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQS SECTION */}
      <section className="faqs-section section-padding" id="faqs">
        <div className="container">
          <div className="section-header">
            <h2>{t('faqTitle')}</h2>
            <p>{t('faqSubtitle')}</p>
          </div>

          <div className="faqs-container">
            {FAQS_TRANSLATIONS[language].map((faq, idx) => (
              <div key={faq.id} className={`faq-item ${activeFaq === idx ? 'active' : ''}`}>
                <button 
                  className="faq-question-btn" 
                  aria-expanded={activeFaq === idx}
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                >
                  <h3 className="faq-question">{faq.question}</h3>
                  <span className="faq-icon-wrapper"><i className="fa-solid fa-chevron-down"></i></span>
                </button>
                <div className="faq-answer-wrapper" style={{ maxHeight: activeFaq === idx ? '300px' : '0px' }}>
                  <p className="faq-answer">{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VOLUNTEER FORM SECTION */}
      <section className="join-section section-padding" id="join">
        <div className="container">
          <div className="join-grid">
            <div className="join-content">
              <h2>{t('formTitle')}</h2>
              <p>{t('formSubtitle')}</p>
              
              <div className="join-list">
                <div className="join-list-item">
                  <div className="join-list-icon"><i className="fa-solid fa-graduation-cap"></i></div>
                  <div className="join-list-text">
                    <h4>{language === 'bn' ? 'শিক্ষক হিসেবে ভূমিকা রাখুন' : 'Help as a Teacher'}</h4>
                    <p>{language === 'bn' ? 'আমাদের ফ্রি স্কুলগুলোতে সুবিধাবটিউট শিশুদের সপ্তাহে ১-২ দিন পড়াতে পারেন।' : 'Teach underprivileged kids 1-2 days a week in our free learning sessions.'}</p>
                  </div>
                </div>
                <div className="join-list-item">
                  <div className="join-list-icon"><i className="fa-solid fa-leaf"></i></div>
                  <div className="join-list-text">
                    <h4>{language === 'bn' ? 'পরিবেশ রক্ষায় নেতৃত্ব দিন' : 'Lead Eco Campaigns'}</h4>
                    <p>{language === 'bn' ? 'সবুজায়ন অভিযান এবং ছাদ বাগান কর্মসূচিতে স্বেচ্ছাসেবক হিসেবে মাঠপর্যায়ে কাজ করুন।' : 'Work on tree plantation programs and support building local rooftop gardens.'}</p>
                  </div>
                </div>
                <div className="join-list-item">
                  <div className="join-list-icon"><i className="fa-solid fa-heart"></i></div>
                  <div className="join-list-text">
                    <h4>{language === 'bn' ? 'জরুরি দুর্যোগ সহায়তা ও রক্তদান' : 'Disaster Relief & Blood Donation'}</h4>
                    <p>{language === 'bn' ? 'যেকোনো জরুরি উদ্ধার অভিযান এবং জরুরি রক্তের চাহিদা মেটাতে আমাদের সাথে যুক্ত থাকুন।' : 'Join our emergency rescue rosters and blood donation databases.'}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="join-form-card">
              <h3>{t('formTitle')}</h3>
              <form onSubmit={handleFormSubmit}>
                {formAlert.text && (
                  <div className={`form-message ${formAlert.type}`} style={{ display: 'block', marginBottom: '20px' }}>
                    {formAlert.text}
                  </div>
                )}
                
                <div className="form-group">
                  <label className="form-label">{t('formLabelName')}</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder={t('formPlaceholderName')}
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">{t('formLabelEmail')}</label>
                  <input 
                    type="email" 
                    className="form-input" 
                    placeholder={t('formPlaceholderEmail')}
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">{t('formLabelPhone')}</label>
                  <input 
                    type="tel" 
                    className="form-input" 
                    placeholder={t('formPlaceholderPhone')}
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">{t('formLabelCategory')}</label>
                  <select 
                    className="form-select"
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                  >
                    <option value="" disabled>{t('formSelectDefault')}</option>
                    <option value="teaching">{language === 'bn' ? '📚 শিক্ষক হিসেবে সহায়তা' : '📚 Help as a Teacher'}</option>
                    <option value="eco">{language === 'bn' ? '🌱 ইকো ক্যাম্পেইন পরিচালনা' : '🌱 Lead Eco Campaigns'}</option>
                    <option value="disaster">{language === 'bn' ? '🩸 দুর্যোগ ত্রাণ ও রক্তদান' : '🩸 Disaster Relief & Blood Donation'}</option>
                    <option value="blood">{language === 'bn' ? '❤️ রক্তদান ডেটাবেস' : '❤️ Blood Donation Database'}</option>
                    <option value="general">{language === 'bn' ? '🤝 সাধারণ স্বেচ্ছাসেবক' : '🤝 General Volunteer'}</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">{t('formLabelMessage')}</label>
                  <textarea 
                    className="form-textarea" 
                    placeholder={t('formPlaceholderMessage')}
                    value={formMsgText}
                    onChange={(e) => setFormMsgText(e.target.value)}
                  ></textarea>
                </div>
                <button type="submit" className="btn btn-primary form-submit-btn">
                  {t('formBtnSubmit')} <i className="fa-regular fa-paper-plane"></i>
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <Footer onCategorySelect={handleCategorySelect} />
    </div>
  );
};

export default Dashboard;
