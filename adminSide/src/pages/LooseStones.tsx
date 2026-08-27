import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Loader2, 
  X, 
  CheckCircle2, 
  Gem, 
  ShieldCheck, 
  RefreshCw,
  Upload
} from 'lucide-react';
import { resolveProductImage } from '../lib/imageResolver';

interface LooseStone {
  _id: string;
  title: string;
  stone_type: 'diamond' | 'solitaire' | 'gemstone' | 'color_stone';
  shape: string;
  weight_carat: number;
  quality: string;
  color: string;
  cut_grade: string;
  price: number;
  discount: number;
  stock: number;
  certificate_no: string;
  mine_name?: string;
  country_of_origin?: string;
  description: string;
  image: string;
  images?: string[];
  status: string;
  createdAt?: string;
}

const SHAPES = [
  'Round', 'Princess', 'Emerald', 'Oval', 'Cushion', 
  'Pear', 'Radiant', 'Marquise', 'Heart', 'Asscher'
];

const QUALITIES = [
  'IJ-SI', 'GH-VS', 'EF-VVS', 'FG-SI', 
  'VVS1', 'VVS2', 'VS1', 'VS2', 'SI1', 'IF', 'FL'
];

const COLORS = [
  'D', 'E', 'F', 'G', 'H', 'I-J', 
  'Fancy Yellow', 'Royal Blue', 'Emerald Green', 'Ruby Red', 'Pink'
];

