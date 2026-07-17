import React, { useState, useEffect } from 'react';
import { Loader2, TrendingUp, Sparkles, Receipt, RefreshCw } from 'lucide-react';

interface RatesData {
  gold_rate_14k: number;
  diamond_rate: number;
  diamond_rate_ij_si: number;
  diamond_rate_gh_vs: number;
  diamond_rate_ef_vvs: number;
  diamond_rate_fg_si: number;
  gemstone_rate: number;
  gst_percent: number;
}

const PricingSettings: React.FC = () => {
  const [rates, setRates] = useState<RatesData>({
    gold_rate_14k: 0,
    diamond_rate: 0,
    diamond_rate_ij_si: 0,
    diamond_rate_gh_vs: 0,
    diamond_rate_ef_vvs: 0,
    diamond_rate_fg_si: 0,
    gemstone_rate: 0,
    gst_percent: 3
  });
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Fetch active daily rates
  const fetchRates = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/jewellery-pricing');
      const data = await res.json();
      if (data.success && data.data) {
        setRates({
          gold_rate_14k: data.data.gold_rate_14k || 0,
          diamond_rate: data.data.diamond_rate || 0,
          diamond_rate_ij_si: data.data.diamond_rate_ij_si || 0,
          diamond_rate_gh_vs: data.data.diamond_rate_gh_vs || 0,
          diamond_rate_ef_vvs: data.data.diamond_rate_ef_vvs || 0,
          diamond_rate_fg_si: data.data.diamond_rate_fg_si || 0,
          gemstone_rate: data.data.gemstone_rate || 0,
          gst_percent: data.data.gst_percent !== undefined ? data.data.gst_percent : 3
        });
      }
    } catch (error) {
      console.error('Failed to load daily rates:', error);
      setMessage({ type: 'error', text: 'Failed to fetch current daily rates.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRates();
  }, []);

  const handleInputChange = (field: keyof RatesData, value: string) => {
    const numValue = value === '' ? 0 : Number(value);
    setRates(prev => ({
      ...prev,
      [field]: numValue
    }));
  };

  const handleUpdateRates = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch('/api/jewellery-pricing', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(rates)
      });
      const data = await res.json();
      if (data.success) {
        setMessage({
          type: 'success',
          text: `Rates successfully updated! Recalculated ${data.data.recalculatedCount} products in the database.`
        });
      } else {
        setMessage({
          type: 'error',
          text: data.message || 'Failed to update rates.'
        });
      }
    } catch (error) {
      console.error('Failed to save daily rates:', error);
      setMessage({ type: 'error', text: 'Network connection failed. Could not save rates.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-3xl">
      {/* Title Header */}
      <div>
        <span className="text-[10px] uppercase tracking-[0.4em] font-black text-slate-500">Pricing Settings</span>
        <h1 className="text-4.5xl font-serif font-bold text-[#12100e] mt-2">Daily Jewellery Pricing</h1>
        <p className="text-sm text-slate-500 mt-2 max-w-xl">
          Configure daily metal and diamond pricing benchmarks. Setting rates here triggers an automatic background recalculation of all catalog items.
        </p>
      </div>

      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center space-y-4 bg-white rounded-3xl border border-slate-200/60 shadow-sm">
          <Loader2 className="animate-spin text-[#5d463c]" size={32} />
          <span className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold">Fetching rates ledger...</span>
        </div>
      ) : (
        <form onSubmit={handleUpdateRates} className="space-y-6">
          {/* Rates Cards Grid */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-8 shadow-sm space-y-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-5">
              <h2 className="font-serif text-lg font-bold text-[#12100e] flex items-center gap-2">
                <TrendingUp className="text-[#C5A880]" size={20} />
                <span>Daily Pricing Benchmarks</span>
              </h2>
              <button 
                type="button"
                onClick={fetchRates}
                className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors"
                title="Refresh rates"
              >
                <RefreshCw size={16} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Gold Rate Input */}
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-black text-slate-400 block">
                  14K Gold Rate (₹ / Gram) *
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold">₹</span>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    value={rates.gold_rate_14k || ''}
                    onChange={e => handleInputChange('gold_rate_14k', e.target.value)}
                    className="w-full bg-[#f8f9fa] border border-slate-200 focus:border-[#C5A880] focus:ring-1 focus:ring-[#C5A880]/30 rounded-2xl py-4 pl-8 pr-6 text-sm text-slate-800 font-bold transition-all"
                  />
                </div>
              </div>

              {/* Diamond Rate Input */}
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-black text-slate-400 block">
                  Base Diamond Rate (₹ / Carat) *
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold">₹</span>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    value={rates.diamond_rate || ''}
                    onChange={e => handleInputChange('diamond_rate', e.target.value)}
                    className="w-full bg-[#f8f9fa] border border-slate-200 focus:border-[#C5A880] focus:ring-1 focus:ring-[#C5A880]/30 rounded-2xl py-4 pl-8 pr-6 text-sm text-slate-800 font-bold transition-all"
                  />
                </div>
              </div>

              {/* Gemstone Rate Input */}
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-black text-slate-400 block">
                  Base Gemstone Rate (₹ / Carat)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold">₹</span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    value={rates.gemstone_rate || ''}
                    onChange={e => handleInputChange('gemstone_rate', e.target.value)}
                    className="w-full bg-[#f8f9fa] border border-slate-200 focus:border-[#C5A880] focus:ring-1 focus:ring-[#C5A880]/30 rounded-2xl py-4 pl-8 pr-6 text-sm text-slate-800 font-bold transition-all"
                  />
                </div>
              </div>

              {/* GST Percent Input */}
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-black text-slate-400 block">
                  Tax / GST Rate (%)
                </label>
                <div className="relative">
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold">%</span>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    placeholder="3.0"
                    value={rates.gst_percent}
                    onChange={e => handleInputChange('gst_percent', e.target.value)}
                    className="w-full bg-[#f8f9fa] border border-slate-200 focus:border-[#C5A880] focus:ring-1 focus:ring-[#C5A880]/30 rounded-2xl py-4 pl-6 pr-10 text-sm text-slate-800 font-bold transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Individual Diamond Quality Rates */}
            <div className="border-t border-slate-100 pt-6">
              <h3 className="text-xs uppercase tracking-widest font-black text-slate-500 mb-4">Individual Diamond Quality Rates (₹ / Carat)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* IJ-SI Rate Input */}
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-black text-slate-400 block">
                    IJ-SI Rate
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold">₹</span>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      value={rates.diamond_rate_ij_si || ''}
                      onChange={e => handleInputChange('diamond_rate_ij_si', e.target.value)}
                      className="w-full bg-[#f8f9fa] border border-slate-200 focus:border-[#C5A880] focus:ring-1 focus:ring-[#C5A880]/30 rounded-2xl py-4 pl-8 pr-6 text-sm text-slate-800 font-bold transition-all"
                    />
                  </div>
                </div>

                {/* GH-VS Rate Input */}
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-black text-slate-400 block">
                    GH-VS Rate
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold">₹</span>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      value={rates.diamond_rate_gh_vs || ''}
                      onChange={e => handleInputChange('diamond_rate_gh_vs', e.target.value)}
                      className="w-full bg-[#f8f9fa] border border-slate-200 focus:border-[#C5A880] focus:ring-1 focus:ring-[#C5A880]/30 rounded-2xl py-4 pl-8 pr-6 text-sm text-slate-800 font-bold transition-all"
                    />
                  </div>
                </div>

                {/* EF-VVS Rate Input */}
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-black text-slate-400 block">
                    EF-VVS Rate
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold">₹</span>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      value={rates.diamond_rate_ef_vvs || ''}
                      onChange={e => handleInputChange('diamond_rate_ef_vvs', e.target.value)}
                      className="w-full bg-[#f8f9fa] border border-slate-200 focus:border-[#C5A880] focus:ring-1 focus:ring-[#C5A880]/30 rounded-2xl py-4 pl-8 pr-6 text-sm text-slate-800 font-bold transition-all"
                    />
                  </div>
                </div>

                {/* FG-SI Rate Input */}
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-black text-slate-400 block">
                    FG-SI Rate
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold">₹</span>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      value={rates.diamond_rate_fg_si || ''}
                      onChange={e => handleInputChange('diamond_rate_fg_si', e.target.value)}
                      className="w-full bg-[#f8f9fa] border border-slate-200 focus:border-[#C5A880] focus:ring-1 focus:ring-[#C5A880]/30 rounded-2xl py-4 pl-8 pr-6 text-sm text-slate-800 font-bold transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Messages Alert */}
          {message && (
            <div className={`p-5 rounded-2xl flex items-start gap-3 border shadow-sm animate-in slide-in-from-top duration-300 ${
              message.type === 'success' 
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-700' 
                : 'bg-red-500/10 border-red-500/20 text-red-700'
            }`}>
              {message.type === 'success' ? (
                <Sparkles className="shrink-0 text-emerald-600 mt-0.5" size={18} />
              ) : (
                <Receipt className="shrink-0 text-red-600 mt-0.5" size={18} />
              )}
              <div className="text-xs font-bold leading-relaxed">{message.text}</div>
            </div>
          )}

          {/* Action Row */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-10 py-4 bg-[#5d463c] hover:bg-[#4c3931] text-[#efe7e5] font-bold text-xs uppercase tracking-[0.2em] rounded-xl transition-all duration-300 shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <Loader2 className="animate-spin" size={16} />
                  <span>Recalculating Catalog...</span>
                </>
              ) : (
                <span>Update Rates & Recalculate</span>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default PricingSettings;
