import React, { useEffect, useRef, useState } from 'react';
import { useVideoCall } from '../context/VideoCallContext';

export default function AdminVideoPanel() {
  const {
    callStatus,
    incomingCall,
    localStream,
    remoteStream,
    acceptCall,
    declineCall,
    endCall,
    goOnline,
    goOffline,
  } = useVideoCall();

  const [isOnline, setIsOnline] = useState(false);
  const [adminName, setAdminName] = useState('Store Advisor');
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  // Attach streams
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

  // Go offline on component unmount
  useEffect(() => {
    return () => { if (isOnline) goOffline(); };
  }, [isOnline]);

  const handleToggleOnline = () => {
    if (isOnline) {
      goOffline();
      setIsOnline(false);
    } else {
      goOnline(adminName);
      setIsOnline(true);
    }
  };

  const isConnected = callStatus === 'connected';
  const isRinging = callStatus === 'ringing';

  return (
    <div style={s.page}>
      <style>{`
        @keyframes ringPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(222,53,129,0.6); }
          50% { box-shadow: 0 0 0 20px rgba(222,53,129,0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      {/* ── Header ── */}
      <div style={s.header}>
        <div style={s.logo}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#634d40" strokeWidth="2">
            <polygon points="23 7 16 12 23 17 23 7"/>
            <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
          </svg>
          <span>Zoniraz — Video Call Admin Panel</span>
        </div>
        <div style={{
          ...s.statusDot,
          background: isOnline ? '#4caf50' : '#9e9e9e',
        }}>
          {isOnline ? '🟢 Online' : '⚪ Offline'}
        </div>
      </div>

      {/* ── Go Online Card ── */}
      {!isConnected && !isRinging && (
        <div style={s.card}>
          <h2 style={s.cardTitle}>Availability Status</h2>
          <p style={s.cardDesc}>
            Toggle your status to allow customers to start a live video consultation with you.
          </p>

          <div style={s.nameRow}>
            <label style={s.label}>Your Display Name</label>
            <input
              style={s.input}
              value={adminName}
              onChange={e => setAdminName(e.target.value)}
              placeholder="e.g. Priya — Diamond Specialist"
              disabled={isOnline}
            />
          </div>

          <button
            onClick={handleToggleOnline}
            style={{
              ...s.toggleBtn,
              background: isOnline ? '#e53935' : '#4caf50',
            }}
          >
            {isOnline ? '🔴  Go Offline' : '🟢  Go Online for Video Calls'}
          </button>

          {isOnline && (
            <p style={s.waitingMsg}>
              ⏳ Waiting for customers to call... Customers can now see you as available.
            </p>
          )}
        </div>
      )}

      {/* ── Incoming Call ── */}
      {isRinging && incomingCall && (
        <div style={{ ...s.card, animation: 'fadeIn 0.3s ease' }}>
          <div style={s.ringIconWrap}>
            📞
          </div>
          <h2 style={s.cardTitle}>Incoming Video Call</h2>
          {incomingCall.product && (
            <div style={s.incomingProduct}>
              {incomingCall.product.image && (
                <img
                  src={incomingCall.product.image}
                  alt={incomingCall.product.name}
                  style={s.incomingImg}
                />
              )}
              <div>
                <div style={s.incomingLabel}>Customer is asking about:</div>
                <div style={s.incomingProductName}>{incomingCall.product.name}</div>
              </div>
            </div>
          )}
          <div style={s.callBtns}>
            <button onClick={acceptCall} style={{ ...s.callBtn, background: '#4caf50' }}>
              ✅ Accept
            </button>
            <button onClick={declineCall} style={{ ...s.callBtn, background: '#e53935' }}>
              ❌ Decline
            </button>
          </div>
        </div>
      )}

      {/* ── Active Call ── */}
      {isConnected && (
        <div style={s.videoCard}>
          <div style={s.videoWrapper}>
            {/* Customer video — large */}
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              style={s.remoteVideo}
            />
            {/* Admin self PiP */}
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              style={s.localVideo}
            />
            <div style={s.liveBadge}>
              <span style={s.liveDot}/>
              LIVE
            </div>
          </div>

          {incomingCall?.product && (
            <div style={s.activeProductBar}>
              <span style={{ color: '#c4aa9f', fontSize: 12 }}>Discussing: </span>
              <strong style={{ color: '#fff', fontSize: 13 }}>{incomingCall.product.name}</strong>
            </div>
          )}

          <div style={s.controls}>
            <button
              style={{ ...s.ctrlBtn, background: '#5c4b6e' }}
              onClick={() => {
                if (localStream) {
                  localStream.getAudioTracks().forEach(t => { t.enabled = !t.enabled; });
                }
              }}
              title="Toggle Mic"
            >
              🎙️
            </button>
            <button
              style={{ ...s.ctrlBtn, background: '#e53935' }}
              onClick={endCall}
              title="End Call"
            >
              📵
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const s = {
  page: {
    minHeight: '100vh',
    background: '#efe7e5',
    fontFamily: "'Inter', sans-serif",
    color: '#634d40',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '18px 28px',
    background: '#fff',
    boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    fontWeight: 700,
    fontSize: 16,
    color: '#634d40',
  },
  statusDot: {
    padding: '5px 14px',
    borderRadius: 20,
    fontSize: 13,
    fontWeight: 600,
    color: '#fff',
    letterSpacing: 0.3,
  },
  card: {
    maxWidth: 520,
    margin: '40px auto',
    background: '#fff',
    borderRadius: 16,
    padding: '32px 28px',
    boxShadow: '0 4px 24px rgba(99,77,64,0.1)',
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: 700,
    color: '#634d40',
    marginBottom: 8,
  },
  cardDesc: {
    fontSize: 14,
    color: '#8a6a58',
    lineHeight: 1.6,
    marginBottom: 24,
  },
  nameRow: {
    marginBottom: 20,
  },
  label: {
    display: 'block',
    fontSize: 12,
    fontWeight: 600,
    color: '#634d40',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    width: '100%',
    padding: '10px 14px',
    border: '1px solid #d4c5bd',
    borderRadius: 8,
    fontSize: 14,
    color: '#634d40',
    outline: 'none',
    boxSizing: 'border-box',
  },
  toggleBtn: {
    width: '100%',
    padding: '14px',
    border: 'none',
    borderRadius: 10,
    fontSize: 15,
    fontWeight: 700,
    color: '#fff',
    cursor: 'pointer',
    letterSpacing: 0.3,
    transition: 'all 0.2s',
  },
  waitingMsg: {
    marginTop: 16,
    padding: '12px 16px',
    background: '#f0fdf4',
    borderRadius: 8,
    fontSize: 13,
    color: '#2e7d32',
    border: '1px solid #c8e6c9',
    textAlign: 'center',
  },
  ringIconWrap: {
    fontSize: 56,
    textAlign: 'center',
    marginBottom: 12,
    animation: 'ringPulse 1.2s ease-in-out infinite',
    display: 'block',
  },
  incomingProduct: {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    background: '#f7f0ee',
    borderRadius: 10,
    padding: '12px 16px',
    marginBottom: 24,
  },
  incomingImg: {
    width: 56,
    height: 56,
    objectFit: 'cover',
    borderRadius: 8,
    border: '2px solid #d4c5bd',
  },
  incomingLabel: {
    fontSize: 11,
    color: '#8a6a58',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  incomingProductName: {
    fontSize: 15,
    fontWeight: 700,
    color: '#634d40',
  },
  callBtns: {
    display: 'flex',
    gap: 14,
  },
  callBtn: {
    flex: 1,
    padding: '14px',
    border: 'none',
    borderRadius: 10,
    color: '#fff',
    fontSize: 15,
    fontWeight: 700,
    cursor: 'pointer',
  },
  videoCard: {
    maxWidth: 560,
    margin: '40px auto',
    background: '#1a1025',
    borderRadius: 16,
    overflow: 'hidden',
    boxShadow: '0 8px 40px rgba(0,0,0,0.3)',
  },
  videoWrapper: {
    position: 'relative',
    width: '100%',
    height: 320,
    background: '#0d0d1a',
  },
  remoteVideo: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  localVideo: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    width: 90,
    height: 120,
    objectFit: 'cover',
    borderRadius: 8,
    border: '2px solid rgba(255,255,255,0.4)',
    zIndex: 10,
  },
  liveBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    background: 'rgba(0,0,0,0.5)',
    padding: '4px 10px',
    borderRadius: 20,
    fontSize: 11,
    fontWeight: 700,
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    letterSpacing: 1,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: '50%',
    background: '#4caf50',
    display: 'inline-block',
  },
  activeProductBar: {
    padding: '10px 20px',
    background: '#2a1a35',
  },
  controls: {
    display: 'flex',
    justifyContent: 'center',
    gap: 20,
    padding: '18px',
    background: 'rgba(0,0,0,0.4)',
  },
  ctrlBtn: {
    width: 52,
    height: 52,
    borderRadius: '50%',
    border: 'none',
    fontSize: 22,
    cursor: 'pointer',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
};
