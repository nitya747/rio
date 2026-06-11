'use client';

import React, { useState, useEffect, useRef, use } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { safeGetItem } from '@/lib/safeStorage';
import { HugeiconsIcon } from '@hugeicons/react';
import { 
  ArrowLeft01Icon,
  UserGroupIcon
} from '@hugeicons/core-free-icons';

interface MembersPageProps {
  params: Promise<{ id: string }>;
}

interface Member {
  name: string;
  avatar?: string;
  isOwner: boolean;
  isOnline: boolean;
  isIdle?: boolean;
}

export default function MembersPage({ params }: MembersPageProps) {
  const router = useRouter();
  const { id: roomId } = use(params);

  // States
  const [roomName, setRoomName] = useState('');
  const [owner, setOwner] = useState('');
  const [members, setMembers] = useState<Member[]>([]);
  const [onlineUsernames, setOnlineUsernames] = useState<string[]>([]);
  const [onlineUsersData, setOnlineUsersData] = useState<Record<string, { avatar: string }>>({});
  const [loading, setLoading] = useState(true);

  // Supabase Channel Ref
  const channelRef = useRef<any>(null);

  useEffect(() => {
    const fetchRoomAndMembers = async () => {
      // 1. Get room info
      const { data: room, error: roomError } = await supabase
        .from('rooms')
        .select('*')
        .eq('id', roomId)
        .maybeSingle();

      if (roomError || !room) {
        console.error('Failed to fetch room details:', roomError);
        router.push('/');
        return;
      }

      setRoomName(room.name);
      setOwner(room.owner || '');

      // 2. Fetch distinct message authors
      const { data: messages, error: messagesError } = await supabase
        .from('messages')
        .select('author')
        .eq('room_id', roomId);

      const historicalNames = new Set<string>();
      const memberAvatars = new Map<string, string>();
      
      if (room.owner) {
        historicalNames.add(room.owner);
      }

      if (!messagesError && messages) {
        messages.forEach((msg: any) => {
          if (msg.author && msg.author !== 'System') {
            const [name, avatar] = msg.author.split('|');
            historicalNames.add(name);
            if (avatar) {
              memberAvatars.set(name, avatar);
            }
          }
        });
      }

      const memberList: Member[] = Array.from(historicalNames).map(name => ({
        name,
        avatar: memberAvatars.get(name) || '',
        isOwner: name === room.owner,
        isOnline: false
      }));

      setMembers(memberList);
      setLoading(false);
    };

    fetchRoomAndMembers();
  }, [roomId, router]);

  // Presence channel to track online status
  useEffect(() => {
    const savedUsername = safeGetItem('rio_username') || safeGetItem('whisper_username') || 'Guest';

    const channel = supabase.channel(`room_presence:${roomId}`, {
      config: {
        presence: {
          key: savedUsername,
        },
      },
    });

    channelRef.current = channel;

    channel.on('presence', { event: 'sync' }, () => {
      const state = channel.presenceState();
      const activeNames = Object.keys(state);
      setOnlineUsernames(activeNames);

      const data: Record<string, { avatar: string }> = {};
      activeNames.forEach(name => {
        const presences = state[name] as any;
        if (presences && presences.length > 0) {
          data[name] = { avatar: presences[0].avatar || '' };
        }
      });
      setOnlineUsersData(data);
    });

    channel.subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        await channel.track({
          joinedAt: Date.now(),
          avatar: safeGetItem('rio_avatar') || safeGetItem('whisper_avatar') || '🌸',
        });
      }
    });

    return () => {
      if (channelRef.current) {
        channelRef.current.unsubscribe();
      }
    };
  }, [roomId]);

  // Merge historical members and currently online users who may not have sent messages yet
  const allMemberNames = new Set<string>();
  members.forEach(m => allMemberNames.add(m.name));
  onlineUsernames.forEach(name => allMemberNames.add(name));

  const processedMembers = Array.from(allMemberNames).map(name => {
    const histMember = members.find(m => m.name === name);
    const isOnline = onlineUsernames.includes(name);
    const avatar = histMember?.avatar || onlineUsersData[name]?.avatar || '';
    return {
      name,
      avatar,
      isOwner: name === owner,
      isOnline
    };
  });

  const sortedMembers = [...processedMembers].sort((a, b) => {
    if (a.isOwner) return -1;
    if (b.isOwner) return 1;
    if (a.isOnline && !b.isOnline) return -1;
    if (!a.isOnline && b.isOnline) return 1;
    return a.name.localeCompare(b.name);
  });

  const onlineList = sortedMembers.filter(m => m.isOnline);
  const offlineList = sortedMembers.filter(m => !m.isOnline);

  const getInitials = (name: string) => {
    return name.slice(0, 2);
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
          <span style={{ color: 'var(--text-heading)', fontWeight: '900' }}>Loading squad list...</span>
        </div>
      </div>
    );
  }

  const avatarGroupPreview = sortedMembers.slice(0, 4);

  return (
    <main className="center-layout">
      {/* SVG Decorative Clouds */}
      <svg className="decor-cloud decor-cloud-1" width="130" height="80" viewBox="0 0 120 80" fill="#FFF">
        <path d="M30 40a20 20 0 0 1 40-10 25 25 0 0 1 45 15 20 20 0 0 1-5 35H30a20 20 0 0 1 0-40z" opacity="0.95"/>
      </svg>
      <svg className="decor-cloud decor-cloud-2" width="160" height="90" viewBox="0 0 120 80" fill="#FFF">
        <path d="M30 40a20 20 0 0 1 40-10 25 25 0 0 1 45 15 20 20 0 0 1-5 35H30a20 20 0 0 1 0-40z" opacity="0.95"/>
      </svg>

      <div className="clay-card home-card" style={{ maxWidth: '460px', marginTop: '40px' }}>
        {/* Back Button */}
        <button 
          className="header-back-btn" 
          onClick={() => router.push(`/room/${roomId}`)}
          style={{ position: 'absolute', top: '20px', left: '20px' }}
        >
          <HugeiconsIcon icon={ArrowLeft01Icon} size={18} />
        </button>

        {/* Overlapping member avatars peeking above the card */}
        <div className="members-header-badge-row">
          {avatarGroupPreview.map((m, idx) => (
            <div key={m.name} className="members-header-avatar" style={{ zIndex: 10 - idx, fontSize: m.avatar ? '1.3rem' : '0.8rem' }}>
              {m.avatar || getInitials(m.name)}
            </div>
          ))}
        </div>

        {/* Header Title */}
        <div style={{ textAlign: 'center', marginTop: '20px', marginBottom: '8px' }}>
          <h2 style={{ fontSize: '1.8rem', color: 'var(--text-heading)' }}>Who's Here 💜</h2>
          <div className="notification-group-chip" style={{ marginTop: '8px', marginBottom: '16px' }}>
            {sortedMembers.length} squad members
          </div>
        </div>

        {/* Online Section */}
        <div className="members-section-title">Online now</div>
        {onlineList.length === 0 ? (
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', paddingLeft: '4px', fontStyle: 'italic' }}>No one online.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {onlineList.map(member => (
              <div key={member.name} className="member-row-clay">
                <div className="member-row-left">
                  <div className={`member-avatar-ring ${member.isOwner ? 'owner' : ''}`}>
                    <div className="member-avatar-inner" style={{ fontSize: member.avatar ? '1.3rem' : '0.85rem' }}>
                      {member.avatar || getInitials(member.name)}
                      <span className="msg-avatar-status online" style={{ right: '-2px', bottom: '-2px' }}></span>
                    </div>
                  </div>
                  <div className="member-details">
                    <span className="member-name">
                      {member.name}
                      {member.isOwner && (
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="#E9B84A" stroke="#7C2D12" strokeWidth="2.5" style={{ marginLeft: '2px', display: 'inline-block' }}>
                          <path d="M2 4l4 6 6-8 6 8 4-6v16H2V4z"/>
                        </svg>
                      )}
                    </span>
                    <span className="member-role">{member.isOwner ? 'Room Owner' : 'Member'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Offline Section */}
        <div className="members-section-title" style={{ marginTop: '24px' }}>Offline</div>
        {offlineList.length === 0 ? (
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', paddingLeft: '4px', fontStyle: 'italic', marginBottom: '10px' }}>No offline members.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '10px' }}>
            {offlineList.map(member => (
              <div key={member.name} className="member-row-clay" style={{ opacity: 0.7 }}>
                <div className="member-row-left">
                  <div className={`member-avatar-ring ${member.isOwner ? 'owner' : ''}`}>
                    <div className="member-avatar-inner" style={{ background: '#DFD9CE', fontSize: member.avatar ? '1.3rem' : '0.85rem' }}>
                      {member.avatar || getInitials(member.name)}
                    </div>
                  </div>
                  <div className="member-details">
                    <span className="member-name">
                      {member.name}
                      {member.isOwner && (
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="#E9B84A" stroke="#7C2D12" strokeWidth="2.5" style={{ marginLeft: '2px', display: 'inline-block' }}>
                          <path d="M2 4l4 6 6-8 6 8 4-6v16H2V4z"/>
                        </svg>
                      )}
                    </span>
                    <span className="member-role">{member.isOwner ? 'Room Owner' : 'Member'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
