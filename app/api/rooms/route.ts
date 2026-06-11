import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { customAlphabet } from 'nanoid';

// Create a generator for a 6-character lowercase alphanumeric room code
const generateRoomId = customAlphabet('abcdefghijklmnopqrstuvwxyz0123456789', 6);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { roomName, description, iconName, privacy, owner } = body;

    if (!roomName || typeof roomName !== 'string' || roomName.trim() === '') {
      return NextResponse.json(
        { error: 'Room name is required' },
        { status: 400 }
      );
    }

    const roomId = generateRoomId();

    const { data, error } = await supabase
      .from('rooms')
      .insert({
        id: roomId,
        name: roomName.trim(),
        description: description ? description.trim() : null,
        icon_name: iconName || 'Home01Icon',
        privacy: privacy || 'public',
        owner: owner ? owner.trim() : null,
      })
      .select()
      .single();

    if (error) {
      console.error('Database error creating room:', error);
      return NextResponse.json(
        { error: 'Failed to create room in database' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, room: data });
  } catch (err) {
    console.error('Server error creating room:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
