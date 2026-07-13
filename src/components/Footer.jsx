"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '../context/LanguageContext';

const Footer = ({ onCategorySelect }) => {
  const { t } = useLanguage();
  const pathname = usePathname();
  const isProfilePage = pathname === '/profile';

  const handleCategoryClick = (category) => {
    if (onCategorySelect) {
      onCategorySelect(category);
    }
  };

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-col-about">
            <h3>
              <i className="fa-solid fa-hand-holding-heart" style={{ color: 'var(--primary-color)', marginRight: '8px' }}></i> 
              {t('logoText')}
            </h3>
            <p>{t('footerAboutDesc')}</p>
            <div className="social-links">
              <a href="#" className="social-link" aria-label="Facebook"><i className="fa-brands fa-facebook-f"></i></a>
              <a href="#" className="social-link" aria-label="Twitter"><i className="fa-brands fa-twitter"></i></a>
              <a href="#" className="social-link" aria-label="Instagram"><i className="fa-brands fa-instagram"></i></a>
              <a href="#" className="social-link" aria-label="Youtube"><i className="fa-brands fa-youtube"></i></a>
            </div>
          </div>
          
          <div className="footer-col">
            <h4>{t('footerColQuickLinks')}</h4>
            <ul className="footer-links">
              {isProfilePage ? (
                <>
                  <li><Link href="/#home">{t('navHome')}</Link></li>
                  <li><Link href="/#clubs">{t('navClubs')}</Link></li>
                  <li><Link href="/#testimonials">{t('navStories')}</Link></li>
                  <li><Link href="/#faqs">{t('navFaqs')}</Link></li>
                  <li><Link href="/#join">{t('navJoin')}</Link></li>
                </>
              ) : (
                <>
                  <li><a href="#home">{t('navHome')}</a></li>
                  <li><a href="#clubs">{t('navClubs')}</a></li>
                  <li><a href="#testimonials">{t('navStories')}</a></li>
                  <li><a href="#faqs">{t('navFaqs')}</a></li>
                  <li><a href="#join">{t('navJoin')}</a></li>
                </>
              )}
            </ul>
          </div>

          <div className="footer-col">
            <h4>{t('footerColCategories')}</h4>
            <ul className="footer-links">
              <li>
                <a href="#clubs" onClick={() => handleCategoryClick('education')}>
                  {t('filterEducation')}
                </a>
              </li>
              <li>
                <a href="#clubs" onClick={() => handleCategoryClick('welfare')}>
                  {t('filterWelfare')}
                </a>
              </li>
              <li>
                <a href="#clubs" onClick={() => handleCategoryClick('environment')}>
                  {t('filterEnvironment')}
                </a>
              </li>
              <li>
                <a href="#clubs" onClick={() => handleCategoryClick('health')}>
                  {t('filterHealth')}
                </a>
              </li>
              <li>
                <a href="#clubs" onClick={() => handleCategoryClick('skills')}>
                  {t('filterSkills')}
                </a>
              </li>
            </ul>
          </div>

          <div className="footer-col-newsletter">
            <h4>{t('footerColNewsletter')}</h4>
            <p>{t('footerColNewsletterDesc')}</p>
            <form 
              className="newsletter-form" 
              onSubmit={(e) => {
                e.preventDefault();
                alert(t('language') === 'bn' ? 'ধন্যবাদ! সফলভাবে সাবস্ক্রাইব করা হয়েছে।' : 'Thank you for subscribing!');
                e.target.reset();
              }}
            >
              <input type="email" className="newsletter-input" placeholder={t('footerNewsletterPlaceholder')} required />
              <button type="submit" className="newsletter-btn" aria-label="Subscribe">
                <i className="fa-solid fa-paper-plane"></i>
              </button>
            </form>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>{t('footerCopyright')}</p>
          <p>
            {t('footerDevBy')} 
            <span style={{ fontFamily: 'var(--font-english)', fontWeight: '600', color: 'var(--primary-color)' }}>
              Antigravity AI
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
