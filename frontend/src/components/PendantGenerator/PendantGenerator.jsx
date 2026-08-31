import React, { useState, useEffect, useContext } from 'react';
import { resolvePendantAssets } from './pendantAssetResolver';
import PendantCanvas from './PendantCanvas';
import { CartContext } from '../../context/CartContext';
import { API_BASE_URL } from '../../config';

export default function PendantGenerator() {
  const { addToCart } = useContext(CartContext);

  const [nameInput, setNameInput] = useState('AMAN');
  const [style, setStyle] = useState('small_hook');
  const [material, setMaterial] = useState('gold_14k');
  const [includeChain, setIncludeChain] = useState(true);
  const [bgColor, setBgColor] = useState('#faf7f5');
  const [activeAngle, setActiveAngle] = useState('front');

  const [priceData, setPriceData] = useState(null);
  const [calculatingPrice, setCalculatingPrice] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const [cartSuccessMessage, setCartSuccessMessage] = useState('');

  // Resolve assets locally for instant live canvas preview
  const resolved = resolvePendantAssets(nameInput, style, material);

  // Fetch authoritative price from backend
  useEffect(() => {
    if (!resolved.success || !resolved.name) {
      setPriceData(null);
      return;
    }

    setCalculatingPrice(true);
    fetch(`${API_BASE_URL}/api/pendant/calculate-price`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: resolved.name,
        style,
        material,
        includeChain
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setPriceData(data);
        }
      })
      .catch(err => console.error('Price calculation error:', err))
      .finally(() => setCalculatingPrice(false));
  }, [resolved.name, style, material, includeChain, resolved.success]);

  // Dynamic "How it works" text derived from selected style
  const getStyleHowItWorksText = () => {
    if (style === 'big') {
      return 'All letters are rendered in dominant statement Big Capital letter style.';
    } else if (style === 'minimal') {
      return 'All letters are rendered in delicate small letter style for a minimalist look.';
    }
    return 'First letter is a big capital with bail, middle letters are small without hook, and last letter is small with hook for perfect pendant connection.';
  };

  // Handle Add to Cart
  const handleAddToCart = async () => {
    if (!resolved.success) return;
    setAddingToCart(true);
    setCartSuccessMessage('');

    try {
      const canvasEl = document.querySelector('canvas');
      let previewImageUrl = resolved.letters[0]?.url || '';

      if (canvasEl) {
        const base64Img = canvasEl.toDataURL('image/png');
        const uploadRes = await fetch(`${API_BASE_URL}/api/pendant/upload-preview`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageBase64: base64Img })
        });
        const uploadData = await uploadRes.json();
        if (uploadData.success && uploadData.url) {
          previewImageUrl = uploadData.url;
        }
      }

      const matNames = {
        gold_14k: '14KT Yellow Gold',
        gold_18k: '18KT Yellow Gold',
        diamond: 'Diamond SI-IJ Real Gold'
      };

      const finalPrice = priceData?.totalPrice || 18950;

      const customPendantProduct = {
        id: `CUSTOM-PENDANT-${Date.now()}`,
        product_id: `CUSTOM-PENDANT-${Date.now()}`,
        name: `Custom Name Pendant (${resolved.name})`,
        product_title: `Custom Name Pendant (${resolved.name})`,
        price: finalPrice,
        image: previewImageUrl,
        images: [previewImageUrl],
        category: 'pendants',
        customization: {
          type: 'custom_name_pendant',
          name: resolved.name,
          material: matNames[material] || material,
          style: style === 'big' ? 'Big Style' : style === 'minimal' ? 'Minimal' : 'Small Connected',
          includeChain,
          previewImage: previewImageUrl,
          letterCount: resolved.letters.length,
          letters: resolved.letters.map(l => ({
            letter: l.letter,
            positionRole: l.positionRole,
            publicId: l.publicId,
            url: l.url
          })),
          priceBreakdown: priceData?.breakdown || {}
        }
      };

      addToCart(customPendantProduct);
      setCartSuccessMessage(`✨ Custom Name Pendant "${resolved.name}" successfully added to your Cart!`);
      setTimeout(() => setCartSuccessMessage(''), 5000);
    } catch (err) {
      console.error('Add to Cart error:', err);
      alert('Failed to add custom pendant to cart. Please try again.');
    } finally {
      setAddingToCart(false);
    }
  };

  return (
    <div style={{
      backgroundColor: '#f7f4f2',
      minHeight: '100vh',
      padding: '40px 24px',
      fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
      color: '#221f1d'
    }}>
      <div style={{
        maxWidth: '1240px',
        margin: '0 auto'
      }}>

        {cartSuccessMessage && (
          <div style={{
            padding: '16px 24px',
            backgroundColor: '#e6f4ea',
            border: '1px solid #ceead6',
            color: '#137333',
            borderRadius: '16px',
            fontWeight: '600',
            fontSize: '14px',
            textAlign: 'center',
            marginBottom: '24px'
          }}>
            {cartSuccessMessage}
          </div>
        )}

        {/* Main 2-Column Desktop Layout */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(340px, 420px) minmax(480px, 1fr)',
          gap: '32px',
          alignItems: 'start'
        }}>

          {/* LEFT COLUMN: Controls Form */}
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '24px',
            padding: '28px',
            border: '1px solid #e8e1dc',
            boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
          }}>

            {/* 1. ENTER YOUR NAME */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                fontSize: '11px',
                fontWeight: '800',
                textTransform: 'uppercase',
                letterSpacing: '1.2px',
                color: '#8c7d75',
                marginBottom: '10px'
              }}>
                1. ENTER YOUR NAME
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 10))}
                  placeholder="AMAN"
                  maxLength={10}
                  style={{
                    width: '100%',
                    padding: '14px 44px 14px 18px',
                    borderRadius: '14px',
                    border: '1.5px solid #e2d9d5',
                    fontSize: '17px',
                    fontWeight: '800',
                    letterSpacing: '2px',
                    color: '#221f1d',
                    outline: 'none',
                    backgroundColor: '#faf8f7',
                    boxSizing: 'border-box'
                  }}
                />
                {nameInput && (
                  <div style={{
                    position: 'absolute',
                    right: '16px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    backgroundColor: '#2e7d32',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}>
                    ✓
                  </div>
                )}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '11px', color: '#8c7d75' }}>
                <span>Alphabetic A-Z characters only</span>
                <span>{nameInput.length} / 10 characters</span>
              </div>
            </div>

            {/* 2. SELECT MATERIAL */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                fontSize: '11px',
                fontWeight: '800',
                textTransform: 'uppercase',
                letterSpacing: '1.2px',
                color: '#8c7d75',
                marginBottom: '10px'
              }}>
                2. SELECT MATERIAL
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[
                  { id: 'gold_14k', title: '14KT Yellow Gold', desc: 'Solid 14KT Gold' },
                  { id: 'gold_18k', title: '18KT Yellow Gold', desc: 'Premium 18KT Hallmarked Gold' },
                  { id: 'diamond', title: 'Diamond SI-IJ', desc: 'Real Natural Diamonds in Gold' }
                ].map(mat => {
                  const isSelected = material === mat.id;
                  return (
                    <button
                      key={mat.id}
                      onClick={() => setMaterial(mat.id)}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '14px 18px',
                        borderRadius: '14px',
                        border: isSelected ? '2px solid #b08d57' : '1px solid #e8e1dc',
                        backgroundColor: isSelected ? '#fffdfa' : '#ffffff',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: '700', fontSize: '13.5px', color: '#221f1d' }}>{mat.title}</div>
                        <div style={{ fontSize: '11.5px', color: '#8c7d75', marginTop: '2px' }}>{mat.desc}</div>
                      </div>
                      <div style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        border: isSelected ? '6px solid #b08d57' : '2px solid #d4c5bd',
                        backgroundColor: '#ffffff',
                        boxSizing: 'border-box'
                      }} />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. SELECT PENDANT STYLE */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                fontSize: '11px',
                fontWeight: '800',
                textTransform: 'uppercase',
                letterSpacing: '1.2px',
                color: '#8c7d75',
                marginBottom: '10px'
              }}>
                3. SELECT PENDANT STYLE
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                {[
                  {
                    id: 'small_hook',
                    name: 'Small Connected',
                    desc: 'First: Big Capital\nMiddle: Small (No Hook)\nLast: Small (With Hook)'
                  },
                  {
                    id: 'big',
                    name: 'Big Style',
                    desc: 'All Big Letters\nStatement Look'
                  },
                  {
                    id: 'minimal',
                    name: 'Minimal',
                    desc: 'All Small Letters\nDelicate Look'
                  }
                ].map(st => {
                  const isSelected = style === st.id;
                  return (
                    <button
                      key={st.id}
                      onClick={() => setStyle(st.id)}
                      style={{
                        padding: '12px 10px',
                        borderRadius: '14px',
                        border: isSelected ? '2px solid #b08d57' : '1px solid #e8e1dc',
                        backgroundColor: isSelected ? '#fffdfa' : '#ffffff',
                        cursor: 'pointer',
                        textAlign: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        minHeight: '110px'
                      }}
                    >
                      <div style={{ fontSize: '15px', color: '#b08d57', fontWeight: 'bold' }}>Aman</div>
                      <div>
                        <div style={{ fontWeight: '700', fontSize: '11.5px', color: '#221f1d' }}>{st.name}</div>
                        <div style={{ fontSize: '9.5px', color: '#8c7d75', whiteSpace: 'pre-line', marginTop: '3px', lineHeight: '1.2' }}>{st.desc}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Checkbox Option: Include Chain */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                borderRadius: '12px',
                border: '1px solid #e8e1dc',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: '600',
                color: '#221f1d'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <input
                    type="checkbox"
                    checked={includeChain}
                    onChange={(e) => setIncludeChain(e.target.checked)}
                    style={{ width: '18px', height: '18px', accentColor: '#221f1d', cursor: 'pointer' }}
                  />
                  <span>Include 18KT Gold Chain (+₹1,000)</span>
                </div>
              </label>
            </div>

            {/* Itemized Receipt Price Summary Card */}
            <div style={{
              backgroundColor: '#faf8f7',
              padding: '20px',
              borderRadius: '18px',
              border: '1px dashed #dcd1cb',
              marginBottom: '24px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '14px' }}>
                <span style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1.2px', color: '#8c7d75' }}>
                  ESTIMATED PRICE
                </span>
                <span style={{ fontSize: '24px', fontWeight: '800', color: '#221f1d' }}>
                  ₹{priceData ? parseFloat(priceData.totalPrice).toLocaleString('en-IN') : '18,950'}
                </span>
              </div>

              <div style={{ fontSize: '12px', color: '#685950', display: 'flex', flexDirection: 'column', gap: '8px', borderTop: '1px dashed #dcd1cb', paddingTop: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Base Pendant Price</span>
                  <span>₹{priceData?.breakdown?.basePrice ? priceData.breakdown.basePrice.toLocaleString('en-IN') : '14,000'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Letter Charges ({priceData?.breakdown?.letterCount || resolved.letters.length} letters)</span>
                  <span>₹{priceData?.breakdown?.letterSubtotal ? priceData.breakdown.letterSubtotal.toLocaleString('en-IN') : '3,600'}</span>
                </div>
                {includeChain && (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>18KT Gold Chain</span>
                    <span>₹1,000</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Making Charges</span>
                  <span>₹350</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '800', color: '#221f1d', borderTop: '1.5px solid #221f1d', paddingTop: '10px', marginTop: '4px' }}>
                  <span>Total</span>
                  <span>₹{priceData ? parseFloat(priceData.totalPrice).toLocaleString('en-IN') : '18,950'}</span>
                </div>
              </div>
            </div>

            {/* ADD CUSTOM PENDANT TO CART Button */}
            <button
              onClick={handleAddToCart}
              disabled={!resolved.success || addingToCart}
              style={{
                width: '100%',
                backgroundColor: '#221f1d',
                color: '#ffffff',
                padding: '16px',
                borderRadius: '16px',
                fontSize: '13.5px',
                fontWeight: '700',
                letterSpacing: '1px',
                border: 'none',
                cursor: resolved.success && !addingToCart ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                boxShadow: '0 4px 14px rgba(34,31,29,0.15)',
                transition: 'all 0.2s ease'
              }}
            >
              <span>🛍️</span>
              <span>{addingToCart ? 'UPLOADING DESIGN & ADDING...' : 'ADD CUSTOM PENDANT TO CART'}</span>
            </button>
          </div>

          {/* RIGHT COLUMN: Live Preview & Angle Gallery */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

            {/* Main Canvas Card */}
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '24px',
              padding: '28px',
              border: '1px solid #e8e1dc',
              boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '20px', margin: 0, fontWeight: '700', color: '#221f1d' }}>
                  Live Jewelry Preview
                </h3>
                
                {/* Background Swatches with Active State Ring */}
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <span style={{ fontSize: '11px', color: '#8c7d75', fontWeight: '600' }}>Background:</span>
                  {[
                    { id: '#faf7f5', color: '#faf7f5', border: '#b08d57' },
                    { id: '#ffffff', color: '#ffffff', border: '#d4c5bd' },
                    { id: '#12100e', color: '#12100e', border: '#12100e' }
                  ].map(b => {
                    const isActive = bgColor === b.id;
                    return (
                      <button
                        key={b.id}
                        onClick={() => setBgColor(b.id)}
                        style={{
                          width: '22px',
                          height: '22px',
                          borderRadius: '50%',
                          backgroundColor: b.color,
                          border: isActive ? `2px solid ${b.border}` : '1px solid #d4c5bd',
                          outline: isActive ? '2px solid #b08d57' : 'none',
                          outlineOffset: '2px',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Live Canvas Engine */}
              <PendantCanvas
                resolvedData={resolved}
                bgColor={bgColor}
                angle={activeAngle}
                material={material}
              />

              {/* BIS Guarantee Badge */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                marginTop: '20px',
                fontSize: '12px',
                fontWeight: '600',
                color: '#2e7d32'
              }}>
                <span>🛡️</span>
                <span>BIS Hallmarked Gold & Certified Real Diamond Guarantee</span>
              </div>
            </div>

            {/* "How it works" Info Panel */}
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '20px',
              padding: '20px',
              border: '1px solid #e8e1dc',
              fontSize: '12.5px',
              color: '#685950',
              display: 'flex',
              gap: '12px',
              alignItems: 'flex-start'
            }}>
              <span style={{ fontSize: '16px' }}>ℹ️</span>
              <div>
                <strong style={{ color: '#221f1d', display: 'block', marginBottom: '4px' }}>How it works</strong>
                {getStyleHowItWorksText()}
              </div>
            </div>

            {/* "View from different angles" Gallery Bar */}
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '24px',
              padding: '24px',
              border: '1px solid #e8e1dc'
            }}>
              <div style={{ fontSize: '12px', fontWeight: '700', color: '#221f1d', marginBottom: '16px' }}>
                View from different angles
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px' }}>
                {[
                  { id: 'front', label: 'Front View' },
                  { id: 'side_left', label: 'Side Left View' },
                  { id: 'side_right', label: 'Side Right View' },
                  { id: 'top', label: 'Top View' },
                  { id: 'angled', label: 'Angled View' }
                ].map(view => {
                  const isSelected = activeAngle === view.id;
                  return (
                    <button
                      key={view.id}
                      onClick={() => setActiveAngle(view.id)}
                      style={{
                        padding: '10px 6px',
                        borderRadius: '12px',
                        border: isSelected ? '2px solid #b08d57' : '1px solid #e8e1dc',
                        backgroundColor: isSelected ? '#fffdfa' : '#ffffff',
                        cursor: 'pointer',
                        textAlign: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px'
                      }}
                    >
                      <div style={{ height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>
                        ✨
                      </div>
                      <span style={{ fontSize: '10.5px', fontWeight: isSelected ? '700' : '500', color: isSelected ? '#b08d57' : '#685950' }}>
                        {view.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
