import React, { useState, useEffect, useRef } from 'react';
import { Loader2, Trash2, Upload, Link, Eye, CheckCircle2, AlertCircle } from 'lucide-react';
import { resolveProductImage } from '../lib/imageResolver';

interface Banner {
  _id?: string;
  title: string;
  imageUrl: string;
  link: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export default function Banners() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // Form State
  const [title, setTitle] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [link, setLink] = useState('');
  const [validationError, setValidationError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchBanners = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/banners');
      const data = await res.json();
      if (data.success) {
        setBanners(data.data || []);
      } else {
        console.error('Failed to fetch banners:', data.message);
      }
    } catch (err) {
      console.error('Error fetching banners:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setValidationError('');
    setSuccessMsg('');

    // Client-side image dimensions validation
    const img = new Image();
    img.src = URL.createObjectURL(file);
    
    img.onload = async () => {
      // Clean up memory
      URL.revokeObjectURL(img.src);

      // Validate dimensions: max width 1214.08, max height 450
      if (img.width > 1214.08 || img.height > 450) {
        setValidationError(`Image dimensions (${img.width}x${img.height}px) exceed the maximum permitted size of 1214.08 x 450 px.`);
        if (fileInputRef.current) fileInputRef.current.value = '';
        return;
      }

      // If dimensions are valid, proceed with upload
      const formData = new FormData();
      formData.append('file', file);
      formData.append('category', 'banners');
      formData.append('type', 'banner');

      setUploading(true);
      try {
        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        });
        const resData = await res.json();
        if (resData.success) {
          setImageUrl(resData.data[0].url);
          setSuccessMsg('Banner image successfully validated and uploaded.');
        } else {
          setValidationError(resData.error || 'Upload failed');
        }
      } catch (err) {
        console.error(err);
        setValidationError('Upload failed due to network/server issue.');
      } finally {
        setUploading(false);
      }
    };

