'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { safeGetItem, safeSetItem } from '@/lib/safeStorage';
import { HugeiconsIcon } from '@hugeicons/react';
import { 
  Home01Icon, 
  Message01Icon, 
  GameController01Icon, 
  PaintBrush01Icon, 
  MusicNote01Icon, 
  Video01Icon, 
  Compass01Icon, 
  Rocket01Icon,
  Key01Icon,
  UserIcon,
  GlobalIcon,
  CheckIcon,
  Copy01Icon,
  SparklesIcon
} from '@hugeicons/core-free-icons';

// Cozy random setups for "Surprise Me"
const COZY_ROOM_NAMES = [
  'Music Chill',
  'Study Sanctuary',
  'Tea Corner',
  'Cozy Fireplace',
  'Garden Talk',
  'Cloud Watching',
  'Stargazing',
  'Book Nook',
  'Pixel Art',
  'Coffee House',
  'Sleepy Squad'
];

const COZY_ROOM_DESCS = [
  'Grab a warm beverage and talk about tunes 🎵',
  'Quiet space for focus and sharing ideas 📚',
  'Just a cozy nook for tea lovers ☕',
  'Warm vibes and comfortable conversations 🔥',
  'Watch the flowers grow and chat with friends 🌸',
  'Discuss your favorite cloud shapes ☁️',
  'Quiet nightly thoughts under the stars ✨',
  'Reading together and sharing cozy quotes 📖',
  'A small space for cozy retro pixel art 🎨',
  'The smell of fresh coffee and friendly chats ☕',
  'Late night sleepy chatter 🌙'
];

const COZY_ROOM_ICONS = [
  'MusicNote01Icon',
  'Compass01Icon',
  'Message01Icon',
  'Home01Icon',
  'Compass01Icon',
  'Rocket01Icon',
  'Rocket01Icon',
  'Compass01Icon',
  'PaintBrush01Icon',
  'Home01Icon',
  'Message01Icon'
];

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

