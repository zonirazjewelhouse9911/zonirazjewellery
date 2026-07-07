import React, { useState, useEffect, useRef } from 'react';
import { Loader2, Search, X, Edit2, Plus, Upload } from 'lucide-react';
import { cn } from '../lib/utils';

interface Collection {
  _id?: string;
  name: string;
  slug: string;
  image: string;
  tags: string[];
  priority: number;
  isActive: boolean;
  productCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

const DEFAULT_COLLECTION: Collection = {
  name: '',
  slug: '',
  image: '',
  tags: [],
  priority: 0,
  isActive: true
};

export default function Collections() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals state
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);
  
  // Form state
  const [formData, setFormData] = useState<Collection>(DEFAULT_COLLECTION);
  const [tagsInput, setTagsInput] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchCollections = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/collections');
      const data = await res.json();
      if (data.success) {
        setCollections(data.data || []);
      } else {
        console.error('Failed to fetch collections:', data.message);
      }
    } catch (err) {
      console.error('Error fetching collections:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  const handleOpenCreateModal = () => {
    setSelectedCollection(null);
    setFormData(DEFAULT_COLLECTION);
    setTagsInput('');
    setError('');
    setModalOpen(true);
  };

  const handleOpenEditModal = (col: Collection) => {
    setSelectedCollection(col);
    setFormData({
      ...col,
      tags: col.tags || []
    });
    setTagsInput((col.tags || []).join(', '));
    setError('');
    setModalOpen(true);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const generatedSlug = val
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
    setFormData({
      ...formData,
      name: val,
      slug: generatedSlug
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const data = new FormData();
    data.append('file', file);
    data.append('category', 'collections');
    data.append('type', 'collection');

    setUploading(true);
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: data
      });
      const resData = await res.json();
      if (resData.success) {
        setFormData(prev => ({
          ...prev,
          image: resData.data[0].url
        }));
      } else {
        alert(resData.error || 'Upload failed');
      }
    } catch (err) {
      console.error(err);
      alert('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.slug) {
      setError('Name and Slug are required.');
      return;
    }

    setSaving(true);
    setError('');

    // Parse tags array
    const parsedTags = tagsInput
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    const payload = {
      ...formData,
      tags: parsedTags
    };

    try {
      const isEdit = !!selectedCollection;
      const url = isEdit ? `/api/admin/collections/${selectedCollection?._id}` : '/api/admin/collections';
      const method = isEdit ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        setModalOpen(false);
        fetchCollections();
      } else {
        setError(data.message || 'Failed to preserve collection records.');
      }
    } catch (err) {
      setError('Network connection error.');
    } finally {
      setSaving(false);
    }
  };

  const filteredCollections = collections.filter(c => {
    const name = c.name.toLowerCase();
    const slug = c.slug.toLowerCase();
    const query = searchQuery.toLowerCase();
    return name.includes(query) || slug.includes(query);
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500 font-sans text-left text-[#12100e]">
      
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span className="text-[10px] uppercase tracking-[0.45em] font-black text-[#a88265] block">Editorial Vault</span>
          <h1 className="text-4.5xl font-serif font-bold text-[#12100e] mt-2">
            Collections <span className="text-slate-350 font-normal italic not-serif text-3xl ml-1">({collections.length})</span>
          </h1>
        </div>
        <button
          type="button"
          onClick={handleOpenCreateModal}
          className="px-8 py-4 bg-[#5d463c] hover:bg-[#4c3931] text-[#efe7e5] font-bold text-xs uppercase tracking-[0.2em] rounded-2xl transition-all duration-300 shadow-md flex items-center gap-2 cursor-pointer animate-in fade-in"
        >
          <Plus size={16} />
          <span>New Collection</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between p-4 bg-white rounded-3xl border border-slate-200/60 shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by collection name or slug..."
            className="w-full bg-[#f0f3f6] border-none rounded-2xl py-3 pl-12 pr-6 text-sm text-slate-800 placeholder-slate-450 focus:ring-1 focus:ring-brand-gold/50"
          />
        </div>
      </div>

      {/* Collections Grid Layout (2 Columns) */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center space-y-4">
          <Loader2 className="animate-spin text-[#5d463c]" size={32} />
          <span className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold">Querying archives...</span>
        </div>
      ) : filteredCollections.length === 0 ? (
        <div className="py-20 text-center text-slate-500 uppercase tracking-widest text-xs font-bold bg-white border border-slate-200/85 rounded-3xl">
          No collections found in editorial vault. Click new to add.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredCollections.map((col) => (
            <div key={col._id} className="bg-white border border-slate-100 rounded-[32px] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.06)] flex flex-col sm:flex-row transition-all duration-500 group">
              
              {/* Left Side: Cover Image */}
              <div className="w-full sm:w-2/5 h-64 sm:h-auto bg-[#efe7e5]/20 overflow-hidden relative border-r border-slate-150/40">
                {col.image ? (
                  <img 
                    src={col.image} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                    alt={col.name} 
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-[#efe7e5]/40">
                    <span className="text-3xl font-serif italic text-[#5d463c] font-black">{col.name[0]}</span>
                  </div>
                )}
                
                {/* Floating Live Status Dot */}
                <div className="absolute top-4 left-4">
                  <span className={cn(
                    'inline-block px-2.5 py-0.5 rounded-md text-[8px] font-black tracking-widest uppercase shadow-sm border border-emerald-500/20 text-white',
                    col.isActive ? 'bg-emerald-500' : 'bg-slate-400 border-slate-450/20'
                  )}>
                    {col.isActive ? 'Live' : 'Archived'}
                  </span>
                </div>
              </div>

              {/* Right Side: Editorial Content */}
              <div className="flex-1 p-8 text-left flex flex-col justify-between space-y-6 relative">
                
                {/* Upper right pencil icon */}
                <button
                  type="button"
                  onClick={() => handleOpenEditModal(col)}
                  className="absolute top-6 right-6 w-9 h-9 rounded-full bg-slate-100/80 hover:bg-slate-200 text-slate-500 hover:text-[#5d463c] flex items-center justify-center transition-all cursor-pointer border border-slate-200/50 hover:scale-105 active:scale-95"
                  title="Refine Collection"
                >
                  <Edit2 size={13} />
                </button>

                {/* Title and descriptions */}
                <div className="space-y-3.5 pr-6">
                  <h3 className="font-serif text-2xl font-bold text-[#12100e] leading-snug">{col.name}</h3>
                  <p className="text-[9.5px] uppercase tracking-[0.2em] leading-relaxed text-slate-400 font-bold">
                    An editorial curation for the discerning collector.
                  </p>
                </div>

                {/* Tags Section */}
                <div className="flex flex-wrap gap-2">
                  {col.tags && col.tags.map((tag, idx) => (
                    <span 
                      key={idx} 
                      className="text-[8px] font-black uppercase tracking-widest bg-[#efe7e5]/40 text-[#5d463c] px-3 py-1 rounded-md border border-[#5d463c]/15"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Footer Section */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-100 text-[9px] tracking-[0.22em] font-black">
                  <div className="flex items-center space-x-1.5 text-slate-400">
                    <svg className="w-4 h-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l-7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                      <line x1="12" y1="22.08" x2="12" y2="12" />
                    </svg>
                    <span className="text-[#a88265]">{col.productCount || 0} Items Linked</span>
                  </div>
                  <span className="text-slate-350">
                    /{col.slug.toUpperCase()}
                  </span>
                </div>

              </div>

            </div>
          ))}
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
                <span className="text-[9px] uppercase tracking-[0.3em] font-black text-slate-400">Atelier Editorial Ledger</span>
                <h3 className="text-xl font-serif font-bold italic mt-1 text-[#12100e]">
                  {selectedCollection ? 'Refine Collection Rules' : 'Initialize Collection'}
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
                <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl text-red-600 text-xs font-bold uppercase tracking-widest">
                  {error}
                </div>
              )}

              {/* Form Input fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white rounded-3xl p-6 border border-slate-200/60">
                <div className="space-y-2">
                  <label className="text-[9px] uppercase tracking-widest font-black text-[#5d463c] block">Collection Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={handleNameChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-xs text-[#12100e] focus:ring-1 focus:ring-brand-gold/50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] uppercase tracking-widest font-black text-[#5d463c] block">Slug</label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({...formData, slug: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-xs text-[#12100e] focus:ring-1 focus:ring-brand-gold/50"
                  />
                </div>
                <div className="space-y-2 col-span-1 md:col-span-2">
                  <label className="text-[9px] uppercase tracking-widest font-black text-[#5d463c] block">Collection Image URL or File</label>
                  <div className="flex items-center space-x-4">
                    <input
                      type="text"
                      value={formData.image}
                      onChange={(e) => setFormData({...formData, image: e.target.value})}
                      placeholder="e.g. /images/site/collection.jpg"
                      className="flex-1 bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-xs text-[#12100e]"
                    />
                    <input 
                      type="file" 
                      accept="image/*"
                      className="hidden"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                    />
                    <button
                      type="button"
                      disabled={uploading}
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-3 bg-[#5d463c] hover:bg-[#4c3931] text-[#efe7e5] rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center space-x-2 transition-colors disabled:opacity-50 cursor-pointer shadow-sm"
                    >
                      {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                      <span>Upload</span>
                    </button>
                  </div>
                </div>
                <div className="space-y-2 col-span-1 md:col-span-2">
                  <label className="text-[9px] uppercase tracking-widest font-black text-[#5d463c] block">Collection Search Tags (Comma separated)</label>
                  <input
                    type="text"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    placeholder="e.g. bridal, wedding, gold"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-xs text-[#12100e]"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] uppercase tracking-widest font-black text-[#5d463c] block">Display Priority (Numeric weight)</label>
                  <input
                    type="number"
                    value={formData.priority || ''}
                    onChange={(e) => setFormData({...formData, priority: parseInt(e.target.value) || 0})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-xs text-[#12100e]"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] uppercase tracking-widest font-black text-[#5d463c] block">Status Visibility</label>
                  <select
                    value={formData.isActive ? '1' : '0'}
                    onChange={(e) => setFormData({...formData, isActive: e.target.value === '1'})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-xs text-[#12100e] cursor-pointer"
                  >
                    <option value="1">Active (Live)</option>
                    <option value="0">Inactive (Archive)</option>
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
                <span>{selectedCollection ? 'Preserve Rules' : 'Initialize Collection'}</span>
              </button>
            </div>

          </form>
        </div>
      )}

    </div>
  );
}
