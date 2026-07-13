import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { API_URL } from '../context/AuthContext';

const FIELDS = [
  { value: 'teaching',  labelBn: 'শিক্ষক হিসেবে সহায়তা',       labelEn: 'Help as a Teacher',             icon: '📚' },
  { value: 'eco',       labelBn: 'ইকো ক্যাম্পেইন পরিচালনা',     labelEn: 'Lead Eco Campaigns',            icon: '🌱' },
  { value: 'disaster',  labelBn: 'দুর্যোগ ত্রাণ ও রক্তদান',     labelEn: 'Disaster Relief & Blood Donation', icon: '🩸' },
  { value: 'blood',     labelBn: 'রক্তদান ডেটাবেস',             labelEn: 'Blood Donation Database',       icon: '❤️' },
  { value: 'general',   labelBn: 'সাধারণ স্বেচ্ছাসেবক',          labelEn: 'General Volunteer',             icon: '🤝' },
];

const INITIATIVES = [
  {
    icon: '📚',
    titleBn: 'শিক্ষক হিসেবে সহায়তা করুন',
    titleEn: 'Help as a Teacher',
    descBn: 'সপ্তাহে ১–২ দিন বিনামূল্যে শিক্ষা সেশনে সুবিধাবঞ্চিত শিশুদের পড়ান।',
    descEn: 'Teach underprivileged kids 1–2 days a week in our free learning sessions.',
    color: '#0f766e',
  },
  {
    icon: '🌿',
    titleBn: 'ইকো ক্যাম্পেইন পরিচালনা করুন',
    titleEn: 'Lead Eco Campaigns',
    descBn: 'বৃক্ষরোপণ ও স্থানীয় ছাদ বাগান নির্মাণ প্রকল্পে কাজ করুন।',
    descEn: 'Work on tree plantation programs and support building local rooftop gardens.',
    color: '#16a34a',
  },
  {
    icon: '🩸',
    titleBn: 'দুর্যোগ ত্রাণ ও রক্তদান',
    titleEn: 'Disaster Relief & Blood Donation',
    descBn: 'জরুরি উদ্ধার তালিকা এবং রক্তদান ডেটাবেসে যোগ দিন।',
    descEn: 'Join our emergency rescue rosters and blood donation databases.',
    color: '#dc2626',
  },
];

