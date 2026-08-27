import React, { useState, useEffect } from 'react';
import { Loader2, Search, X, Plus, Ticket, CheckCircle2, AlertCircle, Edit2, TrendingUp, Activity, MessageSquare, Send, Users, CheckSquare, Square, ExternalLink } from 'lucide-react';
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

  // WhatsApp Broadcast Modal State
  const [waModalOpen, setWaModalOpen] = useState(false);
  const [waCoupon, setWaCoupon] = useState<Coupon | null>(null);
  const [userList, setUserList] = useState<any[]>([]);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [waCustomMessage, setWaCustomMessage] = useState('');
  const [waLoading, setWaLoading] = useState(false);
  const [waSending, setWaSending] = useState(false);
  const [broadcastResult, setBroadcastResult] = useState<any>(null);

  const handleOpenWhatsAppModal = async (coupon: Coupon) => {
    setWaCoupon(coupon);
    setWaModalOpen(true);
    setWaLoading(true);
    setBroadcastResult(null);
    setWaCustomMessage(`✨ *Exclusive Offer from Zoniraz Jewels!* 💎\n\nHello {userName},\nUse promo code *${coupon.code}* on your next order to get *${coupon.discountValue}${coupon.discountType === 'percentage' ? '%' : ' ₹'} OFF*!\n\nRedeem now: http://localhost:5173/#checkout`);
    
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setUserList(data.data);
        setSelectedUserIds(data.data.map((u: any) => u._id));
      }
    } catch (err) {
      console.error('Failed to load users for WhatsApp coupon broadcast:', err);
    } finally {
      setWaLoading(false);
    }
  };

  const toggleSelectUser = (id: string) => {
    setSelectedUserIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const toggleSelectAllUsers = () => {
    if (selectedUserIds.length === userList.length) {
      setSelectedUserIds([]);
    } else {
      setSelectedUserIds(userList.map((u: any) => u._id));
    }
  };

  const handleDispatchWhatsAppBroadcast = async () => {
    if (!waCoupon || selectedUserIds.length === 0) return;
    setWaSending(true);
    try {
      const res = await fetch('/api/admin/coupons/send-whatsapp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          couponId: waCoupon._id || waCoupon.code,
          targetUserIds: selectedUserIds,
          customMessage: waCustomMessage
        })
      });
      const data = await res.json();
      if (data.success && data.data) {
        setBroadcastResult(data.data);
      } else {
        alert(data.message || 'Failed to prepare WhatsApp broadcast');
      }
    } catch (err: any) {
      alert(err.message || 'WhatsApp broadcast failed');
    } finally {
      setWaSending(false);
    }
  };
  
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase tracking-[0.45em] font-black text-[#a88265] block">Campaign Command</span>
          <h1 className="text-3xl sm:text-4.5xl font-serif font-bold text-[#12100e] mt-1 sm:mt-2">
            Strategic Coupons
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-3 sm:gap-6 w-full sm:w-auto">
          {/* Stats indicator box */}
          <div className="bg-white border border-slate-200/60 rounded-2xl py-3 px-6 flex items-center divide-x divide-slate-100 shadow-sm text-xs font-bold text-slate-800 flex-1 sm:flex-initial justify-around sm:justify-start">
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
            className="px-6 sm:px-8 py-3.5 sm:py-4 bg-[#5d463c] hover:bg-[#4c3931] text-[#efe7e5] font-bold text-xs uppercase tracking-[0.2em] rounded-xl sm:rounded-2xl transition-all duration-300 shadow-md flex items-center justify-center gap-2 cursor-pointer w-full sm:w-auto"
          >
            <Plus size={16} />
            <span>New Code</span>
          </button>
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between p-4 bg-white rounded-2xl sm:rounded-3xl border border-slate-200/60 shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Coupon Code..."
            className="w-full bg-[#f0f3f6] border-none rounded-xl sm:rounded-2xl py-3 pl-12 pr-6 text-sm text-slate-800 placeholder-slate-450 focus:ring-1 focus:ring-brand-gold/50"
          />
        </div>
        <button className="px-6 py-3 bg-[#f5ebe2] text-slate-700 font-bold text-[11px] uppercase tracking-widest rounded-xl transition-all border border-slate-200/50 cursor-pointer w-full sm:w-auto">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
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
                <div className="p-6 space-y-3 text-[10px] tracking-[0.2em] font-black text-slate-400 uppercase">
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

                {/* WhatsApp Broadcast Action Button */}
                <div className="p-4 bg-slate-50/80 border-t border-slate-100 mt-auto">
                  <button
                    type="button"
                    onClick={() => handleOpenWhatsAppModal(coupon)}
                    className="w-full py-2.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center space-x-2 transition-all shadow-sm cursor-pointer"
                  >
                    <MessageSquare size={14} />
                    <span>Send via WhatsApp 📱</span>
                  </button>
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

      {/* WhatsApp Coupon Broadcast Modal */}
      {waModalOpen && waCoupon && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in duration-300">
          <div className="bg-white text-[#12100e] w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden max-h-[92vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="p-6 bg-emerald-700 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center">
                  <MessageSquare size={20} className="text-emerald-200" />
                </div>
                <div>
                  <span className="text-[9px] uppercase tracking-widest text-emerald-200 font-bold block">WhatsApp Coupon Broadcast</span>
                  <h3 className="text-lg font-bold">
                    Send Code <span className="font-mono bg-white/20 px-2 py-0.5 rounded text-white">{waCoupon.code}</span> ({waCoupon.discountValue}{waCoupon.discountType === 'percentage' ? '%' : ' ₹'} OFF)
                  </h3>
                </div>
              </div>
              <button 
                type="button" 
                onClick={() => setWaModalOpen(false)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors cursor-pointer text-white"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6 overflow-y-auto flex-1 text-xs">
              
              {/* Message Template Editor */}
              <div className="space-y-2">
                <label className="font-bold text-slate-700 text-xs flex items-center justify-between">
                  <span>📱 Customize WhatsApp Message Template:</span>
                  <span className="text-[10px] text-slate-400 font-normal">Supports &#123;userName&#125;, &#123;couponCode&#125;, &#123;discountValue&#125;</span>
                </label>
                <textarea
                  rows={4}
                  value={waCustomMessage}
                  onChange={(e) => setWaCustomMessage(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-xs font-sans text-slate-800 focus:bg-white focus:border-emerald-500 outline-none leading-relaxed"
                />
              </div>

              {/* Target User Selection */}
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <label className="font-bold text-slate-700 text-xs flex items-center space-x-2">
                    <Users size={14} className="text-emerald-600" />
                    <span>Select Target Customers ({selectedUserIds.length} / {userList.length} Selected):</span>
                  </label>
                  <button
                    type="button"
                    onClick={toggleSelectAllUsers}
                    className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center space-x-1 cursor-pointer"
                  >
                    {selectedUserIds.length === userList.length ? <CheckSquare size={14} /> : <Square size={14} />}
                    <span>{selectedUserIds.length === userList.length ? 'Deselect All' : 'Select All'}</span>
                  </button>
                </div>

                {waLoading ? (
                  <div className="py-8 flex flex-col items-center justify-center space-y-2 text-slate-400">
                    <Loader2 size={24} className="animate-spin text-emerald-600" />
                    <span>Loading registered users list...</span>
                  </div>
                ) : userList.length === 0 ? (
                  <div className="py-6 text-center text-slate-400 font-medium bg-slate-50 rounded-2xl">
                    No users found in database.
                  </div>
                ) : (
                  <div className="max-h-48 overflow-y-auto border border-slate-200 rounded-2xl divide-y divide-slate-100 bg-slate-50/50">
                    {userList.map(u => {
                      const isSelected = selectedUserIds.includes(u._id);
                      return (
                        <div 
                          key={u._id}
                          onClick={() => toggleSelectUser(u._id)}
                          className={cn(
                            "p-3 flex items-center justify-between cursor-pointer transition-colors hover:bg-white",
                            isSelected ? "bg-emerald-50/50" : ""
                          )}
                        >
                          <div className="flex items-center space-x-3">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => {}}
                              className="accent-emerald-600 w-4 h-4 rounded cursor-pointer"
                            />
                            <div>
                              <div className="font-bold text-slate-800">{u.user_name || u.name || 'Valued Patron'}</div>
                              <div className="text-[11px] text-slate-500">{u.phone_number || u.mobile || 'No mobile'} • {u.email || ''}</div>
                            </div>
                          </div>
                          <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full", isSelected ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-600")}>
                            {isSelected ? 'Included' : 'Skip'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Broadcast Results (Links to open WhatsApp Web for each selected user) */}
              {broadcastResult && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-3">
                  <div className="font-bold text-emerald-800 flex items-center justify-between">
                    <span>🎉 Twilio API Broadcast Prepared for {broadcastResult.totalUsers} Customers!</span>
                  </div>
                  <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-800 font-medium">
                    💡 <strong>Twilio Sandbox Tip:</strong> Recipient phones must join your Twilio Sandbox number (+1 415 523 8886) first. If not joined, click <strong>"Open WhatsApp Web"</strong> below to send directly in 1 click!
                  </div>
                  <div className="max-h-40 overflow-y-auto space-y-2 pr-1">
                    {broadcastResult.userBroadcasts?.map((b: any, idx: number) => (
                      <div key={idx} className="p-2.5 bg-white rounded-xl border border-emerald-100 flex items-center justify-between shadow-xs">
                        <div>
                          <div className="font-bold text-slate-800">{b.name}</div>
                          <div className="text-[11px] text-slate-500">{b.phone || 'No Phone'} • <span className="text-emerald-700 font-semibold">{b.status || 'SENT'}</span></div>
                        </div>
                        {b.waUrl ? (
                          <a
                            href={b.waUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-[11px] flex items-center space-x-1.5 shadow-xs cursor-pointer"
                          >
                            <MessageSquare size={13} />
                            <span>Open WhatsApp Web</span>
                            <ExternalLink size={11} />
                          </a>
                        ) : (
                          <span className="text-slate-400 italic text-[11px]">No valid phone</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* Modal Footer */}
            <div className="p-5 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
              <span className="text-slate-500 font-medium text-xs">
                {selectedUserIds.length} recipients selected
              </span>
              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={() => setWaModalOpen(false)}
                  className="px-4 py-2.5 border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-100 transition-all cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="button"
                  disabled={waSending || selectedUserIds.length === 0}
                  onClick={handleDispatchWhatsAppBroadcast}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-xl font-bold flex items-center space-x-2 transition-all shadow-md cursor-pointer disabled:opacity-50"
                >
                  {waSending ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                  <span>Dispatch WhatsApp Campaign 🚀</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
