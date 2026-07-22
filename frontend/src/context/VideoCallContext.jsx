import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import { io } from 'socket.io-client';
import SimplePeer from 'simple-peer/simplepeer.min.js';
import { API_BASE_URL } from '../config';

export const VideoCallContext = createContext();

const SOCKET_URL = API_BASE_URL; // same server as REST API

export function VideoCallProvider({ children }) {
  const [adminOnline, setAdminOnline] = useState(false);
  const [callStatus, setCallStatus] = useState('idle');
  // idle | calling | ringing | connected | ended | declined | offline
  const [callProduct, setCallProduct] = useState(null);
  const [incomingCall, setIncomingCall] = useState(null);
  // { from: socketId, product: {…} }

  const socketRef = useRef(null);
  const peerRef = useRef(null);
  const localStreamRef = useRef(null);
  const remoteStreamRef = useRef(null);

  // Expose streams so components can attach to <video>
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);

  // Who we're in a call with (peer socket id)
  const peerSocketRef = useRef(null);

  // ── Connect to Socket.IO once ──────────────────────────────────────────────
  useEffect(() => {
    const socket = io(SOCKET_URL, { transports: ['websocket', 'polling'] });
    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('VideoCall socket connected:', socket.id);
    });

    // Admin status broadcast from server
    socket.on('admin-status', ({ online }) => {
      setAdminOnline(online);
    });

    // Admin went offline mid-call
    socket.on('call:ended', () => {
      cleanup();
      setCallStatus('ended');
    });

    // Admin declined
    socket.on('call:declined', () => {
      cleanup();
      setCallStatus('declined');
    });

    // Admin offline when we tried to call
    socket.on('call:admin-offline', () => {
      cleanup();
      setCallStatus('offline');
    });

    // ── USER side: admin answered ──────────────────────────────────────────
    socket.on('call:answered', async ({ answer }) => {
      if (peerRef.current) {
        peerRef.current.signal(answer);
      }
    });

    // ── ADMIN side: incoming call from user ───────────────────────────────
    socket.on('incoming-call', ({ from, offer, product }) => {
      setIncomingCall({ from, offer, product });
      setCallStatus('ringing');
    });

    // ── ICE candidates relay ──────────────────────────────────────────────
    socket.on('webrtc:ice-candidate', ({ from, candidate }) => {
      if (peerRef.current && candidate) {
        try {
          peerRef.current.signal({ type: 'candidate', candidate });
        } catch (e) {
          console.warn('ICE signal error:', e);
        }
      }
    });

    // Initial admin status poll
    fetch(`${API_BASE_URL}/api/video-call/admin-status`)
      .then(r => r.json())
      .then(d => setAdminOnline(d.online))
      .catch(() => {});

    return () => {
      socket.disconnect();
    };
  }, []);

  // ── Cleanup helper ─────────────────────────────────────────────────────────
  const cleanup = useCallback(() => {
    if (peerRef.current) {
      peerRef.current.destroy();
      peerRef.current = null;
    }
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(t => t.stop());
      localStreamRef.current = null;
    }
    setLocalStream(null);
    setRemoteStream(null);
    remoteStreamRef.current = null;
    peerSocketRef.current = null;
    setIncomingCall(null);
  }, []);

  // ── USER: start a call ─────────────────────────────────────────────────────
  const startCall = useCallback(async (product) => {
    if (!adminOnline) { setCallStatus('offline'); return; }
    setCallProduct(product);
    setCallStatus('calling');

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      localStreamRef.current = stream;
      setLocalStream(stream);

      const peer = new SimplePeer({ initiator: true, trickle: true, stream });
      peerRef.current = peer;

      peer.on('signal', (data) => {
        if (data.type === 'offer') {
          socketRef.current.emit('user:call-admin', {
            offer: data,
            product: { id: product.id, name: product.name, image: product.image },
          });
        } else if (data.candidate) {
          // ICE candidates — after offer is sent we relay through signaling
          socketRef.current.emit('webrtc:ice-candidate', {
            to: peerSocketRef.current,
            candidate: data.candidate,
          });
        }
      });

      peer.on('stream', (remoteStream) => {
        remoteStreamRef.current = remoteStream;
        setRemoteStream(remoteStream);
        setCallStatus('connected');
      });

      peer.on('error', (err) => {
        console.error('Peer error:', err);
        cleanup();
        setCallStatus('idle');
      });

      peer.on('close', () => {
        cleanup();
        setCallStatus('ended');
      });

    } catch (err) {
      console.error('getUserMedia error:', err);
      cleanup();
      setCallStatus('idle');
    }
  }, [adminOnline, cleanup]);

  // ── ADMIN: accept incoming call ────────────────────────────────────────────
  const acceptCall = useCallback(async () => {
    if (!incomingCall) return;
    const { from, offer } = incomingCall;
    peerSocketRef.current = from;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      localStreamRef.current = stream;
      setLocalStream(stream);

      const peer = new SimplePeer({ initiator: false, trickle: true, stream });
      peerRef.current = peer;

      peer.signal(offer);

      peer.on('signal', (data) => {
        if (data.type === 'answer') {
          socketRef.current.emit('admin:answer', { to: from, answer: data });
        } else if (data.candidate) {
          socketRef.current.emit('webrtc:ice-candidate', { to: from, candidate: data.candidate });
        }
      });

      peer.on('stream', (remoteStream) => {
        remoteStreamRef.current = remoteStream;
        setRemoteStream(remoteStream);
        setCallStatus('connected');
      });

      peer.on('error', (err) => {
        console.error('Peer error (admin):', err);
        cleanup();
        setCallStatus('idle');
      });

      peer.on('close', () => {
        cleanup();
        setCallStatus('ended');
      });

      setIncomingCall(null);
    } catch (err) {
      console.error('getUserMedia error (admin):', err);
      cleanup();
      setCallStatus('idle');
    }
  }, [incomingCall, cleanup]);

  // ── ADMIN: decline incoming call ───────────────────────────────────────────
  const declineCall = useCallback(() => {
    if (incomingCall) {
      socketRef.current.emit('admin:decline', { to: incomingCall.from });
    }
    setIncomingCall(null);
    setCallStatus('idle');
  }, [incomingCall]);

  // ── Either side: end call ──────────────────────────────────────────────────
  const endCall = useCallback(() => {
    const otherId = peerSocketRef.current || (incomingCall?.from);
    if (otherId) {
      socketRef.current.emit('call:end', { to: otherId });
    }
    cleanup();
    setCallStatus('idle');
    setCallProduct(null);
  }, [cleanup, incomingCall]);

  // ── Admin: go online / offline ─────────────────────────────────────────────
  const goOnline = useCallback((name = 'Store Advisor') => {
    socketRef.current?.emit('admin:go-online', { name });
  }, []);

  const goOffline = useCallback(() => {
    socketRef.current?.emit('admin:go-offline');
  }, []);

  const dismissStatus = useCallback(() => {
    setCallStatus('idle');
    setCallProduct(null);
  }, []);

  return (
    <VideoCallContext.Provider value={{
      adminOnline,
      callStatus, setCallStatus,
      callProduct, setCallProduct,
      incomingCall,
      localStream,
      remoteStream,
      startCall,
      acceptCall,
      declineCall,
      endCall,
      goOnline,
      goOffline,
      dismissStatus,
      socketRef,
    }}>
      {children}
    </VideoCallContext.Provider>
  );
}

export function useVideoCall() {
  return useContext(VideoCallContext);
}
