import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Coins, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Loader2, 
  X, 
  CheckCircle2, 
  RefreshCw,
  Upload,
  Percent,
  Receipt,
  Sparkles,
  Scale,
  Star,
  ArrowLeft,
  ArrowRight,
  Link as LinkIcon,
  Image as ImageIcon
} from 'lucide-react';
import { resolveProductImage } from '../lib/imageResolver';
import { cachedFetch, invalidateCache } from '../lib/apiCache';

interface CoinPricing {
  base_price: number;
  making_charges: number;
  subtotal: number;
  gst_percent: number;
  gst_amount: number;
  gross_total: number;
  discount_percent: number;
  discount_amount: number;
  final_price: number;
  savings: number;
}

interface CoinItem {
  _id: string;
  title: string;
  coin_type: 'gold' | 'silver' | 'platinum' | 'other';
  weight_grams: number;
  purity: string;
  price: number;
  making_charges: number;
  gst_percent: number;
  discount_percent: number;
  stock: number;
  sku: string;
  description: string;
  image: string;
  images?: string[];
  status: string;
  createdAt?: string;
  pricing?: CoinPricing;
}

const COMMON_WEIGHTS = [1, 2, 5, 8, 10, 20, 50, 100];

const PURITY_SUGGESTIONS: Record<string, string[]> = {
  gold: ['24K (999.9)', '24K (999)', '22K (916)', '18K (750)'],
  silver: ['999 Fine Silver', '999.9 Pure Silver', '925 Sterling Silver'],
  platinum: ['950 Platinum', '999 Platinum'],
  other: ['Fine Quality']
};

const currencyFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0
});
const formatCurrency = (val: number) => currencyFormatter.format(val || 0);

