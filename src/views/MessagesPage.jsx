"use client";
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter as useNavigate, useSearchParams } from 'next/navigation';

import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import Header from '../components/Header';
import Footer from '../components/Footer';

const ADMIN_EMAIL = 'sohel0130844@gmail.com';

// ── Avatar initials helper ──────────────────────────────
const getInitials = (name = '') =>
  name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

const avatarColor = (name = '') => {
  const colors = [
    '#0f766e', '#16a34a', '#d97706', '#7c3aed',
    '#db2777', '#0284c7', '#b45309', '#059669',
  ];
  let sum = 0;
  for (const c of name) sum += c.charCodeAt(0);
  return colors[sum % colors.length];
};

// ── Time formatter ───────────────────────────────────────
const formatTime = (dateStr) => {
  const d = new Date(dateStr);
  const now = new Date();
  const diffDays = Math.floor((now - d) / 86400000);
  if (diffDays === 0) {
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } else if (diffDays === 1) {
    return 'Yesterday';
  } else if (diffDays < 7) {
    return d.toLocaleDateString([], { weekday: 'short' });
  }
  return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
};

// ────────────────────────────────────────────────────────
const MessagesPage = () => {
  const { API_URL, user, loading } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const isAdmin = user?.role === 'super_admin' && user?.email === ADMIN_EMAIL;

  // State
  const [conversations, setConversations] = useState([]);   // admin: [{userId, userName, lastMessage, unread}]
  const [activeUserId, setActiveUserId] = useState(null);   // which thread is open
  const [activeUserName, setActiveUserName] = useState('');
  const [thread, setThread] = useState([]);
  const [loadingConvs, setLoadingConvs] = useState(true);
  const [loadingThread, setLoadingThread] = useState(false);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [adminId, setAdminId] = useState(null);
  const [allUsers, setAllUsers] = useState([]);             // admin: pick new conversation
  const [showUserPicker, setShowUserPicker] = useState(false);
  const [userSearch, setUserSearch] = useState('');

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const pollRef = useRef(null);

  const t = (bn, en) => (language === 'bn' ? bn : en);

  // ── Redirect if not logged in ──
  useEffect(() => {
    if (!loading && !user) {
      navigate.push('/login');
    }
  }, [user, loading, navigate]);

  // ── Fetch admin ID ──
  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch(`${API_URL}/messages/admin-id`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(d => setAdminId(d.adminId))
      .catch(() => {});
  }, [API_URL]);

  // ── Fetch all users (admin only, for new convo picker) ──
  useEffect(() => {
    if (!isAdmin) return;
    const token = localStorage.getItem('token');
    fetch(`${API_URL}/admin/users`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(data => setAllUsers(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, [API_URL, isAdmin]);

  // ── Open a thread ──
  const openThread = useCallback(async (userId, userName) => {
    setActiveUserId(userId);
    setActiveUserName(userName);
    setThread([]);
    setLoadingThread(true);
    setShowUserPicker(false);

    const token = localStorage.getItem('token');
    try {
      const r = await fetch(`${API_URL}/messages/conversation/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (r.ok) setThread(await r.json());
    } catch (_) {}
    setLoadingThread(false);

    // Mark as read
    fetch(`${API_URL}/messages/read/${userId}`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` },
    }).then(() => {
      setConversations(prev =>
        prev.map(c => c.userId === userId ? { ...c, unread: 0 } : c)
      );
    }).catch(() => {});

    inputRef.current?.focus();
  }, [API_URL]);

  // ── Load conversations / inbox ──
  const loadConversations = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (isAdmin) {
      setLoadingConvs(true);
      try {
        const r = await fetch(`${API_URL}/messages/conversations`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (r.ok) setConversations(await r.json());
      } catch (_) {}
      setLoadingConvs(false);
    } else {
      setLoadingConvs(false);
      // Non-admin: auto-open admin thread
      if (adminId) openThread(adminId, t('অ্যাডমিন', 'Admin'));
    }
  }, [API_URL, isAdmin, adminId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadConversations();
  }, [loadConversations]);

  // ── Handle ?user= query param (from admin dashboard) ──
  useEffect(() => {
    const uid = searchParams.get('user');
    if (uid && isAdmin && allUsers.length > 0) {
      const u = allUsers.find(x => (x.id || x._id) === uid);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (u) openThread(uid, u.name);
    }
  }, [searchParams, isAdmin, allUsers]);




  // ── Polling for new messages (every 8s) ──
  useEffect(() => {
    if (!activeUserId) return;
    pollRef.current = setInterval(async () => {
      const token = localStorage.getItem('token');
      try {
        const r = await fetch(`${API_URL}/messages/conversation/${activeUserId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (r.ok) {
          const data = await r.json();
          setThread(prev => {
            if (data.length !== prev.length) return data;
            return prev;
          });
        }
      } catch (_) {}

      // Refresh conversation list too
      if (isAdmin) {
        const r2 = await fetch(`${API_URL}/messages/conversations`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (r2.ok) setConversations(await r2.json());
      }
    }, 8000);
    return () => clearInterval(pollRef.current);
  }, [activeUserId, API_URL, isAdmin]);

  // ── Auto-scroll ──
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [thread]);

  // ── Send message ──
  const handleSend = async (e) => {
    e?.preventDefault();
    if (!input.trim() || !activeUserId || sending) return;

    const recipientId = isAdmin ? activeUserId : adminId;
    if (!recipientId) return;

    setSending(true);
    const token = localStorage.getItem('token');
    try {
      const r = await fetch(`${API_URL}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ recipientId, content: input.trim() }),
      });
      if (r.ok) {
        const msg = await r.json();
        setThread(prev => [...prev, msg]);
        setInput('');
        // Update conversation list preview
        if (isAdmin) {
          setConversations(prev => {
            const exists = prev.find(c => c.userId === activeUserId);
            if (exists) {
              return prev.map(c =>
                c.userId === activeUserId
                  ? { ...c, lastMessage: msg }
                  : c
              );
            }
            return [
              { userId: activeUserId, userName: activeUserName, lastMessage: msg, unread: 0 },
              ...prev,
            ];
          });
        }
      }
    } catch (_) {}
    setSending(false);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const myId = (user?.id || user?._id)?.toString();

  const filteredUsers = allUsers.filter(u => {
    const id = (u.id || u._id)?.toString();
    const inConv = conversations.find(c => c.userId === id);
    return (
      !inConv &&
      id !== myId &&
      u.name.toLowerCase().includes(userSearch.toLowerCase())
    );
  });

  // ── Non-admin: auto-open admin thread when adminId is known ──
  useEffect(() => {
    if (!isAdmin && adminId && !activeUserId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      openThread(adminId, t('অ্যাডমিন (Sohel)', 'Admin (Sohel)'));
    }
  }, [isAdmin, adminId, activeUserId, openThread]);

  return (
    <>
      <Header />
      <main className="page-main msgs-page">
        <div className="msgs-layout">

          {/* ══ SIDEBAR ══════════════════════════════════════ */}
          <aside className="msgs-sidebar">
            <div className="msgs-sidebar-header">
              <h2 className="msgs-sidebar-title">
                <i className="fa-solid fa-comment-dots" />
                {t('বার্তা', 'Messages')}
              </h2>
              {isAdmin && (
                <button
                  className="msgs-new-btn"
                  onClick={() => setShowUserPicker(p => !p)}
                  title={t('নতুন বার্তা', 'New Message')}
                >
                  <i className="fa-solid fa-pen-to-square" />
                </button>
              )}
            </div>

            {/* ── New conversation picker (admin) ── */}
            {isAdmin && showUserPicker && (
              <div className="msgs-user-picker">
                <input
                  type="text"
                  className="msgs-picker-search"
                  placeholder={t('ইউজার খুঁজুন...', 'Search users...')}
                  value={userSearch}
                  onChange={e => setUserSearch(e.target.value)}
                  autoFocus
                />
                <div className="msgs-picker-list">
                  {filteredUsers.length === 0 ? (
                    <p className="msgs-picker-empty">
                      {t('কোনো ইউজার পাওয়া যায়নি।', 'No users found.')}
                    </p>
                  ) : filteredUsers.map(u => (
                    <button
                      key={u.id || u._id}
                      className="msgs-picker-item"
                      onClick={() => {
                        setUserSearch('');
                        openThread((u.id || u._id)?.toString(), u.name);
                      }}
                    >
                      <span
                        className="msgs-avatar msgs-avatar-sm"
                        style={{ background: avatarColor(u.name) }}
                      >
                        {getInitials(u.name)}
                      </span>
                      <span>{u.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ── Conversation list ── */}
            <div className="msgs-conv-list">
              {loadingConvs ? (
                <div className="msgs-center-loader">
                  <i className="fa-solid fa-spinner fa-spin" />
                </div>
              ) : isAdmin && conversations.length === 0 ? (
                <p className="msgs-empty-hint">
                  {t('কোনো কথোপকথন নেই।\nউপরে ✏️ চাপুন নতুন বার্তা পাঠাতে।',
                     'No conversations yet.\nClick ✏️ above to start one.')}
                </p>
              ) : isAdmin ? (
                conversations.map(conv => (
                  <button
                    key={conv.userId}
                    className={`msgs-conv-item ${activeUserId === conv.userId ? 'active' : ''}`}
                    onClick={() => openThread(conv.userId, conv.userName)}
                  >
                    <span
                      className="msgs-avatar"
                      style={{ background: avatarColor(conv.userName) }}
                    >
                      {getInitials(conv.userName)}
                    </span>
                    <div className="msgs-conv-info">
                      <div className="msgs-conv-top">
                        <span className="msgs-conv-name">{conv.userName}</span>
                        <span className="msgs-conv-time">
                          {conv.lastMessage ? formatTime(conv.lastMessage.createdAt) : ''}
                        </span>
                      </div>
                      <div className="msgs-conv-preview">
                        <span className="msgs-conv-last">
                          {conv.lastMessage?.content?.slice(0, 42) || ''}
                          {conv.lastMessage?.content?.length > 42 ? '…' : ''}
                        </span>
                        {conv.unread > 0 && (
                          <span className="msgs-unread-badge">{conv.unread}</span>
                        )}
                      </div>
                    </div>
                  </button>
                ))
              ) : (
                // Non-admin: single admin conversation entry
                <button
                  className={`msgs-conv-item ${activeUserId === adminId ? 'active' : ''}`}
                  onClick={() => adminId && openThread(adminId, t('অ্যাডমিন', 'Admin'))}
                >
                  <span className="msgs-avatar" style={{ background: '#0f766e' }}>AD</span>
                  <div className="msgs-conv-info">
                    <div className="msgs-conv-top">
                      <span className="msgs-conv-name">{t('অ্যাডমিন', 'Admin')}</span>
                    </div>
                    <div className="msgs-conv-preview">
                      <span className="msgs-conv-last">
                        {t('অ্যাডমিনের সাথে কথা বলুন', 'Chat with Admin')}
                      </span>
                    </div>
                  </div>
                </button>
              )}
            </div>
          </aside>

          {/* ══ CHAT PANEL ═══════════════════════════════════ */}
          <section className="msgs-chat">
            {!activeUserId ? (
              <div className="msgs-empty-state">
                <div className="msgs-empty-icon">💬</div>
                <h3>{t('কথোপকথন শুরু করুন', 'Start a Conversation')}</h3>
                <p>
                  {isAdmin
                    ? t('বাম দিক থেকে একটি conversation বেছে নিন বা ✏️ চাপুন।',
                        'Select a conversation on the left or click ✏️ to start one.')
                    : t('অ্যাডমিনের সাথে কথা বলতে বাম দিকের তালিকা থেকে বেছে নিন।',
                        'Select the admin conversation on the left to chat.')}
                </p>
              </div>
            ) : (
              <>
                {/* Chat header */}
                <div className="msgs-chat-header">
                  <span
                    className="msgs-avatar"
                    style={{ background: avatarColor(activeUserName) }}
                  >
                    {getInitials(activeUserName)}
                  </span>
                  <div>
                    <div className="msgs-chat-name">{activeUserName}</div>
                    <div className="msgs-chat-status">
                      <span className="msgs-online-dot" />
                      {t('সক্রিয়', 'Active')}
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="msgs-thread">
                  {loadingThread ? (
                    <div className="msgs-center-loader">
                      <i className="fa-solid fa-spinner fa-spin" />
                    </div>
                  ) : thread.length === 0 ? (
                    <div className="msgs-thread-empty">
                      <span>👋</span>
                      <p>{t('এখনও কোনো বার্তা নেই। প্রথম বার্তা পাঠান!',
                             'No messages yet. Send the first one!')}</p>
                    </div>
                  ) : (
                    thread.map((msg, i) => {
                      const isMine = msg.senderId === myId;
                      const showDate =
                        i === 0 ||
                        new Date(msg.createdAt).toDateString() !==
                          new Date(thread[i - 1].createdAt).toDateString();
                      return (
                        <React.Fragment key={msg._id}>
                          {showDate && (
                            <div className="msgs-date-divider">
                              <span>{new Date(msg.createdAt).toLocaleDateString(
                                language === 'bn' ? 'bn-BD' : 'en-GB',
                                { weekday: 'long', month: 'long', day: 'numeric' }
                              )}</span>
                            </div>
                          )}
                          <div className={`msgs-bubble-row ${isMine ? 'mine' : 'theirs'}`}>
                            {!isMine && (
                              <span
                                className="msgs-avatar msgs-avatar-sm"
                                style={{ background: avatarColor(msg.senderName), alignSelf: 'flex-end' }}
                              >
                                {getInitials(msg.senderName)}
                              </span>
                            )}
                            <div className="msgs-bubble-group">
                              <div className={`msgs-bubble ${isMine ? 'msgs-bubble-mine' : 'msgs-bubble-theirs'}`}>
                                {msg.content}
                              </div>
                              <span className="msgs-bubble-time">
                                {formatTime(msg.createdAt)}
                                {isMine && (
                                  <span className="msgs-read-tick">
                                    {msg.read
                                      ? <i className="fa-solid fa-check-double" style={{ color: 'var(--primary-color)' }} />
                                      : <i className="fa-solid fa-check" />}
                                  </span>
                                )}
                              </span>
                            </div>
                          </div>
                        </React.Fragment>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input bar */}
                <form className="msgs-input-bar" onSubmit={handleSend}>
                  <textarea
                    ref={inputRef}
                    className="msgs-input"
                    rows={1}
                    placeholder={t('বার্তা লিখুন... (Enter পাঠান)', 'Type a message... (Enter to send)')}
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={sending}
                  />
                  <button
                    type="submit"
                    className="msgs-send-btn"
                    disabled={sending || !input.trim()}
                    aria-label="Send"
                  >
                    {sending
                      ? <i className="fa-solid fa-spinner fa-spin" />
                      : <i className="fa-solid fa-paper-plane" />}
                  </button>
                </form>
              </>
            )}
          </section>
        </div>
      </main>
    </>
  );
};

export default MessagesPage;
