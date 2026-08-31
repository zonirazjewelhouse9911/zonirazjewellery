import { useState, useMemo } from 'react';
import { Loader2, Save, Sparkles, Sliders, ShieldCheck, CheckCircle } from 'lucide-react';
import inventoryData from '../../../frontend/src/components/PendantGenerator/pendantAssetInventory.json';

interface PendantPreviewProps {
  name: string;
  style: string;
  calibrations?: any[];
}

// Standalone Pendant Preview Component with role-based sizing and mirror reflection
export function PendantPreview({ name, style, calibrations }: PendantPreviewProps) {
  const letters = useMemo(() => {
    const chars = (name || 'AMAN').toUpperCase().split('');

    return chars.map((char, idx) => {
      const isFirst = idx === 0;
      const isLast = idx === chars.length - 1;
      const isSingle = chars.length === 1;

      // Determine role — matches admin tool's "Position Role" dropdown
      let role: 'first' | 'single' | 'middle' | 'last' = 'middle';
      if (isSingle) role = 'single';
      else if (isFirst) role = 'first';
      else if (isLast) role = 'last';

      // Determine which asset bucket to use
      let bucket: Record<string, any>;
      if (style === 'big') {
        bucket = inventoryData.big;
      } else if (role === 'first' || role === 'single') {
        bucket = inventoryData.smallWithHook;
      } else {
        bucket = inventoryData.smallWithoutHook;
      }

      const asset = bucket?.[char];

      // Look up saved calibration ONLY for x/y fine-tuning — size/spacing are role-based below
      const cal = calibrations?.find(
        (c: any) => c.letter === char && c.style === style && c.positionRole === role
      );

      // Fixed role-based proportions matching the reference pendant exactly
      const sizeByRole = {
        first: { width: 130, height: 170 },
        single: { width: 130, height: 170 },
        middle: { width: 78, height: 100 },
        last: { width: 88, height: 115 },
      };
      const size = sizeByRole[role];

      return {
        char,
        role,
        url: asset?.url || '',
        x: cal?.x ?? 0,
        y: cal?.y ?? 0,
        width: size.width,
        height: size.height,
        scale: cal?.scale ?? 1,
        spacing: -22, // fixed tight overlap so letters connect like the reference
      };
    });
  }, [name, style, calibrations]);

  const renderLetters = () =>
    letters.map((letter, idx) => (
      <img
        key={idx}
        src={letter.url}
        alt={letter.char}
        style={{
          width: `${letter.width * letter.scale}px`,
          height: `${letter.height * letter.scale}px`,
          objectFit: 'contain',
          objectPosition: 'bottom',
          transform: `translate(${letter.x}px, ${letter.y}px)`,
          marginRight: idx < letters.length - 1 ? `${letter.spacing}px` : 0,
        }}
      />
    ));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {/* Real pendant — no chain */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
        }}
      >
        {renderLetters()}
      </div>

      {/* Reflection: exact same letters, flipped and faded */}
      <div
        aria-hidden="true"
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
          transform: 'scaleY(-1)',
          transformOrigin: 'top center',
          marginTop: '2px',
          WebkitMaskImage:
            'linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0) 75%)',
          maskImage:
            'linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0) 75%)',
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      >
        {renderLetters()}
      </div>
    </div>
  );
}

