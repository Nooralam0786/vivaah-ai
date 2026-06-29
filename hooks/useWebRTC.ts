'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { Socket } from 'socket.io-client';
import type { CallSession, CallType } from '@/components/call/CallModal';

/* Free STUN servers — enough for most users */
const ICE_SERVERS: RTCIceServer[] = [
  { urls: 'stun:stun.l.google.com:19302' },
  { urls: 'stun:stun1.l.google.com:19302' },
];

const IDLE: CallSession = {
  state: 'idle', callType: 'audio',
  remoteUserId: '', remoteName: '', remotePhoto: null,
};

export function useWebRTC(socket: Socket | null) {
  const [session,      setSession]      = useState<CallSession>(IDLE);
  const [localStream,  setLocalStream]  = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [micOn,        setMicOn]        = useState(true);
  const [camOn,        setCamOn]        = useState(true);

  const pc        = useRef<RTCPeerConnection | null>(null);
  const sessionRef = useRef(session);
  useEffect(() => { sessionRef.current = session; }, [session]);

  /* ── Create peer connection ─────────────────────────────────── */
  const createPC = useCallback(() => {
    const conn = new RTCPeerConnection({ iceServers: ICE_SERVERS });

    const rs = new MediaStream();
    setRemoteStream(rs);

    conn.ontrack = (e) => { e.streams[0]?.getTracks().forEach((t) => rs.addTrack(t)); };

    conn.onicecandidate = (e) => {
      if (e.candidate && socket) {
        socket.emit('call:ice-candidate', {
          toUserId:  sessionRef.current.remoteUserId,
          candidate: e.candidate.toJSON(),
        });
      }
    };

    conn.onconnectionstatechange = () => {
      if (conn.connectionState === 'disconnected' || conn.connectionState === 'failed') {
        hangup();
      }
    };

    pc.current = conn;
    return conn;
  }, [socket]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── Get media ──────────────────────────────────────────────── */
  const getMedia = useCallback(async (callType: CallType) => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: callType === 'video',
    });
    setLocalStream(stream);
    return stream;
  }, []);

  /* ── Initiate call ──────────────────────────────────────────── */
  const startCall = useCallback(async (
    toUserId: string, remoteName: string, remotePhoto: string | null, callType: CallType,
  ) => {
    if (!socket) return;

    setSession({ state: 'calling', callType, remoteUserId: toUserId, remoteName, remotePhoto });

    const stream = await getMedia(callType);
    const conn   = createPC();

    stream.getTracks().forEach((t) => conn.addTrack(t, stream));

    const offer = await conn.createOffer();
    await conn.setLocalDescription(offer);

    socket.emit('call:offer', { toUserId, offer, callType });
  }, [socket, getMedia, createPC]);

  /* ── Answer call ────────────────────────────────────────────── */
  const answerCall = useCallback(async () => {
    if (!socket || !session.offer) return;

    const stream = await getMedia(session.state === 'incoming' ? session.callType : 'audio');
    const conn   = createPC();

    stream.getTracks().forEach((t) => conn.addTrack(t, stream));

    await conn.setRemoteDescription(new RTCSessionDescription(session.offer));
    const answer = await conn.createAnswer();
    await conn.setLocalDescription(answer);

    socket.emit('call:answer', { toUserId: session.remoteUserId, answer });
    setSession((s) => ({ ...s, state: 'connected' }));
  }, [socket, session, getMedia, createPC]);

  /* ── Reject / hangup ────────────────────────────────────────── */
  const rejectCall = useCallback(() => {
    if (socket) socket.emit('call:reject', { toUserId: session.remoteUserId });
    hangup();
  }, [socket, session]); // eslint-disable-line react-hooks/exhaustive-deps

  const hangup = useCallback(() => {
    pc.current?.close();
    pc.current = null;
    localStream?.getTracks().forEach((t) => t.stop());
    setLocalStream(null);
    setRemoteStream(null);
    setSession(IDLE);
    setMicOn(true);
    setCamOn(true);
  }, [localStream]);

  const endCall = useCallback(() => {
    if (socket) socket.emit('call:end', { toUserId: session.remoteUserId });
    hangup();
  }, [socket, session, hangup]);

  /* ── Toggle mic / cam ───────────────────────────────────────── */
  const toggleMic = useCallback(() => {
    localStream?.getAudioTracks().forEach((t) => { t.enabled = !t.enabled; });
    setMicOn((v) => !v);
  }, [localStream]);

  const toggleCam = useCallback(() => {
    localStream?.getVideoTracks().forEach((t) => { t.enabled = !t.enabled; });
    setCamOn((v) => !v);
  }, [localStream]);

  /* ── Socket listeners ───────────────────────────────────────── */
  useEffect(() => {
    if (!socket) return;

    const onIncoming = ({ fromUserId, offer, callType, remoteName, remotePhoto }: {
      fromUserId: string; offer: RTCSessionDescriptionInit;
      callType: CallType; remoteName?: string; remotePhoto?: string | null;
    }) => {
      setSession({
        state: 'incoming', callType,
        remoteUserId: fromUserId,
        remoteName:   remoteName  ?? 'Unknown',
        remotePhoto:  remotePhoto ?? null,
        offer,
      });
    };

    const onAnswered = async ({ answer }: { answer: RTCSessionDescriptionInit }) => {
      await pc.current?.setRemoteDescription(new RTCSessionDescription(answer));
      setSession((s) => ({ ...s, state: 'connected' }));
    };

    const onRejected = () => hangup();
    const onEnded    = () => hangup();

    const onIce = async ({ candidate }: { candidate: RTCIceCandidateInit }) => {
      try { await pc.current?.addIceCandidate(new RTCIceCandidate(candidate)); } catch {}
    };

    socket.on('call:incoming',     onIncoming);
    socket.on('call:answered',     onAnswered);
    socket.on('call:rejected',     onRejected);
    socket.on('call:ended',        onEnded);
    socket.on('call:ice-candidate', onIce);

    return () => {
      socket.off('call:incoming',     onIncoming);
      socket.off('call:answered',     onAnswered);
      socket.off('call:rejected',     onRejected);
      socket.off('call:ended',        onEnded);
      socket.off('call:ice-candidate', onIce);
    };
  }, [socket, hangup]);

  return {
    session, localStream, remoteStream,
    micOn, camOn,
    startCall, answerCall, rejectCall, endCall,
    toggleMic, toggleCam,
  };
}