    img.onerror = () => {
      setValidationError('Failed to read the image file.');
    };
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl) {
      setValidationError('Please upload a banner image first.');
      return;
    }

    setSaving(true);
    setValidationError('');
    setSuccessMsg('');

    try {
      const res = await fetch('/api/admin/banners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, imageUrl, link, isActive: true })
      });
      const resData = await res.json();
      if (resData.success) {
        setTitle('');
        setImageUrl('');
        setLink('');
        setSuccessMsg('Banner successfully saved to directory.');
        fetchBanners();
        if (fileInputRef.current) fileInputRef.current.value = '';
      } else {
        setValidationError(resData.message || 'Failed to save banner.');
      }
    } catch (err) {
      console.error(err);
      setValidationError('Server connection failed.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this hero banner?')) return;

    try {
      const res = await fetch(`/api/admin/banners/${id}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        fetchBanners();
      } else {
        alert(data.message || 'Failed to delete banner.');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to connect to delete endpoint.');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Header Title Row */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span className="text-[10px] uppercase tracking-[0.4em] font-black text-slate-500">Website Interface Settings</span>
          <h1 className="text-4.5xl font-serif font-bold text-[#12100e] mt-2">
            Hero Section Banners <span className="text-slate-400 font-normal italic not-serif text-2xl ml-1">({banners.length})</span>
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Banner Upload Form */}
        <div className="lg:col-span-4 bg-white border border-slate-200/80 rounded-3xl p-8 shadow-sm h-fit space-y-6">
          <h2 className="text-lg font-serif font-bold text-[#12100e]">Add Banner</h2>
          
          <form onSubmit={handleSave} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-[9px] uppercase tracking-[0.3em] font-black text-brand-gold ml-2 block">Banner Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Elegant Summer Collection"
                className="w-full bg-[#f0f3f6] border-none rounded-2xl py-3.5 px-5 text-sm text-slate-800 focus:ring-1 focus:ring-brand-gold/50"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[9px] uppercase tracking-[0.3em] font-black text-brand-gold ml-2 block">Redirect Link</label>
              <input
                type="text"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                placeholder="e.g. /collections/summer-2026"
                className="w-full bg-[#f0f3f6] border-none rounded-2xl py-3.5 px-5 text-sm text-slate-800 focus:ring-1 focus:ring-brand-gold/50"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[9px] uppercase tracking-[0.3em] font-black text-brand-gold ml-2 block">Banner Image</label>
              
              <div className="bg-[#f0f3f6] rounded-2xl p-6 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center space-y-3 relative group overflow-hidden min-h-[140px]">
                {imageUrl ? (
                  <>
                    <img 
                      src={resolveProductImage(imageUrl)} 
                      className="absolute inset-0 w-full h-full object-cover opacity-90 transition-transform duration-500 group-hover:scale-105" 
                      alt="Banner Preview" 
                    />
                    <div className="absolute inset-0 bg-black/45 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-white hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-xl text-[10px] uppercase tracking-widest font-bold flex items-center gap-1.5 cursor-pointer shadow-md"
                      >
                        <Upload size={12} /> Replace Image
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-slate-400 shadow-sm">
                      {uploading ? <Loader2 className="animate-spin text-slate-500" size={20} /> : <Upload size={20} />}
                    </div>
                    <div>
                      <button 
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        className="text-xs font-bold text-[#5d463c] hover:underline cursor-pointer"
                      >
                        Click to upload banner
                      </button>
                      <p className="text-[9px] text-slate-450 uppercase mt-1 tracking-widest">Supports PNG, JPG, WEBP</p>
                    </div>
                  </>
                )}
                
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
              </div>

              {/* Resolution constraint label */}
              <div className="flex items-start gap-2 bg-[#efe7e5]/50 border border-slate-200/50 rounded-xl p-3 mt-2">
                <AlertCircle size={14} className="text-brand-gold shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] font-bold text-slate-700 block">Required Dimensions</span>
                  <span className="text-[9px] text-slate-500 block leading-normal mt-0.5">
                    Images must be at most <strong>1214.08 x 450 px</strong> to maintain premium layout alignment.
                  </span>
                </div>
              </div>
            </div>

            {validationError && (
              <div className="flex items-center gap-2 text-red-500 bg-red-50 border border-red-200 rounded-xl p-3.5 text-xs leading-normal">
                <AlertCircle size={14} className="shrink-0" />
                <span>{validationError}</span>
              </div>
            )}

            {successMsg && (
              <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 text-xs leading-normal">
                <CheckCircle2 size={14} className="shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={saving || uploading}
              className="w-full py-4 bg-[#5d463c] hover:bg-[#4c3931] text-[#efe7e5] disabled:bg-[#efe7e5]/60 disabled:text-slate-400 font-bold text-xs uppercase tracking-[0.2em] rounded-xl transition-all duration-300 shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              {saving ? (
                <>
                  <Loader2 className="animate-spin" size={14} /> Preserving...
                </>
              ) : (
                'Preserve Banner'
              )}
            </button>
          </form>
        </div>

        {/* Banners List */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-sm">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <span className="text-[10px] uppercase tracking-widest font-black text-slate-400">Current Hero Banners</span>
              <span className="text-[9px] text-slate-500 uppercase tracking-widest">
                Showing {banners.length} items
              </span>
            </div>
            
            {loading ? (
              <div className="py-20 flex flex-col items-center justify-center space-y-4">
                <Loader2 className="animate-spin text-[#5d463c]" size={32} />
                <span className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold">Querying directory...</span>
              </div>
            ) : banners.length === 0 ? (
              <div className="py-20 text-center space-y-4">
                <span className="text-xs uppercase tracking-widest text-slate-450 font-bold block">No hero banners active</span>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">Upload banners using the panel on the left to set up the website slider.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {banners.map((item) => (
                  <div key={item._id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-slate-50/30 transition-colors">
                    <div className="flex items-center space-x-5 flex-1 min-w-0">
                      <div className="w-32 h-16 bg-[#efe7e5]/40 rounded-xl flex items-center justify-center border border-slate-200/60 shadow-sm shrink-0 overflow-hidden relative group/img">
                        <img 
                          src={resolveProductImage(item.imageUrl)} 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-110" 
                          alt={item.title || "Banner Image"} 
                        />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-serif text-md font-bold text-[#12100e] truncate">{item.title || 'Untitled Banner'}</h3>
                        {item.link ? (
                          <div className="flex items-center gap-1 mt-1 text-slate-400">
                            <Link size={10} className="shrink-0" />
                            <span className="text-[10px] uppercase tracking-widest truncate max-w-xs">{item.link}</span>
                          </div>
                        ) : (
                          <span className="text-[9px] text-slate-400 uppercase tracking-widest mt-1 block">No redirect link configured</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-6 shrink-0">
                      <button 
                        onClick={() => window.open(resolveProductImage(item.imageUrl), '_blank')}
                        className="p-3 hover:bg-slate-100 text-slate-500 rounded-xl transition-all cursor-pointer"
                        title="View Full Resolution"
                      >
                        <Eye size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(item._id!)}
                        className="p-3 hover:bg-red-50 text-red-500 rounded-xl transition-all cursor-pointer"
                        title="Remove Banner"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