// Default export for Admin Dashboard Custom Pendants Management Page
export default function CustomPendants() {
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Selected letter calibration tuner state
  const [selectedLetter, setSelectedLetter] = useState('A');
  const [selectedStyle, setSelectedStyle] = useState('small_hook');
  const [selectedRole, setSelectedRole] = useState('first');

  const [testName, setTestName] = useState('AMAN');

  const [tunerX, setTunerX] = useState(0);
  const [tunerY, setTunerY] = useState(0);
  const [tunerWidth, setTunerWidth] = useState(120);
  const [tunerHeight, setTunerHeight] = useState(150);
  const [tunerScale, setTunerScale] = useState(1);
  const [tunerSpacing, setTunerSpacing] = useState(-22);

  // Global Config Pricing State
  const [basePrice, setBasePrice] = useState(4000);
  const [makingCharge, setMakingCharge] = useState(500);
  const [chainPrice, setChainPrice] = useState(1000);
  const [maxNameLength, setMaxNameLength] = useState(10);

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  const handleSaveConfig = async () => {
    setSaving(true);
    setSuccessMsg('');
    try {
      const res = await fetch('/api/pendant/admin/config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          maxNameLength,
          basePrice,
          makingCharge,
          chainPrice,
          letterCalibrations: [{
            letter: selectedLetter,
            style: selectedStyle,
            positionRole: selectedRole,
            x: tunerX,
            y: tunerY,
            width: tunerWidth,
            height: tunerHeight,
            scale: tunerScale,
            spacing: tunerSpacing,
            price: 2500
          }]
        })
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg('Pendant calibration & pricing saved successfully!');
        setTimeout(() => setSuccessMsg(''), 4000);
      }
    } catch (e) {
      alert('Failed to save calibration config');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 font-sans">
      {/* Header Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center space-x-2 text-amber-600 text-xs font-bold uppercase tracking-widest mb-1">
            <Sparkles size={16} />
            <span>Management & Calibration</span>
          </div>
          <h1 className="text-3xl font-serif font-bold text-[#12100e]">Custom Name Pendant Calibration</h1>
          <p className="text-xs text-slate-500 mt-1">Configure real Cloudinary letter positions, spacing offsets, and pricing rules.</p>
        </div>
        <button
          onClick={handleSaveConfig}
          disabled={saving}
          className="flex items-center space-x-2 bg-[#5d463c] hover:bg-[#4a372f] text-white px-6 py-3 rounded-2xl text-xs font-bold uppercase tracking-widest shadow-md transition-all disabled:opacity-50"
        >
          {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
          <span>{saving ? 'Saving...' : 'Save Configuration'}</span>
        </button>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold rounded-2xl flex items-center space-x-2">
          <CheckCircle size={16} />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Main Grid: Tuner + Live Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Tuner Controls Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Test Name Input & Letter Selection */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-[#5d463c] flex items-center space-x-2">
              <Sliders size={16} />
              <span>Test Name & Letter Calibration</span>
            </h3>

            <div>
              <label className="text-[10px] font-bold text-slate-500 block mb-1">Preview Test Name</label>
              <input
                type="text"
                value={testName}
                onChange={(e) => setTestName(e.target.value.toUpperCase().replace(/[^A-Z]/g, ''))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-bold text-slate-800 outline-none"
              />
            </div>

            {/* Letter Grid Selector */}
            <div className="flex flex-wrap gap-1.5 pt-2">
              {alphabet.map(letter => (
                <button
                  key={letter}
                  onClick={() => setSelectedLetter(letter)}
                  className={`w-9 h-9 text-xs font-bold rounded-xl transition-all ${selectedLetter === letter
                      ? 'bg-[#5d463c] text-white shadow-md'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                >
                  {letter}
                </button>
              ))}
            </div>

            {/* Style & Position Selector */}
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Style Collection</label>
                <select
                  value={selectedStyle}
                  onChange={(e) => setSelectedStyle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-800 outline-none"
                >
                  <option value="small_hook">Small Style (With Hook & Body)</option>
                  <option value="big">Big Style (High-Res 24 Letters)</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Position Role</label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-800 outline-none"
                >
                  <option value="first">First Letter (Top Hook)</option>
                  <option value="middle">Middle / Body Letter</option>
                  <option value="last">Last Letter</option>
                  <option value="single">Single Letter</option>
                </select>
              </div>
            </div>
          </div>

          {/* Calibration Sliders */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
            <h3 className="text-xs font-black uppercase tracking-widest text-[#5d463c]">
              Calibration Tuning Controls for '{selectedLetter}' ({selectedRole})
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
              <div>
                <label className="text-[10px] font-bold text-slate-500 block mb-1">X Offset: {tunerX}px</label>
                <input
                  type="range"
                  min="-50"
                  max="50"
                  value={tunerX}
                  onChange={(e) => setTunerX(Number(e.target.value))}
                  className="w-full accent-[#5d463c]"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 block mb-1">Y Offset: {tunerY}px</label>
                <input
                  type="range"
                  min="-50"
                  max="50"
                  value={tunerY}
                  onChange={(e) => setTunerY(Number(e.target.value))}
                  className="w-full accent-[#5d463c]"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 block mb-1">Width: {tunerWidth}px</label>
                <input
                  type="number"
                  value={tunerWidth}
                  onChange={(e) => setTunerWidth(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs font-bold text-slate-800"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 block mb-1">Height: {tunerHeight}px</label>
                <input
                  type="number"
                  value={tunerHeight}
                  onChange={(e) => setTunerHeight(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs font-bold text-slate-800"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 block mb-1">Overlap Spacing: {tunerSpacing}px</label>
                <input
                  type="range"
                  min="-40"
                  max="10"
                  value={tunerSpacing}
                  onChange={(e) => setTunerSpacing(Number(e.target.value))}
                  className="w-full accent-[#5d463c]"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 block mb-1">Scale Factor: {tunerScale}x</label>
                <input
                  type="number"
                  step="0.1"
                  min="0.5"
                  max="2"
                  value={tunerScale}
                  onChange={(e) => setTunerScale(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs font-bold text-slate-800"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Pendant Preview & Pricing */}
        <div className="space-y-6">
          {/* Live Component Preview */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col items-center justify-center min-h-[300px]">
            <span className="text-[10px] uppercase font-black tracking-widest text-slate-400 mb-6">Live Composed Pendant Preview</span>
            <div className="p-8 bg-[#faf7f5] rounded-2xl border border-slate-200/60 w-full flex items-center justify-center">
              <PendantPreview name={testName} style={selectedStyle} calibrations={[]} />
            </div>
          </div>

          {/* Base Pricing Settings */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-[#5d463c] flex items-center space-x-2">
              <ShieldCheck size={16} />
              <span>Base Pricing Rules</span>
            </h3>

            <div className="space-y-3">
              <div>
                <label className="text-[10px] font-bold text-slate-500 block mb-1">Base Frame Price (₹)</label>
                <input
                  type="number"
                  value={basePrice}
                  onChange={(e) => setBasePrice(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-800"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 block mb-1">Making & Polishing Charge (₹)</label>
                <input
                  type="number"
                  value={makingCharge}
                  onChange={(e) => setMakingCharge(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-800"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 block mb-1">18K Chain Price (₹)</label>
                <input
                  type="number"
                  value={chainPrice}
                  onChange={(e) => setChainPrice(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-800"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 block mb-1">Max Allowed Name Length</label>
                <input
                  type="number"
                  value={maxNameLength}
                  onChange={(e) => setMaxNameLength(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-800"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}