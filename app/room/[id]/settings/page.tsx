'use client';

import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { HugeiconsIcon } from '@hugeicons/react';
import { 
  ArrowLeft01Icon, 
  Settings01Icon, 
  Copy01Icon, 
  CheckIcon, 
  Notification01Icon, 
  Logout01Icon,
  Home01Icon,
  Message01Icon,
  GameController01Icon,
  PaintBrush01Icon,
  MusicNote01Icon,
  Video01Icon,
  Compass01Icon,
  Rocket01Icon,
  Key01Icon
} from '@hugeicons/core-free-icons';

interface SettingsPageProps {
  params: Promise<{ id: string }>;
}

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

export default function SettingsPage({ params }: SettingsPageProps) {
  const router = useRouter();
  const { id: roomId } = use(params);

  // States
  const [roomName, setRoomName] = useState('');
  const [roomIcon, setRoomIcon] = useState('Home01Icon');
  const [roomDescription, setRoomDescription] = useState('');
  const [privacy, setPrivacy] = useState('public');
  const [owner, setOwner] = useState('');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  // Toggle states
  const [notifications, setNotifications] = useState(true);
  const [sounds, setSounds] = useState(true);

  useEffect(() => {
    const fetchRoomDetails = async () => {
      const { data: room, error } = await supabase
        .from('rooms')
        .select('*')
        .eq('id', roomId)
        .maybeSingle();

      if (error || !room) {
        console.error('Failed to load room settings:', error);
        router.push('/');
        return;
      }

      setRoomName(room.name);
      setRoomIcon(room.icon_name || 'Home01Icon');
      setRoomDescription(room.description || 'A cozy space for friends.');
      setPrivacy(room.privacy || 'public');
      setOwner(room.owner || '');
      setLoading(false);

      // Hydrate local preferences
      const savedNotifs = localStorage.getItem(`rio_notif_${roomId}`) || localStorage.getItem(`whisper_notif_${roomId}`);
      if (savedNotifs !== null) {
        setNotifications(savedNotifs === 'true');
      }
      const savedSounds = localStorage.getItem(`rio_sounds_${roomId}`) || localStorage.getItem(`whisper_sounds_${roomId}`);
      if (savedSounds !== null) {
        setSounds(savedSounds === 'true');
      }
    };

    fetchRoomDetails();
  }, [roomId, router]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(roomId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleToggleNotifications = (val: boolean) => {
    setNotifications(val);
    localStorage.setItem(`rio_notif_${roomId}`, String(val));
    localStorage.setItem(`whisper_notif_${roomId}`, String(val));
  };

  const handleToggleSounds = (val: boolean) => {
    setSounds(val);
    localStorage.setItem(`rio_sounds_${roomId}`, String(val));
    localStorage.setItem(`whisper_sounds_${roomId}`, String(val));
  };

  const handleLeaveRoom = () => {
    router.push('/');
  };

  if (loading) {
    return (
      <div className="center-layout">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
          <div className="typing-bubble" style={{ padding: '24px', border: '3px solid var(--text-heading)', borderRadius: '24px', background: 'var(--surface-card)', boxShadow: '0 8px 0 0 var(--card-shadow)' }}>
            <div className="typing-dot" style={{ background: 'var(--primary-purple)' }}></div>
            <div className="typing-dot" style={{ background: 'var(--primary-purple)' }}></div>
            <div className="typing-dot" style={{ background: 'var(--primary-purple)' }}></div>
          </div>
          <span style={{ color: 'var(--text-heading)', fontWeight: '900' }}>Loading settings...</span>
        </div>
      </div>
    );
  }

  const IconComp = ICON_MAP[roomIcon] || Home01Icon;

  return (
    <main className="center-layout">
      {/* SVG Decorative Clouds */}
      <svg className="decor-cloud decor-cloud-1" width="130" height="80" viewBox="0 0 120 80" fill="#FFF">
        <path d="M30 40a20 20 0 0 1 40-10 25 25 0 0 1 45 15 20 20 0 0 1-5 35H30a20 20 0 0 1 0-40z" opacity="0.95"/>
      </svg>
      <svg className="decor-cloud decor-cloud-2" width="160" height="90" viewBox="0 0 120 80" fill="#FFF">
        <path d="M30 40a20 20 0 0 1 40-10 25 25 0 0 1 45 15 20 20 0 0 1-5 35H30a20 20 0 0 1 0-40z" opacity="0.95"/>
      </svg>

      <div className="clay-card home-card" style={{ maxWidth: '480px' }}>
        {/* Back Button */}
        <button 
          className="header-back-btn" 
          onClick={() => router.push(`/room/${roomId}`)}
          style={{ position: 'absolute', top: '20px', left: '20px' }}
        >
          <HugeiconsIcon icon={ArrowLeft01Icon} size={18} />
        </button>

        {/* Large Room Icon Badge */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '20px', marginBottom: '24px' }}>
          <div className="header-icon-tile" style={{ width: '72px', height: '72px', borderRadius: '24px', boxShadow: '0 6px 0 0 var(--card-shadow)' }}>
            <HugeiconsIcon icon={IconComp} size={36} />
          </div>
          <h2 style={{ fontSize: '1.8rem', marginTop: '16px', color: 'var(--text-heading)' }}>{roomName}</h2>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: '4px', padding: '0 10px' }}>
            {roomDescription}
          </p>
          
          <div className="notification-group-chip" style={{ marginTop: '12px', marginBottom: 0, textTransform: 'capitalize' }}>
            {privacy} Room
          </div>
        </div>

        {/* Invite Code Section */}
        <div className="input-group" style={{ marginBottom: '24px' }}>
          <label className="input-label">Invite Code</label>
          <div className="invite-code-card">
            <span className="invite-code-text">{roomId}</span>
            <button className="invite-code-copy-btn" onClick={handleCopyCode}>
              {copied ? <HugeiconsIcon icon={CheckIcon} size={16} /> : <HugeiconsIcon icon={Copy01Icon} size={16} />}
            </button>
          </div>
        </div>

        {/* Settings stack list */}
        <h3 style={{ fontSize: '1.1rem', marginBottom: '12px', paddingLeft: '4px' }}>Preferences</h3>
        <div className="settings-rows-stack">
          {/* Notifications Toggle */}
          <div className="settings-row-clay">
            <div className="settings-row-left">
              <div className="settings-row-icon">
                <HugeiconsIcon icon={Notification01Icon} size={18} />
              </div>
              <span className="settings-row-label">Mute Notifications</span>
            </div>
            <label className="clay-toggle">
              <input 
                type="checkbox" 
                checked={!notifications} 
                onChange={(e) => handleToggleNotifications(!e.target.checked)} 
              />
              <span className="clay-toggle-slider"></span>
            </label>
          </div>

          {/* Sound Effects Toggle */}
          <div className="settings-row-clay">
            <div className="settings-row-left">
              <div className="settings-row-icon">
                <HugeiconsIcon icon={Settings01Icon} size={18} />
              </div>
              <span className="settings-row-label">Sound Effects</span>
            </div>
            <label className="clay-toggle">
              <input 
                type="checkbox" 
                checked={sounds} 
                onChange={(e) => handleToggleSounds(e.target.checked)} 
              />
              <span className="clay-toggle-slider"></span>
            </label>
          </div>

          {/* Owner info row */}
          {owner && (
            <div className="settings-row-clay">
              <div className="settings-row-left">
                <div className="settings-row-icon">
                  <HugeiconsIcon icon={Key01Icon} size={18} />
                </div>
                <span className="settings-row-label">Created By</span>
              </div>
              <span style={{ fontWeight: '900', color: 'var(--primary-purple)' }}>{owner}</span>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="divider" style={{ margin: '28px 0 20px 0' }}>Danger Zone</div>

        {/* Leave Room Button */}
        <button 
          className="btn-primary-clay btn-leave-room" 
          onClick={handleLeaveRoom}
        >
          <HugeiconsIcon icon={Logout01Icon} size={18} /> Leave Room
        </button>
      </div>
    </main>
  );
}
