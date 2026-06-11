'use client';

import React, { useState, useEffect, useRef, use } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { HugeiconsIcon } from '@hugeicons/react';
import { 
  ArrowLeft01Icon, 
  Settings01Icon, 
  TelegramIcon, 
  SmileIcon, 
  UserIcon, 
  UserGroupIcon, 
  Copy01Icon, 
  CheckIcon, 
  Menu01Icon, 
  Cancel01Icon,
  HeartIcon
} from '@hugeicons/core-free-icons';

// Import all icon components for room display
import { 
  Home01Icon, 
  Message01Icon, 
  GameController01Icon, 
  PaintBrush01Icon, 
  MusicNote01Icon, 
  Video01Icon, 
  Compass01Icon, 
  Rocket01Icon 
} from '@hugeicons/core-free-icons';

interface RoomPageProps {
  params: Promise<{ id: string }>;
}

interface Message {
  id: string;
  room_id: string;
  author: string;
  text: string;
  created_at: string;
  isSystem?: boolean;
  likes?: string[]; // Used for reactions/likes array
}

interface PresenceUser {
  username: string;
  avatar?: string;
  joinedAt: number;
}

const COZY_AVATARS = [
  '🌸', '🐱', '🦊', '🐰', '🐻', '🐼', '🐨', '🐸', '🐙', '🧁', '☕', '🎵', '🎨', '✨', '☁️', '🎮'
];

const ICON_MAP: Record<string, any> = {
  Home01Icon,
  Message01Icon,
  GameController01Icon,
  PaintBrush01Icon,
  MusicNote01Icon,
  Video01Icon,
  Compass01Icon,
  Rocket01Icon
};

// Check if message is a single emoji
const isEmojiOnly = (text: string) => {
  const emojiRegex = /^[\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF]$/u;
  const trimmed = text.trim();
  return trimmed.length <= 8 && [...trimmed].every(char => emojiRegex.test(char) || char === ' ');
};

