import React, { useState, useEffect } from 'react';
import { Loader2, Search, X, Plus, Ticket, CheckCircle2, AlertCircle, Edit2, TrendingUp, Activity } from 'lucide-react';
import { cn } from '../lib/utils';

interface Restrictions {
  categories: string[];
  products: string[];
}

interface Coupon {
  _id?: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minCartValue: number;
  expirationDate: string;
  usageLimit: number;
  usedCount: number;
  isActive: boolean;
  restrictions: Restrictions;
  createdAt?: string;
  updatedAt?: string;
}

const DEFAULT_COUPON: Coupon = {
  code: '',
  discountType: 'percentage',
  discountValue: 0,
  minCartValue: 0,
  expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days default
  usageLimit: 100,
  usedCount: 0,
  isActive: true,
  restrictions: {
    categories: [],
    products: []
  }
};

export default function Coupons() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals state
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  
  // Form State
  const [formData, setFormData] = useState<Coupon>(DEFAULT_COUPON);
  const [catInput, setCatInput] = useState('');
  const [prodInput, setProdInput] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/coupons');
      const data = await res.json();
      if (data.success) {
        setCoupons(data.data || []);
      } else {
        console.error('Failed to fetch coupons:', data.message);
      }
    } catch (err) {
      console.error('Error fetching coupons:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleOpenCreateModal = () => {
    setSelectedCoupon(null);
    setFormData(DEFAULT_COUPON);
    setCatInput('');
    setProdInput('');
    setError('');
    setModalOpen(true);
  };

  const handleOpenEditModal = (coupon: Coupon) => {
    setSelectedCoupon(coupon);
    
    // Format expiration date for HTML input (YYYY-MM-DD)
    const formattedDate = coupon.expirationDate
      ? new Date(coupon.expirationDate).toISOString().split('T')[0]
      : '';

    setFormData({
      ...coupon,
      expirationDate: formattedDate
    });
    setCatInput((coupon.restrictions?.categories || []).join(', '));
    setProdInput((coupon.restrictions?.products || []).join(', '));
    setError('');
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.code || formData.discountValue === undefined || formData.discountValue <= 0) {
      setError('Promo code and discount value must be specified.');
      return;
    }

    setSaving(true);
    setError('');

    const parsedCategories = catInput
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    const parsedProducts = prodInput
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    const payload = {
      ...formData,
      code: formData.code.trim().toUpperCase(),
      restrictions: {
        categories: parsedCategories,
        products: parsedProducts
      }
    };

    try {
      const isEdit = !!selectedCoupon;
      const url = isEdit ? `/api/admin/coupons/${selectedCoupon?._id}` : '/api/admin/coupons';
      const method = isEdit ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        setModalOpen(false);
        fetchCoupons();
      } else {
        setError(data.message || 'Failed to preserve promo records.');
      }
    } catch (err) {
      setError('Network connection error.');
    } finally {
      setSaving(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric'
    }).toUpperCase();
  };

  const filteredCoupons = coupons.filter(c => {
    const code = c.code.toLowerCase();
    const query = searchQuery.toLowerCase();
    return code.includes(query);
  });

  const activeCount = coupons.filter(c => c.isActive).length;
  const totalConversions = coupons.reduce((sum, c) => sum + (c.usedCount || 0), 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 font-sans text-left text-[#12100e]">
      
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="text-[10px] uppercase tracking-[0.45em] font-black text-[#a88265] block">Campaign Command</span>
          <h1 className="text-4.5xl font-serif font-bold text-[#12100e] mt-2">
            Strategic Coupons
          </h1>
        </div>

        <div className="flex items-center gap-6 self-start md:self-auto">
          {/* Stats indicator box */}
          <div className="bg-white border border-slate-200/60 rounded-2xl py-3 px-6 flex items-center divide-x divide-slate-100 shadow-sm text-xs font-bold text-slate-800">
            <div className="flex items-center gap-2.5 pr-5">
              <Activity size={14} className="text-[#a88265] animate-pulse" />
              <div>
                <span className="block leading-none text-slate-800 font-black">{activeCount}</span>
                <span className="text-[7.5px] uppercase tracking-wider text-slate-400 font-black mt-0.5 block">Active</span>
              </div>
            </div>
            <div className="flex items-center gap-2.5 pl-5">
              <TrendingUp size={14} className="text-emerald-500" />
              <div>
                <span className="block leading-none text-slate-800 font-black">{totalConversions}</span>
                <span className="text-[7.5px] uppercase tracking-wider text-slate-400 font-black mt-0.5 block">Conversions</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleOpenCreateModal}
            className="px-8 py-4 bg-[#5d463c] hover:bg-[#4c3931] text-[#efe7e5] font-bold text-xs uppercase tracking-[0.2em] rounded-2xl transition-all duration-300 shadow-md flex items-center gap-2 cursor-pointer"
          >
            <Plus size={16} />
            <span>New Code</span>
          </button>
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between p-4 bg-white rounded-3xl border border-slate-200/60 shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Coupon Code..."
            className="w-full bg-[#f0f3f6] border-none rounded-2xl py-3 pl-12 pr-6 text-sm text-slate-800 placeholder-slate-450 focus:ring-1 focus:ring-brand-gold/50"
          />
        </div>
        <button className="px-6 py-3 bg-[#f5ebe2] text-slate-700 font-bold text-[11px] uppercase tracking-widest rounded-xl transition-all border border-slate-200/50 cursor-pointer">
          All Campaigns
        </button>
      </div>

      {/* Coupons Grid Section */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center space-y-4">
          <Loader2 className="animate-spin text-[#5d463c]" size={32} />
          <span className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold">Querying campaigns...</span>
        </div>
      ) : filteredCoupons.length === 0 ? (
        <div className="py-20 text-center text-slate-500 uppercase tracking-widest text-xs font-bold bg-white border border-slate-200/85 rounded-3xl">
          No coupons found in campaigns ledger. Click new to add.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCoupons.map((coupon) => {
            const isPercentage = coupon.discountType === 'percentage';
            const displayOff = isPercentage ? `${coupon.discountValue}% Off` : `₹${coupon.discountValue} Off`;
            
            return (
              <div 
                key={coupon._id} 
                className="bg-white border border-slate-150 rounded-[32px] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.05)] hover:border-[#5d463c]/30 flex flex-col transition-all duration-500 group relative"
              >
                
                {/* Upper Block: Ticket and Value Header */}
                <div className="p-8 bg-slate-50/50 border-b border-slate-100 flex flex-col justify-between h-44 relative">
                  
                  {/* Status Circle Dot & Used count */}
                  <div className="flex items-start justify-between">
                    {/* Code badge with ticket */}
                    <div className="flex items-center space-x-1.5 bg-white border border-slate-200/60 rounded-lg px-2.5 py-1 text-[10px] font-mono font-black text-slate-600 shadow-sm shrink-0">
                      <Ticket size={11} className="text-[#a88265] shrink-0" />
                      <span>{coupon.code}</span>
                    </div>

                    <div className="flex flex-col items-end">
                      <span className={cn(
                        'w-5 h-5 rounded-full flex items-center justify-center border shrink-0',
                        coupon.isActive ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600' : 'bg-slate-100 border-slate-200 text-slate-400'
                      )}>
                        {coupon.isActive ? <CheckCircle2 size={12} className="fill-emerald-500 text-white" /> : <AlertCircle size={12} />}
                      </span>
                      <span className="text-[9px] uppercase tracking-wider text-slate-400 font-black mt-2">
                        <strong className="text-slate-800">{coupon.usedCount || 0}</strong> Used
                      </span>
                    </div>
                  </div>

                  {/* Big bold italic serif discount text */}
                  <h3 className="font-serif text-3.5xl font-bold text-[#12100e] italic mt-4">
                    {displayOff}
                  </h3>

                  {/* Absolute Edit Pencil Button */}
                  <button
                    type="button"
                    onClick={() => handleOpenEditModal(coupon)}
                    className="absolute bottom-6 right-6 w-9 h-9 rounded-full bg-white shadow-md flex items-center justify-center text-slate-500 hover:text-[#5d463c] hover:scale-105 active:scale-95 transition-all cursor-pointer border border-slate-100"
                    title="Refine Coupon Code"
                  >
                    <Edit2 size={12} />
                  </button>
                </div>

                {/* Lower Block: Specs lists */}
                <div className="p-8 space-y-4 text-[10px] tracking-[0.2em] font-black text-slate-400 uppercase">
                  <div className="flex items-center justify-between">
                    <span>Minimum Cart</span>
                    <span className="text-slate-800 font-bold tracking-normal">{formatPrice(coupon.minCartValue)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Expires</span>
                    <span className="text-slate-800 font-bold tracking-normal">{formatDate(coupon.expirationDate)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Limit</span>
                    <span className="text-slate-800 font-bold tracking-normal">
                      {coupon.usedCount} / {coupon.usageLimit}
                    </span>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Creator / Editor Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-6 backdrop-blur-xs animate-in fade-in duration-300">
          <form 
            onSubmit={handleSave}
            className="bg-[#efe7e5] text-[#12100e] w-full max-w-3xl rounded-4xl shadow-premium border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col"
          >
            {/* Modal Header */}
            <div className="p-6 bg-white border-b border-slate-200/60 flex items-center justify-between shrink-0">
              <div>
                <span className="text-[9px] uppercase tracking-[0.3em] font-black text-slate-400">Campaign Command Vault</span>
                <h3 className="text-xl font-serif font-bold italic mt-1 text-[#12100e]">
                  {selectedCoupon ? 'Refine Coupon Settings' : 'Initialize Promo Code'}
                </h3>
              </div>
              <button 
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-2 text-slate-400 hover:text-[#12100e] transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-8 space-y-8 text-left">
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl text-red-600 text-xs font-bold uppercase tracking-widest animate-shake">
                  {error}
                </div>
              )}

              {/* Form Input fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white rounded-3xl p-6 border border-slate-200/60">
                <div className="space-y-2">
                  <label className="text-[9px] uppercase tracking-widest font-black text-[#5d463c] block">Coupon Code</label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                    placeholder="e.g. SUMMER2026"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-xs text-[#12100e] focus:ring-1 focus:ring-brand-gold/50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] uppercase tracking-widest font-black text-[#5d463c] block">Discount Type</label>
                  <select
                    value={formData.discountType}
                    onChange={(e) => setFormData({...formData, discountType: e.target.value as 'percentage' | 'fixed'})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-xs text-[#12100e] cursor-pointer"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Value (₹)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] uppercase tracking-widest font-black text-[#5d463c] block">Discount Value</label>
                  <input
                    type="number"
                    value={formData.discountValue || ''}
                    onChange={(e) => setFormData({...formData, discountValue: parseFloat(e.target.value) || 0})}
                    placeholder="e.g. 10"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-xs text-[#12100e]"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] uppercase tracking-widest font-black text-[#5d463c] block">Minimum Cart Value (₹)</label>
                  <input
                    type="number"
                    value={formData.minCartValue || ''}
                    onChange={(e) => setFormData({...formData, minCartValue: parseInt(e.target.value) || 0})}
                    placeholder="e.g. 5000"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-xs text-[#12100e]"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] uppercase tracking-widest font-black text-[#5d463c] block">Expiration Date</label>
                  <input
                    type="date"
                    value={formData.expirationDate}
                    onChange={(e) => setFormData({...formData, expirationDate: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-xs text-[#12100e]"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] uppercase tracking-widest font-black text-[#5d463c] block">Usage Limit (Number of times)</label>
                  <input
                    type="number"
                    value={formData.usageLimit || ''}
                    onChange={(e) => setFormData({...formData, usageLimit: parseInt(e.target.value) || 0})}
                    placeholder="e.g. 100"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-xs text-[#12100e]"
                  />
                </div>
                
                <div className="space-y-2 col-span-1 md:col-span-2 border-t border-slate-100 pt-4">
                  <h4 className="text-[10px] uppercase tracking-widest font-black text-[#a88265]">Optional Restrictions</h4>
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] uppercase tracking-widest font-black text-[#5d463c] block">Restrict to Categories (Comma separated slugs)</label>
                  <input
                    type="text"
                    value={catInput}
                    onChange={(e) => setCatInput(e.target.value)}
                    placeholder="e.g. rings, anklets"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-xs text-[#12100e]"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] uppercase tracking-widest font-black text-[#5d463c] block">Restrict to Products (Comma separated slugs)</label>
                  <input
                    type="text"
                    value={prodInput}
                    onChange={(e) => setProdInput(e.target.value)}
                    placeholder="e.g. gold-ring-1"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-xs text-[#12100e]"
                  />
                </div>

                <div className="space-y-2 col-span-1 md:col-span-2">
                  <label className="text-[9px] uppercase tracking-widest font-black text-[#5d463c] block">Coupon Status</label>
                  <select
                    value={formData.isActive ? '1' : '0'}
                    onChange={(e) => setFormData({...formData, isActive: e.target.value === '1'})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-xs text-[#12100e] cursor-pointer"
                  >
                    <option value="1">Active (Live)</option>
                    <option value="0">Inactive (Disabled)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 bg-white border-t border-slate-200/60 flex items-center justify-end shrink-0 gap-4">
              <button 
                type="button"
                onClick={() => setModalOpen(false)}
                className="px-5 py-3 border border-slate-200 text-slate-500 rounded-xl text-[10px] font-bold uppercase tracking-widest cursor-pointer hover:bg-slate-50"
              >
                Cancel
              </button>
              <button 
                type="submit"
                disabled={saving}
                className="px-6 py-3 bg-[#5d463c] hover:bg-[#4c3931] text-[#efe7e5] rounded-xl text-[10px] font-bold uppercase tracking-widest cursor-pointer shadow-sm flex items-center space-x-2"
              >
                {saving ? <Loader2 size={14} className="animate-spin" /> : null}
                <span>{selectedCoupon ? 'Preserve Coupon' : 'Initialize Promo Code'}</span>
              </button>
            </div>

          </form>
        </div>
      )}

    </div>
  );
}
