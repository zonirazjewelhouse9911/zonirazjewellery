import React, { useEffect, useRef } from 'react';
import { useVideoCall } from '../context/VideoCallContext';

export default function VideoCallModal() {
  const {
    callStatus,
    callProduct,
    localStream,
    remoteStream,
    endCall,
    dismissStatus,
  } = useVideoCall();

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  // Attach streams to video elements when mounted or stream updates
  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream, callStatus]);

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream, callStatus]);

  // Don't render if idle
  if (callStatus === 'idle') return null;

  const isConnected = callStatus === 'connected';
  const isCalling = callStatus === 'calling';
  const isEnded = callStatus === 'ended';
  const isDeclined = callStatus === 'declined';
  const isOffline = callStatus === 'offline';

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <style>{`
          @keyframes vcPulse {
            0%, 100% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.12); opacity: 0.7; }
          }
          @keyframes vcRing {
            0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(99,77,64,0.5); }
            70% { transform: scale(1.05); box-shadow: 0 0 0 18px rgba(99,77,64,0); }
            100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(99,77,64,0); }
          }
          @keyframes vcFadeIn {
            from { opacity: 0; transform: translateY(20px) scale(0.97); }
            to { opacity: 1; transform: translateY(0) scale(1); }
          }
          @keyframes vcSpin {
            to { transform: rotate(360deg); }
          }
        `}</style>

        {/* Header */}
        <div style={styles.header}>
          <div style={styles.headerLeft}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
              <polygon points="23 7 16 12 23 17 23 7"/>
              <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
            </svg>
            <span style={styles.headerTitle}>Live Video Consultation</span>
          </div>
          {(isEnded || isDeclined || isOffline) && (
            <button onClick={dismissStatus} style={styles.closeBtn}>✕</button>
          )}
          {(isCalling || isConnected) && (
            <button onClick={endCall} style={{ ...styles.closeBtn, background: 'rgba(255,255,255,0.15)' }}>
              End
            </button>
          )}
        </div>

        {/* Product Banner */}
        {callProduct && (
          <div style={styles.productBanner}>
            {callProduct.image && (
              <img src={callProduct.image} alt={callProduct.name} style={styles.productImg} />
            )}
            <div>
              <div style={styles.productLabel}>Enquiring about</div>
              <div style={styles.productName}>{callProduct.name}</div>
            </div>
          </div>
        )}

        {/* ── States ── */}

        {/* Calling — waiting for admin to answer */}
        {isCalling && (
          <div style={styles.stateBox}>
            <div style={styles.ringAvatar}>
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#634d40" strokeWidth="1.8">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
            <div style={styles.stateTitle}>Connecting to Store Advisor...</div>
            <div style={styles.stateSubtitle}>Please wait. Our advisor will answer shortly.</div>
            <div style={styles.spinner}/>
          </div>
        )}

        {/* Connected — live video */}
        {isConnected && (
          <div style={styles.videoContainer}>
            {/* Remote (admin) video — large */}
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              style={styles.remoteVideo}
            />
            {/* Local (user) PiP */}
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              style={styles.localVideo}
            />
            {/* Live badge */}
            <div style={styles.liveBadge}>
              <span style={styles.liveDot}/>
              LIVE
            </div>
          </div>
        )}

        {/* Ended */}
        {isEnded && (
          <div style={styles.stateBox}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>📞</div>
            <div style={styles.stateTitle}>Call Ended</div>
            <div style={styles.stateSubtitle}>Thank you for consulting with Zoniraz.</div>
            <button onClick={dismissStatus} style={styles.actionBtn}>Close</button>
          </div>
        )}

        {/* Declined */}
        {isDeclined && (
          <div style={styles.stateBox}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>😔</div>
            <div style={styles.stateTitle}>Call Declined</div>
            <div style={styles.stateSubtitle}>Our advisor is busy right now. Please try again in a moment.</div>
            <button onClick={dismissStatus} style={styles.actionBtn}>Close</button>
          </div>
        )}

        {/* Admin offline */}
        {isOffline && (
          <div style={styles.stateBox}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🔴</div>
            <div style={styles.stateTitle}>Advisor Offline</div>
            <div style={styles.stateSubtitle}>
              No store advisor is available right now.
              <br/>Try again later or contact us via WhatsApp.
            </div>
            <button onClick={dismissStatus} style={styles.actionBtn}>Close</button>
          </div>
        )}

        {/* Controls when connected */}
        {isConnected && (
          <div style={styles.controls}>
            <button
              style={{ ...styles.ctrlBtn, background: '#5c4b6e' }}
              onClick={() => {
                if (localStream) {
                  const audioTracks = localStream.getAudioTracks();
                  audioTracks.forEach(t => { t.enabled = !t.enabled; });
                }
              }}
              title="Toggle Microphone"
            >
              🎙️
            </button>
            <button
              style={{ ...styles.ctrlBtn, background: '#e53935' }}
              onClick={endCall}
              title="End Call"
            >
              📵
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(15,10,25,0.82)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 99999,
    backdropFilter: 'blur(6px)',
    animation: 'vcFadeIn 0.3s ease',
  },
  modal: {
    background: '#1a1025',
    borderRadius: 20,
    width: '92%',
    maxWidth: 480,
    overflow: 'hidden',
    boxShadow: '0 30px 80px rgba(0,0,0,0.6)',
    fontFamily: "'Inter', sans-serif",
    color: '#fff',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 20px',
    background: '#634d40',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: 700,
    letterSpacing: 0.3,
    color: '#fff',
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    color: '#fff',
    fontSize: 14,
    fontWeight: 700,
    cursor: 'pointer',
    padding: '4px 10px',
    borderRadius: 6,
    background: 'rgba(255,255,255,0.15)',
  },
  productBanner: {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    padding: '12px 20px',
    background: 'rgba(255,255,255,0.05)',
    borderBottom: '1px solid rgba(255,255,255,0.08)',
  },
  productImg: {
    width: 52,
    height: 52,
    objectFit: 'cover',
    borderRadius: 8,
    border: '2px solid rgba(255,255,255,0.15)',
  },
  productLabel: {
    fontSize: 10,
    color: '#c4aa9f',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 3,
  },
  productName: {
    fontSize: 13,
    fontWeight: 600,
    color: '#fff',
  },
  stateBox: {
    padding: '40px 24px 32px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    gap: 8,
  },
  ringAvatar: {
    width: 80,
    height: 80,
    borderRadius: '50%',
    background: '#f7f0ee',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    animation: 'vcRing 1.5s ease-out infinite',
  },
  stateTitle: {
    fontSize: 18,
    fontWeight: 700,
    color: '#fff',
    marginBottom: 4,
  },
  stateSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.6)',
    lineHeight: 1.6,
    marginBottom: 8,
  },
  spinner: {
    width: 28,
    height: 28,
    borderRadius: '50%',
    border: '3px solid rgba(255,255,255,0.15)',
    borderTop: '3px solid #c4aa9f',
    animation: 'vcSpin 0.9s linear infinite',
    marginTop: 12,
  },
  actionBtn: {
    marginTop: 16,
    padding: '10px 28px',
    background: '#634d40',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    fontWeight: 700,
    fontSize: 14,
    cursor: 'pointer',
  },
  videoContainer: {
    position: 'relative',
    width: '100%',
    height: 300,
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
    width: 88,
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
    animation: 'vcPulse 1.5s ease infinite',
  },
  controls: {
    display: 'flex',
    justifyContent: 'center',
    gap: 20,
    padding: '18px 24px',
    background: 'rgba(0,0,0,0.3)',
  },
  ctrlBtn: {
    width: 52,
    height: 52,
    borderRadius: '50%',
    border: 'none',
    fontSize: 22,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    color: '#fff',
    transition: 'transform 0.15s',
  },
};