export default function RoomPage({ params }: RoomPageProps) {
  const router = useRouter();
  
  // Unwrap route params
  const { id: roomId } = use(params);

  // User details
  const [username, setUsername] = useState<string>('');
  const [showUsernameModal, setShowUsernameModal] = useState<boolean>(false);
  const [inputUsername, setInputUsername] = useState<string>('');
  const [inputAvatar, setInputAvatar] = useState<string>('🌸');
  const [usernameError, setUsernameError] = useState<string | null>(null);

  // Room metadata
  const [roomName, setRoomName] = useState<string>('');
  const [roomIcon, setRoomIcon] = useState<string>('Home01Icon');
  const [roomDescription, setRoomDescription] = useState<string>('');
  const [roomExists, setRoomExists] = useState<boolean | null>(null);

  // Chat states
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState<string>('');
  const [onlineUsers, setOnlineUsers] = useState<PresenceUser[]>([]);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [isTyping, setIsTyping] = useState<boolean>(false);

  // UI state
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [showScrollButton, setShowScrollButton] = useState<boolean>(false);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [isTabFocused, setIsTabFocused] = useState<boolean>(true);
  
  // Heart pop animation & reactions panel
  const [likedAnimationId, setLikedAnimationId] = useState<string | null>(null);
  const [activeReactionMsgId, setActiveReactionMsgId] = useState<string | null>(null);

  // Refs for scroll and connection tracking
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const titleFlashIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const channelRef = useRef<any>(null);
  const initialSyncDone = useRef<boolean>(false);

  // 1. Initial configuration check & database validation
  useEffect(() => {
    const checkRoomAndUser = async () => {
      // Check if room exists
      const { data: room, error } = await supabase
        .from('rooms')
        .select('*')
        .eq('id', roomId)
        .maybeSingle();

      if (error || !room) {
        console.error('Room lookup failed:', error);
        setRoomExists(false);
        return;
      }

      setRoomName(room.name);
      setRoomIcon(room.icon_name || 'Home01Icon');
      setRoomDescription(room.description || '');
      setRoomExists(true);

      // Check username in localStorage
      const savedUsername = localStorage.getItem('rio_username') || localStorage.getItem('whisper_username');
      const savedAvatar = localStorage.getItem('rio_avatar') || localStorage.getItem('whisper_avatar');
      if (savedAvatar) {
        setInputAvatar(savedAvatar);
      }
      if (savedUsername) {
        setUsername(savedUsername);
      } else {
        setShowUsernameModal(true);
      }
    };

    checkRoomAndUser();
  }, [roomId]);

  // 2. Fetch historic chat messages when username is loaded and room exists
  useEffect(() => {
    if (!roomExists || !username) return;

    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('room_id', roomId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching messages:', error);
      } else if (data) {
        setMessages(data);
        setTimeout(scrollToBottom, 50);
      }
    };

    fetchMessages();
  }, [roomExists, username, roomId]);

  // 3. Tab Visibility & Flash notifications
  useEffect(() => {
    const handleFocus = () => {
      setIsTabFocused(true);
      setUnreadCount(0);
      document.title = 'rio chat';
      if (titleFlashIntervalRef.current) {
        clearInterval(titleFlashIntervalRef.current);
        titleFlashIntervalRef.current = null;
      }
    };

    const handleBlur = () => {
      setIsTabFocused(false);
    };

    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);
    
    const visibilityHandler = () => {
      if (document.visibilityState === 'visible') handleFocus();
    };
    document.addEventListener('visibilitychange', visibilityHandler);

    return () => {
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
      document.removeEventListener('visibilitychange', visibilityHandler);
      if (titleFlashIntervalRef.current) clearInterval(titleFlashIntervalRef.current);
    };
  }, []);

  // Flash tab title if unread count increases when tab is out of focus
  useEffect(() => {
    if (isTabFocused || unreadCount === 0) return;

    if (titleFlashIntervalRef.current) {
      clearInterval(titleFlashIntervalRef.current);
    }

    let isOriginalTitle = true;
    titleFlashIntervalRef.current = setInterval(() => {
      document.title = isOriginalTitle 
        ? `🌸 (${unreadCount}) rio!` 
        : 'rio chat';
      isOriginalTitle = !isOriginalTitle;
    }, 1500);

    return () => {
      if (titleFlashIntervalRef.current) clearInterval(titleFlashIntervalRef.current);
    };
  }, [unreadCount, isTabFocused]);

  // Helper: Append system event message
  const appendSystemMessage = (text: string) => {
    const systemMsg: Message = {
      id: Math.random().toString(),
      room_id: roomId,
      author: 'System',
      text,
      created_at: new Date().toISOString(),
      isSystem: true
    };
    setMessages(prev => [...prev, systemMsg]);
    if (isNearBottom()) {
      setTimeout(scrollToBottom, 50);
    }
  };

  // 4. Supabase Realtime Channels setup
  useEffect(() => {
    if (!roomExists || !username) return;

    initialSyncDone.current = false;

    const channel = supabase.channel(`room:${roomId}`, {
      config: {
        presence: {
          key: username,
        },
      },
    });

    channelRef.current = channel;

    channel.on(
      'postgres_changes',
      {
        event: '*', 
        schema: 'public',
        table: 'messages',
        filter: `room_id=eq.${roomId}`,
      },
      (payload: any) => {
        if (payload.eventType === 'INSERT') {
          const newMsg = payload.new as Message;
          setMessages(prev => {
            if (prev.some(m => m.id === newMsg.id)) return prev;
            return [...prev, newMsg];
          });

          if (!isTabFocused) {
            setUnreadCount(c => c + 1);
          }

          const [newMsgAuthor] = newMsg.author.split('|');
          if (isNearBottom() || newMsgAuthor === username) {
            setTimeout(scrollToBottom, 50);
          } else {
            setShowScrollButton(true);
          }
        } else if (payload.eventType === 'UPDATE') {
          const updatedMsg = payload.new as Message;
          setMessages(prev => prev.map(m => m.id === updatedMsg.id ? updatedMsg : m));
        } else if (payload.eventType === 'DELETE') {
          const deletedMsg = payload.old as { id: string };
          setMessages(prev => prev.filter(m => m.id !== deletedMsg.id));
        }
      }
    );

    channel.on('presence', { event: 'sync' }, () => {
      const state = channel.presenceState();
      const userList: PresenceUser[] = [];
      
      Object.keys(state).forEach(key => {
        const userPresences = state[key] as any;
        if (userPresences && userPresences.length > 0) {
          userList.push({
            username: key,
            avatar: userPresences[0].avatar || '',
            joinedAt: userPresences[0].joinedAt || Date.now(),
          });
        }
      });
      
      userList.sort((a, b) => a.joinedAt - b.joinedAt);
      setOnlineUsers(userList);

      if (!initialSyncDone.current) {
        setTimeout(() => {
          initialSyncDone.current = true;
        }, 500);
      }
    });

    channel.on('presence', { event: 'join' }, ({ key }) => {
      if (initialSyncDone.current && key && key !== username) {
        appendSystemMessage(`${key} joined the cozy squad 🌸`);
      }
    });

    channel.on('presence', { event: 'leave' }, ({ key }) => {
      if (initialSyncDone.current && key) {
        appendSystemMessage(`${key} left the room 🌙`);
      }
    });

    channel.on('broadcast', { event: 'typing' }, (payload: any) => {
      const typingUser = payload.payload.username;
      if (typingUser === username) return;

      setTypingUsers(prev => {
        if (prev.includes(typingUser)) return prev;
        return [...prev, typingUser];
      });

      setTimeout(() => {
        setTypingUsers(prev => prev.filter(u => u !== typingUser));
      }, 2500);
    });

    channel.subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        await channel.track({
          username,
          avatar: localStorage.getItem('rio_avatar') || localStorage.getItem('whisper_avatar') || '🌸',
          joinedAt: Date.now(),
        });
      }
    });

    return () => {
      if (channelRef.current) {
        channelRef.current.unsubscribe();
      }
    };
  }, [roomExists, username, roomId, isTabFocused]);

  const isNearBottom = () => {
    const container = containerRef.current;
    if (!container) return true;
    const threshold = 150; 
    return container.scrollHeight - container.scrollTop - container.clientHeight <= threshold;
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    setShowScrollButton(false);
  };

  const handleScroll = () => {
    const container = containerRef.current;
    if (!container) return;
    
    const scrolledUp = container.scrollHeight - container.scrollTop - container.clientHeight > 300;
    setShowScrollButton(scrolledUp);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const messageText = inputText.trim();
    if (!messageText) return;

    setInputText('');
    stopTyping();

    try {
      const userAvatar = localStorage.getItem('rio_avatar') || localStorage.getItem('whisper_avatar') || '🌸';
      const { error } = await supabase.from('messages').insert({
        room_id: roomId,
        author: `${username}|${userAvatar}`,
        text: messageText,
      });

      if (error) {
        console.error('Error inserting message:', error);
        alert('Failed to send message.');
      }
    } catch (err) {
      console.error('Send message error:', err);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);

    if (!isTyping && channelRef.current) {
      setIsTyping(true);
      channelRef.current.send({
        type: 'broadcast',
        event: 'typing',
        payload: { username },
      });
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(stopTyping, 2000);
  };

  const stopTyping = () => {
    setIsTyping(false);
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
  };

  const copyRoomCode = () => {
    navigator.clipboard.writeText(roomId);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const copyMessage = (message: Message) => {
    if (message.isSystem) return;
    navigator.clipboard.writeText(message.text);
    setCopiedMessageId(message.id);
    setTimeout(() => setCopiedMessageId(null), 1500);
  };

  const handleLikeMessage = async (msg: Message) => {
    if (msg.isSystem) return;
    
    const likesList = msg.likes || [];
    const isLiked = likesList.includes(username);
    
    const updatedLikes = isLiked
      ? likesList.filter(u => u !== username)
      : [...likesList, username];
      
      setLikedAnimationId(msg.id);
      setTimeout(() => setLikedAnimationId(null), 700);
      
    try {
      const { error } = await supabase
        .from('messages')
        .update({ likes: updatedLikes })
        .eq('id', msg.id);
        
      if (error) {
        console.error('Error liking message:', error);
      }
    } catch (err) {
      console.error('Like action exception:', err);
    }
  };

  const handleAddReactionEmoji = async (msg: Message, emoji: string) => {
    if (msg.isSystem) return;
    setActiveReactionMsgId(null);
    
    const likesList = msg.likes || [];
    const reactionString = `${username}:${emoji}`;
    const userReactionExists = likesList.some(r => r.startsWith(`${username}:`));
    
    let updatedLikes = [...likesList];
    if (userReactionExists) {
      updatedLikes = updatedLikes.filter(r => !r.startsWith(`${username}:`));
    }
    updatedLikes.push(reactionString);

    try {
      const { error } = await supabase
        .from('messages')
        .update({ likes: updatedLikes })
        .eq('id', msg.id);
        
      if (error) console.error('Error adding reaction:', error);
    } catch (err) {
      console.error('Reaction exception:', err);
    }
  };

  const handleModalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUsername = inputUsername.trim();
    if (!cleanUsername) {
      setUsernameError('Please enter a username.');
      return;
    }
    if (cleanUsername.length < 2 || cleanUsername.length > 20) {
      setUsernameError('Username must be between 2 and 20 characters.');
      return;
    }
    if (cleanUsername.includes('|')) {
      setUsernameError('Username cannot contain the "|" character.');
      return;
    }
    localStorage.setItem('rio_username', cleanUsername);
    localStorage.setItem('rio_avatar', inputAvatar);
    localStorage.setItem('whisper_username', cleanUsername);
    localStorage.setItem('whisper_avatar', inputAvatar);
    setUsername(cleanUsername);
    setShowUsernameModal(false);
  };

  const formatTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  const getInitials = (name: string) => {
    return name.slice(0, 2);
  };

  if (roomExists === null) {
    return (
      <div className="center-layout">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
          <div className="typing-bubble" style={{ padding: '24px', border: '3px solid var(--text-heading)', borderRadius: '24px', background: 'var(--surface-card)', boxShadow: '0 8px 0 0 var(--card-shadow)' }}>
            <div className="typing-dot" style={{ background: 'var(--primary-purple)' }}></div>
            <div className="typing-dot" style={{ background: 'var(--primary-purple)' }}></div>
            <div className="typing-dot" style={{ background: 'var(--primary-purple)' }}></div>
          </div>
          <span style={{ color: 'var(--text-heading)', fontWeight: '900', fontSize: '1.05rem' }}>
            Entering room... 🌸
          </span>
        </div>
      </div>
    );
  }

  if (roomExists === false) {
    return (
      <div className="center-layout">
        <div className="clay-card home-card" style={{ textAlign: 'center' }}>
          <HugeiconsIcon icon={Cancel01Icon} size={48} style={{ color: 'var(--danger)', margin: '0 auto 16px auto', display: 'block' }} />
          <h2 style={{ marginBottom: '12px' }}>Room Not Found</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '24px', lineHeight: 1.5 }}>
            The room code <strong>{roomId}</strong> does not exist. Make sure you entered it correctly.
          </p>
          <button onClick={() => router.push('/')} className="btn-primary-clay">
            <HugeiconsIcon icon={ArrowLeft01Icon} size={18} /> Back to safety
          </button>
        </div>
      </div>
    );
  }

  const HeaderIcon = ICON_MAP[roomIcon] || Home01Icon;

  const getReactionsCounts = (likes: string[] = []) => {
    const counts: Record<string, number> = {};
    let hasMyHeart = false;
    likes.forEach(like => {
      if (like.includes(':')) {
        const [user, emoji] = like.split(':');
        counts[emoji] = (counts[emoji] || 0) + 1;
      } else {
        counts['❤️'] = (counts['❤️'] || 0) + 1;
        if (like === username) hasMyHeart = true;
      }
    });
    return { counts, hasMyHeart };
  };

  return (
    <div className="chat-layout">
      {/* SVG Decorative Clouds */}
      <svg className="decor-cloud decor-cloud-1" width="130" height="80" viewBox="0 0 120 80" fill="#FFF">
        <path d="M30 40a20 20 0 0 1 40-10 25 25 0 0 1 45 15 20 20 0 0 1-5 35H30a20 20 0 0 1 0-40z" opacity="0.95"/>
      </svg>
      <svg className="decor-cloud decor-cloud-2" width="160" height="90" viewBox="0 0 120 80" fill="#FFF">
        <path d="M30 40a20 20 0 0 1 40-10 25 25 0 0 1 45 15 20 20 0 0 1-5 35H30a20 20 0 0 1 0-40z" opacity="0.95"/>
      </svg>

      {/* Username Dialog Modal */}
      {showUsernameModal && (
        <div className="modal-overlay">
          <div className="clay-card modal-card">

            <div className="home-logo">
              <HugeiconsIcon icon={UserIcon} size={30} style={{ color: 'var(--primary-purple)' }} />
              <h2>Who is joining?</h2>
            </div>
            <p className="home-subtitle" style={{ marginBottom: '20px' }}>Enter details to join the discussion in <strong>{roomName}</strong></p>
            {usernameError && <div className="error-message">{usernameError}</div>}
            <form onSubmit={handleModalSubmit}>
              {/* Avatar Selector */}
              <div className="input-group">
                <label className="input-label">Choose Avatar</label>
                <div className="avatar-picker-row">
                  {COZY_AVATARS.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      className={`avatar-picker-btn ${inputAvatar === emoji ? 'active' : ''}`}
                      onClick={() => setInputAvatar(emoji)}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              {/* Username Input */}
              <div className="input-group">
                <label className="input-label" htmlFor="username">Choose Username</label>
                <div className="clay-input-wrapper">
                  <HugeiconsIcon icon={UserIcon} className="clay-input-icon" size={18} />
                  <input
                    id="username"
                    type="text"
                    value={inputUsername}
                    onChange={(e) => setInputUsername(e.target.value)}
                    placeholder="e.g. Alyx 🌸"
                    maxLength={20}
                    className="text-input"
                    required
                    autoComplete="off"
                  />
                </div>
              </div>
              <button type="submit" className="btn-primary-clay">
                Join Discussion
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Clay Sidebar Drawer */}
      <aside className={`chat-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-title">
            <HugeiconsIcon icon={UserGroupIcon} size={20} style={{ color: 'var(--primary-purple)' }} />
            <span>Active squad</span>
          </div>
          <span className="online-count-badge">
            {onlineUsers.length} online
          </span>
          <button 
            className="sidebar-toggle-btn-clay" 
            onClick={() => setSidebarOpen(false)}
            style={{ display: sidebarOpen ? 'flex' : 'none', marginRight: 0, width: '32px', height: '32px' }}
          >
            <HugeiconsIcon icon={Cancel01Icon} size={16} />
          </button>
        </div>

        <div className="user-list">
          {onlineUsers.map((user) => (
            <div key={user.username} className="user-item-clay">
              <div 
                className="msg-avatar" 
                style={{ width: '28px', height: '28px', fontSize: user.avatar ? '1.15rem' : '0.75rem', boxShadow: 'none', border: '2.5px solid var(--text-heading)' }}
              >
                {user.avatar || getInitials(user.username)}
                <span className="msg-avatar-status online"></span>
              </div>
              <span className={`username-label ${user.username === username ? 'me' : ''}`}>
                {user.username}
              </span>
            </div>
          ))}
        </div>

        <div className="sidebar-footer">
          <button 
            onClick={() => router.push(`/room/${roomId}/members`)} 
            className="btn-primary-clay"
            style={{ padding: '10px 14px', fontSize: '0.9rem' }}
          >
            View squad list
          </button>
          <button 
            onClick={() => router.push('/')} 
            className="btn-ghost-clay" 
            style={{ margin: 0, padding: '8px 12px', fontSize: '0.85rem' }}
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} size={14} /> Back to lobby
          </button>
        </div>
      </aside>

      {/* Main Chat Feed Area */}
      <section className="chat-main">
        {/* Soft tag-like header */}
        <header className="chat-header-pill">
          <div className="chat-header-left">
            <button 
              className="header-back-btn" 
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <HugeiconsIcon icon={Menu01Icon} size={18} />
            </button>
            
            <div className="header-icon-tile">
              <HugeiconsIcon icon={HeaderIcon} />
            </div>

            <div className="header-room-details">
              <div className="header-room-name">{roomName}</div>
              <div className="header-room-members">
                <span className="header-online-dot"></span>
                <span>{onlineUsers.length} online</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button className="room-code-badge" style={{ border: '3px solid var(--text-heading)', borderRadius: '12px', padding: '6px 12px', fontWeight: '900', color: 'var(--text-heading)', boxShadow: '0 3px 0 0 var(--card-shadow)' }} onClick={copyRoomCode}>
              {copiedCode ? (
                <>
                  <HugeiconsIcon icon={CheckIcon} size={14} /> Copied!
                </>
              ) : (
                <>
                  <HugeiconsIcon icon={Copy01Icon} size={14} /> Code: {roomId}
                </>
              )}
            </button>
            <button 
              className="header-back-btn" 
              onClick={() => router.push(`/room/${roomId}/settings`)}
            >
              <HugeiconsIcon icon={Settings01Icon} size={18} />
            </button>
          </div>
        </header>

        {/* Real-time Message Feed */}
        <div className="chat-fade-top"></div>
        <div 
          className="messages-container" 
          ref={containerRef}
          onScroll={handleScroll}
        >
          {messages.map((msg, index) => {
            if (msg.isSystem) {
              return (
                <div key={msg.id} className="system-message-row">
                  <div className="system-message">{msg.text}</div>
                </div>
              );
            }

            const showTimeDivider = index === 0 || (() => {
              const prev = messages[index - 1];
              if (!prev || prev.isSystem) return true;
              const diff = new Date(msg.created_at).getTime() - new Date(prev.created_at).getTime();
              return diff > 5 * 60 * 1000; 
            })();

            const [msgAuthor, msgAvatar] = msg.author.split('|');
            const isMe = msgAuthor === username;
            const emojiMsg = isEmojiOnly(msg.text);
            const { counts: reactionCounts, hasMyHeart } = getReactionsCounts(msg.likes);

            return (
              <React.Fragment key={msg.id}>
                {showTimeDivider && (
                  <div className="timestamp-divider">
                    {new Date(msg.created_at).toLocaleDateString([], { weekday: 'short', hour: '2-digit', minute: '2-digit' })}
                  </div>
                )}
                
                <div className={`message-row ${isMe ? 'sent' : 'received'}`} style={{ position: 'relative' }}>
                  {!isMe && (
                    <div className="msg-avatar-container">
                      <div className="msg-avatar" style={{ fontSize: msgAvatar ? '1.3rem' : '0.85rem' }}>
                        {msgAvatar || getInitials(msgAuthor)}
                      </div>
                    </div>
                  )}

                  <div className="message-content-wrapper">
                    <span className="message-author">{msgAuthor}</span>
                    
                    {emojiMsg ? (
                      <div 
                        className="message-sticker-clay"
                        onDoubleClick={(e) => {
                          e.stopPropagation();
                          handleLikeMessage(msg);
                        }}
                        onClick={() => setActiveReactionMsgId(activeReactionMsgId === msg.id ? null : msg.id)}
                      >
                        {msg.text}
                      </div>
                    ) : (
                      <div 
                        className="message-bubble-clay"
                        onClick={() => copyMessage(msg)}
                        onDoubleClick={(e) => {
                          e.stopPropagation();
                          handleLikeMessage(msg);
                        }}
                        style={{ cursor: 'pointer' }}
                      >
                        <div className="message-text">{msg.text}</div>
                        <span className="message-time-stamp">{formatTime(msg.created_at)}</span>

                        {copiedMessageId === msg.id && (
                          <div className="tooltip">Copied text!</div>
                        )}
                        
                        {activeReactionMsgId === msg.id && (
                          <div className="reactions-bar-container" onClick={(e) => e.stopPropagation()}>
                            {['❤️', '👍', '😂', '😮', '😢', '🎉'].map(emoji => (
                              <span 
                                key={emoji} 
                                className="reaction-tile"
                                onClick={() => handleAddReactionEmoji(msg, emoji)}
                              >
                                {emoji}
                              </span>
                            ))}
                          </div>
                        )}

                        {likedAnimationId === msg.id && (
                          <div className="heart-pop">
                            <HugeiconsIcon icon={HeartIcon} size={32} style={{ fill: '#ff6b6b', stroke: '#ff6b6b' }} />
                          </div>
                        )}

                        {Object.keys(reactionCounts).length > 0 && (
                          <div className={`likes-badge-clay ${hasMyHeart ? 'liked' : ''}`}>
                            {Object.entries(reactionCounts).map(([emoji, count]) => (
                              <span key={emoji} style={{ display: 'inline-flex', alignItems: 'center', gap: '1px' }}>
                                <span>{emoji}</span>
                                <span>{count}</span>
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </React.Fragment>
            );
          })}

          {typingUsers.length > 0 && (
            <div className="message-row received">
              <div className="msg-avatar-container">
                <div className="msg-avatar" style={{ borderStyle: 'dashed' }}>
                  💬
                </div>
              </div>
              <div className="message-content-wrapper">
                <div className="typing-bubble" style={{ border: '3px solid var(--text-heading)', borderRadius: '18px', background: 'var(--surface-card)', padding: '10px 14px' }}>
                  <div className="typing-dot" style={{ background: 'var(--primary-purple)' }}></div>
                  <div className="typing-dot" style={{ background: 'var(--primary-purple)' }}></div>
                  <div className="typing-dot" style={{ background: 'var(--primary-purple)' }}></div>
                  <span style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--text-muted)', marginLeft: '6px' }}>
                    {typingUsers.length === 1 
                      ? `${typingUsers[0]} is writing...`
                      : 'Squad members are writing...'
                    }
                  </span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
        <div className="chat-fade-bottom"></div>

        {showScrollButton && (
          <button className="jump-to-latest-clay" onClick={scrollToBottom}>
            🌸 Jump to latest
          </button>
        )}

        {/* Input composer tag */}
        <div className="composer-panel-clay">
          <button 
            type="button" 
            className="composer-left-btn"
            onClick={() => {
              if (messages.length > 0) {
                const lastMsg = messages[messages.length - 1];
                if (lastMsg && !lastMsg.isSystem) {
                  setActiveReactionMsgId(activeReactionMsgId === lastMsg.id ? null : lastMsg.id);
                }
              }
            }}
          >
            <HugeiconsIcon icon={SmileIcon} size={20} />
          </button>
          
          <form onSubmit={handleSendMessage} style={{ display: 'flex', flex: 1, gap: '8px', alignItems: 'center' }}>
            <div className="composer-input-recessed">
              <input
                type="text"
                value={inputText}
                onChange={handleInputChange}
                onBlur={stopTyping}
                placeholder="Say something cozy..."
                className="composer-input-field"
                maxLength={500}
                autoComplete="off"
              />
            </div>
            <button 
              type="submit" 
              className="composer-send-btn"
              disabled={!inputText.trim()}
            >
              <HugeiconsIcon icon={TelegramIcon} size={18} />
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
