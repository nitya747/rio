'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { safeGetItem } from '@/lib/safeStorage';
import { HugeiconsIcon } from '@hugeicons/react';
import { 
  ArrowLeft01Icon, 
  Notification01Icon,
  Home01Icon,
  Message01Icon,
  GameController01Icon,
  PaintBrush01Icon,
  MusicNote01Icon,
  Video01Icon,
  Compass01Icon,
  Rocket01Icon
} from '@hugeicons/core-free-icons';

interface NotificationItem {
  id: string;
  roomId: string;
  roomName: string;
  roomIcon: string;
  sender: string;
  text: string;
  createdAt: string;
  isUnread: boolean;
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

export default function NotificationsPage() {
  const router = useRouter();
  
  // States
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('');

  useEffect(() => {
    const savedUsername = safeGetItem('rio_username') || safeGetItem('whisper_username') || '';
    setUsername(savedUsername);

    const fetchNotifications = async () => {
      try {
        const { data, error } = await supabase
          .from('messages')
          .select('*, rooms (name, icon_name)')
          .order('created_at', { ascending: false })
          .limit(20);

        if (error) throw error;

        if (data) {
          const filtered = data
            .filter((msg: any) => msg.author !== savedUsername && msg.author !== 'System')
            .map((msg: any) => {
              const roomInfo = msg.rooms || {};
              return {
                id: msg.id,
                roomId: msg.room_id,
                roomName: roomInfo.name || 'Cozy Room',
                roomIcon: roomInfo.icon_name || 'Home01Icon',
                sender: msg.author,
                text: msg.text,
                createdAt: msg.created_at,
                isUnread: new Date().getTime() - new Date(msg.created_at).getTime() < 2 * 60 * 60 * 1000
              };
            });

          setNotifications(filtered);
        }
      } catch (err) {
        console.error('Failed to fetch notifications:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const handleNotificationClick = (roomId: string) => {
    router.push(`/room/${roomId}`);
  };

  const getGroupedNotifications = () => {
    const grouped: Record<string, NotificationItem[]> = {
      Today: [],
      Yesterday: [],
      Earlier: []
    };

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);

    notifications.forEach(notif => {
      const date = new Date(notif.createdAt);
      date.setHours(0, 0, 0, 0);

      if (date.getTime() === today.getTime()) {
        grouped.Today.push(notif);
      } else if (date.getTime() === yesterday.getTime()) {
        grouped.Yesterday.push(notif);
      } else {
        grouped.Earlier.push(notif);
      }
    });

    return grouped;
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
          <span style={{ color: 'var(--text-heading)', fontWeight: '900' }}>Reading notifications...</span>
        </div>
      </div>
    );
  }

  const grouped = getGroupedNotifications();
  const hasNotifications = notifications.length > 0;

  return (
    <main className="center-layout">
      {/* SVG Decorative Clouds */}
      <svg className="decor-cloud decor-cloud-1" width="130" height="80" viewBox="0 0 120 80" fill="#FFF">
        <path d="M30 40a20 20 0 0 1 40-10 25 25 0 0 1 45 15 20 20 0 0 1-5 35H30a20 20 0 0 1 0-40z" opacity="0.95"/>
      </svg>
      <svg className="decor-cloud decor-cloud-2" width="160" height="90" viewBox="0 0 120 80" fill="#FFF">
        <path d="M30 40a20 20 0 0 1 40-10 25 25 0 0 1 45 15 20 20 0 0 1-5 35H30a20 20 0 0 1 0-40z" opacity="0.95"/>
      </svg>

      <div className="clay-card home-card" style={{ maxWidth: '480px', marginTop: '40px' }}>
        {/* Back Button */}
        <button 
          className="header-back-btn" 
          onClick={() => router.push('/')}
          style={{ position: 'absolute', top: '20px', left: '20px' }}
        >
          <HugeiconsIcon icon={ArrowLeft01Icon} size={18} />
        </button>

        {/* Bell Header Icon with Sparkle */}
        <div className="bell-header-container">
          <div className="bell-badge-tile">
            <HugeiconsIcon icon={Notification01Icon} size={36} />
            <div className="bell-sparkle">✦</div>
          </div>
        </div>

        {/* Title */}
        <div style={{ textAlign: 'center', marginTop: '20px', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '1.8rem', color: 'var(--text-heading)' }}>What's New ✦</h2>
        </div>

        {/* List of Grouped Notifications */}
        {!hasNotifications ? (
          <div className="notifications-empty-state">
            <img src="/chibi_full.png" className="notifications-empty-img" alt="chibi full body" />
            <div className="notifications-empty-text">All caught up! 🌸</div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '8px' }}>
              Check back later for cozy updates from your squad.
            </p>
          </div>
        ) : (
          <div style={{ maxHeight: '350px', overflowY: 'auto', paddingRight: '4px' }}>
            {Object.entries(grouped).map(([day, items]) => {
              if (items.length === 0) return null;
              return (
                <div key={day} style={{ display: 'flex', flexDirection: 'column' }}>
                  <div style={{ textAlign: 'center' }}>
                    <span className="notification-group-chip">{day}</span>
                  </div>
                  {items.map(notif => {
                    const IconData = ICON_MAP[notif.roomIcon] || Home01Icon;
                    return (
                      <div 
                        key={notif.id}
                        className={`notification-card-clay ${notif.isUnread ? 'unread' : 'read'}`}
                        onClick={() => handleNotificationClick(notif.roomId)}
                        style={{ cursor: 'pointer' }}
                      >
                        <div className="notification-left">
                          <div className="notification-icon-tile">
                            <HugeiconsIcon icon={IconData} />
                          </div>
                          <div className="notification-info">
                            <span className="notification-author">{notif.sender}</span>
                            <span className="notification-text">
                              sent a message in <strong>{notif.roomName}</strong>
                            </span>
                          </div>
                        </div>
                        <div className="notification-right">
                          <span className="notification-time">
                            {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          {notif.isUnread && <span className="notification-unread-dot"></span>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
