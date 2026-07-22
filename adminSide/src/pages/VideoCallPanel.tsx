import { useState, useEffect, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import SimplePeer from 'simple-peer/simplepeer.min.js';
import { Video, VideoOff, Mic, MicOff, PhoneOff, PhoneCall, Radio } from 'lucide-react';

// Backend URL for Socket.IO connection (local vs production fallback)
const BACKEND_URL =
  import.meta.env.VITE_API_URL ||
  (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? 'http://localhost:55000'
    : 'https://zonirazjewellery.onrender.com');

interface IncomingCall {
  from: string;
  offer: SimplePeer.SignalData;
  product: {
    id: string | number;
    name: string;
    image?: string;
  };
}

export default function VideoCallPanel() {
  const [isOnline, setIsOnline] = useState(false);
  const [adminName, setAdminName] = useState('Store Advisor');
  const [callStatus, setCallStatus] = useState<'idle' | 'ringing' | 'connected' | 'ended'>('idle');
  const [incomingCall, setIncomingCall] = useState<IncomingCall | null>(null);
  const [micMuted, setMicMuted] = useState(false);
  const [camOff, setCamOff] = useState(false);
  const [connected, setConnected] = useState(false);

  const socketRef = useRef<Socket | null>(null);
  const peerRef = useRef<SimplePeer.Instance | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const callerSocketId = useRef<string | null>(null);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  // ── Connect socket once ──────────────────────────────────────────────────
  useEffect(() => {
    const socket = io(BACKEND_URL, { transports: ['websocket', 'polling'] });
    socketRef.current = socket;

    socket.on('connect', () => setConnected(true));
    socket.on('disconnect', () => setConnected(false));

    // Incoming call from a user
    socket.on('incoming-call', ({ from, offer, product }: IncomingCall) => {
      setIncomingCall({ from, offer, product });
      callerSocketId.current = from;
      setCallStatus('ringing');
    });

    // ICE candidates relay
    socket.on('webrtc:ice-candidate', ({ candidate }: { from: string; candidate: RTCIceCandidateInit }) => {
      if (peerRef.current && candidate) {
        try {
          peerRef.current.signal({ type: 'candidate', candidate } as unknown as SimplePeer.SignalData);
        } catch (e) {
          console.warn('ICE signal error:', e);
        }
      }
    });

    // User hung up
    socket.on('call:ended', () => {
      cleanup();
      setCallStatus('ended');
      setTimeout(() => setCallStatus('idle'), 3000);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // ── Cleanup helper ────────────────────────────────────────────────────────
  const cleanup = useCallback(() => {
    if (peerRef.current) { peerRef.current.destroy(); peerRef.current = null; }
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(t => t.stop());
      localStreamRef.current = null;
    }
    if (localVideoRef.current) localVideoRef.current.srcObject = null;
    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
    callerSocketId.current = null;
    setIncomingCall(null);
  }, []);

  // ── Toggle online status ─────────────────────────────────────────────────
  const handleToggleOnline = () => {
    if (!socketRef.current) return;
    if (isOnline) {
      socketRef.current.emit('admin:go-offline');
      setIsOnline(false);
    } else {
      socketRef.current.emit('admin:go-online', { name: adminName });
      setIsOnline(true);
    }
  };

  // ── Accept incoming call ─────────────────────────────────────────────────
  const handleAccept = async () => {
    if (!incomingCall || !socketRef.current) return;
    const { from, offer } = incomingCall;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      localStreamRef.current = stream;
      if (localVideoRef.current) localVideoRef.current.srcObject = stream;

      const peer = new SimplePeer({ initiator: false, trickle: true, stream });
      peerRef.current = peer;

      peer.signal(offer);

      peer.on('signal', (data: SimplePeer.SignalData) => {
        if ((data as any).type === 'answer') {
          socketRef.current?.emit('admin:answer', { to: from, answer: data });
        } else if ((data as any).candidate) {
          socketRef.current?.emit('webrtc:ice-candidate', { to: from, candidate: (data as any).candidate });
        }
      });

      peer.on('stream', (remoteStream: MediaStream) => {
        if (remoteVideoRef.current) remoteVideoRef.current.srcObject = remoteStream;
        setCallStatus('connected');
      });

      peer.on('error', (err: Error) => {
        console.error('Peer error:', err);
        cleanup();
        setCallStatus('idle');
      });

      peer.on('close', () => {
        cleanup();
        setCallStatus('ended');
        setTimeout(() => setCallStatus('idle'), 3000);
      });

      setIncomingCall(null);
    } catch (err) {
      console.error('Camera/mic access error:', err);
      cleanup();
      setCallStatus('idle');
    }
  };

  // ── Decline call ─────────────────────────────────────────────────────────
  const handleDecline = () => {
    if (incomingCall && socketRef.current) {
      socketRef.current.emit('admin:decline', { to: incomingCall.from });
    }
    setIncomingCall(null);
    setCallStatus('idle');
  };

  // ── End active call ──────────────────────────────────────────────────────
  const handleEndCall = () => {
    if (callerSocketId.current && socketRef.current) {
      socketRef.current.emit('call:end', { to: callerSocketId.current });
    }
    cleanup();
    setCallStatus('ended');
    setTimeout(() => setCallStatus('idle'), 3000);
  };

  // ── Toggle mic ───────────────────────────────────────────────────────────
  const toggleMic = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getAudioTracks().forEach(t => { t.enabled = !t.enabled; });
      setMicMuted(m => !m);
    }
  };

  // ── Toggle camera ────────────────────────────────────────────────────────
  const toggleCam = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getVideoTracks().forEach(t => { t.enabled = !t.enabled; });
      setCamOff(c => !c);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">

      {/* ── Page Header ── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span className="text-[10px] uppercase tracking-[0.4em] font-black text-slate-500">
            Live Consultation
          </span>
          <h1 className="text-4xl font-serif font-bold text-[#12100e] mt-2">
            Video Call Panel
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Go online to allow customers to start a live video consultation with you.
          </p>
        </div>

        {/* Socket connection indicator */}
        <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest border ${
          connected
            ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
            : 'bg-slate-100 border-slate-200 text-slate-400'
        }`}>
          <span className={`w-2 h-2 rounded-full ${connected ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
          {connected ? 'Server Connected' : 'Connecting...'}
        </div>
      </div>

      {/* ── Go Online Card ── */}
      {callStatus === 'idle' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-slate-100 bg-slate-50/50">
            <span className="text-[10px] uppercase tracking-widest font-black text-slate-400">
              Availability
            </span>
            <h2 className="text-xl font-serif font-bold text-[#12100e] mt-1">
              Your Status
            </h2>
          </div>

          <div className="p-8 space-y-6">
            {/* Name input */}
            <div>
              <label className="block text-[10px] uppercase tracking-widest font-black text-slate-500 mb-2">
                Display Name (shown to customers)
              </label>
              <input
                type="text"
                value={adminName}
                onChange={e => setAdminName(e.target.value)}
                disabled={isOnline}
                placeholder="e.g. Priya — Diamond Specialist"
                className="w-full max-w-sm px-4 py-3 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#5d463c]/30 disabled:bg-slate-50 disabled:text-slate-400"
              />
            </div>

            {/* Online Toggle */}
            <div className="flex items-center gap-6">
              <button
                onClick={handleToggleOnline}
                disabled={!connected}
                className={`flex items-center gap-3 px-8 py-4 rounded-xl font-bold text-sm uppercase tracking-[0.15em] transition-all shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                  isOnline
                    ? 'bg-red-500 hover:bg-red-600 text-white'
                    : 'bg-emerald-500 hover:bg-emerald-600 text-white'
                }`}
              >
                <Radio size={16} className={isOnline ? 'animate-pulse' : ''} />
                {isOnline ? 'Go Offline' : 'Go Online for Calls'}
              </button>

              <div className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-bold ${
                isOnline
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                  : 'bg-slate-100 border-slate-200 text-slate-400'
              }`}>
                <span className={`w-2.5 h-2.5 rounded-full ${isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
                {isOnline ? '🟢 Online — Accepting Calls' : '⚪ Offline'}
              </div>
            </div>

            {/* Waiting state message */}
            {isOnline && (
              <div className="flex items-start gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-xl max-w-lg">
                <PhoneCall size={18} className="text-emerald-600 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-bold text-emerald-800">Waiting for incoming calls...</p>
                  <p className="text-xs text-emerald-600 mt-0.5">
                    Customers browsing the store can see you're online and click the 📹 button on any product card to call you.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Ended state ── */}
      {callStatus === 'ended' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
          <div className="text-5xl">📞</div>
          <h2 className="text-xl font-serif font-bold text-[#12100e]">Call Ended</h2>
          <p className="text-sm text-slate-400">Thank you for consulting with the customer.</p>
        </div>
      )}

      {/* ── Incoming Call Card ── */}
      {callStatus === 'ringing' && incomingCall && (
        <div className="bg-white rounded-3xl border-2 border-[#5d463c]/30 shadow-lg overflow-hidden">
          <div className="bg-[#5d463c] p-6 text-white flex items-center gap-3">
            <PhoneCall size={20} className="animate-bounce" />
            <span className="font-bold text-sm uppercase tracking-widest">Incoming Video Call</span>
          </div>

          <div className="p-8 space-y-6">
            {/* Product info */}
            {incomingCall.product && (
              <div className="flex items-center gap-5 p-5 bg-[#f7f0ee] rounded-2xl">
                {incomingCall.product.image && (
                  <img
                    src={incomingCall.product.image}
                    alt={incomingCall.product.name}
                    className="w-16 h-16 rounded-xl object-cover border-2 border-[#d4c5bd]"
                  />
                )}
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">
                    Customer is enquiring about:
                  </p>
                  <p className="text-base font-serif font-bold text-[#12100e]">
                    {incomingCall.product.name}
                  </p>
                </div>
              </div>
            )}

            {/* Accept / Decline */}
            <div className="flex gap-4">
              <button
                onClick={handleAccept}
                className="flex-1 flex items-center justify-center gap-2 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm uppercase tracking-widest rounded-xl transition-all cursor-pointer shadow-sm"
              >
                <PhoneCall size={18} />
                Accept Call
              </button>
              <button
                onClick={handleDecline}
                className="flex-1 flex items-center justify-center gap-2 py-4 bg-red-100 hover:bg-red-200 text-red-600 font-bold text-sm uppercase tracking-widest rounded-xl transition-all cursor-pointer"
              >
                <PhoneOff size={18} />
                Decline
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Active Call ── */}
      {callStatus === 'connected' && (
        <div className="bg-[#1a1025] rounded-3xl overflow-hidden shadow-2xl">
          {/* Video area */}
          <div className="relative w-full" style={{ height: '420px' }}>
            {/* Remote (customer) video */}
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
            {/* Admin self PiP */}
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className="absolute bottom-4 right-4 w-28 h-36 object-cover rounded-xl border-2 border-white/40 z-10"
              style={{ display: camOff ? 'none' : 'block' }}
            />
            {camOff && (
              <div className="absolute bottom-4 right-4 w-28 h-36 rounded-xl border-2 border-white/20 bg-[#2a1a35] flex items-center justify-center z-10">
                <VideoOff size={20} className="text-white/40" />
              </div>
            )}
            {/* Live badge */}
            <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/50 px-3 py-1.5 rounded-full">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-bold text-white uppercase tracking-widest">Live</span>
            </div>
            {/* Product being discussed */}
            {incomingCall?.product && (
              <div className="absolute top-4 right-4 bg-black/50 px-3 py-2 rounded-xl max-w-44">
                <p className="text-[9px] text-white/60 uppercase tracking-wider">Discussing</p>
                <p className="text-xs font-bold text-white truncate">{incomingCall.product.name}</p>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-6 py-6 bg-black/30">
            {/* Mic toggle */}
            <button
              onClick={toggleMic}
              title={micMuted ? 'Unmute Mic' : 'Mute Mic'}
              className={`w-14 h-14 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                micMuted ? 'bg-red-500 text-white' : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              {micMuted ? <MicOff size={20} /> : <Mic size={20} />}
            </button>

            {/* End Call */}
            <button
              onClick={handleEndCall}
              title="End Call"
              className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center transition-all cursor-pointer shadow-lg"
            >
              <PhoneOff size={24} />
            </button>

            {/* Camera toggle */}
            <button
              onClick={toggleCam}
              title={camOff ? 'Turn Camera On' : 'Turn Camera Off'}
              className={`w-14 h-14 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                camOff ? 'bg-red-500 text-white' : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              {camOff ? <VideoOff size={20} /> : <Video size={20} />}
            </button>
          </div>
        </div>
      )}

      {/* ── Hidden video elements for idle/ringing (needed for stream attachment) ── */}
      <div style={{ display: 'none' }}>
        <video ref={localVideoRef} autoPlay playsInline muted />
        <video ref={remoteVideoRef} autoPlay playsInline />
      </div>
    </div>
  );
}
