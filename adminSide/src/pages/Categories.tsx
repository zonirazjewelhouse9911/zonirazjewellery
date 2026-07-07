import React, { useState, useEffect, useRef } from 'react';
import { Loader2, Search, X, Edit2, Plus, Upload } from 'lucide-react';
import { cn } from '../lib/utils';

interface VariantVisibility {
  size: boolean;
  metal: boolean;
  purity: boolean;
  diamondQuality: boolean;
  diamondWeight: boolean;
}

interface MakingCharges {
  type: 'percentage' | 'fixed';
  value: number;
}

interface WeightRules {
  baseSize: number;
  sizeIncrementWeight: number;
}

interface CategoryConfig {
  variantVisibility: VariantVisibility;
  makingCharges: MakingCharges;
  weightRules: WeightRules;
}

interface Category {
  _id?: string;
  name: string;
  slug: string;
  image: string;
  description: string;
  config: CategoryConfig;
  createdAt?: string;
  updatedAt?: string;
}

const DEFAULT_CATEGORY: Category = {
  name: '',
  slug: '',
  image: '',
  description: '',
  config: {
    variantVisibility: {
      size: true,
      metal: true,
      purity: true,
      diamondQuality: true,
      diamondWeight: true
    },
    makingCharges: {
      type: 'percentage',
      value: 0
    },
    weightRules: {
      baseSize: 0,
      sizeIncrementWeight: 0
    }
  }
};

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [productCounts, setProductCounts] = useState<Record<string, number>>({});
  
  // Form State
  const [formData, setFormData] = useState<Category>(DEFAULT_CATEGORY);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchProductCounts = async () => {
    try {
      const res = await fetch('/api/admin/products');
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        const counts: Record<string, number> = {};
        data.data.forEach((p: any) => {
          const catId = p.category_id;
          if (catId) {
            counts[catId] = (counts[catId] || 0) + 1;
          }
        });
        setProductCounts(counts);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/categories');
      const data = await res.json();
      if (data.success) {
        setCategories(data.data || []);
      } else {
        console.error('Failed to fetch categories:', data.message);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchProductCounts();
  }, []);

  const handleOpenCreateModal = () => {
    setSelectedCategory(null);
    setFormData(DEFAULT_CATEGORY);
    setError('');
    setModalOpen(true);
  };

  const handleOpenEditModal = (cat: Category) => {
    setSelectedCategory(cat);
    setFormData({
      ...cat,
      config: {
        variantVisibility: {
          size: cat.config?.variantVisibility?.size ?? true,
          metal: cat.config?.variantVisibility?.metal ?? true,
          purity: cat.config?.variantVisibility?.purity ?? true,
          diamondQuality: cat.config?.variantVisibility?.diamondQuality ?? true,
          diamondWeight: cat.config?.variantVisibility?.diamondWeight ?? true,
        },
        makingCharges: {
          type: cat.config?.makingCharges?.type ?? 'percentage',
          value: cat.config?.makingCharges?.value ?? 0,
        },
        weightRules: {
          baseSize: cat.config?.weightRules?.baseSize ?? 0,
          sizeIncrementWeight: cat.config?.weightRules?.sizeIncrementWeight ?? 0,
        }
      }
    });
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
    data.append('category', 'categories');
    data.append('type', 'category');

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

    try {
      const isEdit = !!selectedCategory;
      const url = isEdit ? `/api/admin/categories/${selectedCategory?._id}` : '/api/admin/categories';
      const method = isEdit ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        setModalOpen(false);
        fetchCategories();
      } else {
        setError(data.message || 'Failed to preserve category rules.');
      }
    } catch (err) {
      setError('Network connection error.');
    } finally {
      setSaving(false);
    }
  };

  const filteredCategories = categories.filter(c => {
    const name = c.name.toLowerCase();
    const slug = c.slug.toLowerCase();
    const desc = (c.description || '').toLowerCase();
    const query = searchQuery.toLowerCase();
    return name.includes(query) || slug.includes(query) || desc.includes(query);
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500 font-sans text-left text-[#12100e]">
      
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span className="text-[10px] uppercase tracking-[0.45em] font-black text-[#a88265] block">Classification Hub</span>
          <h1 className="text-4.5xl font-serif font-bold text-[#12100e] mt-2">
            Categories <span className="text-slate-350 font-normal italic not-serif text-3xl ml-1">({categories.length})</span>
          </h1>
        </div>
        <button
          type="button"
          onClick={handleOpenCreateModal}
          className="px-8 py-4 bg-[#5d463c] hover:bg-[#4c3931] text-[#efe7e5] font-bold text-xs uppercase tracking-[0.2em] rounded-2xl transition-all duration-300 shadow-md flex items-center gap-2 cursor-pointer"
        >
          <Plus size={16} />
          <span>New Category</span>
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
            placeholder="Search by category name, slug, or description..."
            className="w-full bg-[#f0f3f6] border-none rounded-2xl py-3 pl-12 pr-6 text-sm text-slate-800 placeholder-slate-450 focus:ring-1 focus:ring-brand-gold/50"
          />
        </div>
      </div>

      {/* Categories Grid Directory */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center space-y-4">
          <Loader2 className="animate-spin text-[#5d463c]" size={32} />
          <span className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold">Structuring catalog...</span>
        </div>
      ) : filteredCategories.length === 0 ? (
        <div className="py-20 text-center text-slate-500 uppercase tracking-widest text-xs font-bold bg-white border border-slate-200/85 rounded-3xl">
          No categories found. Click new category to start.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCategories.map((cat) => {
            const pCount = productCounts[cat._id || ''] || productCounts[cat.slug] || 0;
            return (
              <div 
                key={cat._id} 
                className="bg-white border border-slate-100 rounded-[32px] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.06)] flex flex-col justify-between transition-all duration-500 group"
              >
                {/* Full Width Top Image */}
                <div className="h-60 w-full bg-[#efe7e5]/20 overflow-hidden relative">
                  {cat.image ? (
                    <img 
                      src={cat.image} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                      alt={cat.name} 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-[#efe7e5]/40">
                      <span className="text-3xl font-serif italic text-[#5d463c] font-black">{cat.name[0]}</span>
                    </div>
                  )}

                  {/* Absolute Centered Edit/Refine circular Button */}
                  <button
                    type="button"
                    onClick={() => handleOpenEditModal(cat)}
                    className="absolute inset-0 m-auto w-11 h-11 rounded-full bg-white shadow-md flex items-center justify-center text-slate-700 hover:text-[#5d463c] hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer"
                    title="Refine rules"
                  >
                    <Edit2 size={14} />
                  </button>
                </div>

                {/* Content Area */}
                <div className="p-8 flex flex-col justify-between flex-1 space-y-6">
                  {/* Title and Product count row */}
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif text-2xl font-bold text-[#12100e]">{cat.name}</h3>
                    <div className="flex items-center space-x-1.5 text-slate-400">
                      {/* Box Icon */}
                      <svg className="w-4 h-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l-7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                        <line x1="12" y1="22.08" x2="12" y2="12" />
                      </svg>
                      <span className="text-[11px] font-bold">{pCount}</span>
                    </div>
                  </div>

                  {/* Description - Uppercase */}
                  <p className="text-[10px] uppercase tracking-[0.18em] leading-relaxed text-slate-400 line-clamp-2 h-10">
                    {cat.description || `Explore our exquisite collection of ${cat.name.toLowerCase()}.`}
                  </p>

                  {/* Footer dynamic tracking */}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100/80 text-[9px] tracking-[0.2em] font-black text-slate-350">
                    <span>
                      /{cat.slug.toUpperCase()}
                    </span>
                    <span className="text-slate-450 group-hover:text-[#5d463c] transition-colors">
                      {/* Right Chevron arrow */}
                      <svg className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Create / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-6 backdrop-blur-xs animate-in fade-in duration-300">
          <form 
            onSubmit={handleSave}
            className="bg-[#efe7e5] text-[#12100e] w-full max-w-3xl rounded-4xl shadow-premium border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col"
          >
            {/* Modal Header */}
            <div className="p-6 bg-white border-b border-slate-200/60 flex items-center justify-between shrink-0">
              <div>
                <span className="text-[9px] uppercase tracking-[0.3em] font-black text-slate-400">Atelier Catalog Schema</span>
                <h3 className="text-xl font-serif font-bold italic mt-1 text-[#12100e]">
                  {selectedCategory ? 'Refine Category Rules' : 'Initialize Category'}
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
                  <label className="text-[9px] uppercase tracking-widest font-black text-[#5d463c] block">Category Name</label>
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
                  <label className="text-[9px] uppercase tracking-widest font-black text-[#5d463c] block">Category Image URL or File</label>
                  <div className="flex items-center space-x-4">
                    <input
                      type="text"
                      value={formData.image}
                      onChange={(e) => setFormData({...formData, image: e.target.value})}
                      placeholder="e.g. /images/site/category.png"
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
                  <label className="text-[9px] uppercase tracking-widest font-black text-[#5d463c] block">Description</label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-4 text-xs text-[#12100e]"
                  />
                </div>
              </div>

              {/* Variant Toggles (variantVisibility) */}
              <div className="space-y-4">
                <h4 className="text-[10px] uppercase tracking-[0.3em] font-black text-slate-500">Variant Visibility Toggles</h4>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 p-6 bg-white border border-slate-200 rounded-3xl">
                  {([
                    { id: 'size', label: 'Size' },
                    { id: 'metal', label: 'Metal' },
                    { id: 'purity', label: 'Purity' },
                    { id: 'diamondQuality', label: 'Diamond Quality' },
                    { id: 'diamondWeight', label: 'Diamond Weight' },
                  ] as const).map((variant) => {
                    const isChecked = formData.config?.variantVisibility?.[variant.id] ?? true;
                    return (
                      <button
                        type="button"
                        key={variant.id}
                        onClick={() => {
                          setFormData({
                            ...formData,
                            config: {
                              ...formData.config,
                              variantVisibility: {
                                ...formData.config.variantVisibility,
                                [variant.id]: !isChecked
                              }
                            }
                          });
                        }}
                        className={cn(
                          'flex items-center justify-center p-3.5 rounded-xl border text-center transition-all duration-300 cursor-pointer text-[10px] uppercase font-bold tracking-wider',
                          isChecked 
                            ? 'bg-[#5d463c]/15 border-[#5d463c] text-[#5d463c]'
                            : 'bg-slate-50 border-slate-200 text-[#12100e]/40'
                        )}
                      >
                        {variant.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Charges & Increments Rules Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Making Charges */}
                <div className="space-y-4">
                  <h4 className="text-[10px] uppercase tracking-[0.3em] font-black text-slate-500">Making Charges</h4>
                  <div className="bg-white border border-slate-200/60 rounded-3xl p-6 space-y-4">
                    <div className="space-y-2">
                      <label className="text-[9px] uppercase tracking-widest font-black text-[#5d463c] block">Fee Calculation Type</label>
                      <select
                        value={formData.config?.makingCharges?.type ?? 'percentage'}
                        onChange={(e) => setFormData({
                          ...formData,
                          config: {
                            ...formData.config,
                            makingCharges: {
                              ...formData.config.makingCharges,
                              type: e.target.value as 'percentage' | 'fixed'
                            }
                          }
                        })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-xs text-[#12100e]"
                      >
                        <option value="percentage">Percentage (%)</option>
                        <option value="fixed">Fixed Flat Rate (₹)</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] uppercase tracking-widest font-black text-[#5d463c] block">Charges Value</label>
                      <input
                        type="number"
                        value={formData.config?.makingCharges?.value || ''}
                        onChange={(e) => setFormData({
                          ...formData,
                          config: {
                            ...formData.config,
                            makingCharges: {
                              ...formData.config.makingCharges,
                              value: parseFloat(e.target.value) || 0
                            }
                          }
                        })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-xs text-[#12100e] font-bold"
                      />
                    </div>
                  </div>
                </div>

                {/* Weight increment Rules */}
                <div className="space-y-4">
                  <h4 className="text-[10px] uppercase tracking-[0.3em] font-black text-slate-500">Weight & Size Increments</h4>
                  <div className="bg-white border border-slate-200/60 rounded-3xl p-6 space-y-4">
                    <div className="space-y-2">
                      <label className="text-[9px] uppercase tracking-widest font-black text-[#5d463c] block">Base Size Pivot</label>
                      <input
                        type="number"
                        value={formData.config?.weightRules?.baseSize || ''}
                        onChange={(e) => setFormData({
                          ...formData,
                          config: {
                            ...formData.config,
                            weightRules: {
                              ...formData.config.weightRules,
                              baseSize: parseFloat(e.target.value) || 0
                            }
                          }
                        })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-xs text-[#12100e]"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] uppercase tracking-widest font-black text-[#5d463c] block">Size Increment Weight (g)</label>
                      <input
                        type="number"
                        step="0.001"
                        value={formData.config?.weightRules?.sizeIncrementWeight || ''}
                        onChange={(e) => setFormData({
                          ...formData,
                          config: {
                            ...formData.config,
                            weightRules: {
                              ...formData.config.weightRules,
                              sizeIncrementWeight: parseFloat(e.target.value) || 0
                            }
                          }
                        })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-xs text-[#12100e]"
                      />
                    </div>
                  </div>
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
                <span>{selectedCategory ? 'Preserve Rules' : 'Initialize Category'}</span>
              </button>
            </div>

          </form>
        </div>
      )}

    </div>
  );
}