const ApplicationPage = () => {
  const [lang, setLang] = useState(() => localStorage.getItem('language') || 'bn');
  const t = (bn, en) => (lang === 'bn' ? bn : en);

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    mobile: '',
    field: '',
    whyJoin: '',
  });
  const [status, setStatus] = useState({ type: '', message: '' }); // 'success' | 'error' | 'loading'
  const [showPopup, setShowPopup] = useState(false);  // congrats popup

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: 'loading', message: '' });

    try {
      const res = await fetch(`${API_URL}/applications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) {
        setStatus({ type: 'error', message: data.message || 'কিছু একটা ভুল হয়েছে।' });
      } else {
        // Reset form so user can submit again
        setForm({ fullName: '', email: '', mobile: '', field: '', whyJoin: '' });
        setStatus({ type: '', message: '' });
        // Show congrats popup for 4 seconds
        setShowPopup(true);
        setTimeout(() => setShowPopup(false), 4000);
      }
    } catch (err) {
      setStatus({ type: 'error', message: 'সার্ভারের সাথে যোগাযোগ করা যাচ্ছে না।' });
    }
  };

  return (
    <>
      <Header />
      <main className="page-main apply-page">

        {/* ── HERO ── */}
        <section className="apply-hero">
          <div className="apply-hero-glow apply-hero-glow-1" />
          <div className="apply-hero-glow apply-hero-glow-2" />
          <div className="container apply-hero-inner">
            <span className="apply-eyebrow">
              {t('স্বেচ্ছাসেবী হোন', 'Become a Volunteer')}
            </span>
            <h1 className="apply-hero-title">
              {t(
                <>আপনিই হতে পারেন <span>পরিবর্তনের</span> উদ্যোক্তা!</>,
                <>You can be the <span>catalyst</span> of change!</>
              )}
            </h1>
            <p className="apply-hero-subtitle">
              {t(
                'আপনার প্রতিভা ও সময় দিয়ে শিক্ষা ও কল্যাণ ছড়িয়ে দিন। আপনার ক্ষুদ্রতম ইচ্ছাও একটি অবহেলিত শিশুর জীবন বদলে দিতে পারে।',
                "Spend your talent and time to spread education and welfare. Your smallest wish can change a neglected child's life."
              )}
            </p>
            <div className="apply-hero-cta">
              <a href="#apply-form" className="btn btn-primary apply-scroll-btn">
                {t('আবেদন করুন', 'Apply Now')} ↓
              </a>
              <button
                className="apply-lang-toggle"
                onClick={() => {
                  const next = lang === 'bn' ? 'en' : 'bn';
                  setLang(next);
                  localStorage.setItem('language', next);
                }}
              >
                {lang === 'bn' ? 'EN' : 'বাং'}
              </button>
            </div>
          </div>
        </section>

        {/* ── INITIATIVES ── */}
        <section className="apply-initiatives section-padding">
          <div className="container">
            <div className="section-header">
              <h2>{t('আমাদের উদ্যোগ', 'Our Initiatives')}</h2>
              <p>{t('আপনার আগ্রহ ও দক্ষতা অনুযায়ী একটি ক্ষেত্র বেছে নিন।', 'Choose a field that matches your interest and skill.')}</p>
            </div>
            <div className="apply-initiatives-grid">
              {INITIATIVES.map((item, i) => (
                <div className="apply-initiative-card" key={i} style={{ '--card-accent': item.color }}>
                  <div className="apply-initiative-icon">{item.icon}</div>
                  <h3>{t(item.titleBn, item.titleEn)}</h3>
                  <p>{t(item.descBn, item.descEn)}</p>
                  <div className="apply-initiative-bar" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FORM ── */}
        <section className="apply-form-section section-padding" id="apply-form">
          <div className="container">
            <div className="section-header">
              <h2>{t('স্বেচ্ছাসেবী আবেদন', 'Volunteer Application')}</h2>
              <p>{t('নিচের ফর্মটি পূরণ করুন — আমরা আপনার সাথে যোগাযোগ করব।', 'Fill out the form below — we will get in touch with you.')}</p>
            </div>

            <div className="apply-form-wrapper">
                <form className="apply-form" onSubmit={handleSubmit} noValidate>

                  {/* Full Name */}
                  <div className="apply-form-group">
                    <label htmlFor="apply-fullName">
                      {t('পূর্ণ নাম', 'Your Full Name')}
                      <span className="apply-required">*</span>
                    </label>
                    <input
                      id="apply-fullName"
                      name="fullName"
                      type="text"
                      placeholder={t('যেমন: রাহেলা বেগম', 'e.g., John Doe')}
                      value={form.fullName}
                      onChange={handleChange}
                      required
                      className="apply-input"
                    />
                  </div>

                  {/* Email + Mobile row */}
                  <div className="apply-form-row">
                    <div className="apply-form-group">
                      <label htmlFor="apply-email">
                        {t('ইমেইল ঠিকানা', 'Email Address')}
                        <span className="apply-required">*</span>
                      </label>
                      <input
                        id="apply-email"
                        name="email"
                        type="email"
                        placeholder="name@example.com"
                        value={form.email}
                        onChange={handleChange}
                        required
                        className="apply-input"
                      />
                    </div>
                    <div className="apply-form-group">
                      <label htmlFor="apply-mobile">
                        {t('মোবাইল নম্বর', 'Mobile Number')}
                        <span className="apply-required">*</span>
                      </label>
                      <input
                        id="apply-mobile"
                        name="mobile"
                        type="tel"
                        placeholder="01XXXXXXXXX"
                        value={form.mobile}
                        onChange={handleChange}
                        required
                        className="apply-input"
                      />
                    </div>
                  </div>

                  {/* Field of Work */}
                  <div className="apply-form-group">
                    <label htmlFor="apply-field">
                      {t('কাজের পছন্দের ক্ষেত্র', 'Preferred Field of Work')}
                      <span className="apply-required">*</span>
                    </label>
                    <select
                      id="apply-field"
                      name="field"
                      value={form.field}
                      onChange={handleChange}
                      required
                      className="apply-input apply-select"
                    >
                      <option value="">{t('একটি ক্ষেত্র বেছে নিন...', 'Select a field...')}</option>
                      {FIELDS.map((f) => (
                        <option key={f.value} value={f.value}>
                          {f.icon} {t(f.labelBn, f.labelEn)}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Why Join */}
                  <div className="apply-form-group">
                    <label htmlFor="apply-whyJoin">
                      {t('কেন যোগ দিতে চান? (সংক্ষেপে)', 'Why do you want to join? (Briefly)')}
                      <span className="apply-required">*</span>
                    </label>
                    <textarea
                      id="apply-whyJoin"
                      name="whyJoin"
                      rows={4}
                      placeholder={t(
                        'আপনার আগ্রহ বা আগের অভিজ্ঞতা সম্পর্কে লিখুন...',
                        'Write about your interest or previous experience...'
                      )}
                      value={form.whyJoin}
                      onChange={handleChange}
                      required
                      className="apply-input apply-textarea"
                    />
                  </div>

                  {/* Error */}
                  {status.type === 'error' && (
                    <div className="apply-alert apply-alert-error">⚠️ {status.message}</div>
                  )}

                  {/* Admin note */}
                  <p className="apply-admin-note">
                    🔒 {t('এই আবেদন শুধুমাত্র অ্যাডমিন দেখতে পাবেন।', 'This application is only visible to the admin.')}
                  </p>

                  <button
                    id="apply-submit-btn"
                    type="submit"
                    className="btn btn-primary apply-submit-btn"
                    disabled={status.type === 'loading'}
                  >
                    {status.type === 'loading'
                      ? t('পাঠানো হচ্ছে...', 'Submitting...')
                      : t('আবেদন জমা দিন', 'Submit Application')}
                  </button>
                </form>
            </div>
          </div>
        </section>

      </main>
      <Footer />

      {/* ── Congratulations Popup ── */}
      {showPopup && (
        <div className="congrats-overlay" onClick={() => setShowPopup(false)}>
          <div className="congrats-popup" onClick={e => e.stopPropagation()}>
            {/* Confetti dots */}
            {[...Array(12)].map((_, i) => (
              <span key={i} className={`confetti-dot confetti-dot-${i + 1}`} />
            ))}

            <div className="congrats-icon-ring">
              <span className="congrats-icon">🎉</span>
            </div>

            <h2 className="congrats-title">
              {t('অভিনন্দন!', 'Congratulations!')}
            </h2>
            <p className="congrats-subtitle">
              {t(
                'আপনার আবেদন সফলভাবে জমা হয়েছে।\nআমরা শীঘ্রই যোগাযোগ করব!',
                'Your application was submitted successfully.\nWe will reach out to you soon!'
              )}
            </p>

            {/* Progress bar that depletes over 4s */}
            <div className="congrats-progress-track">
              <div className="congrats-progress-bar" />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ApplicationPage;
