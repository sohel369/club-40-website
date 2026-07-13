import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { STATIC_CLUBS_LIST } from '../translations/dictionary';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { API_URL, user } = useAuth();
  const { t, language } = useLanguage();

  const [activeTab, setActiveTab] = useState('users'); // 'users', 'clubs', or 'applications'

  // Applications tab states
  const [applications, setApplications] = useState([]);
  const [loadingApps, setLoadingApps] = useState(false);
  const [appAlert, setAppAlert] = useState({ text: '', type: '' });

  // Users tab states
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [userAlert, setUserAlert] = useState({ text: '', type: '' });

  // Add User modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [addName, setAddName] = useState('');
  const [addEmail, setAddEmail] = useState('');
  const [addPassword, setAddPassword] = useState('');
  const [addClubId, setAddClubId] = useState('');
  const [addRole, setAddRole] = useState('member');
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState('');

  // Clubs tab states
  const [clubs, setClubs] = useState([]);
  const [loadingClubs, setLoadingClubs] = useState(true);
  const [editingClub, setEditingClub] = useState(null);
  const [clubAlert, setClubAlert] = useState({ text: '', type: '' });

  // Edit club form state
  const [editNameEn, setEditNameEn] = useState('');
  const [editNameBn, setEditNameBn] = useState('');
  const [editLocationEn, setEditLocationEn] = useState('');
  const [editLocationBn, setEditLocationBn] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editShortDescEn, setEditShortDescEn] = useState('');
  const [editShortDescBn, setEditShortDescBn] = useState('');
  const [editLongDescEn, setEditLongDescEn] = useState('');
  const [editLongDescBn, setEditLongDescBn] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPhoneBn, setEditPhoneBn] = useState('');
  const [editPhoneEn, setEditPhoneEn] = useState('');

  // Access check on mount
  useEffect(() => {
    if (!user || user.role !== 'super_admin') {
      navigate('/');
    }
  }, [user, navigate]);

  // Fetch Users
  const fetchUsers = async () => {
    setLoadingUsers(true);
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/admin/users`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setLoadingUsers(false);
    }
  };

  // Fetch Clubs
  const fetchClubs = async () => {
    setLoadingClubs(true);
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/clubs`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setClubs(data);
      }
    } catch (err) {
      console.error('Error fetching clubs:', err);
    } finally {
      setLoadingClubs(false);
    }
  };

  useEffect(() => {
    if (user && user.role === 'super_admin') {
      if (activeTab === 'users') fetchUsers();
      if (activeTab === 'clubs') fetchClubs();
      if (activeTab === 'applications') fetchApplications();
    }
  }, [activeTab, user, API_URL]);

  // Fetch Applications
  const fetchApplications = async () => {
    setLoadingApps(true);
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/applications`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setApplications(data);
      }
    } catch (err) {
      console.error('Error fetching applications:', err);
    } finally {
      setLoadingApps(false);
    }
  };

  const handleAppStatusChange = async (id, status) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/applications/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        setApplications(prev => prev.map(a => a._id === id ? { ...a, status } : a));
      }
    } catch (err) {
      console.error('Error updating application status:', err);
    }
  };

  const handleDeleteApp = async (id) => {
    if (!window.confirm(language === 'bn' ? 'এই আবেদনটি মুছে ফেলবেন?' : 'Delete this application?')) return;
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/applications/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setApplications(prev => prev.filter(a => a._id !== id));
        setAppAlert({ text: language === 'bn' ? 'আবেদন মুছে ফেলা হয়েছে।' : 'Application deleted.', type: 'success' });
        setTimeout(() => setAppAlert({ text: '', type: '' }), 3000);
      }
    } catch (err) {
      console.error('Error deleting application:', err);
    }
  };

  const FIELD_LABELS = {
    teaching: { bn: '📚 শিক্ষকতা', en: '📚 Teaching' },
    eco:      { bn: '🌿 ইকো ক্যাম্পেইন', en: '🌿 Eco Campaign' },
    disaster: { bn: '🩸 দুর্যোগ ত্রাণ', en: '🩸 Disaster Relief' },
    blood:    { bn: '❤️ রক্তদান', en: '❤️ Blood Donation' },
    general:  { bn: '🤝 সাধারণ', en: '🤝 General' },
  };

  const STATUS_LABELS = {
    pending:  { bn: '⏳ অপেক্ষমান', en: '⏳ Pending' },
    reviewed: { bn: '👁️ পর্যালোচিত', en: '👁️ Reviewed' },
    accepted: { bn: '✅ গৃহীত', en: '✅ Accepted' },
    rejected: { bn: '❌ প্রত্যাখ্যাত', en: '❌ Rejected' },
  };

  // Add User handler
  const handleAddUser = async (e) => {
    e.preventDefault();
    setAddError('');
    setAddLoading(true);
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/admin/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name: addName, email: addEmail, password: addPassword, clubId: addClubId, role: addRole })
      });
      const data = await res.json();
      if (res.ok) {
        setUsers(prev => [data, ...prev]);
        setShowAddModal(false);
        setAddName(''); setAddEmail(''); setAddPassword(''); setAddClubId(''); setAddRole('member');
        setUserAlert({ text: language === 'bn' ? 'নতুন ইউজার সফলভাবে যোগ করা হয়েছে!' : 'New user added successfully!', type: 'success' });
      } else {
        setAddError(data.message || 'Failed to add user.');
      }
    } catch (err) {
      setAddError('Network error. Please try again.');
    } finally {
      setAddLoading(false);
    }
  };

  // Change User Role handler
  const handleRoleChange = async (targetUserId, newRole) => {
    setUserAlert({ text: '', type: '' });
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/admin/users/${targetUserId}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ role: newRole })
      });
      const data = await res.json();
      if (res.ok) {
        setUsers(prev => prev.map(u => u.id === targetUserId || u._id === targetUserId ? { ...u, role: newRole } : u));
        setUserAlert({ text: t('adminSuccess'), type: 'success' });
      } else {
        setUserAlert({ text: data.message || 'Failed to update user role', type: 'error' });
      }
    } catch (err) {
      console.error(err);
      setUserAlert({ text: 'Error executing request.', type: 'error' });
    }
  };

  // Delete User Account handler
  const handleDeleteUser = async (targetUserId) => {
    if (!window.confirm(language === 'bn' ? 'আপনি কি নিশ্চিতভাবে এই ইউজার অ্যাকাউন্টটি ডিলিট করতে চান?' : 'Are you sure you want to delete this user account?')) {
      return;
    }

    setUserAlert({ text: '', type: '' });
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/admin/users/${targetUserId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setUsers(prev => prev.filter(u => u.id !== targetUserId && u._id !== targetUserId));
        setUserAlert({ text: t('adminDeleteSuccess'), type: 'success' });
      } else {
        setUserAlert({ text: data.message || 'Failed to delete user', type: 'error' });
      }
    } catch (err) {
      console.error(err);
      setUserAlert({ text: 'Error deleting user account.', type: 'error' });
    }
  };

  // Open Edit Club Form
  const startEditClub = (club) => {
    setEditingClub(club);
    setEditNameEn(club.name.en || '');
    setEditNameBn(club.name.bn || '');
    setEditLocationEn(club.location.en || '');
    setEditLocationBn(club.location.bn || '');
    setEditCategory(club.category || '');
    setEditShortDescEn(club.shortDescription.en || '');
    setEditShortDescBn(club.shortDescription.bn || '');
    setEditLongDescEn(club.longDescription.en || '');
    setEditLongDescBn(club.longDescription.bn || '');
    setEditEmail(club.email || '');
    setEditPhoneBn(club.phone?.bn || club.phone || '');
    setEditPhoneEn(club.phone?.en || club.phone || '');
    setClubAlert({ text: '', type: '' });
  };

  // Update Club handler
  const handleClubUpdate = async (e) => {
    e.preventDefault();
    setClubAlert({ text: '', type: '' });

    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/clubs/${editingClub.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          location: { en: editLocationEn, bn: editLocationBn },
          category: editCategory,
          shortDescription: { en: editShortDescEn, bn: editShortDescBn },
          longDescription: { en: editLongDescEn, bn: editLongDescBn },
          email: editEmail,
          phone: { en: editPhoneEn, bn: editPhoneBn }
        })
      });

      const data = await res.json();
      if (res.ok) {
        setClubs(prev => prev.map(c => c.id === editingClub.id ? data : c));
        setEditingClub(null);
        setClubAlert({ text: t('adminClubUpdateSuccess'), type: 'success' });
      } else {
        setClubAlert({ text: data.message || 'Failed to update club details', type: 'error' });
      }
    } catch (err) {
      console.error(err);
      setClubAlert({ text: 'Error updating club details.', type: 'error' });
    }
  };

  const handleApproveNameChange = async (cid) => {
    if (!window.confirm(language === 'bn' ? 'আপনি কি ক্লাবের নাম পরিবর্তনের এই আবেদনটি অনুমোদন করতে চান?' : 'Are you sure you want to approve this name change request?')) {
      return;
    }
    
    setClubAlert({ text: '', type: '' });
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/clubs/${cid}/approve-name-change`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setClubs(prev => prev.map(c => c.id === cid ? data : c));
        setEditingClub(null);
        setClubAlert({ text: t('adminClubUpdateSuccess'), type: 'success' });
      } else {
        setClubAlert({ text: data.message || 'Failed to approve name change', type: 'error' });
      }
    } catch (err) {
      console.error(err);
      setClubAlert({ text: 'Error executing request.', type: 'error' });
    }
  };

  const handleRejectNameChange = async (cid) => {
    if (!window.confirm(language === 'bn' ? 'আপনি কি ক্লাবের নাম পরিবর্তনের এই আবেদনটি বাতিল করতে চান?' : 'Are you sure you want to reject this name change request?')) {
      return;
    }

    setClubAlert({ text: '', type: '' });
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/clubs/${cid}/reject-name-change`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setClubs(prev => prev.map(c => c.id === cid ? data : c));
        setEditingClub(null);
        setClubAlert({ text: 'Name change request rejected.', type: 'success' });
      } else {
        setClubAlert({ text: data.message || 'Failed to reject name change', type: 'error' });
      }
    } catch (err) {
      console.error(err);
      setClubAlert({ text: 'Error executing request.', type: 'error' });
    }
  };

  const getClubNameById = (cid) => {
    const club = STATIC_CLUBS_LIST.find(c => c.id === cid);
    return club ? club.name[language] : '-';
  };

  const getRoleLabel = (role) => {
    if (role === 'super_admin') return t('roleSuperAdmin');
    if (role === 'club_admin') return t('roleClubAdmin');
    return t('roleMember');
  };

  if (!user || user.role !== 'super_admin') return null;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />

      <main style={{ flex: 1, backgroundColor: 'var(--bg-secondary)', padding: '100px 0 60px', transition: 'background-color var(--transition-normal)' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
            <div style={{
              width: '50px',
              height: '50px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--primary-color)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.6rem'
            }}>
              <i className="fa-solid fa-lock-open"></i>
            </div>
            <div>
              <h1 style={{ fontSize: '2rem', fontWeight: '800' }}>{t('adminTitle')}</h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>{language === 'bn' ? 'সহযোগ জোটের গ্লোবাল প্যানেল এডমিন ড্যাশবোর্ড' : 'Global portal dashboard controls for Coop Alliance.'}</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div style={{ display: 'flex', gap: '12px', borderBottom: '1px solid var(--border-color)', marginBottom: '32px', paddingBottom: '1px' }}>
            <button
              onClick={() => setActiveTab('users')}
              style={{
                padding: '12px 24px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                backgroundColor: 'transparent',
                border: 'none',
                borderBottom: activeTab === 'users' ? '3px solid var(--primary-color)' : '3px solid transparent',
                color: activeTab === 'users' ? 'var(--primary-color)' : 'var(--text-secondary)',
                transition: 'all var(--transition-fast)'
              }}
            >
              <i className="fa-solid fa-users-gear" style={{ marginRight: '8px' }}></i> {t('adminManageUsers')}
            </button>
            <button
              onClick={() => setActiveTab('clubs')}
              style={{
                padding: '12px 24px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                backgroundColor: 'transparent',
                border: 'none',
                borderBottom: activeTab === 'clubs' ? '3px solid var(--primary-color)' : '3px solid transparent',
                color: activeTab === 'clubs' ? 'var(--primary-color)' : 'var(--text-secondary)',
                transition: 'all var(--transition-fast)'
              }}
            >
              <i className="fa-solid fa-folder-tree" style={{ marginRight: '8px' }}></i> {t('adminManageClubs')}
            </button>
            <button
              onClick={() => setActiveTab('applications')}
              style={{
                padding: '12px 24px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                backgroundColor: 'transparent',
                border: 'none',
                borderBottom: activeTab === 'applications' ? '3px solid var(--primary-color)' : '3px solid transparent',
                color: activeTab === 'applications' ? 'var(--primary-color)' : 'var(--text-secondary)',
                transition: 'all var(--transition-fast)'
              }}
            >
              <i className="fa-solid fa-file-pen" style={{ marginRight: '8px' }}></i>
              {language === 'bn' ? 'আবেদনসমূহ' : 'Applications'}
              {applications.filter(a => a.status === 'pending').length > 0 && (
                <span style={{ marginLeft: '8px', background: '#ef4444', color: '#fff', borderRadius: '50px', padding: '1px 8px', fontSize: '0.75rem', fontWeight: '700' }}>
                  {applications.filter(a => a.status === 'pending').length}
                </span>
              )}
            </button>
            <Link
              to="/messages"
              style={{
                padding: '12px 24px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                backgroundColor: 'transparent',
                border: 'none',
                borderBottom: '3px solid transparent',
                color: 'var(--text-secondary)',
                transition: 'all var(--transition-fast)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                textDecoration: 'none',
              }}
            >
              <i className="fa-solid fa-comment-dots" style={{ marginRight: '4px' }} />
              {language === 'bn' ? 'বার্তা' : 'Messages'}
              <span style={{ fontSize: '0.72rem', background: 'var(--primary-color)', color: '#fff', borderRadius: '4px', padding: '1px 6px', fontWeight: 700 }}>
                {language === 'bn' ? 'নতুন' : 'Go'}
              </span>
            </Link>
          </div>

          {/* ── Add User Modal ── */}
          {showAddModal && (
            <div
              onClick={(e) => { if (e.target === e.currentTarget) setShowAddModal(false); }}
              style={{
                position: 'fixed', inset: 0, zIndex: 1000,
                backgroundColor: 'rgba(0,0,0,0.55)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                backdropFilter: 'blur(4px)'
              }}
            >
              <div style={{
                backgroundColor: 'var(--bg-primary)',
                borderRadius: 'var(--radius-md)',
                padding: '36px',
                width: '100%', maxWidth: '520px',
                border: '1px solid var(--border-color)',
                boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
                position: 'relative'
              }}>
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                  <h3 style={{ fontSize: '1.4rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'linear-gradient(135deg, var(--primary-color), var(--primary-hover))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '1rem' }}>
                      <i className="fa-solid fa-user-plus"></i>
                    </span>
                    {language === 'bn' ? 'নতুন ইউজার যোগ করুন' : 'Add New User'}
                  </h3>
                  <button onClick={() => setShowAddModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.4rem', color: 'var(--text-secondary)', lineHeight: 1 }}>✕</button>
                </div>

                {addError && (
                  <div style={{ backgroundColor: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)', padding: '10px 14px', borderRadius: '8px', fontSize: '0.9rem', marginBottom: '18px' }}>
                    <i className="fa-solid fa-triangle-exclamation" style={{ marginRight: '8px' }}></i>{addError}
                  </div>
                )}

                <form onSubmit={handleAddUser}>
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontWeight: '600', fontSize: '0.9rem', marginBottom: '6px', color: 'var(--text-primary)' }}>
                      {language === 'bn' ? 'পুরো নাম' : 'Full Name'}
                    </label>
                    <input
                      type="text" required value={addName}
                      onChange={e => setAddName(e.target.value)}
                      placeholder={language === 'bn' ? 'ইউজারের নাম লিখুন' : 'Enter full name'}
                      style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: '0.95rem' }}
                    />
                  </div>

                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontWeight: '600', fontSize: '0.9rem', marginBottom: '6px', color: 'var(--text-primary)' }}>
                      {language === 'bn' ? 'ইমেইল ঠিকানা' : 'Email Address'}
                    </label>
                    <input
                      type="email" required value={addEmail}
                      onChange={e => setAddEmail(e.target.value)}
                      placeholder="example@email.com"
                      style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: '0.95rem' }}
                    />
                  </div>

                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontWeight: '600', fontSize: '0.9rem', marginBottom: '6px', color: 'var(--text-primary)' }}>
                      {language === 'bn' ? 'পাসওয়ার্ড' : 'Password'}
                    </label>
                    <input
                      type="password" required value={addPassword}
                      onChange={e => setAddPassword(e.target.value)}
                      placeholder="••••••••"
                      style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: '0.95rem' }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                    <div>
                      <label style={{ display: 'block', fontWeight: '600', fontSize: '0.9rem', marginBottom: '6px', color: 'var(--text-primary)' }}>
                        {language === 'bn' ? 'ক্লাব' : 'Club'}
                      </label>
                      <select
                        required value={addClubId}
                        onChange={e => setAddClubId(e.target.value)}
                        style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: '0.9rem', cursor: 'pointer' }}
                      >
                        <option value="">{language === 'bn' ? '— ক্লাব বেছে নিন —' : '— Select club —'}</option>
                        {STATIC_CLUBS_LIST.map(c => (
                          <option key={c.id} value={c.id}>{c.name[language]}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontWeight: '600', fontSize: '0.9rem', marginBottom: '6px', color: 'var(--text-primary)' }}>
                        {language === 'bn' ? 'ভূমিকা' : 'Role'}
                      </label>
                      <select
                        value={addRole}
                        onChange={e => setAddRole(e.target.value)}
                        style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: '0.9rem', cursor: 'pointer' }}
                      >
                        <option value="member">{language === 'bn' ? 'সদস্য' : 'Member'}</option>
                        <option value="club_admin">{language === 'bn' ? 'ক্লাব এডমিন' : 'Club Admin'}</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                      type="button"
                      onClick={() => setShowAddModal(false)}
                      style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)', fontWeight: '600', cursor: 'pointer', fontSize: '0.95rem' }}
                    >
                      {language === 'bn' ? 'বাতিল' : 'Cancel'}
                    </button>
                    <button
                      type="submit"
                      disabled={addLoading}
                      style={{ flex: 1, padding: '12px', borderRadius: '8px', background: 'linear-gradient(135deg, var(--primary-color), var(--primary-hover))', color: '#fff', fontWeight: '700', cursor: addLoading ? 'not-allowed' : 'pointer', fontSize: '0.95rem', opacity: addLoading ? 0.7 : 1 }}
                    >
                      {addLoading
                        ? <><i className="fa-solid fa-spinner fa-spin" style={{ marginRight: '8px' }}></i>{language === 'bn' ? 'যোগ করা হচ্ছে...' : 'Adding...'}</>
                        : <><i className="fa-solid fa-user-plus" style={{ marginRight: '8px' }}></i>{language === 'bn' ? 'ইউজার যোগ করুন' : 'Add User'}</>
                      }
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Tab 1: Users Accounts Management */}
          {activeTab === 'users' && (
            <div style={{
              padding: '30px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--bg-primary)',
              border: '1px solid var(--border-color)'
            }}>
              {/* Top bar: heading + Add User button */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '1.2rem', fontWeight: '700' }}>
                  <i className="fa-solid fa-users" style={{ marginRight: '8px', color: 'var(--primary-color)' }}></i>
                  {language === 'bn' ? `মোট ইউজার: ${users.length} জন` : `Total Users: ${users.length}`}
                </h2>
                <button
                  onClick={() => { setShowAddModal(true); setAddError(''); }}
                  style={{
                    padding: '10px 20px',
                    borderRadius: '8px',
                    background: 'linear-gradient(135deg, var(--primary-color), var(--primary-hover))',
                    color: '#fff',
                    fontWeight: '700',
                    fontSize: '0.95rem',
                    cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: '8px',
                    boxShadow: '0 4px 14px rgba(15,118,110,0.3)'
                  }}
                >
                  <i className="fa-solid fa-user-plus"></i>
                  {language === 'bn' ? 'ইউজার যোগ করুন' : 'Add User'}
                </button>
              </div>

              {userAlert.text && (
                <div className={`form-message ${userAlert.type}`} style={{ display: 'block', marginBottom: '24px' }}>
                  {userAlert.text}
                </div>
              )}

              {loadingUsers ? (
                <div style={{ textAlign: 'center', padding: '60px 0' }}>
                  <i className="fa-solid fa-spinner fa-spin" style={{ color: 'var(--primary-color)', fontSize: '2.5rem' }}></i>
                </div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid var(--border-color)', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                        <th style={{ padding: '12px 16px' }}>{t('adminColName')}</th>
                        <th style={{ padding: '12px 16px' }}>{t('adminColEmail')}</th>
                        <th style={{ padding: '12px 16px' }}>{language === 'bn' ? 'সংশ্লিষ্ট ক্লাব' : 'Club'}</th>
                        <th style={{ padding: '12px 16px' }}>{t('adminColRole')}</th>
                        <th style={{ padding: '12px 16px', textAlign: 'right' }}>{t('adminColActions')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map(u => (
                        <tr key={u.id || u._id} style={{ borderBottom: '1px solid var(--border-color)', fontSize: '0.95rem' }}>
                          <td style={{ padding: '16px', fontWeight: '600' }}>{u.name}</td>
                          <td style={{ padding: '16px', color: 'var(--text-secondary)' }}>{u.email}</td>
                          <td style={{ padding: '16px' }}>{getClubNameById(u.clubId)}</td>
                          <td style={{ padding: '16px' }}>
                            <span style={{
                              display: 'inline-block',
                              padding: '4px 10px',
                              borderRadius: '4px',
                              fontSize: '0.8rem',
                              fontWeight: '700',
                              backgroundColor: u.role === 'super_admin' ? 'rgba(239, 68, 68, 0.1)' : u.role === 'club_admin' ? 'rgba(20, 184, 166, 0.1)' : 'var(--bg-secondary)',
                              color: u.role === 'super_admin' ? '#ef4444' : u.role === 'club_admin' ? 'var(--primary-color)' : 'var(--text-primary)'
                            }}>{getRoleLabel(u.role)}</span>
                          </td>
                          <td style={{ padding: '16px', textAlign: 'right', display: 'flex', gap: '8px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                            {/* Skip all actions for super_admin row */}
                            {u.role === 'super_admin' ? (
                              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontStyle: 'italic', padding: '6px 12px' }}>
                                {language === 'bn' ? '(সুরক্ষিত)' : '(Protected)'}
                              </span>
                            ) : (
                              <>
                                {u.role !== 'member' && (
                                  <button
                                    onClick={() => handleRoleChange(u.id || u._id, 'member')}
                                    className="btn"
                                    style={{ padding: '6px 14px', fontSize: '0.8rem', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}
                                  >
                                    <i className="fa-solid fa-user-minus" style={{ marginRight: '5px' }}></i>
                                    {t('adminBtnMakeMember')}
                                  </button>
                                )}
                                {u.role !== 'club_admin' && (
                                  <button
                                    onClick={() => handleRoleChange(u.id || u._id, 'club_admin')}
                                    className="btn btn-secondary"
                                    style={{ padding: '6px 14px', fontSize: '0.8rem' }}
                                  >
                                    <i className="fa-solid fa-user-shield" style={{ marginRight: '5px' }}></i>
                                    {t('adminBtnMakeClubAdmin')}
                                  </button>
                                )}
                                {/* Delete — fix: compare resolved IDs to avoid undefined===undefined bug */}
                                {(user.id || user._id) !== (u.id || u._id) && (
                                  <button
                                    onClick={() => handleDeleteUser(u.id || u._id)}
                                    className="btn"
                                    style={{ padding: '6px 14px', fontSize: '0.8rem', backgroundColor: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.25)' }}
                                  >
                                    <i className="fa-regular fa-trash-can" style={{ marginRight: '5px' }}></i>
                                    {language === 'bn' ? 'মুছুন' : 'Delete'}
                                  </button>
                                )}
                              </>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Club Registry Editor */}
          {activeTab === 'clubs' && (
            <div style={{
              padding: '30px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--bg-primary)',
              border: '1px solid var(--border-color)'
            }}>
              {clubAlert.text && (
                <div className={`form-message ${clubAlert.type}`} style={{ display: 'block', marginBottom: '24px' }}>
                  {clubAlert.text}
                </div>
              )}

              {loadingClubs ? (
                <div style={{ textAlign: 'center', padding: '60px 0' }}>
                  <i className="fa-solid fa-spinner fa-spin" style={{ color: 'var(--primary-color)', fontSize: '2.5rem' }}></i>
                </div>
              ) : editingClub ? (
                /* Edit Club Form Overlay */
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
                    <h3 style={{ fontSize: '1.4rem' }}><i className="fa-regular fa-pen-to-square"></i> {t('adminEditClubTitle')} ({editingClub.id})</h3>
                    <button onClick={() => setEditingClub(null)} className="btn" style={{ padding: '6px 12px', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>
                      {language === 'bn' ? 'বাতিল' : 'Cancel'}
                    </button>
                  </div>

                  {/* Lock Notice */}
                  <div style={{
                    padding: '16px',
                    backgroundColor: 'rgba(217, 119, 6, 0.05)',
                    border: '1px dashed rgba(217, 119, 6, 0.2)',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.85rem',
                    color: 'var(--text-primary)',
                    marginBottom: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}>
                    <i className="fa-solid fa-lock" style={{ color: '#d97706', fontSize: '1.2rem' }}></i>
                    <span>{t('adminNameLockNotice')}</span>
                  </div>

                  {/* Pending Request Approval Panel */}
                  {editingClub.nameChangeRequest && editingClub.nameChangeRequest.status === 'pending' && (
                    <div style={{
                      padding: '20px',
                      backgroundColor: 'rgba(20, 184, 166, 0.05)',
                      border: '1px solid rgba(20, 184, 166, 0.3)',
                      borderRadius: 'var(--radius-sm)',
                      marginBottom: '24px'
                    }}>
                      <h4 style={{ fontSize: '1.1rem', color: 'var(--primary-color)', marginBottom: '12px' }}>
                        <i className="fa-solid fa-bell" style={{ marginRight: '8px' }}></i>
                        {t('adminPendingRequestTitle')}
                      </h4>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '16px' }}>
                        <div>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{t('lblRequestNameEn')}</span>
                          <div style={{ fontWeight: '700', fontSize: '1rem' }}>{editingClub.nameChangeRequest.requestedName.en}</div>
                        </div>
                        <div>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{t('lblRequestNameBn')}</span>
                          <div style={{ fontWeight: '700', fontSize: '1rem' }}>{editingClub.nameChangeRequest.requestedName.bn}</div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '12px' }}>
                        <button
                          type="button"
                          onClick={() => handleApproveNameChange(editingClub.id)}
                          className="btn btn-primary"
                          style={{ padding: '8px 16px', fontSize: '0.85rem' }}
                        >
                          <i className="fa-solid fa-check" style={{ marginRight: '6px' }}></i> {t('adminBtnApproveRequest')}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRejectNameChange(editingClub.id)}
                          className="btn"
                          style={{ padding: '8px 16px', fontSize: '0.85rem', backgroundColor: '#ef4444', color: '#ffffff' }}
                        >
                          <i className="fa-solid fa-xmark" style={{ marginRight: '6px' }}></i> {t('adminBtnRejectRequest')}
                        </button>
                      </div>
                    </div>
                  )}

                  <form onSubmit={handleClubUpdate}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                      <div className="form-group">
                        <label className="form-label">{t('adminFieldClubNameEn')}</label>
                        <input type="text" className="form-input" value={editNameEn} readOnly disabled style={{ opacity: 0.6, cursor: 'not-allowed' }} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">{t('adminFieldClubNameBn')}</label>
                        <input type="text" className="form-input" value={editNameBn} readOnly disabled style={{ opacity: 0.6, cursor: 'not-allowed' }} />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                      <div className="form-group">
                        <label className="form-label">{t('adminFieldLocationEn')}</label>
                        <input type="text" className="form-input" value={editLocationEn} onChange={(e) => setEditLocationEn(e.target.value)} required />
                      </div>
                      <div className="form-group">
                        <label className="form-label">{t('adminFieldLocationBn')}</label>
                        <input type="text" className="form-input" value={editLocationBn} onChange={(e) => setEditLocationBn(e.target.value)} required />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
                      <div className="form-group">
                        <label className="form-label">{t('adminFieldCategory')}</label>
                        <select className="form-input" value={editCategory} onChange={(e) => setEditCategory(e.target.value)} style={{ cursor: 'pointer' }} required>
                          <option value="education">education</option>
                          <option value="welfare">welfare</option>
                          <option value="environment">environment</option>
                          <option value="health">health</option>
                          <option value="skills">skills</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label className="form-label">{t('lblEmail')}</label>
                        <input type="email" className="form-input" value={editEmail} onChange={(e) => setEditEmail(e.target.value)} required />
                      </div>
                      <div className="form-group">
                        <label className="form-label">{t('lblPhone')}</label>
                        <input type="text" className="form-input" value={editPhoneBn} onChange={(e) => { setEditPhoneBn(e.target.value); setEditPhoneEn(e.target.value); }} required />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">{t('adminFieldShortDescEn')}</label>
                      <input type="text" className="form-input" value={editShortDescEn} onChange={(e) => setEditShortDescEn(e.target.value)} required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">{t('adminFieldShortDescBn')}</label>
                      <input type="text" className="form-input" value={editShortDescBn} onChange={(e) => setEditShortDescBn(e.target.value)} required />
                    </div>

                    <div className="form-group">
                      <label className="form-label">{t('adminFieldLongDescEn')}</label>
                      <textarea className="form-textarea" value={editLongDescEn} onChange={(e) => setEditLongDescEn(e.target.value)} style={{ height: '80px' }} required></textarea>
                    </div>
                    <div className="form-group">
                      <label className="form-label">{t('adminFieldLongDescBn')}</label>
                      <textarea className="form-textarea" value={editLongDescBn} onChange={(e) => setEditLongDescBn(e.target.value)} style={{ height: '80px' }} required></textarea>
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '14px', marginTop: '16px' }}>
                      {t('adminBtnSaveClub')}
                    </button>
                  </form>
                </div>
              ) : (
                /* Clubs List Table */
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid var(--border-color)', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                        <th style={{ padding: '12px 16px' }}>ID</th>
                        <th style={{ padding: '12px 16px' }}>{language === 'bn' ? 'ক্লাবের নাম' : 'Club Name'}</th>
                        <th style={{ padding: '12px 16px' }}>{language === 'bn' ? 'ফোকাস এরিয়া' : 'Category'}</th>
                        <th style={{ padding: '12px 16px' }}>{t('lblLocation')}</th>
                        <th style={{ padding: '12px 16px', textAlign: 'right' }}>{t('adminColActions')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {clubs.map(c => (
                        <tr key={c.id} style={{ borderBottom: '1px solid var(--border-color)', fontSize: '0.95rem' }}>
                          <td style={{ padding: '16px', color: 'var(--text-secondary)' }}>{c.id}</td>
                          <td style={{ padding: '16px', fontWeight: '600' }}>{c.name[language]}</td>
                          <td style={{ padding: '16px' }}>
                            <span style={{
                              display: 'inline-block',
                              padding: '2px 8px',
                              borderRadius: '4px',
                              fontSize: '0.75rem',
                              fontWeight: '700',
                              backgroundColor: 'rgba(20, 184, 166, 0.1)',
                              color: 'var(--primary-color)'
                            }}>{c.categoryName[language]}</span>
                          </td>
                          <td style={{ padding: '16px', color: 'var(--text-secondary)' }}>{c.location[language]}</td>
                          <td style={{ padding: '16px', textAlign: 'right' }}>
                            <button onClick={() => startEditClub(c)} className="btn btn-primary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
                              <i className="fa-regular fa-pen-to-square" style={{ marginRight: '6px' }}></i> {language === 'bn' ? 'সংশোধন' : 'Edit'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
          {/* Tab 3: Volunteer Applications */}
          {activeTab === 'applications' && (
            <div style={{
              padding: '30px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--bg-primary)',
              border: '1px solid var(--border-color)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '1.2rem', fontWeight: '700' }}>
                  <i className="fa-solid fa-file-pen" style={{ marginRight: '8px', color: 'var(--primary-color)' }}></i>
                  {language === 'bn' ? `স্বেচ্ছাসেবী আবেদন: ${applications.length} টি` : `Volunteer Applications: ${applications.length}`}
                </h2>
                <button
                  onClick={fetchApplications}
                  style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)', cursor: 'pointer', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <i className="fa-solid fa-rotate-right"></i>
                  {language === 'bn' ? 'রিফ্রেশ' : 'Refresh'}
                </button>
              </div>

              {appAlert.text && (
                <div className={`form-message ${appAlert.type}`} style={{ display: 'block', marginBottom: '20px' }}>
                  {appAlert.text}
                </div>
              )}

              {loadingApps ? (
                <div style={{ textAlign: 'center', padding: '60px 0' }}>
                  <i className="fa-solid fa-spinner fa-spin" style={{ color: 'var(--primary-color)', fontSize: '2.5rem' }}></i>
                </div>
              ) : applications.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-secondary)' }}>
                  <i className="fa-regular fa-folder-open" style={{ fontSize: '3rem', display: 'block', marginBottom: '16px' }}></i>
                  <p>{language === 'bn' ? 'কোনো আবেদন নেই।' : 'No applications yet.'}</p>
                </div>
              ) : (
                <div className="admin-apps-grid">
                  {applications.map((app) => (
                    <div key={app._id} className="admin-app-card">
                      <div className="admin-app-info">
                        <h4>{app.fullName}</h4>
                        <div className="admin-app-meta">
                          <span>✉️ {app.email}</span>
                          <span>📞 {app.mobile}</span>
                          <span>🗓️ {new Date(app.createdAt).toLocaleDateString(language === 'bn' ? 'bn-BD' : 'en-GB')}</span>
                          <span className="admin-app-field-tag">
                            {FIELD_LABELS[app.field]?.[language] || app.field}
                          </span>
                        </div>
                        <div className="admin-app-why">
                          &ldquo;{app.whyJoin}&rdquo;
                        </div>
                      </div>
                      <div className="admin-app-actions">
                        <span className={`admin-app-status-badge badge-${app.status}`}>
                          {STATUS_LABELS[app.status]?.[language] || app.status}
                        </span>
                        <select
                          className="admin-app-status-select"
                          value={app.status}
                          onChange={(e) => handleAppStatusChange(app._id, e.target.value)}
                        >
                          <option value="pending">{language === 'bn' ? '⏳ অপেক্ষমান' : '⏳ Pending'}</option>
                          <option value="reviewed">{language === 'bn' ? '👁️ পর্যালোচিত' : '👁️ Reviewed'}</option>
                          <option value="accepted">{language === 'bn' ? '✅ গৃহীত' : '✅ Accepted'}</option>
                          <option value="rejected">{language === 'bn' ? '❌ প্রত্যাখ্যাত' : '❌ Rejected'}</option>
                        </select>
                        <button
                          className="admin-app-delete-btn"
                          onClick={() => handleDeleteApp(app._id)}
                        >
                          <i className="fa-regular fa-trash-can" style={{ marginRight: '4px' }}></i>
                          {language === 'bn' ? 'মুছুন' : 'Delete'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AdminDashboard;