const CoinsPage: React.FC = () => {
  const [coins, setCoins] = useState<CoinItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<string>('all');

  // Modal / Form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoinId, setEditingCoinId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Image upload state
  const [coinImages, setCoinImages] = useState<string[]>([]);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string>('');
  const [urlInput, setUrlInput] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form Data State
  const initialFormData = {
    title: '',
    coin_type: 'gold' as 'gold' | 'silver' | 'platinum' | 'other',
    weight_grams: '10',
    purity: '24K (999)',
    price: '',
    making_charges: '0',
    gst_percent: '3',
    discount_percent: '0',
    stock: '10',
    sku: '',
    description: '',
    status: '1'
  };

  const [formData, setFormData] = useState(initialFormData);

  // Real-time price calculation helper for the modal
  const livePricing = useMemo(() => {
    const basePrice = Math.max(0, Number(formData.price) || 0);
    const making = Math.max(0, Number(formData.making_charges) || 0);
    const gstPct = Math.max(0, Number(formData.gst_percent) !== undefined ? Number(formData.gst_percent) : 3);
    const discPct = Math.max(0, Math.min(100, Number(formData.discount_percent) || 0));

    const subtotal = basePrice + making;
    const gstAmount = Math.round((subtotal * (gstPct / 100)) * 100) / 100;
    const grossTotal = Math.round((subtotal + gstAmount) * 100) / 100;
    const discountAmount = Math.round((grossTotal * (discPct / 100)) * 100) / 100;
    const finalPrice = Math.max(0, Math.round(grossTotal - discountAmount));

    return {
      base_price: basePrice,
      making_charges: making,
      subtotal,
      gst_percent: gstPct,
      gst_amount: gstAmount,
      gross_total: grossTotal,
      discount_percent: discPct,
      discount_amount: discountAmount,
      final_price: finalPrice,
      savings: discountAmount
    };
  }, [formData.price, formData.making_charges, formData.gst_percent, formData.discount_percent]);

  // Fetch coins
  const fetchCoins = async (forceRefresh = false) => {
    if (coins.length === 0) setLoading(true);
    try {
      const data = await cachedFetch('/api/admin/coins', { forceRefresh, ttlMs: 60000 });
      if (data && data.success) {
        setCoins(data.data || []);
      }
    } catch (error) {
      console.error('Failed to load coins:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoins();
  }, []);

  // Handle Multiple Image Upload
  const processFiles = async (files: FileList | File[]) => {
    const fileList = Array.from(files);
    if (fileList.length === 0) return;

    setUploadingImages(true);
    setErrorMessage('');
    const newUrls: string[] = [];
    let failCount = 0;

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      setUploadProgress(`Uploading ${i + 1} of ${fileList.length}: ${file.name}...`);
      try {
        const bodyData = new FormData();
        bodyData.append('file', file);
        bodyData.append('category', 'coins');
        bodyData.append('type', 'coin');

        const res = await fetch('/api/upload', {
          method: 'POST',
          body: bodyData
        });
        const json = await res.json();
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          const u = json.data[0].url || json.data[0].path;
          if (u) newUrls.push(u);
        } else {
          failCount++;
        }
      } catch (err) {
        console.error('File upload failed:', file.name, err);
        failCount++;
      }
    }

    if (newUrls.length > 0) {
      setCoinImages(prev => [...prev, ...newUrls]);
    }
    if (failCount > 0) {
      setErrorMessage(
        newUrls.length > 0 
          ? `Uploaded ${newUrls.length} file(s), but ${failCount} failed.` 
          : 'Failed to upload images. Please check network connection.'
      );
    }
    setUploadingImages(false);
    setUploadProgress('');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      processFiles(e.target.files);
      e.target.value = '';
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleRemoveImage = (index: number) => {
    setCoinImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleMakePrimary = (index: number) => {
    if (index === 0) return;
    setCoinImages(prev => {
      const copy = [...prev];
      const [item] = copy.splice(index, 1);
      copy.unshift(item);
      return copy;
    });
  };

  const handleMoveImage = (index: number, direction: 'left' | 'right') => {
    const targetIdx = direction === 'left' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= coinImages.length) return;
    setCoinImages(prev => {
      const copy = [...prev];
      const temp = copy[index];
      copy[index] = copy[targetIdx];
      copy[targetIdx] = temp;
      return copy;
    });
  };

  const handleAddUrlImage = () => {
    const trimmed = urlInput.trim();
    if (!trimmed) return;
    setCoinImages(prev => [...prev, trimmed]);
    setUrlInput('');
    setShowUrlInput(false);
  };

  // Open Create Modal
  const handleOpenCreateModal = () => {
    setEditingCoinId(null);
    setFormData(initialFormData);
    setCoinImages([]);
    setUrlInput('');
    setShowUrlInput(false);
    setUploadProgress('');
    setErrorMessage('');
    setSuccessMessage('');
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (coin: CoinItem) => {
    setEditingCoinId(coin._id);
    setUrlInput('');
    setShowUrlInput(false);
    setUploadProgress('');
    setFormData({
      title: coin.title || '',
      coin_type: coin.coin_type || 'gold',
      weight_grams: coin.weight_grams ? String(coin.weight_grams) : '10',
      purity: coin.purity || '24K (999)',
      price: coin.price ? String(coin.price) : '',
      making_charges: coin.making_charges !== undefined ? String(coin.making_charges) : '0',
      gst_percent: coin.gst_percent !== undefined ? String(coin.gst_percent) : '3',
      discount_percent: coin.discount_percent !== undefined ? String(coin.discount_percent) : '0',
      stock: coin.stock !== undefined ? String(coin.stock) : '10',
      sku: coin.sku || '',
      description: coin.description || '',
      status: coin.status || '1'
    });
    setCoinImages(
      Array.isArray(coin.images) && coin.images.length > 0
        ? coin.images
        : (coin.image ? [coin.image] : [])
    );
    setErrorMessage('');
    setSuccessMessage('');
    setIsModalOpen(true);
  };

  // Delete Coin
  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) {
      return;
    }
    try {
      const res = await fetch(`/api/admin/coins/${id}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        invalidateCache('/api/admin/coins');
        invalidateCache('/api/admin/products');
        fetchCoins(true);
      } else {
        alert(data.message || 'Failed to delete coin.');
      }
    } catch (err) {
      console.error(err);
      alert('Network error while deleting coin.');
    }
  };

  // Toggle Live/Archived
  const handleToggleStatus = async (coin: CoinItem) => {
    const newStatus = coin.status === '1' ? '0' : '1';
    try {
      const res = await fetch(`/api/admin/coins/${coin._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        invalidateCache('/api/admin/coins');
        invalidateCache('/api/admin/products');
        fetchCoins(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMessage('');
    setSuccessMessage('');

    if (!formData.title.trim()) {
      setErrorMessage('Please provide a name/title for the coin.');
      setSaving(false);
      return;
    }

    if (!formData.price || Number(formData.price) <= 0) {
      setErrorMessage('Please specify a valid base price.');
      setSaving(false);
      return;
    }

    if (!formData.weight_grams || Number(formData.weight_grams) <= 0) {
      setErrorMessage('Please enter the coin weight in grams.');
      setSaving(false);
      return;
    }

    try {
      const payload = {
        title: formData.title.trim(),
        coin_type: formData.coin_type,
        weight_grams: Number(formData.weight_grams),
        purity: formData.purity.trim(),
        price: Number(formData.price),
        making_charges: Number(formData.making_charges) || 0,
        gst_percent: Number(formData.gst_percent) || 0,
        discount_percent: Number(formData.discount_percent) || 0,
        stock: Number(formData.stock) || 0,
        sku: formData.sku.trim(),
        description: formData.description.trim(),
        status: formData.status,
        image: coinImages[0] || '',
        images: coinImages
      };

      const url = editingCoinId 
        ? `/api/admin/coins/${editingCoinId}` 
        : '/api/admin/coins';
      const method = editingCoinId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (data.success) {
        invalidateCache('/api/admin/coins');
        invalidateCache('/api/admin/products');
        setSuccessMessage(editingCoinId ? 'Coin updated successfully!' : 'Coin uploaded successfully!');
        fetchCoins(true);
        setTimeout(() => {
          setIsModalOpen(false);
        }, 600);
      } else {
        setErrorMessage(data.message || 'Operation failed. Please try again.');
      }
    } catch (err) {
      console.error(err);
      setErrorMessage('Network connection error while saving coin.');
    } finally {
      setSaving(false);
    }
  };

  // Filtered Coins
  const filteredCoins = useMemo(() => {
    return coins.filter(coin => {
      // Metal type filter
      if (activeTab !== 'all' && coin.coin_type !== activeTab) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = coin.title.toLowerCase().includes(q);
        const matchesPurity = (coin.purity || '').toLowerCase().includes(q);
        const matchesSku = (coin.sku || '').toLowerCase().includes(q);
        const matchesWeight = `${coin.weight_grams}g`.includes(q) || `${coin.weight_grams}gm`.includes(q);
        return matchesTitle || matchesPurity || matchesSku || matchesWeight;
      }
      return true;
    });
  }, [coins, activeTab, searchQuery]);

  // Quick statistics
  const stats = useMemo(() => {
    const total = coins.length;
    const gold = coins.filter(c => c.coin_type === 'gold').length;
    const silver = coins.filter(c => c.coin_type === 'silver').length;
    const live = coins.filter(c => c.status === '1').length;
    return { total, gold, silver, live };
  }, [coins]);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/60 shadow-sm relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 opacity-5 pointer-events-none">
          <Coins size={220} className="text-[#5d463c]" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center space-x-2 text-[#5d463c]">
            <Coins size={22} />
            <span className="text-[11px] uppercase tracking-[0.25em] font-black">Bullion & Coin Vault</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif italic text-slate-800 mt-2 font-bold">
            Precious Coins Ledger
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Upload and manage pure gold, silver, and precious metal coins with automated tax, making charges, and discount pricing calculation.
          </p>
        </div>

        <div className="flex items-center space-x-3 relative z-10 shrink-0">
          <button
            onClick={() => fetchCoins(true)}
            className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer"
            title="Refresh Ledger"
          >
            <RefreshCw size={16} />
          </button>
          <button
            onClick={handleOpenCreateModal}
            className="px-5 py-3 bg-[#5d463c] hover:bg-[#4c3931] text-[#efe7e5] rounded-xl text-xs uppercase tracking-widest font-bold flex items-center space-x-2 transition-all shadow-md hover:shadow-lg cursor-pointer"
          >
            <Plus size={16} />
            <span>Upload New Coin</span>
          </button>
        </div>
      </div>

      {/* Metric Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm">
          <span className="text-[10px] uppercase tracking-widest font-black text-slate-400">Total Coins</span>
          <div className="flex items-baseline space-x-2 mt-2">
            <span className="text-2xl font-serif font-bold text-slate-800">{stats.total}</span>
            <span className="text-[10px] text-slate-400">Vaulted</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm">
          <span className="text-[10px] uppercase tracking-widest font-black text-amber-600">Gold Coins</span>
          <div className="flex items-baseline space-x-2 mt-2">
            <span className="text-2xl font-serif font-bold text-amber-700">{stats.gold}</span>
            <span className="text-[10px] text-amber-600/70">24K/22K</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm">
          <span className="text-[10px] uppercase tracking-widest font-black text-slate-500">Silver Coins</span>
          <div className="flex items-baseline space-x-2 mt-2">
            <span className="text-2xl font-serif font-bold text-slate-700">{stats.silver}</span>
            <span className="text-[10px] text-slate-500">999 Pure</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm">
          <span className="text-[10px] uppercase tracking-widest font-black text-emerald-600">Live Status</span>
          <div className="flex items-baseline space-x-2 mt-2">
            <span className="text-2xl font-serif font-bold text-emerald-700">{stats.live}</span>
            <span className="text-[10px] text-emerald-600/70">Public</span>
          </div>
        </div>
      </div>

      {/* Control Bar: Search & Metal Filter Tabs */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Metal Tabs */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          {[
            { id: 'all', label: 'All Coins' },
            { id: 'gold', label: 'Gold (Au)' },
            { id: 'silver', label: 'Silver (Ag)' },
            { id: 'platinum', label: 'Platinum (Pt)' },
            { id: 'other', label: 'Other' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-[#5d463c] text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[260px]">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search coin by name, purity, SKU..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#5d463c] transition-colors"
          />
        </div>
      </div>

      {/* Coins List / Table */}
      <div className="bg-white rounded-3xl border border-slate-200/60 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center space-y-4">
            <Loader2 size={36} className="animate-spin text-[#5d463c]" />
            <span className="text-xs uppercase tracking-widest font-black text-slate-400">Loading Coins Vault...</span>
          </div>
        ) : filteredCoins.length === 0 ? (
          <div className="py-24 text-center space-y-4 px-4">
            <Coins size={48} className="mx-auto text-slate-300" />
            <h3 className="font-serif italic text-lg text-slate-700">No coins found in this view</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Start by uploading your first gold or silver coin with custom weight, purity, and automated pricing.
            </p>
            <button
              onClick={handleOpenCreateModal}
              className="px-6 py-2.5 bg-[#5d463c] text-white text-xs uppercase tracking-widest font-bold rounded-xl hover:bg-[#4c3931] cursor-pointer"
            >
              Upload First Coin
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredCoins.map(coin => {
              const pricing = coin.pricing || {
                base_price: coin.price,
                making_charges: coin.making_charges,
                gst_percent: coin.gst_percent,
                gst_amount: Math.round(((coin.price + (coin.making_charges || 0)) * ((coin.gst_percent || 3) / 100))),
                gross_total: coin.price + (coin.making_charges || 0) + Math.round(((coin.price + (coin.making_charges || 0)) * ((coin.gst_percent || 3) / 100))),
                discount_percent: coin.discount_percent,
                discount_amount: Math.round(((coin.price + (coin.making_charges || 0)) * ((coin.discount_percent || 0) / 100))),
                final_price: coin.price
              };

              const thumbImage = coin.image || (coin.images && coin.images[0]) || '';

              return (
                <div
                  key={coin._id}
                  className="p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6 hover:bg-slate-50/40 transition-colors"
                >
                  {/* Left: Thumbnail & Main Info */}
                  <div className="flex items-center space-x-5 flex-1 min-w-0">
                    <div className="w-20 h-20 bg-[#efe7e5]/40 rounded-2xl flex items-center justify-center border border-slate-200/60 shadow-sm shrink-0 overflow-hidden relative group/img">
                      {thumbImage ? (
                        <>
                          <img
                            src={resolveProductImage(thumbImage, true)}
                            alt={coin.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-125"
                            loading="lazy"
                          />
                          {Array.isArray(coin.images) && coin.images.length > 1 && (
                            <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded-md bg-black/75 text-white text-[8px] font-bold">
                              +{coin.images.length - 1}
                            </span>
                          )}
                        </>
                      ) : (
                        <div className="flex flex-col items-center text-amber-700">
                          <Coins size={26} />
                          <span className="text-[9px] font-bold mt-1 uppercase">{coin.coin_type}</span>
                        </div>
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                        <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                          coin.coin_type === 'gold' 
                            ? 'bg-amber-100 text-amber-800 border border-amber-200' 
                            : coin.coin_type === 'silver'
                            ? 'bg-slate-200 text-slate-800 border border-slate-300'
                            : 'bg-purple-100 text-purple-800 border border-purple-200'
                        }`}>
                          {coin.coin_type}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-[#efe7e5] text-[#5d463c]">
                          {coin.weight_grams} gm
                        </span>
                        <span className="text-[10px] font-bold text-slate-500">
                          {coin.purity}
                        </span>
                      </div>

                      <h3 className="font-serif text-base font-bold text-slate-800 mt-1 truncate">
                        {coin.title}
                      </h3>

                      <p className="text-[9px] text-slate-400 uppercase tracking-widest mt-0.5 truncate">
                        SKU: {coin.sku || 'N/A'} • {coin.stock > 0 ? `${coin.stock} In Stock` : 'Out of Stock'}
                      </p>

                      {Array.isArray(coin.images) && coin.images.length > 1 && (
                        <div className="flex items-center space-x-1.5 mt-2">
                          {coin.images.slice(0, 4).map((imgUrl, i) => (
                            <div key={i} className="w-7 h-7 rounded-lg overflow-hidden border border-slate-200 bg-white shrink-0 shadow-xs" title={`Image ${i + 1}`}>
                              <img src={resolveProductImage(imgUrl, true)} alt="" className="w-full h-full object-cover" />
                            </div>
                          ))}
                          {coin.images.length > 4 && (
                            <span className="text-[9px] text-slate-400 font-bold">+{coin.images.length - 4}</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Middle: Calculated Price Breakdown */}
                  <div className="flex flex-wrap items-center gap-6 lg:gap-10 shrink-0 text-left lg:text-right bg-slate-50/80 p-3.5 rounded-2xl border border-slate-100">
                    <div>
                      <p className="text-[9px] text-slate-400 uppercase tracking-widest">Base Metal</p>
                      <p className="text-xs font-bold text-slate-700 mt-0.5">{formatCurrency(pricing.base_price)}</p>
                      <p className="text-[8px] text-slate-400 mt-0.5">+ Making: {formatCurrency(pricing.making_charges)}</p>
                    </div>

                    <div>
                      <p className="text-[9px] text-slate-400 uppercase tracking-widest">Tax (GST)</p>
                      <p className="text-xs font-bold text-slate-700 mt-0.5">
                        +{formatCurrency(pricing.gst_amount)}
                      </p>
                      <p className="text-[8px] text-slate-400 mt-0.5">({pricing.gst_percent}%)</p>
                    </div>

                    <div>
                      <p className="text-[9px] text-slate-400 uppercase tracking-widest">Discount</p>
                      <p className={`text-xs font-bold mt-0.5 ${pricing.discount_percent > 0 ? 'text-emerald-600' : 'text-slate-400'}`}>
                        {pricing.discount_percent > 0 ? `-${formatCurrency(pricing.discount_amount)}` : '0%'}
                      </p>
                      {pricing.discount_percent > 0 && (
                        <p className="text-[8px] text-emerald-600 font-bold mt-0.5">({pricing.discount_percent}% OFF)</p>
                      )}
                    </div>

                    <div className="pl-2 border-l border-slate-200">
                      <p className="text-[9px] text-[#5d463c] uppercase tracking-widest font-black">Customer Price</p>
                      <p className="text-sm font-black text-[#5d463c] mt-0.5">
                        {formatCurrency(pricing.final_price)}
                      </p>
                      {pricing.discount_amount > 0 && (
                        <p className="text-[9px] text-slate-400 line-through mt-0.5">
                          {formatCurrency(pricing.gross_total)}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center space-x-3 shrink-0 justify-end">
                    {/* Live/Archived Toggle */}
                    <button
                      onClick={() => handleToggleStatus(coin)}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                        coin.status === '1'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                          : 'bg-slate-100 text-slate-400 border border-slate-200 hover:bg-slate-200'
                      }`}
                      title="Click to toggle status"
                    >
                      {coin.status === '1' ? '● Live' : '○ Archived'}
                    </button>

                    <button
                      onClick={() => handleOpenEditModal(coin)}
                      className="p-2.5 bg-[#5d463c] hover:bg-[#4c3931] text-white rounded-xl transition-all cursor-pointer shadow-sm"
                      title="Edit Coin"
                    >
                      <Edit3 size={14} />
                    </button>

                    <button
                      onClick={() => handleDelete(coin._id, coin.title)}
                      className="p-2.5 bg-red-50 hover:bg-red-600 text-red-600 hover:text-white rounded-xl transition-all border border-red-200 cursor-pointer"
                      title="Delete Coin"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Upload / Edit Coin Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-[#5d463c] text-white flex items-center justify-center">
                  <Coins size={20} />
                </div>
                <div>
                  <h3 className="font-serif italic font-bold text-lg text-slate-800">
                    {editingCoinId ? 'Edit Coin Entry' : 'Upload New Coin'}
                  </h3>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider">
                    {editingCoinId ? 'Update pricing ledger & specifications' : 'Add gold or silver coin to public catalogue'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-lg transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Form Body */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
              {errorMessage && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-700 font-bold">
                  {errorMessage}
                </div>
              )}
              {successMessage && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-700 font-bold flex items-center space-x-2">
                  <CheckCircle2 size={16} />
                  <span>{successMessage}</span>
                </div>
              )}

              {/* SECTION 1: Coin Type & Weight */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Coin Metal Type *
                  </label>
                  <select
                    value={formData.coin_type}
                    onChange={(e) => {
                      const newType = e.target.value as 'gold' | 'silver' | 'platinum' | 'other';
                      setFormData(prev => ({
                        ...prev,
                        coin_type: newType,
                        purity: PURITY_SUGGESTIONS[newType]?.[0] || prev.purity
                      }));
                    }}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:border-[#5d463c]"
                  >
                    <option value="gold">Gold Coin (Au)</option>
                    <option value="silver">Silver Coin (Ag)</option>
                    <option value="platinum">Platinum Coin (Pt)</option>
                    <option value="other">Other / Bullion</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center justify-between">
                    <span>Weight (in Grams) *</span>
                    <span className="text-[9px] text-[#5d463c] font-black">e.g. 10g, 20g</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.1"
                    required
                    value={formData.weight_grams}
                    onChange={(e) => setFormData(prev => ({ ...prev, weight_grams: e.target.value }))}
                    placeholder="10"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:border-[#5d463c]"
                  />
                  {/* Quick Weight Chips */}
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {COMMON_WEIGHTS.map(w => (
                      <button
                        type="button"
                        key={w}
                        onClick={() => setFormData(prev => ({ ...prev, weight_grams: String(w) }))}
                        className={`px-2 py-0.5 rounded-lg text-[9px] font-bold transition-all cursor-pointer ${
                          formData.weight_grams === String(w)
                            ? 'bg-[#5d463c] text-white'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {w}g
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* SECTION 2: Name / Title & Purity */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Coin Title / Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g. 24K 999 Pure Gold Coin 10gm"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:border-[#5d463c]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Purity Standard *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.purity}
                    onChange={(e) => setFormData(prev => ({ ...prev, purity: e.target.value }))}
                    placeholder="e.g. 24K (999.9), 999 Fine Silver"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:border-[#5d463c]"
                  />
                  {/* Quick Purity Chips */}
                  <div className="flex flex-wrap gap-1 mt-2">
                    {(PURITY_SUGGESTIONS[formData.coin_type] || []).map(p => (
                      <button
                        type="button"
                        key={p}
                        onClick={() => setFormData(prev => ({ ...prev, purity: p }))}
                        className="px-2 py-0.5 rounded-md text-[8px] bg-slate-100 text-slate-600 hover:bg-slate-200 cursor-pointer"
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* SECTION 3: Price Calculation Inputs (Price, Making, GST %, Discount %) */}
              <div className="p-5 bg-amber-50/40 rounded-2xl border border-amber-200/60 space-y-4">
                <div className="flex items-center space-x-2 text-[#5d463c]">
                  <Receipt size={16} />
                  <span className="text-[10px] uppercase tracking-widest font-black">
                    Pricing & Taxation Ledger
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                      Base Price (₹) *
                    </label>
                    <input
                      type="number"
                      step="1"
                      min="0"
                      required
                      value={formData.price}
                      onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                      placeholder="e.g. 75000"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-[#5d463c]"
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                      Making Charges (₹)
                    </label>
                    <input
                      type="number"
                      step="1"
                      min="0"
                      value={formData.making_charges}
                      onChange={(e) => setFormData(prev => ({ ...prev, making_charges: e.target.value }))}
                      placeholder="e.g. 500"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-[#5d463c]"
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                      GST (%) *
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="100"
                      value={formData.gst_percent}
                      onChange={(e) => setFormData(prev => ({ ...prev, gst_percent: e.target.value }))}
                      placeholder="3"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-[#5d463c]"
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                      Discount (%)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="100"
                      value={formData.discount_percent}
                      onChange={(e) => setFormData(prev => ({ ...prev, discount_percent: e.target.value }))}
                      placeholder="e.g. 5"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-[#5d463c]"
                    />
                  </div>
                </div>

                {/* LIVE CALCULATION BREAKDOWN BOX */}
                <div className="bg-white p-4 rounded-xl border border-amber-200 shadow-sm space-y-2">
                  <div className="flex items-center justify-between text-[10px] text-slate-400 uppercase tracking-widest font-black">
                    <span>Formula: (Price + Makking + GST) - Discount</span>
                    <span className="text-amber-800 font-serif italic">Live Pricing Preview</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2 text-xs">
                    <div>
                      <span className="text-[9px] text-slate-400 block uppercase">Base Metal</span>
                      <span className="font-bold text-slate-700">{formatCurrency(livePricing.base_price)}</span>
                    </div>

                    <div>
                      <span className="text-[9px] text-slate-400 block uppercase">+ Making</span>
                      <span className="font-bold text-slate-700">{formatCurrency(livePricing.making_charges)}</span>
                    </div>

                    <div>
                      <span className="text-[9px] text-slate-400 block uppercase">+ GST ({livePricing.gst_percent}%)</span>
                      <span className="font-bold text-slate-700">{formatCurrency(livePricing.gst_amount)}</span>
                    </div>

                    <div>
                      <span className="text-[9px] text-slate-400 block uppercase">- Discount ({livePricing.discount_percent}%)</span>
                      <span className={`font-bold ${livePricing.discount_percent > 0 ? 'text-emerald-600' : 'text-slate-400'}`}>
                        {livePricing.discount_percent > 0 ? `-${formatCurrency(livePricing.discount_amount)}` : '₹0'}
                      </span>
                    </div>

                    <div className="col-span-2 sm:col-span-1 bg-amber-50/70 p-2 rounded-lg border border-amber-200/50">
                      <span className="text-[9px] text-[#5d463c] font-black block uppercase">Final Price</span>
                      <span className="font-black text-[#5d463c] text-sm">{formatCurrency(livePricing.final_price)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 4: Image Upload */}
              <div className="space-y-4 p-5 bg-slate-50/70 rounded-2xl border border-slate-200">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block text-[11px] font-black uppercase tracking-wider text-slate-700">
                      Coin Images Gallery {coinImages.length > 0 && `(${coinImages.length})`}
                    </label>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      Upload multiple images: Front view, Reverse view, Certicard packaging & Hallmark.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowUrlInput(prev => !prev)}
                    className="text-[10px] font-bold text-[#5d463c] hover:underline flex items-center space-x-1 cursor-pointer"
                  >
                    <LinkIcon size={12} />
                    <span>{showUrlInput ? 'Hide URL input' : '+ Add via URL'}</span>
                  </button>
                </div>

                {/* Optional URL Input */}
                {showUrlInput && (
                  <div className="flex items-center space-x-2 bg-white p-2 rounded-xl border border-slate-200">
                    <input
                      type="url"
                      placeholder="Paste image URL (https://...)"
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      className="flex-1 px-3 py-1.5 text-xs text-slate-700 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleAddUrlImage}
                      className="px-4 py-1.5 bg-[#5d463c] text-white text-xs font-bold rounded-lg hover:bg-[#4c3931] cursor-pointer"
                    >
                      Add
                    </button>
                  </div>
                )}

                {/* Upload Status / Progress Bar */}
                {uploadingImages && (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center space-x-3 text-xs text-amber-800 font-bold">
                    <Loader2 size={16} className="animate-spin text-[#5d463c] shrink-0" />
                    <span>{uploadProgress || 'Processing and uploading images...'}</span>
                  </div>
                )}

                {/* Drag & Drop Upload Zone */}
                <div
                  onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                  onDragLeave={() => setIsDragOver(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer ${
                    isDragOver 
                      ? 'border-[#5d463c] bg-amber-50/50' 
                      : 'border-slate-300 hover:border-[#5d463c] bg-white hover:bg-slate-50/50'
                  }`}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    disabled={uploadingImages}
                    className="hidden"
                  />
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <div className="w-12 h-12 rounded-full bg-[#efe7e5] text-[#5d463c] flex items-center justify-center">
                      <Upload size={20} />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-700 block">
                        Click to browse or Drag & Drop multiple images
                      </span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">
                        Select multiple files at once • PNG, JPG, WEBP supported
                      </span>
                    </div>
                  </div>
                </div>

                {/* Uploaded Images List with Clear Delete & Cover Selection */}
                {coinImages.length > 0 ? (
                  <div className="space-y-2 pt-2">
                    <span className="text-[10px] uppercase tracking-wider font-bold text-slate-500 block">
                      Uploaded Photos ({coinImages.length}) — First image is the Main Cover:
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {coinImages.map((url, idx) => (
                        <div
                          key={idx}
                          className="flex items-center space-x-3 p-3 bg-white rounded-xl border border-slate-200 shadow-sm relative group"
                        >
                          {/* Image Thumbnail */}
                          <div className="w-16 h-16 rounded-lg bg-slate-50 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center">
                            <img
                              src={resolveProductImage(url, true)}
                              alt={`Coin upload ${idx + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          {/* Image Details & Cover Badge */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-1.5 flex-wrap">
                              {idx === 0 ? (
                                <span className="px-2 py-0.5 rounded-md text-[9px] font-black bg-amber-100 text-amber-800 border border-amber-200 flex items-center space-x-1">
                                  <Star size={10} className="fill-amber-600 text-amber-600" />
                                  <span>Cover Photo</span>
                                </span>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => handleMakePrimary(idx)}
                                  className="text-[9px] font-bold text-[#5d463c] hover:underline cursor-pointer"
                                >
                                  Make Cover
                                </button>
                              )}
                              <span className="text-[9px] text-slate-400">Photo #{idx + 1}</span>
                            </div>
                            <p className="text-[10px] text-slate-400 truncate mt-1" title={url}>
                              {url.split('/').pop() || url}
                            </p>
                          </div>

                          {/* Action Buttons: Reorder + Prominent DELETE BUTTON */}
                          <div className="flex items-center space-x-1 shrink-0">
                            {idx > 0 && (
                              <button
                                type="button"
                                onClick={() => handleMoveImage(idx, 'left')}
                                className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-xs cursor-pointer"
                                title="Move left / up"
                              >
                                <ArrowLeft size={12} />
                              </button>
                            )}
                            {idx < coinImages.length - 1 && (
                              <button
                                type="button"
                                onClick={() => handleMoveImage(idx, 'right')}
                                className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-xs cursor-pointer"
                                title="Move right / down"
                              >
                                <ArrowRight size={12} />
                              </button>
                            )}
                            {/* Prominent Red Delete Button */}
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(idx)}
                              className="px-2.5 py-1.5 bg-red-50 hover:bg-red-600 text-red-600 hover:text-white rounded-lg text-[10px] font-bold border border-red-200 transition-colors flex items-center space-x-1 cursor-pointer"
                              title="Delete this image"
                            >
                              <Trash2 size={12} />
                              <span>Delete</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="p-3 bg-slate-100/60 rounded-xl text-center text-[11px] text-slate-400">
                    No images uploaded yet. Please select multiple photos above.
                  </div>
                )}
              </div>

              {/* SECTION 5: Stock, SKU, Status */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Stock Quantity
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.stock}
                    onChange={(e) => setFormData(prev => ({ ...prev, stock: e.target.value }))}
                    placeholder="10"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:border-[#5d463c]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    SKU Code
                  </label>
                  <input
                    type="text"
                    value={formData.sku}
                    onChange={(e) => setFormData(prev => ({ ...prev, sku: e.target.value }))}
                    placeholder="Auto-generated if left blank"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:border-[#5d463c]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Visibility Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:border-[#5d463c]"
                  >
                    <option value="1">Live (Visible on Store)</option>
                    <option value="0">Archived (Hidden)</option>
                  </select>
                </div>
              </div>

              {/* SECTION 6: Description */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Coin Description & Certicard Packaging Notes
                </label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="e.g. Tamper-evident certicard packaging with unique serial number and BIS Hallmark certification..."
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:border-[#5d463c]"
                />
              </div>

              {/* Modal Footer / Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving || uploadingImages}
                  className="px-6 py-2.5 bg-[#5d463c] hover:bg-[#4c3931] disabled:opacity-50 text-[#efe7e5] rounded-xl text-xs uppercase tracking-widest font-bold flex items-center space-x-2 transition-all shadow-md cursor-pointer"
                >
                  {saving && <Loader2 size={14} className="animate-spin" />}
                  <span>{saving ? 'Saving Coin...' : editingCoinId ? 'Update Coin' : 'Save & Publish Coin'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoinsPage;

