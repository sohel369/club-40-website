"use client";
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import Header from '../components/Header';
import Footer from '../components/Footer';

const ClubDetailsPage = () => {
  const { id } = useParams();
  const clubId = parseInt(id, 10);

  const { API_URL, user } = useAuth();
  const { t, language } = useLanguage();

  const [club, setClub] = useState(null);
  const [loadingClub, setLoadingClub] = useState(true);

  // Members lists
  const [admins, setAdmins] = useState([]);
  const [members, setMembers] = useState([]);
  const [loadingMembers, setLoadingMembers] = useState(true);

  // Posts Feed states
  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');
  const [postAlert, setPostAlert] = useState({ text: '', type: '' });

  // Edit / Delete post states
  const [editingPost, setEditingPost] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editAlert, setEditAlert] = useState({ text: '', type: '' });
  const [deleteConfirmPost, setDeleteConfirmPost] = useState(null);

  // Chatroom states
  const [chatMessages, setChatMessages] = useState([]);
  const [loadingChat, setLoadingChat] = useState(true);
  const [newMessage, setNewMessage] = useState('');
  const [chatAlert, setChatAlert] = useState({ text: '', type: '' });

  const chatEndRef = useRef(null);

  // Name change proposal states
  const [reqNameEn, setReqNameEn] = useState('');
  const [reqNameBn, setReqNameBn] = useState('');
  const [requestAlert, setRequestAlert] = useState({ text: '', type: '' });

  const isUserMember = user && (user.clubId === clubId || user.role === 'super_admin');

  // Fetch Club details
  useEffect(() => {
    const fetchClubDetails = async () => {
      try {
        const res = await fetch(`${API_URL}/clubs/${clubId}`);
        if (res.ok) {
          const data = await res.json();
          setClub(data);
        }
      } catch (err) {
        console.error('Error fetching club details:', err);
      } finally {
        setLoadingClub(false);
      }
    };
    fetchClubDetails();
  }, [clubId, API_URL]);

  // Fetch Club members & admins
  useEffect(() => {
    const fetchMembers = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      try {
        const res = await fetch(`${API_URL}/clubs/${clubId}/members`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setAdmins(data.admins || []);
          setMembers(data.members || []);
        }
      } catch (err) {
        console.error('Error fetching members:', err);
      } finally {
        setLoadingMembers(false);
      }
    };
    if (club) fetchMembers();
  }, [clubId, club, API_URL]);

  // Fetch Club updates (posts)
  useEffect(() => {
    const fetchPosts = async () => {
      const token = localStorage.getItem('token');
      try {
        const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
        const res = await fetch(`${API_URL}/clubs/${clubId}/posts`, { headers });
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
    if (club) fetchPosts();
  }, [clubId, club, API_URL]);

  // Scroll Chat to bottom
  const scrollToBottom = () => {
    setTimeout(() => {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  // Fetch Chat messages
  useEffect(() => {
    const fetchMessages = async () => {
      const token = localStorage.getItem('token');
      if (!token || !isUserMember) {
        setLoadingChat(false);
        return;
      }
      try {
        const res = await fetch(`${API_URL}/clubs/${clubId}/messages`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setChatMessages(data);
          scrollToBottom();
        }
      } catch (err) {
        console.error('Error fetching messages:', err);
      } finally {
        setLoadingChat(false);
      }
    };
    if (club) fetchMessages();
  }, [clubId, club, isUserMember, API_URL]);



  // Submit Post handler
  const handlePostSubmit = async (e) => {
    e.preventDefault();
    setPostAlert({ text: '', type: '' });

    if (!postTitle.trim() || !postContent.trim()) {
      setPostAlert({ text: t('formValErrAll'), type: 'error' });
      return;
    }

    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/clubs/${clubId}/posts`, {
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
        setPostAlert({ text: data.message || 'Failed to publish post', type: 'error' });
      }
    } catch (err) {
      console.error(err);
      setPostAlert({ text: 'Server error. Please try again.', type: 'error' });
    }
  };

  // Delete Post handler
  const handleDeletePost = async (post) => {
    const token = localStorage.getItem('token');
    const postId = post.id || post._id;
    try {
      const res = await fetch(`${API_URL}/clubs/${clubId}/posts/${postId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setPosts(prev => prev.filter(p => (p.id || p._id) !== postId));
        setDeleteConfirmPost(null);
      } else {
        const data = await res.json();
        setPostAlert({ text: data.message || 'Failed to delete post', type: 'error' });
        setDeleteConfirmPost(null);
      }
    } catch (err) {
      console.error(err);
      setPostAlert({ text: 'Server error deleting post.', type: 'error' });
      setDeleteConfirmPost(null);
    }
  };

  // Edit Post submit handler
  const handleEditPost = async (e) => {
    e.preventDefault();
    setEditAlert({ text: '', type: '' });
    if (!editTitle.trim() || !editContent.trim()) {
      setEditAlert({ text: language === 'bn' ? 'শিরোনাম ও বিষয়বস্তু প্রয়োজন' : 'Title and content are required', type: 'error' });
      return;
    }
    const token = localStorage.getItem('token');
    const postId = editingPost.id || editingPost._id;
    try {
      const res = await fetch(`${API_URL}/clubs/${clubId}/posts/${postId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ title: editTitle.trim(), content: editContent.trim() })
      });
      const data = await res.json();
      if (res.ok) {
        setPosts(prev => prev.map(p => (p.id || p._id) === postId ? data : p));
        setEditingPost(null);
      } else {
        setEditAlert({ text: data.message || 'Failed to update post', type: 'error' });
      }
    } catch (err) {
      console.error(err);
      setEditAlert({ text: 'Server error updating post.', type: 'error' });
    }
  };

  // Submit Name Change Proposal handler
  const handleNameChangeRequest = async (e) => {
    e.preventDefault();
    setRequestAlert({ text: '', type: '' });

    if (!reqNameEn.trim() || !reqNameBn.trim()) {
      setRequestAlert({ text: t('formValErrAll'), type: 'error' });
      return;
    }

    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/clubs/${clubId}/request-name-change`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          requestedName: {
            en: reqNameEn.trim(),
            bn: reqNameBn.trim()
          }
        })
      });

      const data = await res.json();
      if (res.ok) {
        setClub(data);
        setRequestAlert({ text: t('lblRequestSubmitted'), type: 'success' });
        setReqNameEn('');
        setReqNameBn('');
      } else {
        setRequestAlert({ text: data.message || 'Failed to submit name change proposal', type: 'error' });
      }
    } catch (err) {
      console.error(err);
      setRequestAlert({ text: 'Server error. Please try again.', type: 'error' });
    }
  };

  // Submit Chat Message handler
  const handleChatSubmit = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/clubs/${clubId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ content: newMessage.trim() })
      });

      const data = await res.json();

      if (res.ok) {
        setChatMessages(prev => [...prev, data]);
        setNewMessage('');
        scrollToBottom();
      } else {
        setChatAlert({ text: data.message || 'Failed to send message', type: 'error' });
      }
    } catch (err) {
      console.error(err);
      setChatAlert({ text: 'Error sending message.', type: 'error' });
    }
  };

  if (loadingClub) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Header />
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '100px 0', color: 'var(--primary-color)' }}>
          <div style={{ textAlign: 'center' }}>
            <i className="fa-solid fa-circle-notch fa-spin" style={{ fontSize: '3rem', marginBottom: '20px' }}></i>
            <h3>{language === 'bn' ? 'ক্লাবের তথ্য লোড হচ্ছে...' : 'Loading club details...'}</h3>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!club) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Header />
        <div className="container" style={{ flex: 1, textAlign: 'center', padding: '120px 24px' }}>
          <i className="fa-solid fa-triangle-exclamation" style={{ fontSize: '4rem', color: '#ef4444', marginBottom: '24px' }}></i>
          <h2>{language === 'bn' ? 'ক্লাবটি পাওয়া যায়নি' : 'Club Not Found'}</h2>
          <p style={{ margin: '16px 0 32px 0', color: 'var(--text-secondary)' }}>
            {language === 'bn' ? 'দুঃখিত, অনুরোধকৃত ক্লাবটির কোনো তথ্য পাওয়া যায়নি।' : 'Sorry, we could not find any information for the requested club.'}
          </p>
          <Link href="/" className="btn btn-primary">{language === 'bn' ? 'হোমপেজে ফিরে যান' : 'Go back to Home'}</Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />

      {/* Hero Banner Section */}
      <section style={{
        position: 'relative',
        height: '350px',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'flex-end',
        color: '#ffffff'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1
        }}>
          <img 
            src={club.image} 
            alt={club.name[language]} 
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/' + club.fallbackImage;
            }}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(to top, rgba(15, 23, 42, 0.95) 0%, rgba(15, 23, 42, 0.4) 100%)'
          }}></div>
        </div>

        <div className="container" style={{ position: 'relative', zIndex: 2, paddingBottom: '40px', width: '100%' }}>
          <Link href="/" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            color: 'var(--primary-color)',
            fontWeight: '600',
            fontSize: '0.95rem',
            marginBottom: '16px',
            textDecoration: 'none'
          }}>
            <i className="fa-solid fa-arrow-left"></i> {language === 'bn' ? 'হোম ড্যাশবোর্ড' : 'Back to Dashboard'}
          </Link>
          <span style={{
            display: 'inline-block',
            padding: '4px 12px',
            borderRadius: '20px',
            backgroundColor: 'var(--primary-color)',
            fontSize: '0.8rem',
            fontWeight: '700',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            marginBottom: '12px'
          }}>
            {club.categoryName[language]}
          </span>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800', lineHeight: 1.2 }}>{club.name[language]}</h1>
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="section-padding" style={{ flex: 1, backgroundColor: 'var(--bg-secondary)', transition: 'background-color var(--transition-normal)' }}>
        <div className="container" style={{
          display: 'grid',
          gridTemplateColumns: '1.2fr 2fr',
          gap: '40px'
        }}>
          
          {/* Left Column - Information & Members */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            
            {/* About Box */}
            <div style={{
              padding: '30px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--bg-primary)',
              border: '1px solid var(--border-color)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
            }}>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
                <i className="fa-solid fa-circle-info" style={{ color: 'var(--primary-color)', marginRight: '8px' }}></i>
                {language === 'bn' ? 'ক্লাব পরিচিতি' : 'About Club'}
              </h3>
              <p style={{ fontSize: '0.95rem', lineHeight: 1.6, color: 'var(--text-primary)', marginBottom: '24px' }}>
                {club.longDescription[language]}
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}><i className="fa-solid fa-calendar-check" style={{ marginRight: '8px' }}></i> {t('lblEstablished')}</span>
                  <span style={{ fontWeight: '600' }}>{club.established[language]}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}><i className="fa-solid fa-location-dot" style={{ marginRight: '8px' }}></i> {t('lblLocation')}</span>
                  <span style={{ fontWeight: '600' }}>{club.location[language]}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}><i className="fa-solid fa-envelope" style={{ marginRight: '8px' }}></i> {t('lblEmail')}</span>
                  <a href={`mailto:${club.email}`} style={{ fontWeight: '600', color: 'var(--primary-color)' }}>{club.email}</a>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}><i className="fa-solid fa-phone" style={{ marginRight: '8px' }}></i> {t('lblPhone')}</span>
                  <span style={{ fontWeight: '600' }}>{typeof club.phone === 'object' && club.phone !== null ? club.phone[language] : club.phone}</span>
                </div>
              </div>
            </div>

            {/* Name Change Request Box for Club Admins */}
            {user && user.role === 'club_admin' && user.clubId === clubId && (
              <div style={{
                padding: '30px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--bg-primary)',
                border: '1px solid var(--border-color)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
              }}>
                <h3 style={{ fontSize: '1.3rem', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
                  <i className="fa-regular fa-paper-plane" style={{ color: 'var(--primary-color)', marginRight: '8px' }}></i>
                  {t('lblRequestNameChangeTitle')}
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: 1.5 }}>
                  {t('lblRequestNameChangeDesc')}
                </p>

                {club.nameChangeRequest && club.nameChangeRequest.status === 'pending' ? (
                  <div style={{
                    padding: '16px',
                    backgroundColor: 'rgba(217, 119, 6, 0.05)',
                    border: '1px dashed rgba(217, 119, 6, 0.2)',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.9rem',
                    lineHeight: 1.5
                  }}>
                    <strong style={{ color: '#d97706', display: 'block', marginBottom: '8px' }}>
                      <i className="fa-solid fa-clock-rotate-left"></i> {t('lblRequestPendingStatus')}
                    </strong>
                    <div style={{ paddingLeft: '8px', borderLeft: '2px solid #d97706' }}>
                      <div>EN: <strong>{club.nameChangeRequest.requestedName.en}</strong></div>
                      <div>BN: <strong>{club.nameChangeRequest.requestedName.bn}</strong></div>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleNameChangeRequest}>
                    {requestAlert.text && (
                      <div className={`form-message ${requestAlert.type}`} style={{ display: 'block', marginBottom: '16px' }}>
                        {requestAlert.text}
                      </div>
                    )}
                    <div className="form-group" style={{ marginBottom: '12px' }}>
                      <label className="form-label">{t('lblRequestNameEn')}</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        value={reqNameEn}
                        onChange={(e) => setReqNameEn(e.target.value)}
                        required 
                      />
                    </div>
                    <div className="form-group" style={{ marginBottom: '16px' }}>
                      <label className="form-label">{t('lblRequestNameBn')}</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        value={reqNameBn}
                        onChange={(e) => setReqNameBn(e.target.value)}
                        required 
                      />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                      {t('lblRequestSubmitBtn')}
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* Administrators Box */}
            <div style={{
              padding: '30px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--bg-primary)',
              border: '1px solid var(--border-color)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
            }}>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
                <i className="fa-solid fa-user-shield" style={{ color: 'var(--primary-color)', marginRight: '8px' }}></i>
                {t('lblClubAdmins')}
              </h3>
              {loadingMembers ? (
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{language === 'bn' ? 'সদস্য তালিকা লোড হচ্ছে...' : 'Loading...'}</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {admins.length > 0 ? (
                    admins.map(admin => (
                      <div key={admin.id} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '50%',
                          backgroundColor: 'rgba(20, 184, 166, 0.1)',
                          color: 'var(--primary-color)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: '700'
                        }}>{admin.name[0].toUpperCase()}</div>
                        <div>
                          <h5 style={{ fontSize: '0.95rem', fontWeight: '600' }}>{admin.name}</h5>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{admin.email}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                      {language === 'bn' ? 'কোনো এডমিন নিযুক্ত নেই' : 'No admins assigned.'}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Members List Box */}
            <div style={{
              padding: '30px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--bg-primary)',
              border: '1px solid var(--border-color)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
            }}>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
                <i className="fa-solid fa-users" style={{ color: 'var(--primary-color)', marginRight: '8px' }}></i>
                {t('lblClubMembers')} ({members.length})
              </h3>
              {loadingMembers ? (
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{language === 'bn' ? 'সদস্য তালিকা লোড হচ্ছে...' : 'Loading...'}</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '300px', overflowY: 'auto', paddingRight: '4px' }}>
                  {members.length > 0 ? (
                    members.map(member => (
                      <div key={member.id} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '50%',
                          backgroundColor: 'var(--border-color)',
                          color: 'var(--text-primary)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: '600'
                        }}>{member.name[0].toUpperCase()}</div>
                        <div>
                          <h5 style={{ fontSize: '0.95rem', fontWeight: '600' }}>{member.name}</h5>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{member.email}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                      {language === 'bn' ? 'এখনো কোনো নিবন্ধিত সদস্য নেই' : 'No registered members yet.'}
                    </span>
                  )}
                </div>
              )}
            </div>

          </div>

          {/* Right Column - Updates Feed & Chatroom */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

            {/* Updates Feed Box */}
            <div style={{
              padding: '30px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--bg-primary)',
              border: '1px solid var(--border-color)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
            }}>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
                <i className="fa-solid fa-bullhorn" style={{ color: 'var(--primary-color)', marginRight: '8px' }}></i>
                {t('lblPostsSectionTitle')}
              </h3>

              {/* Feed List */}
              {loadingPosts ? (
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                  <i className="fa-solid fa-circle-notch fa-spin" style={{ color: 'var(--primary-color)', fontSize: '1.5rem' }}></i>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '400px', overflowY: 'auto', paddingRight: '4px', marginBottom: '24px' }}>
                  {posts.length > 0 ? (
                    posts.map(post => {
                      const postId = post.id || post._id;
                      const rawUserId = user?.id || user?._id;
                      const baseUserId = rawUserId?.toString().replace('-user', '');
                      const baseAuthorId = post.authorId?.toString().replace('-user', '');
                      const canManage = user && (user.role === 'super_admin' || baseAuthorId === baseUserId);
                      return (
                        <div key={postId} style={{
                          backgroundColor: 'var(--bg-secondary)',
                          border: '1px solid var(--border-color)',
                          borderRadius: 'var(--radius-sm)',
                          padding: '20px',
                          position: 'relative'
                        }}>
                          <h4 style={{ fontSize: '1.1rem', marginBottom: '8px', color: 'var(--primary-color)', paddingRight: canManage ? '90px' : '0' }}>{post.title}</h4>
                          <p style={{ fontSize: '0.95rem', color: 'var(--text-primary)', marginBottom: '12px', whiteSpace: 'pre-line', lineHeight: 1.5 }}>{post.content}</p>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                            <span><i className="fa-regular fa-user" style={{ marginRight: '6px' }}></i> {post.authorName}</span>
                            <span><i className="fa-regular fa-calendar" style={{ marginRight: '6px' }}></i> {new Date(post.createdAt).toLocaleDateString(language === 'bn' ? 'bn-BD' : 'en-US')}</span>
                          </div>
                          {canManage && (
                            <div style={{ position: 'absolute', top: '14px', right: '14px', display: 'flex', gap: '6px' }}>
                              <button
                                onClick={() => { setEditingPost(post); setEditTitle(post.title); setEditContent(post.content); setEditAlert({ text: '', type: '' }); }}
                                style={{ background: 'rgba(20,184,166,0.1)', border: '1px solid var(--primary-color)', color: 'var(--primary-color)', borderRadius: '6px', padding: '4px 10px', cursor: 'pointer', fontSize: '0.78rem', fontWeight: '600' }}
                                title={language === 'bn' ? 'সম্পাদনা করুন' : 'Edit'}
                              ><i className="fa-regular fa-pen-to-square"></i></button>
                              <button
                                onClick={() => setDeleteConfirmPost(post)}
                                style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid #ef4444', color: '#ef4444', borderRadius: '6px', padding: '4px 10px', cursor: 'pointer', fontSize: '0.78rem', fontWeight: '600' }}
                                title={language === 'bn' ? 'মুছুন' : 'Delete'}
                              ><i className="fa-regular fa-trash-can"></i></button>
                            </div>
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <span style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '20px 0', fontStyle: 'italic', fontSize: '0.9rem' }}>
                      {t('lblNoPosts')}
                    </span>
                  )}
                </div>
              )}

              {/* Post Creation Form (restricted to members) */}
              {isUserMember && (
                <div style={{
                  padding: '20px',
                  backgroundColor: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-sm)'
                }}>
                  <h4 style={{ fontSize: '1.1rem', marginBottom: '16px' }}>
                    <i className="fa-regular fa-pen-to-square" style={{ color: 'var(--primary-color)', marginRight: '8px' }}></i>
                    {t('lblCreatePostTitle')}
                  </h4>
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
                        style={{ height: '70px' }}
                        required
                      ></textarea>
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                      {t('lblPostSubmitBtn')}
                    </button>
                  </form>
                </div>
              )}
            </div>

            {/* Messaging / Chatroom Box */}
            <div style={{
              padding: '30px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--bg-primary)',
              border: '1px solid var(--border-color)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
            }}>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
                <i className="fa-solid fa-comments" style={{ color: 'var(--primary-color)', marginRight: '8px' }}></i>
                {t('lblChatTitle')}
              </h3>

              {!isUserMember ? (
                <div style={{
                  padding: '24px',
                  backgroundColor: 'rgba(217, 119, 6, 0.05)',
                  border: '1px dashed rgba(217, 119, 6, 0.2)',
                  borderRadius: 'var(--radius-sm)',
                  textAlign: 'center',
                  color: 'var(--text-primary)',
                  fontSize: '0.95rem'
                }}>
                  <i className="fa-solid fa-lock" style={{ fontSize: '2rem', color: '#d97706', marginBottom: '12px' }}></i>
                  <p>
                    {language === 'bn' 
                      ? 'এই ক্লাবের চ্যাটরুমটি লক করা আছে। চ্যাট করতে এবং একে অপরকে মেসেজ পাঠাতে আপনাকে অবশ্যই এই ক্লাবের নিবন্ধিত সদস্য হতে হবে।'
                      : 'This club chatroom is locked. You must be a registered member of this club to message other members.'
                    }
                  </p>
                </div>
              ) : (
                <div>
                  {/* Live Chat Message Feed */}
                  <div style={{
                    height: '250px',
                    overflowY: 'auto',
                    border: '1px solid var(--border-color)',
                    backgroundColor: 'var(--bg-secondary)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '16px',
                    marginBottom: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px'
                  }}>
                    {loadingChat ? (
                      <div style={{ textAlign: 'center', padding: '40px 0' }}>
                        <i className="fa-solid fa-circle-notch fa-spin" style={{ color: 'var(--primary-color)' }}></i>
                      </div>
                    ) : chatMessages.length > 0 ? (
                      chatMessages.map(msg => {
                        const isSelf = user && (user.id === msg.senderId || user._id === msg.senderId);
                        return (
                          <div 
                            key={msg.id || msg._id} 
                            style={{
                              alignSelf: isSelf ? 'flex-end' : 'flex-start',
                              maxWidth: '75%',
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: isSelf ? 'flex-end' : 'flex-start'
                            }}
                          >
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '2px', fontWeight: '600' }}>
                              {msg.senderName}
                            </span>
                            <div style={{
                              padding: '10px 14px',
                              borderRadius: isSelf ? '16px 16px 0px 16px' : '16px 16px 16px 0px',
                              backgroundColor: isSelf ? 'var(--primary-color)' : 'var(--border-color)',
                              color: isSelf ? '#ffffff' : 'var(--text-primary)',
                              fontSize: '0.9rem',
                              lineHeight: 1.4,
                              wordBreak: 'break-word'
                            }}>
                              {msg.content}
                            </div>
                            <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                              {new Date(msg.createdAt).toLocaleTimeString(language === 'bn' ? 'bn-BD' : 'en-US', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        );
                      })
                    ) : (
                      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', fontStyle: 'italic', fontSize: '0.85rem', textAlign: 'center' }}>
                        {t('lblNoMessages')}
                      </div>
                    )}
                    <div ref={chatEndRef}></div>
                  </div>

                  {/* Chat Message Form */}
                  <form onSubmit={handleChatSubmit} style={{ display: 'flex', gap: '8px' }}>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder={t('lblChatPlaceholder')}
                      style={{ flex: 1, marginBottom: 0 }}
                      required
                    />
                    <button type="submit" className="btn btn-primary" style={{ padding: '0 20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {t('lblChatSend')} <i className="fa-solid fa-paper-plane" style={{ marginLeft: '6px' }}></i>
                    </button>
                  </form>
                </div>
              )}
            </div>

          </div>

        </div>
      </section>

      <Footer />

      {/* ── Edit Post Modal ── */}
      {editingPost && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 1000,
          backgroundColor: 'rgba(0,0,0,0.6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '24px'
        }} onClick={() => setEditingPost(null)}>
          <div style={{
            backgroundColor: 'var(--bg-primary)',
            borderRadius: 'var(--radius-md)',
            padding: '32px',
            width: '100%',
            maxWidth: '540px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.35)',
            border: '1px solid var(--border-color)'
          }} onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <i className="fa-regular fa-pen-to-square" style={{ color: 'var(--primary-color)' }}></i>
              {language === 'bn' ? 'পোস্ট সম্পাদনা করুন' : 'Edit Post'}
            </h3>
            <form onSubmit={handleEditPost}>
              {editAlert.text && (
                <div className={`form-message ${editAlert.type}`} style={{ display: 'block', marginBottom: '16px' }}>{editAlert.text}</div>
              )}
              <div className="form-group">
                <label className="form-label">{language === 'bn' ? 'শিরোনাম' : 'Title'}</label>
                <input type="text" className="form-input" value={editTitle} onChange={e => setEditTitle(e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">{language === 'bn' ? 'বিষয়বস্তু' : 'Content'}</label>
                <textarea className="form-textarea" value={editContent} onChange={e => setEditContent(e.target.value)} style={{ height: '130px' }} required></textarea>
              </div>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '8px' }}>
                <button type="button" onClick={() => setEditingPost(null)} style={{ padding: '10px 20px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', backgroundColor: 'transparent', color: 'var(--text-primary)', cursor: 'pointer', fontWeight: '600' }}>
                  {language === 'bn' ? 'বাতিল' : 'Cancel'}
                </button>
                <button type="submit" className="btn btn-primary" style={{ padding: '10px 24px' }}>
                  {language === 'bn' ? 'আপডেট করুন' : 'Update'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Delete Confirm Modal ── */}
      {deleteConfirmPost && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 1000,
          backgroundColor: 'rgba(0,0,0,0.6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '24px'
        }} onClick={() => setDeleteConfirmPost(null)}>
          <div style={{
            backgroundColor: 'var(--bg-primary)',
            borderRadius: 'var(--radius-md)',
            padding: '36px 32px',
            width: '100%',
            maxWidth: '440px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.35)',
            border: '1px solid var(--border-color)',
            textAlign: 'center'
          }} onClick={e => e.stopPropagation()}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'rgba(239,68,68,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <i className="fa-regular fa-trash-can" style={{ fontSize: '1.8rem', color: '#ef4444' }}></i>
            </div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '12px' }}>{language === 'bn' ? 'পোস্ট মুছবেন?' : 'Delete Post?'}</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '8px' }}>
              <strong style={{ color: 'var(--text-primary)' }}>&quot;{deleteConfirmPost.title}&quot;</strong>
            </p>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '28px' }}>
              {language === 'bn' ? 'এই পোস্টটি স্থায়ীভাবে মুছে যাবে। এটি পূর্বাবস্থায় ফেরানো যাবে না।' : 'This post will be permanently deleted. This action cannot be undone.'}
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button onClick={() => setDeleteConfirmPost(null)} style={{ padding: '10px 24px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', backgroundColor: 'transparent', color: 'var(--text-primary)', cursor: 'pointer', fontWeight: '600' }}>
                {language === 'bn' ? 'বাতিল' : 'Cancel'}
              </button>
              <button onClick={() => handleDeletePost(deleteConfirmPost)} style={{ padding: '10px 28px', borderRadius: 'var(--radius-sm)', border: 'none', backgroundColor: '#ef4444', color: '#fff', cursor: 'pointer', fontWeight: '700', fontSize: '0.95rem' }}>
                <i className="fa-regular fa-trash-can" style={{ marginRight: '6px' }}></i>
                {language === 'bn' ? 'হ্যাঁ, মুছুন' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClubDetailsPage;
