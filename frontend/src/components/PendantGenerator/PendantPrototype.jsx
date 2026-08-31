import React, { useState } from 'react';
import { resolvePendantAssets } from './pendantAssetResolver';
import PendantCanvas from './PendantCanvas';

export default function PendantPrototype() {
  const [nameInput, setNameInput] = useState('VIKAS');
  const [style, setStyle] = useState('small_hook');
  const [material, setMaterial] = useState('gold_18k');
  const [bgColor, setBgColor] = useState('#faf7f5');

  // Fast preset names for testing real composition rules
  const presets = ['A', 'AN', 'AM', 'AMAN', 'VIKAS', 'RAHUL', 'PRIYA', 'WILLIAM', 'ALEX', 'KARAN'];

  // Resolve assets using real Cloudinary inventory
  const resolved = resolvePendantAssets(nameInput, style, material);

  return (
    <div style={{
      maxWidth: '900px',
      margin: '40px auto',
      padding: '30px',
      backgroundColor: '#ffffff',
      borderRadius: '24px',
      border: '1px solid #dbcfcb',
      boxShadow: '0 10px 30px rgba(43, 34, 29, 0.05)',
      fontFamily: "'Inter', sans-serif",
      color: '#2b221d'
    }}>
      <h1 style={{
        fontFamily: "'Playfair Display', serif",
        fontSize: '28px',
        textAlign: 'center',
        marginBottom: '8px',
        color: '#2b221d'
      }}>
        ✨ Custom Name Pendant Composition Prototype
      </h1>
      <p style={{
        textAlign: 'center',
        fontSize: '13px',
        color: '#8c7365',
        marginBottom: '30px'
      }}>
        Phase 1 & 2 & 3: Real Cloudinary Asset Inventory & Position-Role Canvas Composition Engine
      </p>

      {/* Controls Container */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '20px',
        marginBottom: '30px',
        backgroundColor: '#faf7f5',
        padding: '24px',
        borderRadius: '16px',
        border: '1px solid #f2ebe8'
      }}>
        {/* Name Input */}
        <div>
          <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', color: '#746380', marginBottom: '8px' }}>
            Enter Name (Max 10 Chars)
          </label>
          <input
            type="text"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 10))}
            placeholder="e.g. VIKAS"
            maxLength={10}
            style={{
              width: '100%',
              padding: '12px 16px',
              borderRadius: '10px',
              border: '1px solid #dbcfcb',
              fontSize: '16px',
              fontWeight: '700',
              letterSpacing: '2px',
              color: '#2b221d',
              outline: 'none',
              boxSizing: 'border-box'
            }}
          />
          {/* Preset test buttons */}
          <div style={{ marginTop: '10px', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            <span style={{ fontSize: '11px', color: '#8c7365', alignSelf: 'center', marginRight: '4px' }}>Presets:</span>
            {presets.map(p => (
              <button
                key={p}
                onClick={() => setNameInput(p)}
                style={{
                  padding: '4px 8px',
                  borderRadius: '6px',
                  border: nameInput === p ? '1px solid #2b221d' : '1px solid #d4c5bd',
                  backgroundColor: nameInput === p ? '#2b221d' : '#ffffff',
                  color: nameInput === p ? '#ffffff' : '#2b221d',
                  fontSize: '11px',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Style Selector */}
        <div>
          <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', color: '#746380', marginBottom: '8px' }}>
            Pendant Style
          </label>
          <select
            value={style}
            onChange={(e) => setStyle(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 16px',
              borderRadius: '10px',
              border: '1px solid #dbcfcb',
              fontSize: '13.5px',
              color: '#2b221d',
              backgroundColor: '#ffffff',
              cursor: 'pointer',
              outline: 'none',
              boxSizing: 'border-box'
            }}
          >
            <option value="small_hook">Small Style (With Hook First / Body Middle-Last)</option>
            <option value="big">Big Style (24 High-Res Letters)</option>
          </select>
        </div>

        {/* Material Choice */}
        <div>
          <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', color: '#746380', marginBottom: '8px' }}>
            Material Choice
          </label>
          <select
            value={material}
            onChange={(e) => setMaterial(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 16px',
              borderRadius: '10px',
              border: '1px solid #dbcfcb',
              fontSize: '13.5px',
              color: '#2b221d',
              backgroundColor: '#ffffff',
              cursor: 'pointer',
              outline: 'none',
              boxSizing: 'border-box'
            }}
          >
            <option value="gold_14k">Yellow Gold 14KT</option>
            <option value="gold_18k">Yellow Gold 18KT</option>
            <option value="diamond">Diamond SI-IJ Real Gold</option>
          </select>
        </div>
      </div>

      {/* Error / Validation Banner */}
      {resolved.error && (
        <div style={{
          padding: '14px 20px',
          backgroundColor: '#fce8e6',
          border: '1px solid #f5c2c7',
          color: '#c5221f',
          borderRadius: '12px',
          fontSize: '13px',
          fontWeight: '600',
          marginBottom: '24px'
        }}>
          ⚠️ {resolved.error}
        </div>
      )}

      {/* Live Canvas Preview */}
      <div style={{ marginBottom: '30px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '18px', margin: 0 }}>
            Live Composed Jewelry Preview
          </h3>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', color: '#8c7365' }}>Background:</span>
            {['#faf7f5', '#ffffff', '#12100e'].map(bg => (
              <button
                key={bg}
                onClick={() => setBgColor(bg)}
                style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  backgroundColor: bg,
                  border: bgColor === bg ? '2px solid #b06000' : '1px solid #d4c5bd',
                  cursor: 'pointer'
                }}
              />
            ))}
          </div>
        </div>

        <PendantCanvas resolvedData={resolved} bgColor={bgColor} />
      </div>

      {/* Asset Resolution Inspector Details */}
      {resolved.success && (
        <div style={{
          backgroundColor: '#faf7f5',
          borderRadius: '16px',
          padding: '20px',
          border: '1px solid #f2ebe8'
        }}>
          <h4 style={{ margin: '0 0 12px 0', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px', color: '#746380' }}>
            Asset Resolution & Position-Role Inspector
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
            {resolved.letters.map((item, idx) => (
              <div key={idx} style={{
                backgroundColor: '#ffffff',
                padding: '12px',
                borderRadius: '10px',
                border: '1px solid #dbcfcb',
                fontSize: '12px'
              }}>
                <div style={{ fontWeight: '700', fontSize: '14px', color: '#2b221d' }}>
                  Letter #{idx + 1}: <span style={{ color: '#b06000' }}>{item.letter}</span>
                </div>
                <div style={{ color: '#8c7365', marginTop: '4px' }}>
                  Position Role: <strong>{item.positionRole}</strong>
                </div>
                <div style={{ color: '#8c7365', marginTop: '2px', wordBreak: 'break-all', fontSize: '10px' }}>
                  Public ID: <code>{item.publicId}</code>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
