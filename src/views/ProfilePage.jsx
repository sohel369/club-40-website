"use client";
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { STATIC_CLUBS_LIST } from '../translations/dictionary';

const ProfilePage = () => {
  const { user, updateProfile, logout } = useAuth();
  const { t, language, setLanguage } = useLanguage();
  
  const [name, setName] = useState(user?.name || '');
  const [prefLanguage, setPrefLanguage] = useState(user?.preferredLanguage || 'bn');
  const [alert, setAlert] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(false);

  const getClubName = () => {
    if (!user || !user.clubId) return '';
    const club = STATIC_CLUBS_LIST.find(c => c.id === user.clubId);
    return club ? club.name[language] : '';
  };

  const getClubImage = () => {
    if (!user || !user.clubId) return null;
    const club = STATIC_CLUBS_LIST.find(c => c.id === user.clubId);
    if (!club) return null;
    const isEducation = club.id <= 15 || (club.id >= 36 && club.id <= 40);
    return isEducation ? '/assets/education_cat.png' : '/assets/welfare_cat.png';
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setAlert({ text: '', type: '' });
    setLoading(true);

    if (!name.trim()) {
      setAlert({ text: t('formValErrAll'), type: 'error' });
      setLoading(false);
      return;
    }

    try {
      await updateProfile({
        name: name.trim(),
        preferredLanguage: prefLanguage
      });
      // Update local state context lang
      setLanguage(prefLanguage);
      setAlert({ text: t('profileSuccess'), type: 'success' });
    } catch (err) {
      setAlert({ text: t('profileErr') + ': ' + err.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    
    if (language === 'bn') {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return date.toLocaleDateString('bn-BD', options);
    } else {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return date.toLocaleDateString('en-US', options);
    }
  };

  return (
    <div>
      <Header />
      
      <main style={{
        minHeight: '80vh',
        paddingTop: '130px',
        paddingBottom: '80px',
        backgroundColor: 'var(--bg-secondary)',
        transition: 'background-color var(--transition-normal)'
      }}>
        <div className="container" style={{ maxWidth: '680px' }}>
          <div style={{
            backgroundColor: 'var(--glass-bg)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid var(--glass-border)',
            borderRadius: 'var(--radius-lg)',
            padding: '40px',
            boxShadow: 'var(--card-shadow)',
            transition: 'background-color var(--transition-normal)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '20px',
              borderBottom: '1px solid var(--border-color)',
              paddingBottom: '24px',
              marginBottom: '32px'
            }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: 'var(--radius-circle)',
                backgroundColor: 'var(--primary-color)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.8rem',
                boxShadow: '0 5px 15px rgba(15, 118, 110, 0.2)'
              }}>
                <i className="fa-solid fa-user-gear"></i>
              </div>
              <div>
                <h2 style={{ fontSize: '1.6rem', marginBottom: '4px' }}>{t('profileTitle')}</h2>
                <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
                  {t('profileCardHeader')}
                </p>
              </div>
            </div>

            {alert.text && (
              <div className={`form-message ${alert.type}`} style={{ display: 'block', marginBottom: '24px' }}>
                {alert.type === 'success' ? (
                  <i className="fa-solid fa-circle-check" style={{ marginRight: '8px' }}></i>
                ) : (
                  <i className="fa-solid fa-circle-exclamation" style={{ marginRight: '8px' }}></i>
                )}
                {alert.text}
              </div>
            )}

            <form onSubmit={handleSave}>
              <div className="form-group">
                <label className="form-label">{t('profileLabelName')}</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t('formPlaceholderName')}
                  required
                />
              </div>

              <div className="form-group" style={{ opacity: 0.85 }}>
                <label className="form-label">{t('profileLabelEmail')}</label>
                <input 
                  type="email" 
                  className="form-input" 
                  value={user?.email || ''} 
                  disabled 
                  style={{ cursor: 'not-allowed', backgroundColor: 'var(--bg-tertiary)' }}
                />
              </div>

              <div className="form-group" style={{ opacity: 0.85 }}>
                <label className="form-label">{t('profileLabelClub')}</label>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  {getClubImage() && (
                    <img 
                      src={getClubImage()} 
                      alt="Club Logo" 
                      style={{
                        width: '46px',
                        height: '46px',
                        borderRadius: 'var(--radius-sm)',
                        objectFit: 'cover',
                        border: '1px solid var(--border-color)',
                        backgroundColor: 'var(--bg-secondary)'
                      }} 
                    />
                  )}
                  <input 
                    type="text" 
                    className="form-input" 
                    value={getClubName()} 
                    disabled 
                    style={{ flex: 1, cursor: 'not-allowed', backgroundColor: 'var(--bg-tertiary)' }}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">{t('profileLabelLanguage')}</label>
                <div style={{
                  display: 'flex',
                  gap: '16px',
                  marginTop: '8px'
                }}>
                  <label style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    fontWeight: '600',
                    color: 'var(--text-primary)'
                  }}>
                    <input 
                      type="radio" 
                      name="preferredLanguage" 
                      value="bn"
                      checked={prefLanguage === 'bn'}
                      onChange={() => setPrefLanguage('bn')}
                      style={{
                        width: '18px',
                        height: '18px',
                        accentColor: 'var(--primary-color)'
                      }}
                    />
                    বাংলা (Bengali)
                  </label>
                  <label style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    fontWeight: '600',
                    color: 'var(--text-primary)'
                  }}>
                    <input 
                      type="radio" 
                      name="preferredLanguage" 
                      value="en"
                      checked={prefLanguage === 'en'}
                      onChange={() => setPrefLanguage('en')}
                      style={{
                        width: '18px',
                        height: '18px',
                        accentColor: 'var(--primary-color)'
                      }}
                    />
                    English
                  </label>
                </div>
              </div>

              {user?.createdAt && (
                <div className="form-group" style={{ 
                  marginTop: '24px', 
                  padding: '16px', 
                  backgroundColor: 'var(--bg-secondary)', 
                  border: '1px solid var(--border-color)', 
                  borderRadius: 'var(--radius-sm)' 
                }}>
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    <i className="fa-solid fa-clock-rotate-left" style={{ marginRight: '8px' }}></i>
                    {t('profileLabelCreated')}:{' '}
                    <strong style={{ color: 'var(--text-primary)' }}>{formatDate(user.createdAt)}</strong>
                  </span>
                </div>
              )}

              <div style={{ 
                display: 'flex', 
                gap: '16px', 
                marginTop: '40px', 
                borderTop: '1px solid var(--border-color)', 
                paddingTop: '24px' 
              }}>
                <button 
                  type="submit" 
                  className="btn btn-primary" 
                  disabled={loading}
                  style={{ flex: 2 }}
                >
                  {loading ? (
                    <i className="fa-solid fa-spinner fa-spin" style={{ marginRight: '8px' }}></i>
                  ) : (
                    <i className="fa-regular fa-floppy-disk" style={{ marginRight: '8px' }}></i>
                  )}
                  {t('profileBtnSave')}
                </button>
                <button 
                  type="button" 
                  onClick={logout} 
                  className="btn btn-secondary"
                  style={{ flex: 1, borderColor: '#ef4444', color: '#ef4444' }}
                >
                  <i className="fa-solid fa-power-off" style={{ marginRight: '8px' }}></i>
                  {t('navLogout')}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProfilePage;
