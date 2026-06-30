'use client';

import { useEffect, useRef, useState } from 'react';
import { Phone, PhoneOff, Video, VideoOff, Mic, MicOff } from 'lucide-react';

/* ── Types ────────────────────────────────────────────────────── */
export type CallState = 'idle' | 'calling' | 'incoming' | 'connected' | 'ended';
export type CallType  = 'audio' | 'video';

export interface CallSession {
  state:       CallState;
  callType:    CallType;
  remoteUserId: string;
  remoteName:  string;
  remotePhoto: string | null;
  offer?:      RTCSessionDescriptionInit;
}

interface CallModalProps {
  session:    CallSession;
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  onAnswer():   void;
  onReject():   void;
  onEnd():      void;
  onToggleMic():   void;
  onToggleCam():   void;
  micOn:  boolean;
  camOn:  boolean;
}

/* ── Timer ────────────────────────────────────────────────────── */
function useCallTimer(active: boolean) {
  const [secs, setSecs] = useState(0);
  useEffect(() => {
    if (!active) { setSecs(0); return; }
    const id = setInterval(() => setSecs((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [active]);
  const mm = String(Math.floor(secs / 60)).padStart(2, '0');
  const ss = String(secs % 60).padStart(2, '0');
  return `${mm}:${ss}`;
}

/* ── Component ────────────────────────────────────────────────── */
export default function CallModal({
  session, localStream, remoteStream,
  onAnswer, onReject, onEnd, onToggleMic, onToggleCam,
  micOn, camOn,
}: CallModalProps) {
  const localVideoRef  = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const timer = useCallTimer(session.state === 'connected');

  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  if (session.state === 'idle') return null;

  const isVideo    = session.callType === 'video';
  const isIncoming = session.state === 'incoming';
  const isCalling  = session.state === 'calling';
  const isConnected = session.state === 'connected';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={isVideo ? 'Video call' : 'Audio call'}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
    >
      <div className={`relative bg-[#160C12] rounded-3xl overflow-hidden shadow-2xl flex flex-col w-full ${
        isVideo && isConnected ? 'max-w-2xl h-[80dvh]' : 'max-w-xs'
      }`}>

        {/* Remote video (full background when connected) */}
        {isVideo && isConnected && (
          <video
            ref={remoteVideoRef}
            autoPlay playsInline
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}

        {/* Overlay content */}
        <div className={`relative z-10 flex flex-col items-center w-full p-6 sm:p-8 ${isVideo && isConnected ? 'h-full justify-between' : ''}`}>

          {/* Top — name + status */}
          <div className="text-center mb-6 w-full min-w-0">
            <div className="w-20 h-20 rounded-full bg-[#6B1B3D] flex items-center justify-center mx-auto mb-3 overflow-hidden border-2 border-[#D4AF37]">
              {session.remotePhoto
                ? <img src={session.remotePhoto} alt="" className="w-full h-full object-cover" />
                : <span className="text-white text-3xl font-bold">{session.remoteName[0]}</span>
              }
            </div>
            <h3 className="text-white font-bold text-xl truncate px-2">{session.remoteName}</h3>
            <p className="text-white/60 text-sm mt-1">
              {isIncoming  && `Incoming ${isVideo ? 'video' : 'audio'} call…`}
              {isCalling   && 'Calling…'}
              {isConnected && timer}
            </p>
          </div>

          {/* Audio-only remote stream */}
          {!isVideo && <audio ref={remoteVideoRef as unknown as React.RefObject<HTMLAudioElement>} autoPlay />}

          {/* Local video (small PiP) */}
          {isVideo && isConnected && (
            <div className="absolute top-4 right-4 w-24 sm:w-28 aspect-video rounded-xl overflow-hidden border-2 border-white/20 bg-black">
              <video ref={localVideoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
            </div>
          )}

          {/* Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 mt-4">
            {isIncoming ? (
              <>
                {/* Reject */}
                <button onClick={onReject}
                  aria-label="Reject call"
                  className="w-14 h-14 sm:w-16 sm:h-16 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center transition-colors shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70">
                  <PhoneOff className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </button>
                {/* Answer */}
                <button onClick={onAnswer}
                  aria-label="Answer call"
                  className="w-14 h-14 sm:w-16 sm:h-16 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center transition-colors shadow-lg animate-pulse focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70">
                  <Phone className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </button>
              </>
            ) : (
              <>
                {/* Mic toggle */}
                <button onClick={onToggleMic}
                  aria-label={micOn ? 'Mute microphone' : 'Unmute microphone'}
                  aria-pressed={!micOn}
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70 ${micOn ? 'bg-white/20 hover:bg-white/30' : 'bg-red-500 hover:bg-red-600'}`}>
                  {micOn ? <Mic className="w-5 h-5 text-white" /> : <MicOff className="w-5 h-5 text-white" />}
                </button>
                {/* Cam toggle (video only) */}
                {isVideo && (
                  <button onClick={onToggleCam}
                    aria-label={camOn ? 'Turn off camera' : 'Turn on camera'}
                    aria-pressed={!camOn}
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70 ${camOn ? 'bg-white/20 hover:bg-white/30' : 'bg-red-500 hover:bg-red-600'}`}>
                    {camOn ? <Video className="w-5 h-5 text-white" /> : <VideoOff className="w-5 h-5 text-white" />}
                  </button>
                )}
                {/* End call */}
                <button onClick={onEnd}
                  aria-label="End call"
                  className="w-14 h-14 sm:w-16 sm:h-16 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center transition-colors shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70">
                  <PhoneOff className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