const LooseStones: React.FC = () => {
  const [stones, setStones] = useState<LooseStone[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<string>('all');
  
  // Modal / Form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStoneId, setEditingStoneId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Multiple Image Upload State
  const [stoneImages, setStoneImages] = useState<string[]>([]);
  const [uploadingImages, setUploadingImages] = useState(false);

  // Initial Form Data State
  const initialFormData = {
    title: '',
    stone_type: 'solitaire',
    shape: 'Round',
    weight_carat: '',
    quality: 'GH-VS',
    color: 'G',
    cut_grade: 'Excellent',
    price: '',
    discount: '0',
    stock: '1',
    certificate_no: '',
    mine_name: '',
    country_of_origin: '',
    description: '',
    image: '',
    status: '1'
  };

  const [formData, setFormData] = useState(initialFormData);

  // Fetch loose stones from backend
  const fetchStones = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/loose-stones');
      const data = await res.json();
      if (data.success) {
        setStones(data.data || []);
      }
    } catch (error) {
      console.error('Failed to load loose stones:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStones();
  }, []);

  // Handle File Upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImages(true);
    setErrorMessage('');

    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const bodyData = new FormData();
        bodyData.append('file', file);

        const res = await fetch('/api/upload', {
          method: 'POST',
          body: bodyData
        });
        const json = await res.json();
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          return json.data[0].url || json.data[0].path;
        }
        return null;
      });

      const results = await Promise.all(uploadPromises);
      const validUrls = results.filter(Boolean) as string[];
      if (validUrls.length > 0) {
        setStoneImages(prev => [...prev, ...validUrls]);
      } else {
        setErrorMessage('Failed to upload image(s). Please try again.');
      }
    } catch (err) {
      console.error(err);
      setErrorMessage('Network connection error while uploading images.');
    } finally {
      setUploadingImages(false);
      e.target.value = '';
    }
  };

  const handleRemoveImage = (index: number) => {
    setStoneImages(prev => prev.filter((_, i) => i !== index));
  };

  // Open modal for new stone
  const handleOpenCreateModal = () => {
    setEditingStoneId(null);
    setFormData(initialFormData);
    setStoneImages([]);
    setErrorMessage('');
    setSuccessMessage('');
    setIsModalOpen(true);
  };

  // Open modal for editing existing stone
  const handleOpenEditModal = (stone: LooseStone) => {
    setEditingStoneId(stone._id);
    setFormData({
      title: stone.title || '',
      stone_type: stone.stone_type || 'solitaire',
      shape: stone.shape || 'Round',
      weight_carat: stone.weight_carat ? String(stone.weight_carat) : '',
      quality: stone.quality || 'GH-VS',
      color: stone.color || 'G',
      cut_grade: stone.cut_grade || 'Excellent',
      price: stone.price ? String(stone.price) : '',
      discount: stone.discount ? String(stone.discount) : '0',
      stock: stone.stock !== undefined ? String(stone.stock) : '1',
      certificate_no: stone.certificate_no || '',
      mine_name: stone.mine_name || '',
      country_of_origin: stone.country_of_origin || '',
      description: stone.description || '',
      image: stone.image || '',
      status: stone.status || '1'
    });
    setStoneImages(
      Array.isArray(stone.images) && stone.images.length > 0
        ? stone.images
        : (stone.image ? [stone.image] : [])
    );
    setErrorMessage('');
    setSuccessMessage('');
    setIsModalOpen(true);
  };

  // Delete loose stone
  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) {
      return;
    }
    try {
      const res = await fetch(`/api/admin/loose-stones/${id}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        fetchStones();
      } else {
        alert(data.message || 'Failed to delete stone.');
      }
    } catch (err) {
      console.error(err);
      alert('Network error while deleting loose stone.');
    }
  };

  // Submit Form Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMessage('');
    setSuccessMessage('');

    if (!formData.title.trim() || !formData.price || !formData.weight_carat) {
      setErrorMessage('Please fill out all required fields: Title, Carat Weight, and Selling Price.');
      setSaving(false);
      return;
    }

    try {
      const url = editingStoneId 
        ? `/api/admin/loose-stones/${editingStoneId}` 
        : '/api/admin/loose-stones';
      const method = editingStoneId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: formData.title.trim(),
          stone_type: formData.stone_type,
          shape: formData.shape,
          weight_carat: parseFloat(formData.weight_carat) || 0,
          quality: formData.quality,
          color: formData.color,
          cut_grade: formData.cut_grade,
          price: parseFloat(formData.price) || 0,
          discount: parseFloat(formData.discount) || 0,
          stock: parseInt(formData.stock) || 0,
          certificate_no: formData.certificate_no.trim(),
          mine_name: formData.mine_name.trim(),
          country_of_origin: formData.country_of_origin.trim(),
          description: formData.description.trim(),
          image: stoneImages.length > 0 ? stoneImages[0] : '',
          images: stoneImages,
          status: formData.status
        })
      });

      const data = await res.json();
      if (data.success) {
        setSuccessMessage(editingStoneId ? 'Stone details updated successfully!' : 'Loose stone created successfully!');
        fetchStones();
        setTimeout(() => {
          setIsModalOpen(false);
        }, 600);
      } else {
        setErrorMessage(data.message || 'Failed to save loose stone.');
      }
    } catch (err) {
      console.error(err);
      setErrorMessage('Network connection error while saving.');
    } finally {
      setSaving(false);
    }
  };

  // Filter stones by tab & search query
  const filteredStones = stones.filter(stone => {
    const matchesTab = activeTab === 'all' || stone.stone_type === activeTab;
    const q = searchQuery.toLowerCase();
    const matchesQuery = 
      (stone.title || '').toLowerCase().includes(q) ||
      (stone.shape || '').toLowerCase().includes(q) ||
      (stone.quality || '').toLowerCase().includes(q) ||
      (stone.certificate_no || '').toLowerCase().includes(q);
    return matchesTab && matchesQuery;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-7xl">
      {/* Title Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase tracking-[0.4em] font-black text-slate-500">Standalone Vault</span>
          <h1 className="text-3xl sm:text-4.5xl font-serif font-bold text-[#12100e] mt-1 sm:mt-2 flex items-center gap-3">
            <span>Loose Stones</span>
            <span className="text-slate-400 font-normal italic not-serif text-xl sm:text-2xl">({stones.length})</span>
          </h1>
          <p className="text-xs text-slate-500 mt-2 max-w-xl">
            List and manage standalone diamonds, solitaires, gemstones, and color stones for direct sales.
          </p>
        </div>
        <button
          onClick={handleOpenCreateModal}
          className="px-6 sm:px-8 py-3.5 sm:py-4 bg-[#5d463c] hover:bg-[#4c3931] text-[#efe7e5] font-bold text-xs uppercase tracking-[0.2em] rounded-xl transition-all duration-300 shadow-md flex items-center justify-center gap-2 cursor-pointer w-full sm:w-auto"
        >
          <Plus size={16} />
          <span>+ Add Loose Stone</span>
        </button>
      </div>

      {/* Tabs & Search Filter Row */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-4 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          
          {/* Stone Type Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
            {[
              { id: 'all', label: 'All Stones' },
              { id: 'solitaire', label: 'Solitaires' },
              { id: 'diamond', label: 'Diamonds' },
              { id: 'gemstone', label: 'Gemstones' },
              { id: 'color_stone', label: 'Color Stones' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-2.5 rounded-xl text-[11px] uppercase tracking-wider font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-[#5d463c] text-[#efe7e5] shadow-sm'
                    : 'bg-slate-100/70 text-slate-600 hover:bg-slate-200/70'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Box & Refresh */}
          <div className="flex items-center gap-3 flex-1 md:max-w-md">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                placeholder="Search by title, shape, purity or certificate..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-[#f8f9fa] border border-slate-200 focus:border-[#5d463c] focus:ring-1 focus:ring-[#5d463c]/30 rounded-xl py-2.5 pl-11 pr-4 text-xs font-medium text-slate-800 transition-all"
              />
            </div>
            <button
              onClick={fetchStones}
              className="p-2.5 hover:bg-slate-100 rounded-xl text-slate-500 transition-colors"
              title="Refresh ledger"
            >
              <RefreshCw size={16} />
            </button>
          </div>

        </div>
      </div>

      {/* Loose Stones Directory Listing */}
      <div className="bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <span className="text-[10px] uppercase tracking-widest font-black text-slate-400">Loose Stone Inventory</span>
          <span className="text-[9px] text-slate-500 uppercase tracking-widest">
            Showing {filteredStones.length} items
          </span>
        </div>

        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-4">
            <Loader2 className="animate-spin text-[#5d463c]" size={32} />
            <span className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold">Querying loose stone catalog...</span>
          </div>
        ) : filteredStones.length === 0 ? (
          <div className="py-20 text-center space-y-4">
            <Gem className="mx-auto text-slate-300" size={40} />
            <span className="text-xs uppercase tracking-widest text-slate-400 font-bold block">No loose stones found</span>
            <button
              onClick={handleOpenCreateModal}
              className="px-6 py-2.5 bg-[#5d463c] text-[#efe7e5] rounded-xl text-[10px] uppercase tracking-widest font-bold hover:bg-[#4c3931] cursor-pointer"
            >
              + Add First Loose Stone
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredStones.map(stone => (
              <div key={stone._id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-slate-50/40 transition-colors">
                
                {/* Stone Title & Details */}
                <div className="flex items-center space-x-5 flex-1 min-w-0">
                  <div className="w-20 h-20 bg-[#efe7e5]/50 rounded-2xl flex items-center justify-center border border-slate-200/60 shadow-sm shrink-0 overflow-hidden relative">
                    {(stone.images && stone.images.length > 0) || stone.image ? (
                      <img 
                        src={resolveProductImage((stone.images && stone.images.length > 0) ? stone.images[0] : stone.image)} 
                        alt={stone.title} 
                        className="w-full h-full object-cover" 
                      />
                    ) : (
                      <Gem className="text-[#5d463c]" size={28} />
                    )}
                  </div>
                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] uppercase tracking-wider font-extrabold px-2.5 py-0.5 rounded-full bg-[#5d463c]/10 text-[#5d463c]">
                        {stone.stone_type.replace('_', ' ')}
                      </span>
                      {stone.certificate_no && (
                        <span className="text-[9px] font-bold text-slate-500 flex items-center gap-1">
                          <ShieldCheck size={12} className="text-emerald-600" />
                          <span>Cert: {stone.certificate_no}</span>
                        </span>
                      )}
                    </div>
                    <h3 className="font-serif text-base font-bold text-[#12100e] truncate">{stone.title}</h3>
                    <div className="flex flex-wrap items-center gap-2 text-[10px] text-slate-500 font-medium">
                      <span>Shape: <strong className="text-slate-800">{stone.shape}</strong></span>
                      <span>•</span>
                      <span>Weight: <strong className="text-slate-800">{stone.weight_carat} ct</strong></span>
                      <span>•</span>
                      <span>Quality: <strong className="text-slate-800">{stone.quality}</strong></span>
                      <span>•</span>
                      <span>Color: <strong className="text-slate-800">{stone.color}</strong></span>
                      {stone.mine_name && (
                        <>
                          <span>•</span>
                          <span>Mine: <strong className="text-slate-800">{stone.mine_name}</strong></span>
                        </>
                      )}
                      {stone.country_of_origin && (
                        <>
                          <span>•</span>
                          <span>Origin: <strong className="text-slate-800">{stone.country_of_origin}</strong></span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Price, Stock & Actions */}
                <div className="flex flex-wrap items-center gap-6 md:gap-12 shrink-0 text-left md:text-right">
                  <div>
                    <p className="text-[9px] text-slate-400 uppercase tracking-widest">Selling Price</p>
                    <p className="text-sm font-bold text-slate-900 mt-0.5">
                      ₹{stone.price ? stone.price.toLocaleString('en-IN') : 0}
                    </p>
                  </div>

                  <div>
                    <p className="text-[9px] text-slate-400 uppercase tracking-widest">Stock</p>
                    <span className={`flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide mt-0.5 ${stone.stock > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${stone.stock > 0 ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                      {stone.stock > 0 ? `${stone.stock} Available` : 'Out of Stock'}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleOpenEditModal(stone)}
                      className="px-4 py-2 bg-[#5d463c] hover:bg-[#4c3931] text-[#efe7e5] rounded-xl text-[10px] uppercase tracking-widest font-bold transition-all border border-slate-200/50 shadow-sm flex items-center gap-1.5 cursor-pointer"
                    >
                      <Edit3 size={13} />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDelete(stone._id, stone.title)}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-[10px] uppercase tracking-widest font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
                    >
                      <Trash2 size={13} />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add / Edit Modal Drawer */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl animate-in zoom-in-95 duration-200 relative overflow-hidden my-auto">
            
            {/* Modal Header (Fixed / Sticky at Top) */}
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5 bg-slate-50/80 shrink-0">
              <div>
                <span className="text-[9px] uppercase tracking-[0.3em] font-black text-[#5d463c]">Direct Loose Stone Sale</span>
                <h2 className="text-lg md:text-xl font-serif font-bold text-[#12100e] mt-0.5">
                  {editingStoneId ? 'Edit Loose Stone Details' : 'Add New Loose Stone'}
                </h2>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-slate-200/60 rounded-full text-slate-400 hover:text-slate-700 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">

              {/* Modal Messages */}
              {errorMessage && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-xs font-bold text-red-600">
                  {errorMessage}
                </div>
              )}
              {successMessage && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs font-bold text-emerald-700 flex items-center gap-2">
                  <CheckCircle2 size={16} />
                  <span>{successMessage}</span>
                </div>
              )}

              {/* Modal Form Container */}
              <form id="looseStoneForm" onSubmit={handleSubmit} className="space-y-6">
                
                {/* Title (Full Width) */}
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-wider font-bold text-slate-500 block">
                    Stone Title / Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 1.50 Ct VVS1 Round Solitaire Diamond"
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    className="w-full bg-[#f8f9fa] border border-slate-200 focus:border-[#5d463c] focus:ring-1 focus:ring-[#5d463c]/30 rounded-xl py-3 px-4 text-xs font-bold text-slate-800 transition-all"
                  />
                </div>

                {/* Section 1: Classification & Specs */}
                <div className="bg-slate-50/60 border border-slate-200/70 rounded-2xl p-4 md:p-5 space-y-4">
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#5d463c] block border-b border-slate-200/60 pb-2">
                    1. Stone Specifications
                  </span>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    
                    {/* Category */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase tracking-wider font-bold text-slate-500 block">
                        Category *
                      </label>
                      <select
                        value={formData.stone_type}
                        onChange={e => setFormData({ ...formData, stone_type: e.target.value as any })}
                        className="w-full bg-white border border-slate-200 focus:border-[#5d463c] rounded-xl py-2.5 px-3 text-xs font-bold text-slate-800 transition-all"
                      >
                        <option value="solitaire">Solitaire</option>
                        <option value="diamond">Diamond</option>
                        <option value="gemstone">Gemstone</option>
                        <option value="color_stone">Color Stone</option>
                      </select>
                    </div>

                    {/* Shape */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase tracking-wider font-bold text-slate-500 block">
                        Shape
                      </label>
                      <select
                        value={formData.shape}
                        onChange={e => setFormData({ ...formData, shape: e.target.value })}
                        className="w-full bg-white border border-slate-200 focus:border-[#5d463c] rounded-xl py-2.5 px-3 text-xs font-bold text-slate-800 transition-all"
                      >
                        {SHAPES.map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>

                    {/* Weight Carat */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase tracking-wider font-bold text-slate-500 block">
                        Weight (Carats - ct) *
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        required
                        placeholder="e.g. 1.25"
                        value={formData.weight_carat}
                        onChange={e => setFormData({ ...formData, weight_carat: e.target.value })}
                        className="w-full bg-white border border-slate-200 focus:border-[#5d463c] rounded-xl py-2.5 px-3 text-xs font-bold text-slate-800 transition-all"
                      />
                    </div>

                    {/* Quality / Purity */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase tracking-wider font-bold text-slate-500 block">
                        Purity / Quality
                      </label>
                      <select
                        value={formData.quality}
                        onChange={e => setFormData({ ...formData, quality: e.target.value })}
                        className="w-full bg-white border border-slate-200 focus:border-[#5d463c] rounded-xl py-2.5 px-3 text-xs font-bold text-slate-800 transition-all"
                      >
                        {QUALITIES.map(q => (
                          <option key={q} value={q}>{q}</option>
                        ))}
                      </select>
                    </div>

                    {/* Color Grade */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase tracking-wider font-bold text-slate-500 block">
                        Color Grade
                      </label>
                      <select
                        value={formData.color}
                        onChange={e => setFormData({ ...formData, color: e.target.value })}
                        className="w-full bg-white border border-slate-200 focus:border-[#5d463c] rounded-xl py-2.5 px-3 text-xs font-bold text-slate-800 transition-all"
                      >
                        {COLORS.map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>

                    {/* Cut Grade */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase tracking-wider font-bold text-slate-500 block">
                        Cut Grade
                      </label>
                      <select
                        value={formData.cut_grade}
                        onChange={e => setFormData({ ...formData, cut_grade: e.target.value })}
                        className="w-full bg-white border border-slate-200 focus:border-[#5d463c] rounded-xl py-2.5 px-3 text-xs font-bold text-slate-800 transition-all"
                      >
                        <option value="Excellent">Excellent</option>
                        <option value="Very Good">Very Good</option>
                        <option value="Good">Good</option>
                        <option value="Ideal">Ideal</option>
                        <option value="N/A">N/A</option>
                      </select>
                    </div>

                  </div>
                </div>

                {/* Section 2: Pricing & Inventory */}
                <div className="bg-slate-50/60 border border-slate-200/70 rounded-2xl p-4 md:p-5 space-y-4">
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#5d463c] block border-b border-slate-200/60 pb-2">
                    2. Commercial & Inventory
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    
                    {/* Selling Price */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase tracking-wider font-bold text-slate-500 block">
                        Selling Price (₹) *
                      </label>
                      <input
                        type="number"
                        min="0"
                        required
                        placeholder="e.g. 125000"
                        value={formData.price}
                        onChange={e => setFormData({ ...formData, price: e.target.value })}
                        className="w-full bg-white border border-slate-200 focus:border-[#5d463c] rounded-xl py-2.5 px-3 text-xs font-bold text-slate-800 transition-all"
                      />
                    </div>

                    {/* Stock */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase tracking-wider font-bold text-slate-500 block">
                        Available Stock
                      </label>
                      <input
                        type="number"
                        min="0"
                        placeholder="1"
                        value={formData.stock}
                        onChange={e => setFormData({ ...formData, stock: e.target.value })}
                        className="w-full bg-white border border-slate-200 focus:border-[#5d463c] rounded-xl py-2.5 px-3 text-xs font-bold text-slate-800 transition-all"
                      />
                    </div>

                    {/* Status */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase tracking-wider font-bold text-slate-500 block">
                        Visibility Status
                      </label>
                      <select
                        value={formData.status}
                        onChange={e => setFormData({ ...formData, status: e.target.value })}
                        className="w-full bg-white border border-slate-200 focus:border-[#5d463c] rounded-xl py-2.5 px-3 text-xs font-bold text-slate-800 transition-all"
                      >
                        <option value="1">Live (Visible)</option>
                        <option value="0">Archived (Hidden)</option>
                      </select>
                    </div>

                  </div>
                </div>

                {/* Section 3: Origin & Certificate */}
                <div className="bg-slate-50/60 border border-slate-200/70 rounded-2xl p-4 md:p-5 space-y-4">
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#5d463c] block border-b border-slate-200/60 pb-2">
                    3. Origin & Certification
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    
                    {/* Certificate No */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase tracking-wider font-bold text-slate-500 block">
                        Certificate No. (GIA / IGI / SGL)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. GIA-74839201"
                        value={formData.certificate_no}
                        onChange={e => setFormData({ ...formData, certificate_no: e.target.value })}
                        className="w-full bg-white border border-slate-200 focus:border-[#5d463c] rounded-xl py-2.5 px-3 text-xs font-bold text-slate-800 transition-all"
                      />
                    </div>

                    {/* Mine Name */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase tracking-wider font-bold text-slate-500 block">
                        Mine Name / Origin Mine
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Argyle Mine, Muzo Mine"
                        value={formData.mine_name}
                        onChange={e => setFormData({ ...formData, mine_name: e.target.value })}
                        className="w-full bg-white border border-slate-200 focus:border-[#5d463c] rounded-xl py-2.5 px-3 text-xs font-bold text-slate-800 transition-all"
                      />
                    </div>

                    {/* Country of Origin */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase tracking-wider font-bold text-slate-500 block">
                        Country of Origin
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. South Africa, India, Botswana"
                        value={formData.country_of_origin}
                        onChange={e => setFormData({ ...formData, country_of_origin: e.target.value })}
                        className="w-full bg-white border border-slate-200 focus:border-[#5d463c] rounded-xl py-2.5 px-3 text-xs font-bold text-slate-800 transition-all"
                      />
                    </div>

                  </div>
                </div>

                {/* Section 4: Media Uploader & Notes */}
                <div className="bg-slate-50/60 border border-slate-200/70 rounded-2xl p-4 md:p-5 space-y-4">
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#5d463c] block border-b border-slate-200/60 pb-2">
                    4. Media & Additional Notes
                  </span>

                  {/* Multiple Stone Images Upload */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] uppercase tracking-wider font-bold text-slate-500 block">
                        Stone Images ({stoneImages.length} Uploaded)
                      </label>
                      <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                        Select one or multiple images
                      </span>
                    </div>

                    {/* Upload Dropzone / Button */}
                    <div className="relative border-2 border-dashed border-slate-300 hover:border-[#5d463c] bg-white hover:bg-[#5d463c]/5 transition-all rounded-2xl p-5 text-center cursor-pointer group">
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={uploadingImages}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                      <div className="flex flex-col items-center justify-center space-y-2 pointer-events-none">
                        {uploadingImages ? (
                          <div className="flex items-center space-x-2 text-[#5d463c]">
                            <Loader2 size={24} className="animate-spin" />
                            <span className="text-xs font-bold uppercase tracking-wider">Uploading images...</span>
                          </div>
                        ) : (
                          <>
                            <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-200 shadow-sm flex items-center justify-center text-[#5d463c] group-hover:scale-110 transition-transform">
                              <Upload size={18} />
                            </div>
                            <div>
                              <span className="text-xs font-bold text-slate-700 block">Click or Drag & Drop Images</span>
                              <span className="text-[10px] text-slate-400">Select 1 or more images (PNG, JPG, WEBP)</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Uploaded Images Preview Grid */}
                    {stoneImages.length > 0 && (
                      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 mt-3">
                        {stoneImages.map((imgUrl, idx) => (
                          <div key={idx} className="relative group rounded-xl overflow-hidden border border-slate-200 aspect-square bg-slate-100 shadow-sm">
                            <img
                              src={resolveProductImage(imgUrl)}
                              alt={`Uploaded stone ${idx + 1}`}
                              className="w-full h-full object-cover"
                            />
                            {idx === 0 && (
                              <span className="absolute top-1 left-1 bg-[#5d463c] text-[#efe7e5] text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md shadow-sm">
                                Primary
                              </span>
                            )}
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(idx)}
                              className="absolute top-1 right-1 p-1 bg-red-600/90 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hover:bg-red-700 shadow-md"
                              title="Remove image"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Description / Notes */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-wider font-bold text-slate-500 block">
                      Description / Notes
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Enter stone specifications, inclusions, or origin notes..."
                      value={formData.description}
                      onChange={e => setFormData({ ...formData, description: e.target.value })}
                      className="w-full bg-white border border-slate-200 focus:border-[#5d463c] rounded-xl py-2.5 px-3 text-xs font-bold text-slate-800 transition-all"
                    />
                  </div>

                </div>

              </form>
            </div>

            {/* Modal Footer (Fixed / Sticky at Bottom) */}
            <div className="flex items-center justify-end space-x-3 border-t border-slate-100 px-6 py-4 bg-slate-50/80 shrink-0">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="looseStoneForm"
                disabled={saving}
                className="px-8 py-2.5 bg-[#5d463c] hover:bg-[#4c3931] text-[#efe7e5] rounded-xl font-bold text-xs uppercase tracking-wider transition-all disabled:opacity-50 flex items-center gap-2 cursor-pointer shadow-sm"
              >
                {saving ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                <span>{editingStoneId ? 'Save Changes' : 'Create Loose Stone'}</span>
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default LooseStones;