export default function HomePage() {
  const router = useRouter();
  
  // Form states
  const [username, setUsername] = useState('');
  const [avatar, setAvatar] = useState('🌸');
  const [roomName, setRoomName] = useState('');
  const [roomDescription, setRoomDescription] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('Home01Icon');
  const [privacy, setPrivacy] = useState<'public' | 'private' | 'invite'>('public');
  const [roomCode, setRoomCode] = useState('');
  const [activeTab, setActiveTab] = useState<'create' | 'join'>('create');
  const [step, setStep] = useState(1);
  
  // Status states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Public Rooms states
  const [showPublicRooms, setShowPublicRooms] = useState(false);
  const [publicRooms, setPublicRooms] = useState<any[]>([]);
  const [loadingPublicRooms, setLoadingPublicRooms] = useState(false);

  // Mounted state to prevent hydration errors from browser extensions
  const [mounted, setMounted] = useState(false);

  // Hydrate username and avatar from localStorage on mount
  useEffect(() => {
    const savedUsername = safeGetItem('rio_username') || safeGetItem('whisper_username');
    if (savedUsername) {
      setUsername(savedUsername);
    }
    const savedAvatar = safeGetItem('rio_avatar') || safeGetItem('whisper_avatar');
    if (savedAvatar) {
      setAvatar(savedAvatar);
    }
    setMounted(true);
  }, []);

  // Surprise Me logic
  const handleSurpriseMe = () => {
    const randIndex = Math.floor(Math.random() * COZY_ROOM_NAMES.length);
    setRoomName(COZY_ROOM_NAMES[randIndex]);
    setRoomDescription(COZY_ROOM_DESCS[randIndex]);
    setSelectedIcon(COZY_ROOM_ICONS[randIndex] || 'Home01Icon');
    setPrivacy('public');
  };

  // Fetch Public Rooms
  const fetchPublicRooms = async () => {
    setLoadingPublicRooms(true);
    try {
      const { data, error: dbError } = await supabase
        .from('rooms')
        .select('*')
        .eq('privacy', 'public')
        .order('created_at', { ascending: false });

      if (dbError) throw dbError;
      setPublicRooms(data || []);
    } catch (err) {
      console.error('Failed to fetch public rooms:', err);
    } finally {
      setLoadingPublicRooms(false);
    }
  };

  const handleOpenPublicRooms = () => {
    setShowPublicRooms(true);
    fetchPublicRooms();
  };

  // Form submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedUsername = username.trim();
    if (!trimmedUsername) {
      setError('Please choose a username to continue.');
      return;
    }

    if (trimmedUsername.length < 2 || trimmedUsername.length > 20) {
      setError('Username must be between 2 and 20 characters.');
      return;
    }

    if (trimmedUsername.includes('|')) {
      setError('Username cannot contain the "|" character.');
      return;
    }

    // Save username & avatar locally
    safeSetItem('rio_username', trimmedUsername);
    safeSetItem('rio_avatar', avatar);
    safeSetItem('whisper_username', trimmedUsername);
    safeSetItem('whisper_avatar', avatar);

    if (activeTab === 'create') {
      if (step === 1) {
        setStep(2);
      } else if (step === 2) {
        const trimmedRoomName = roomName.trim();
        if (!trimmedRoomName) {
          setError('Please enter a room name.');
          return;
        }
        if (trimmedRoomName.length < 3 || trimmedRoomName.length > 30) {
          setError('Room name must be between 3 and 30 characters.');
          return;
        }
        setStep(3);
      } else if (step === 3) {
        setLoading(true);
        try {
          const trimmedRoomName = roomName.trim();
          const response = await fetch('/api/rooms', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              roomName: trimmedRoomName,
              description: roomDescription.trim(),
              iconName: selectedIcon,
              privacy,
              owner: trimmedUsername
            }),
          });

          const result = await response.json();

          if (!response.ok || !result.success) {
            setError(result.error || 'Failed to create room.');
            setLoading(false);
            return;
          }

          // Redirect to room
          router.push(`/room/${result.room.id}`);
        } catch (err) {
          console.error('Submission error:', err);
          setError('An unexpected error occurred. Please try again.');
          setLoading(false);
        }
      }
    } else {
      // Join Flow
      if (step === 1) {
        setStep(2);
      } else if (step === 2) {
        const cleanCode = roomCode.trim().toLowerCase();
        if (!cleanCode) {
          setError('Please enter a 6-character room code.');
          return;
        }

        setLoading(true);
        try {
          // Verify room
          const { data: room, error: dbError } = await supabase
            .from('rooms')
            .select('id, name')
            .eq('id', cleanCode)
            .maybeSingle();

          if (dbError) {
            console.error('Database connection error:', dbError);
            setError('Could not connect to database. Please try again.');
            setLoading(false);
            return;
          }

          if (!room) {
            setError('Room not found. Please verify the code and try again.');
            setLoading(false);
            return;
          }

          router.push(`/room/${room.id}`);
        } catch (err) {
          console.error('Submission error:', err);
          setError('An unexpected error occurred. Please try again.');
          setLoading(false);
        }
      }
    }
  };

  const handleJoinPublicRoom = (roomId: string) => {
    const trimmedUsername = username.trim();
    if (!trimmedUsername) {
      setError('Please choose a username before joining a room.');
      setShowPublicRooms(false);
      return;
    }
    safeSetItem('rio_username', trimmedUsername);
    safeSetItem('rio_avatar', avatar);
    safeSetItem('whisper_username', trimmedUsername);
    safeSetItem('whisper_avatar', avatar);
    router.push(`/room/${roomId}`);
  };

  return (
    <main className="center-layout home-layout">
      {/* SVG Decorative Clouds */}
      <svg className="decor-cloud decor-cloud-1" width="130" height="80" viewBox="0 0 120 80" fill="#FFF">
        <path d="M30 40a20 20 0 0 1 40-10 25 25 0 0 1 45 15 20 20 0 0 1-5 35H30a20 20 0 0 1 0-40z" opacity="0.95"/>
      </svg>
      <svg className="decor-cloud decor-cloud-2" width="160" height="90" viewBox="0 0 120 80" fill="#FFF">
        <path d="M30 40a20 20 0 0 1 40-10 25 25 0 0 1 45 15 20 20 0 0 1-5 35H30a20 20 0 0 1 0-40z" opacity="0.95"/>
      </svg>
      <svg className="decor-cloud decor-cloud-3" width="90" height="60" viewBox="0 0 120 80" fill="#FFF">
        <path d="M30 40a20 20 0 0 1 40-10 25 25 0 0 1 45 15 20 20 0 0 1-5 35H30a20 20 0 0 1 0-40z" opacity="0.8"/>
      </svg>

      {/* SVG Leafy Plant (Terracotta Pot) - Bottom Left */}
      <svg className="decor-plant" width="200" height="200" viewBox="0 0 200 200" fill="none">
        {/* Leaves */}
        <path d="M60 120 C40 80 40 40 80 60 C80 90 70 110 60 120 Z" fill="#65A30D" stroke="#3F6212" strokeWidth="4"/>
        <path d="M90 120 C100 70 120 40 135 70 C120 100 105 115 90 120 Z" fill="#4D7C0F" stroke="#3F6212" strokeWidth="4"/>
        <path d="M110 130 C150 100 170 80 150 120 C130 140 120 135 110 130 Z" fill="#84CC16" stroke="#3F6212" strokeWidth="4"/>
        <path d="M75 130 C40 110 20 100 45 140 C60 145 70 135 75 130 Z" fill="#a3e635" stroke="#3F6212" strokeWidth="4"/>
        {/* Pot */}
        <path d="M60 130 H120 L110 180 H70 Z" fill="#EA580C" stroke="#7C2D12" strokeWidth="5"/>
        <rect x="54" y="120" width="72" height="15" rx="6" fill="#F97316" stroke="#7C2D12" strokeWidth="5"/>
      </svg>

      {/* SVG Pink Flower (Terracotta Pot) - Bottom Right */}
      <svg className="decor-flower" width="180" height="180" viewBox="0 0 180 180" fill="none">
        {/* Stem */}
        <path d="M90 120 V80" stroke="#4D7C0F" strokeWidth="6" strokeLinecap="round"/>
        {/* Leaves */}
        <path d="M90 100 C75 95 65 95 72 105 C80 110 90 105 90 100 Z" fill="#4D7C0F" stroke="#3F6212" strokeWidth="3"/>
        {/* Petals */}
        <circle cx="90" cy="55" r="18" fill="#F472B6" stroke="#BE185D" strokeWidth="4"/>
        <circle cx="70" cy="70" r="18" fill="#F472B6" stroke="#BE185D" strokeWidth="4"/>
        <circle cx="110" cy="70" r="18" fill="#F472B6" stroke="#BE185D" strokeWidth="4"/>
        <circle cx="80" cy="90" r="18" fill="#F472B6" stroke="#BE185D" strokeWidth="4"/>
        <circle cx="100" cy="90" r="18" fill="#F472B6" stroke="#BE185D" strokeWidth="4"/>
        {/* Center */}
        <circle cx="90" cy="75" r="14" fill="#FACC15" stroke="#BE185D" strokeWidth="4"/>
        {/* Pot */}
        <path d="M65 115 H115 L107 160 H73 Z" fill="#D97706" stroke="#78350F" strokeWidth="4"/>
        <rect x="60" y="106" width="60" height="12" rx="5" fill="#F59E0B" stroke="#78350F" strokeWidth="4"/>
      </svg>

      {/* Main Claymorphic Card Container */}
      <div className="clay-card home-card">
        {/* Mascot sitting on top of the card holding the app name "rio" */}
        <div className="chibi-peeking-container">
          <img src="/rio_mascot.png" className="chibi-peeking-img" alt="rio mascot" />
        </div>

        {/* Since the new mascot image already has "rio" beautifully written on it, we skip duplicate logo text */}
        <div style={{ height: '20px' }}></div>
        <p className="home-subtitle">Join a cozy room or create one for your squad</p>

        {mounted ? (
          <>
            {/* Step Indicator */}
            <div className="step-indicator">
              <div className={`step-dot ${step >= 1 ? 'active' : ''}`} />
              <div className="step-line" />
              <div className={`step-dot ${step >= 2 ? 'active' : ''}`} />
              {activeTab === 'create' && (
                <>
                  <div className="step-line" />
                  <div className={`step-dot ${step >= 3 ? 'active' : ''}`} />
                </>
              )}
            </div>

            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleSubmit}>
              {/* Step 1: Avatar, Username, Tab Switcher */}
              {step === 1 && (
                <div className="step-container">
                  {/* Avatar Selector */}
                  <div className="input-group">
                    <label className="input-label">Choose Avatar</label>
                    <div className="avatar-picker-row">
                      {COZY_AVATARS.map((emoji) => (
                        <button
                          key={emoji}
                          type="button"
                          className={`avatar-picker-btn ${avatar === emoji ? 'active' : ''}`}
                          onClick={() => setAvatar(emoji)}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Username Input */}
                  <div className="input-group" style={{ marginBottom: 0 }}>
                    <label className="input-label" htmlFor="username">Choose Username</label>
                    <div className="clay-input-wrapper">
                      <HugeiconsIcon icon={UserIcon} className="clay-input-icon" size={18} />
                      <input
                        id="username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="e.g. Alyx 🌸"
                        maxLength={20}
                        className="text-input"
                        required
                        disabled={loading}
                        autoComplete="off"
                      />
                    </div>
                  </div>

                  <div className="divider" style={{ margin: '4px 0 10px 0' }}>Room Setup</div>

                  {/* Recessed Tab Switcher */}
                  <div className="tabs-header-recessed" style={{ marginBottom: 0 }}>
                    <button
                      type="button"
                      className={`tab-btn-clay ${activeTab === 'create' ? 'active' : ''}`}
                      onClick={() => {
                        setActiveTab('create');
                        setError(null);
                      }}
                      disabled={loading}
                    >
                      Create
                    </button>
                    <button
                      type="button"
                      className={`tab-btn-clay ${activeTab === 'join' ? 'active' : ''}`}
                      onClick={() => {
                        setActiveTab('join');
                        setError(null);
                      }}
                      disabled={loading}
                    >
                      Join
                    </button>
                  </div>

                  <button
                    type="submit"
                    className="btn-primary-clay"
                    disabled={loading}
                    style={{ marginTop: '8px' }}
                  >
                    Next Step
                  </button>
                </div>
              )}

              {/* Step 2 (Create): Room Name & Description */}
              {step === 2 && activeTab === 'create' && (
                <div className="step-container">
                  {/* Room Name Input */}
                  <div className="input-group" style={{ marginBottom: 0 }}>
                    <label className="input-label" htmlFor="roomName">Room Name</label>
                    <div className="clay-input-wrapper">
                      <HugeiconsIcon icon={SparklesIcon} className="clay-input-icon" size={18} />
                      <input
                        id="roomName"
                        type="text"
                        value={roomName}
                        onChange={(e) => setRoomName(e.target.value)}
                        placeholder="e.g. Chill Corner"
                        maxLength={30}
                        className="text-input"
                        required={activeTab === 'create'}
                        disabled={loading}
                        autoComplete="off"
                        style={{ paddingRight: '48px' }}
                      />
                      <button
                        type="button"
                        className="input-inline-btn"
                        onClick={handleSurpriseMe}
                        title="Cozy random setup"
                        disabled={loading}
                      >
                        ✨
                      </button>
                    </div>
                  </div>

                  {/* Room Description Input */}
                  <div className="input-group" style={{ marginBottom: 0 }}>
                    <label className="input-label" htmlFor="roomDesc">What's this room about?</label>
                    <div className="clay-input-wrapper">
                      <HugeiconsIcon icon={Message01Icon} className="clay-input-icon" size={18} />
                      <input
                        id="roomDesc"
                        type="text"
                        value={roomDescription}
                        onChange={(e) => setRoomDescription(e.target.value)}
                        placeholder="Pop it in below..."
                        maxLength={60}
                        className="text-input"
                        disabled={loading}
                        autoComplete="off"
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
                    <button
                      type="button"
                      className="btn-primary-clay btn-accent-clay"
                      onClick={() => {
                        setError(null);
                        setStep(1);
                      }}
                      disabled={loading}
                      style={{ flex: 1, padding: '14px 12px' }}
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="btn-primary-clay"
                      disabled={loading}
                      style={{ flex: 2 }}
                    >
                      Next Step
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3 (Create): Room Icon & Privacy Selection */}
              {step === 3 && activeTab === 'create' && (
                <div className="step-container">
                  {/* Icon Picker (Clay Tiles Grid) */}
                  <div className="input-group" style={{ marginBottom: 0 }}>
                    <label className="input-label">Pick Room Icon</label>
                    <div className="icon-picker-grid">
                      {Object.keys(ICON_MAP).map((iconKey) => {
                        const IconData = ICON_MAP[iconKey];
                        return (
                          <div
                            key={iconKey}
                            className={`icon-picker-tile ${selectedIcon === iconKey ? 'active' : ''}`}
                            onClick={() => setSelectedIcon(iconKey)}
                          >
                            {IconData && <HugeiconsIcon icon={IconData} />}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Privacy chips selector */}
                  <div className="input-group" style={{ marginBottom: 0 }}>
                    <label className="input-label">Privacy Mode</label>
                    <div className="chips-container">
                      <div
                        className={`privacy-chip ${privacy === 'public' ? 'active' : ''}`}
                        onClick={() => setPrivacy('public')}
                      >
                        Public
                      </div>
                      <div
                        className={`privacy-chip ${privacy === 'private' ? 'active' : ''}`}
                        onClick={() => setPrivacy('private')}
                      >
                        Private
                      </div>
                      <div
                        className={`privacy-chip ${privacy === 'invite' ? 'active' : ''}`}
                        onClick={() => setPrivacy('invite')}
                      >
                        Invite
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
                    <button
                      type="button"
                      className="btn-primary-clay btn-accent-clay"
                      onClick={() => {
                        setError(null);
                        setStep(2);
                      }}
                      disabled={loading}
                      style={{ flex: 1, padding: '14px 12px' }}
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="btn-primary-clay"
                      disabled={loading}
                      style={{ flex: 2 }}
                    >
                      {loading ? 'Creating...' : 'Create Room'}
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2 (Join): Room Code Input */}
              {step === 2 && activeTab === 'join' && (
                <div className="step-container">
                  <div className="input-group" style={{ marginBottom: 0 }}>
                    <label className="input-label" htmlFor="roomCode">Room Code</label>
                    <div className="clay-input-wrapper">
                      <HugeiconsIcon icon={Key01Icon} className="clay-input-icon" size={18} />
                      <input
                        id="roomCode"
                        type="text"
                        value={roomCode}
                        onChange={(e) => {
                          let val = e.target.value;
                          if (val.includes('/room/')) {
                            const parts = val.split('/room/');
                            let code = parts[parts.length - 1];
                            if (code) {
                              code = code.split('?')[0].split('#')[0].replace(/\/+$/, '');
                              val = code.slice(0, 6);
                            }
                          } else {
                            val = val.slice(0, 6);
                          }
                          setRoomCode(val.toLowerCase());
                        }}
                        placeholder="e.g. a1b2c3"
                        className="text-input"
                        required={activeTab === 'join'}
                        disabled={loading}
                        autoComplete="off"
                        style={{ textTransform: 'lowercase' }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
                    <button
                      type="button"
                      className="btn-primary-clay btn-accent-clay"
                      onClick={() => {
                        setError(null);
                        setStep(1);
                      }}
                      disabled={loading}
                      style={{ flex: 1, padding: '14px 12px' }}
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="btn-primary-clay"
                      disabled={loading}
                      style={{ flex: 2 }}
                    >
                      {loading ? 'Joining...' : 'Join Room'}
                    </button>
                  </div>
                </div>
              )}
            </form>

            {/* Ghost button for browsing public rooms */}
            {step === 1 && (
              <button
                type="button"
                className="btn-ghost-clay"
                onClick={handleOpenPublicRooms}
              >
                <HugeiconsIcon icon={GlobalIcon} size={18} /> Browse public rooms
              </button>
            )}
          </>
        ) : (
          <div className="skeleton-placeholder" style={{ height: '300px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '16px' }}>
            <div className="typing-bubble" style={{ padding: '24px', border: '3px solid var(--text-heading)', borderRadius: '24px', background: 'var(--surface-card)', boxShadow: '0 8px 0 0 var(--card-shadow)', display: 'flex', gap: '6px' }}>
              <div className="typing-dot" style={{ background: 'var(--primary-purple)', width: '10px', height: '10px', borderRadius: '50%' }}></div>
              <div className="typing-dot" style={{ background: 'var(--primary-purple)', width: '10px', height: '10px', borderRadius: '50%' }}></div>
              <div className="typing-dot" style={{ background: 'var(--primary-purple)', width: '10px', height: '10px', borderRadius: '50%' }}></div>
            </div>
            <span style={{ color: 'var(--text-heading)', fontWeight: '900', fontSize: '1rem' }}>
              Opening lobby... 🌸
            </span>
          </div>
        )}
      </div>

      {/* Public Rooms Modal Sheet */}
      {showPublicRooms && (
        <div className="modal-overlay" onClick={() => setShowPublicRooms(false)}>
          <div className="clay-card modal-card" onClick={(e) => e.stopPropagation()}>
            <h2 style={{ fontSize: '1.6rem', marginBottom: '8px', textAlign: 'center' }}>Cozy Public Rooms</h2>
            <p style={{ textAlign: 'center', marginBottom: '20px', fontSize: '0.9rem' }}>Join an active room and say hello!</p>
            
            {loadingPublicRooms ? (
              <div style={{ textAlign: 'center', padding: '20px', fontWeight: 'bold' }}>Searching for rooms...</div>
            ) : publicRooms.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)' }}>No public rooms found. Create one!</div>
            ) : (
              <div className="public-rooms-list">
                {publicRooms.map((room) => {
                  const IconData = ICON_MAP[room.icon_name] || Home01Icon;
                  return (
                    <div 
                      key={room.id} 
                      className="public-room-item-clay"
                      onClick={() => handleJoinPublicRoom(room.id)}
                    >
                      <div className="public-room-left">
                        <div className="public-room-icon">
                          <HugeiconsIcon icon={IconData} />
                        </div>
                        <div className="public-room-info">
                          <span className="public-room-name">{room.name}</span>
                          <span className="public-room-desc">{room.description || 'A cozy space'}</span>
                        </div>
                      </div>
                      <div className="invite-code-copy-btn" style={{ pointerEvents: 'none' }}>
                        <HugeiconsIcon icon={CheckIcon} size={16} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            
            <button
              type="button"
              className="btn-primary-clay"
              style={{ marginTop: '20px' }}
              onClick={() => setShowPublicRooms(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
