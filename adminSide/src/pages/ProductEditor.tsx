import { useState, useEffect } from 'react';
import AdminImageUploader from '../components/admin/AdminImageUploader';
import { 
  Save, 
  ArrowLeft,
  Image as ImageIcon, 
  Layers, 
  Coins, 
  Settings,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  ExternalLink,
  FileText
} from 'lucide-react';
import { cn } from '../lib/utils';

// Metadata Constants mapped to IDs
const METAL_TYPES = [
  { id: '1', name: 'White Gold' },
  { id: '2', name: 'Yellow Gold' },
  { id: '3', name: 'Rose Gold' },
  { id: '4', name: 'Platinum' },
  { id: '5', name: 'Silver' }
];

const KARATS = [
  { id: '1', name: '18K' },
  { id: '2', name: '22K' },
  { id: '3', name: '14K' },
  { id: '4', name: '9K' }
];

const DIAMOND_QUALITIES = [
  { id: '1', name: 'VVS-EF' },
  { id: '2', name: 'SI-GH' },
  { id: '3', name: 'VS-GH' },
  { id: '4', name: 'I-JK' }
];

const GENDERS = [
  { id: '1', name: 'Men' },
  { id: '2', name: 'Women' },
  { id: '3', name: 'Unisex' },
  { id: '4', name: 'Kids' }
];

const CATEGORIES = [
  { id: '1', name: 'Rings' },
  { id: '2', name: 'Earrings' },
  { id: '3', name: 'Necklaces' },
  { id: '4', name: 'Bracelets' },
  { id: '5', name: 'Bangles' },
  { id: '6', name: 'Pendants' },
  { id: '7', name: 'Chains' }
];

const SUBCATEGORIES = [
  { id: '1', name: 'Engagement Rings' },
  { id: '2', name: 'Solitaire Rings' },
  { id: '3', name: 'Casual Rings' },
  { id: '4', name: 'Cocktail Rings' },
  { id: '5', name: 'Band Rings' },
  { id: '6', name: 'Stud Earrings' },
  { id: '7', name: 'Hoop Earrings' },
  { id: '8', name: 'Drop Earrings' }
];

const SIZES = Array.from({ length: 30 }, (_, i) => (i + 1).toString());

interface ProductEditorProps {
  productId?: string;
  onBack?: () => void;
  onSaveSuccess?: (savedProduct: any) => void;
}

interface ProductFormData {
  _id?: string;
  product_id: string;
  category_id: string;
  subcategory_id: string;
  product_title: string;
  product_code: string;
  hsn_code: string;
  product_type: string;
  product_slug: string;
  description: string;
  price: number;
  discount: number;
  stock: number;
  gender: string;
  size_id: string;
  banglesize_id: string;
  karat_id: string;
  metal_type: string;
  gallery: Record<string, string[]>;
  height: number;
  diamond_quality: string;
  width: number;
  noof_gem: number;
  gold_weight: number;
  diamond_weight: number;
  solitaires_weight: number;
  solitaires_quality: string;
  product_weight: number;
  center_diamond_weight: number | null;
  center_diamond_price: number | null;
  custom_type: string;
  color_stone: string | null;
  gemstone_weight: number;
  status: string;
  feature: string;
  topselling: string;
  sessional: string;
  meta_title: string;
  meta_keyword: string;
  meta_description: string;
}

export default function ProductEditor({ productId, onBack, onSaveSuccess }: ProductEditorProps) {
  // Parse ID from prop or location query params
  const getProductId = () => {
    if (productId) return productId;
    const queryParams = new URLSearchParams(window.location.search);
    return queryParams.get('id') || 'new';
  };

  const currentId = getProductId();
  const isNew = currentId === 'new';

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form State matching productModel.js fields
  const [formData, setFormData] = useState<ProductFormData>({
    product_id: '',
    category_id: '',
    subcategory_id: '',
    product_title: '',
    product_code: '',
    hsn_code: '00',
    product_type: 'diamond',
    product_slug: '',
    description: '',
    price: 0,
    discount: 0,
    stock: 0,
    gender: '2',
    size_id: '',
    banglesize_id: '0',
    karat_id: '',
    metal_type: '',
    gallery: {},
    height: 0,
    diamond_quality: '',
    width: 0,
    noof_gem: 0,
    gold_weight: 0,
    diamond_weight: 0,
    solitaires_weight: 0,
    solitaires_quality: '0',
    product_weight: 0,
    center_diamond_weight: null,
    center_diamond_price: null,
    custom_type: '0',
    color_stone: null,
    gemstone_weight: 0,
    status: '1',
    feature: '0',
    topselling: '0',
    sessional: '0',
    meta_title: '',
    meta_keyword: '',
    meta_description: ''
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/admin/products/${currentId}`);
        const data = await res.json();
        if (data.success) {
          const product = data.data;
          
          let parsedGallery = {};
          if (product.gallery) {
            if (typeof product.gallery === 'string') {
              try {
                parsedGallery = JSON.parse(product.gallery);
              } catch (e) {
                console.error('Failed to parse gallery JSON string', e);
              }
            } else if (typeof product.gallery === 'object') {
              parsedGallery = product.gallery;
            }
          }

          setFormData({
            ...product,
            price: Number(product.price || 0),
            discount: Number(product.discount || 0),
            stock: Number(product.stock || 0),
            height: Number(product.height || 0),
            width: Number(product.width || 0),
            noof_gem: Number(product.noof_gem || 0),
            gold_weight: Number(product.gold_weight || 0),
            diamond_weight: Number(product.diamond_weight || 0),
            solitaires_weight: Number(product.solitaires_weight || 0),
            product_weight: Number(product.product_weight || 0),
            center_diamond_weight: product.center_diamond_weight !== null ? Number(product.center_diamond_weight) : null,
            center_diamond_price: product.center_diamond_price !== null ? Number(product.center_diamond_price) : null,
            gemstone_weight: Number(product.gemstone_weight || 0),
            gallery: parsedGallery
          });
        } else {
          setError('Failed to load product data.');
        }
      } catch {
        setError('An error occurred while fetching the product.');
      } finally {
        setLoading(false);
      }
    };

    if (!isNew) {
      fetchProduct();
    }
  }, [currentId, isNew]);

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSuccess('');

    // Generate product_id if not present
    const computedProductId = formData.product_id || `PROD-${Date.now()}`;

    // Validation
    if (!formData.product_title || !formData.product_slug || !formData.category_id || !formData.product_code) {
      setError('Title, Slug, Code, and Category are mandatory.');
      setSaving(false);
      return;
    }

    const payload = {
      ...formData,
      product_id: computedProductId
    };

    try {
      const url = isNew ? '/api/admin/products' : `/api/admin/products/${currentId}`;
      const method = isNew ? 'POST' : 'PATCH';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setSuccess('Masterpiece preserved in the vault.');
        if (onSaveSuccess) {
          onSaveSuccess(data.data);
        } else if (isNew) {
          window.location.search = `?id=${data.data._id}`;
        } else {
          let parsedGallery = {};
          if (data.data.gallery) {
            if (typeof data.data.gallery === 'string') {
              try {
                parsedGallery = JSON.parse(data.data.gallery);
              } catch (e) {}
            } else if (typeof data.data.gallery === 'object') {
              parsedGallery = data.data.gallery;
            }
          }
          setFormData({
            ...data.data,
            price: Number(data.data.price || 0),
            discount: Number(data.data.discount || 0),
            stock: Number(data.data.stock || 0),
            height: Number(data.data.height || 0),
            width: Number(data.data.width || 0),
            noof_gem: Number(data.data.noof_gem || 0),
            gold_weight: Number(data.data.gold_weight || 0),
            diamond_weight: Number(data.data.diamond_weight || 0),
            solitaires_weight: Number(data.data.solitaires_weight || 0),
            product_weight: Number(data.data.product_weight || 0),
            center_diamond_weight: data.data.center_diamond_weight !== null ? Number(data.data.center_diamond_weight) : null,
            center_diamond_price: data.data.center_diamond_price !== null ? Number(data.data.center_diamond_price) : null,
            gemstone_weight: Number(data.data.gemstone_weight || 0),
            gallery: parsedGallery
          });
        }
      } else {
        setError(data.message || 'The vault rejected the update.');
      }
    } catch {
      setError('A secure connection could not be established.');
    } finally {
      setSaving(false);
    }
  };

  const handleTitleChange = (val: string) => {
    const slug = val
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
    setFormData({
      ...formData,
      product_title: val,
      product_slug: isNew ? slug : formData.product_slug
    });
  };

  // Helper arrays for multi-select checkboxes
  const activeMetals = formData.metal_type ? formData.metal_type.split(',').map(s => s.trim()).filter(Boolean) : [];
  const activeKarats = formData.karat_id ? formData.karat_id.split(',').map(s => s.trim()).filter(Boolean) : [];
  const activeSizes = formData.size_id ? formData.size_id.split(',').map(s => s.trim()).filter(Boolean) : [];
  const activeDiamondQualities = formData.diamond_quality ? formData.diamond_quality.split(',').map(s => s.trim()).filter(Boolean) : [];

  const handleMetalToggle = (metalId: string) => {
    const newMetals = activeMetals.includes(metalId)
      ? activeMetals.filter(id => id !== metalId)
      : [...activeMetals, metalId];
    setFormData({ ...formData, metal_type: newMetals.join(',') });
  };

  const handleKaratToggle = (karatId: string) => {
    const newKarats = activeKarats.includes(karatId)
      ? activeKarats.filter(id => id !== karatId)
      : [...activeKarats, karatId];
    setFormData({ ...formData, karat_id: newKarats.join(',') });
  };

  const handleSizeToggle = (sizeId: string) => {
    const newSizes = activeSizes.includes(sizeId)
      ? activeSizes.filter(id => id !== sizeId)
      : [...activeSizes, sizeId];
    setFormData({ ...formData, size_id: newSizes.join(',') });
  };

  const handleDiamondQualityToggle = (qualityId: string) => {
    const newQualities = activeDiamondQualities.includes(qualityId)
      ? activeDiamondQualities.filter(id => id !== qualityId)
      : [...activeDiamondQualities, qualityId];
    setFormData({ ...formData, diamond_quality: newQualities.join(',') });
  };

  const handleBackClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onBack) {
      onBack();
    } else {
      window.history.back();
    }
  };

  if (loading) {
    return (
      <div className="py-40 flex flex-col items-center justify-center space-y-4 bg-transparent">
        <Loader2 className="text-brand-gold animate-spin" size={40} />
        <p className="text-[11px] uppercase tracking-[0.4em] font-bold text-slate-400">Preparing Atelier...</p>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-24 font-sans text-left text-[#12100e]">
      {/* Top Navigation */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <a 
            href="#"
            onClick={handleBackClick}
            className="flex items-center space-x-2 text-[10px] uppercase tracking-widest text-[#12100e]/70 hover:text-brand-gold transition-colors font-bold mb-4 animate-fade-in"
          >
            <ArrowLeft size={14} />
            <span>Return to Vault</span>
          </a>
          <h1 className="text-4xl font-serif font-bold text-[#12100e] italic">
            {isNew ? 'Create New' : 'Refine'} <span className="not-italic text-[#12100e]/30">Masterpiece</span>
          </h1>
        </div>
        <div className="flex items-center space-x-4">
          {!isNew && (
            <a 
              href={`/product/${formData.product_slug}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center space-x-2 px-6 py-4 bg-white/60 text-[#12100e]/60 rounded-2xl border border-slate-200 hover:border-brand-gold/40 transition-all text-[12px] font-bold uppercase tracking-widest shadow-sm"
            >
              <ExternalLink size={16} />
              <span>Preview</span>
            </a>
          )}
          <button 
            onClick={handleSave}
            disabled={saving}
            className="flex items-center space-x-3 px-10 py-4 bg-[#5d463c] hover:bg-[#4c3931] text-[#efe7e5] rounded-2xl font-bold text-[12px] uppercase tracking-[0.3em] transition-all duration-500 shadow-md disabled:opacity-50"
          >
            {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
            <span>{isNew ? 'Initialize' : 'Preserve'}</span>
          </button>
        </div>
      </div>

      {/* Error/Success Messages */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-4xl flex items-center space-x-4 text-red-600 animate-in fade-in slide-in-from-top-4">
          <AlertCircle size={20} />
          <p className="text-[12px] font-bold uppercase tracking-widest">{error}</p>
        </div>
      )}
      {success && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 p-6 rounded-4xl flex items-center space-x-4 text-emerald-600 animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 size={20} />
          <p className="text-[12px] font-bold uppercase tracking-widest">{success}</p>
        </div>
      )}

      {/* Editor Tabs */}
      <div className="flex items-center space-x-2 p-2 bg-white/60 rounded-3xl border border-slate-200/80 max-w-fit overflow-x-auto shadow-sm backdrop-blur-sm">
        {[
          { id: 'basic', label: 'Identity', icon: Settings },
          { id: 'pricing', label: 'Value & Inventory', icon: Coins },
          { id: 'media', label: 'Media Gallery', icon: ImageIcon },
          { id: 'specs', label: 'Jewellery Details', icon: FileText },
          { id: 'attributes', label: 'Configuration & Options', icon: Layers },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'flex items-center space-x-3 px-6 py-3 rounded-2xl transition-all duration-500 text-[11px] font-bold uppercase tracking-widest whitespace-nowrap',
              activeTab === tab.id 
                ? 'bg-[#5d463c] text-[#efe7e5] shadow-sm' 
                : 'text-[#12100e]/70 hover:text-[#12100e] hover:bg-white/30'
            )}
          >
            <tab.icon size={16} />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Main Form Sections */}
      <div className="grid grid-cols-1 gap-12 text-left">
        {activeTab === 'basic' && (
          <div className="bg-white border border-slate-200/80 rounded-[40px] p-10 space-y-10 shadow-sm transition-all">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-4">
                <label className="text-[10px] uppercase tracking-[0.3em] font-black text-brand-gold block">Masterpiece Title</label>
                <input 
                  type="text" 
                  value={formData.product_title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 text-[14px] text-[#12100e] focus:ring-1 focus:ring-brand-gold/50 transition-all shadow-inner"
                />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] uppercase tracking-[0.3em] font-black text-brand-gold block">Secure Slug</label>
                <input 
                  type="text" 
                  value={formData.product_slug}
                  onChange={(e) => setFormData({...formData, product_slug: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 text-[14px] text-[#12100e] focus:ring-1 focus:ring-brand-gold/50 transition-all shadow-inner"
                />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] uppercase tracking-[0.3em] font-black text-brand-gold block">Product Code</label>
                <input 
                  type="text" 
                  value={formData.product_code}
                  onChange={(e) => setFormData({...formData, product_code: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 text-[14px] text-[#12100e] focus:ring-1 focus:ring-brand-gold/50 transition-all shadow-inner"
                />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] uppercase tracking-[0.3em] font-black text-brand-gold block">HSN Code</label>
                <input 
                  type="text" 
                  value={formData.hsn_code}
                  onChange={(e) => setFormData({...formData, hsn_code: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 text-[14px] text-[#12100e] focus:ring-1 focus:ring-brand-gold/50 transition-all shadow-inner"
                />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] uppercase tracking-[0.3em] font-black text-brand-gold block">Product Type</label>
                <select 
                  value={formData.product_type}
                  onChange={(e) => setFormData({...formData, product_type: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 text-[14px] text-[#12100e] focus:ring-1 focus:ring-brand-gold/50 transition-all shadow-inner"
                >
                  <option value="diamond">Diamond Jewelry</option>
                  <option value="gold">Plain Gold Jewelry</option>
                  <option value="solitaire">Solitaire Jewelry</option>
                  <option value="gemstone">Gemstone Jewelry</option>
                </select>
              </div>
              <div className="space-y-4">
                <label className="text-[10px] uppercase tracking-[0.3em] font-black text-brand-gold block">Gender Selection</label>
                <select 
                  value={formData.gender}
                  onChange={(e) => setFormData({...formData, gender: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 text-[14px] text-[#12100e] focus:ring-1 focus:ring-brand-gold/50 transition-all shadow-inner"
                >
                  {GENDERS.map(g => (
                    <option key={g.id} value={g.id}>{g.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-4">
                <label className="text-[10px] uppercase tracking-[0.3em] font-black text-brand-gold block">Custom Type</label>
                <input 
                  type="text" 
                  value={formData.custom_type}
                  onChange={(e) => setFormData({...formData, custom_type: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 text-[14px] text-[#12100e] focus:ring-1 focus:ring-brand-gold/50 transition-all shadow-inner"
                />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] uppercase tracking-[0.3em] font-black text-brand-gold block">Visibility</label>
                <div className="flex items-center space-x-6 h-15">
                  <button 
                    type="button"
                    onClick={() => setFormData({...formData, status: '1'})}
                    className={cn(
                      'flex-1 flex items-center justify-center space-x-3 px-6 py-3 rounded-xl border transition-all duration-500',
                      formData.status === '1' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 font-bold' : 'bg-white border-slate-200 text-[#12100e]/30'
                    )}
                  >
                    <Eye size={16} />
                    <span className="text-[11px] font-bold uppercase tracking-widest">Live</span>
                  </button>
                  <button 
                    type="button"
                    onClick={() => setFormData({...formData, status: '0'})}
                    className={cn(
                      'flex-1 flex items-center justify-center space-x-3 px-6 py-3 rounded-xl border transition-all duration-500',
                      formData.status === '0' ? 'bg-red-500/10 border-red-500/30 text-red-600 font-bold' : 'bg-white border-slate-200 text-[#12100e]/30'
                    )}
                  >
                    <EyeOff size={16} />
                    <span className="text-[11px] font-bold uppercase tracking-widest">Archive</span>
                  </button>
                </div>
              </div>

              {/* Marketing Toggles */}
              <div className="space-y-4 col-span-1 md:col-span-2 grid grid-cols-3 gap-6 pt-4 border-t border-slate-200/80">
                <div className="space-y-2">
                  <label className="text-[9px] uppercase tracking-[0.3em] font-black text-brand-gold block">Featured product</label>
                  <select 
                    value={formData.feature}
                    onChange={(e) => setFormData({...formData, feature: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-[12px] text-[#12100e]"
                  >
                    <option value="0">Standard</option>
                    <option value="1">Featured</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] uppercase tracking-[0.3em] font-black text-brand-gold block">Top Selling</label>
                  <select 
                    value={formData.topselling}
                    onChange={(e) => setFormData({...formData, topselling: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-[12px] text-[#12100e]"
                  >
                    <option value="0">Standard</option>
                    <option value="1">Top Selling</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] uppercase tracking-[0.3em] font-black text-brand-gold block">Sessional Collection</label>
                  <select 
                    value={formData.sessional}
                    onChange={(e) => setFormData({...formData, sessional: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-[12px] text-[#12100e]"
                  >
                    <option value="0">Standard</option>
                    <option value="1">Sessional</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] uppercase tracking-[0.3em] font-black text-brand-gold block">The Story (Description)</label>
              <textarea 
                rows={6}
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 rounded-4xl py-6 px-8 text-[14px] leading-relaxed text-[#12100e] focus:ring-1 focus:ring-brand-gold/50 transition-all shadow-inner"
              />
            </div>
          </div>
        )}

        {activeTab === 'pricing' && (
          <div className="bg-white border border-slate-200/80 rounded-[40px] p-10 space-y-10 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
              <div className="space-y-4">
                <label className="text-[10px] uppercase tracking-[0.3em] font-black text-brand-gold block">Price (₹)</label>
                <input 
                  type="number" 
                  value={formData.price || ''}
                  onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value) || 0})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 text-[14px] font-bold text-brand-gold transition-all shadow-inner"
                />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] uppercase tracking-[0.3em] font-black text-brand-gold block">Discount (%)</label>
                <input 
                  type="number" 
                  value={formData.discount || ''}
                  onChange={(e) => setFormData({...formData, discount: parseFloat(e.target.value) || 0})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 text-[14px] font-bold text-[#12100e] transition-all shadow-inner"
                />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] uppercase tracking-[0.3em] font-black text-brand-gold block">Stock Count</label>
                <input 
                  type="number" 
                  value={formData.stock || ''}
                  onChange={(e) => setFormData({...formData, stock: parseInt(e.target.value) || 0})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 text-[14px] font-bold text-[#12100e] transition-all shadow-inner"
                />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] uppercase tracking-[0.3em] font-black text-brand-gold block">Base Product Weight (g)</label>
                <input 
                  type="number" 
                  step="0.01"
                  value={formData.product_weight || ''}
                  onChange={(e) => setFormData({...formData, product_weight: parseFloat(e.target.value) || 0})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 text-[14px] font-bold text-[#12100e] transition-all shadow-inner"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'media' && (
          <div className="bg-white border border-slate-200/80 rounded-[40px] p-10 space-y-10 shadow-sm">
            {activeMetals.length === 0 ? (
              <div className="text-center py-10 border border-dashed border-slate-200 rounded-3xl">
                <p className="text-[12px] uppercase tracking-widest text-[#12100e]/50">
                  Please select active Metal Types in the &ldquo;Configuration & Options&rdquo; tab first.
                </p>
              </div>
            ) : (
              <div className="space-y-12">
                <p className="text-[11px] text-[#12100e]/70 leading-relaxed uppercase tracking-widest">
                  Map high-resolution image galleries to their corresponding metal variants.
                </p>
                {activeMetals.map((metalId) => {
                  const metalObj = METAL_TYPES.find(m => m.id === metalId);
                  const metalName = metalObj ? metalObj.name : `Metal ID: ${metalId}`;
                  const metalImages = formData.gallery[metalId] || [];

                  return (
                    <div key={metalId} className="bg-slate-50 border border-slate-200 rounded-[28px] p-8 space-y-6">
                      <h3 className="text-md font-serif font-bold text-brand-gold uppercase tracking-wider">{metalName} Assets</h3>
                      <AdminImageUploader
                        images={metalImages}
                        onChange={(newImages) => {
                          setFormData({
                            ...formData,
                            gallery: {
                              ...formData.gallery,
                              [metalId]: newImages
                            }
                          });
                        }}
                        category={formData.category_id || 'products'}
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === 'specs' && (
          <div className="bg-white border border-slate-200/80 rounded-[40px] p-10 space-y-12 shadow-sm">
            <div className="space-y-6">
              <label className="text-[10px] uppercase tracking-[0.3em] font-black text-brand-gold block">Jewellery Weights & Specifications</label>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-3">
                  <label className="text-[9px] uppercase tracking-[0.3em] font-black text-brand-gold ml-2 block">Total Product Weight (g)</label>
                  <input 
                    type="number" 
                    step="0.01"
                    value={formData.product_weight || ''}
                    onChange={(e) => setFormData({...formData, product_weight: parseFloat(e.target.value) || 0})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-6 text-[13px] text-[#12100e]"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[9px] uppercase tracking-[0.3em] font-black text-brand-gold ml-2 block">Gold Weight (g)</label>
                  <input 
                    type="number" 
                    step="0.01"
                    value={formData.gold_weight || ''}
                    onChange={(e) => setFormData({...formData, gold_weight: parseFloat(e.target.value) || 0})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-6 text-[13px] text-[#12100e]"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[9px] uppercase tracking-[0.3em] font-black text-brand-gold ml-2 block">Diamond Weight (ct)</label>
                  <input 
                    type="number" 
                    step="0.01"
                    value={formData.diamond_weight || ''}
                    onChange={(e) => setFormData({...formData, diamond_weight: parseFloat(e.target.value) || 0})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-6 text-[13px] text-[#12100e]"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[9px] uppercase tracking-[0.3em] font-black text-brand-gold ml-2 block">Solitaire Weight (ct)</label>
                  <input 
                    type="number" 
                    step="0.01"
                    value={formData.solitaires_weight || ''}
                    onChange={(e) => setFormData({...formData, solitaires_weight: parseFloat(e.target.value) || 0})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-6 text-[13px] text-[#12100e]"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[9px] uppercase tracking-[0.3em] font-black text-brand-gold ml-2 block">Solitaire Quality</label>
                  <input 
                    type="text" 
                    value={formData.solitaires_quality}
                    onChange={(e) => setFormData({...formData, solitaires_quality: e.target.value})}
                    placeholder="e.g. VVS1-F"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-6 text-[13px] text-[#12100e]"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[9px] uppercase tracking-[0.3em] font-black text-brand-gold ml-2 block">Center Diamond Weight (ct)</label>
                  <input 
                    type="number" 
                    step="0.01"
                    value={formData.center_diamond_weight ?? ''}
                    onChange={(e) => setFormData({...formData, center_diamond_weight: e.target.value ? parseFloat(e.target.value) : null})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-6 text-[13px] text-[#12100e]"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[9px] uppercase tracking-[0.3em] font-black text-brand-gold ml-2 block">Center Diamond Price (₹)</label>
                  <input 
                    type="number" 
                    value={formData.center_diamond_price ?? ''}
                    onChange={(e) => setFormData({...formData, center_diamond_price: e.target.value ? parseFloat(e.target.value) : null})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-6 text-[13px] text-[#12100e]"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[9px] uppercase tracking-[0.3em] font-black text-brand-gold ml-2 block">Color Stone Info</label>
                  <input 
                    type="text" 
                    value={formData.color_stone ?? ''}
                    onChange={(e) => setFormData({...formData, color_stone: e.target.value || null})}
                    placeholder="e.g. Ruby, Emerald"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-6 text-[13px] text-[#12100e]"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[9px] uppercase tracking-[0.3em] font-black text-brand-gold ml-2 block">Gemstone Weight (ct)</label>
                  <input 
                    type="number" 
                    step="0.01"
                    value={formData.gemstone_weight || ''}
                    onChange={(e) => setFormData({...formData, gemstone_weight: parseFloat(e.target.value) || 0})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-6 text-[13px] text-[#12100e]"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[9px] uppercase tracking-[0.3em] font-black text-brand-gold ml-2 block">Number of Gems</label>
                  <input 
                    type="number" 
                    value={formData.noof_gem || ''}
                    onChange={(e) => setFormData({...formData, noof_gem: parseInt(e.target.value) || 0})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-6 text-[13px] text-[#12100e]"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[9px] uppercase tracking-[0.3em] font-black text-brand-gold ml-2 block">Height (mm)</label>
                  <input 
                    type="number" 
                    step="0.01"
                    value={formData.height || ''}
                    onChange={(e) => setFormData({...formData, height: parseFloat(e.target.value) || 0})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-6 text-[13px] text-[#12100e]"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[9px] uppercase tracking-[0.3em] font-black text-brand-gold ml-2 block">Width (mm)</label>
                  <input 
                    type="number" 
                    step="0.01"
                    value={formData.width || ''}
                    onChange={(e) => setFormData({...formData, width: parseFloat(e.target.value) || 0})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-6 text-[13px] text-[#12100e]"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'attributes' && (
          <div className="bg-white border border-slate-200/80 rounded-[40px] p-10 space-y-12 shadow-sm">
            
            {/* Category Configuration */}
            <div className="space-y-6">
              <h3 className="text-lg font-serif font-bold text-[#12100e]">Collection Category</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[9px] uppercase tracking-[0.3em] font-black text-brand-gold ml-2 block">Category</label>
                  <select 
                    value={formData.category_id}
                    onChange={(e) => setFormData({...formData, category_id: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 text-[14px] text-[#12100e]"
                  >
                    <option value="">Select Category</option>
                    {CATEGORIES.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-3">
                  <label className="text-[9px] uppercase tracking-[0.3em] font-black text-brand-gold ml-2 block">Subcategory</label>
                  <select 
                    value={formData.subcategory_id}
                    onChange={(e) => setFormData({...formData, subcategory_id: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 text-[14px] text-[#12100e]"
                  >
                    <option value="">Select Subcategory</option>
                    {SUBCATEGORIES.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Configurable Metal Selection */}
            <div className="space-y-6 pt-10 border-t border-slate-200/80">
              <h3 className="text-lg font-serif font-bold text-[#12100e]">Active Metals</h3>
              <p className="text-[11px] text-[#12100e]/70 leading-relaxed uppercase tracking-widest">
                Selecting metal options generates corresponding image uploader sections in the Media tab.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {METAL_TYPES.map(metal => {
                  const isChecked = activeMetals.includes(metal.id);
                  return (
                    <button
                      key={metal.id}
                      onClick={() => handleMetalToggle(metal.id)}
                      className={cn(
                        'flex items-center justify-center p-4 rounded-2xl border text-center transition-all duration-300 cursor-pointer',
                        isChecked 
                          ? 'bg-[#5d463c]/15 border-[#5d463c] text-[#5d463c] font-bold'
                          : 'bg-slate-50 border border-slate-200 text-[#12100e]/60'
                      )}
                    >
                      <span className="text-[12px] uppercase tracking-wider">{metal.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Purity Configuration */}
            <div className="space-y-6 pt-10 border-t border-slate-200/80">
              <h3 className="text-lg font-serif font-bold text-[#12100e]">Available Gold Purities</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {KARATS.map(karat => {
                  const isChecked = activeKarats.includes(karat.id);
                  return (
                    <button
                      key={karat.id}
                      onClick={() => handleKaratToggle(karat.id)}
                      className={cn(
                        'flex items-center justify-center p-4 rounded-2xl border text-center transition-all duration-300 cursor-pointer',
                        isChecked 
                          ? 'bg-[#5d463c]/15 border-[#5d463c] text-[#5d463c] font-bold'
                          : 'bg-slate-50 border border-slate-200 text-[#12100e]/60'
                      )}
                    >
                      <span className="text-[12px] uppercase tracking-wider">{karat.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Diamond Quality Configuration */}
            <div className="space-y-6 pt-10 border-t border-slate-200/80">
              <h3 className="text-lg font-serif font-bold text-[#12100e]">Diamond Qualities</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {DIAMOND_QUALITIES.map(dq => {
                  const isChecked = activeDiamondQualities.includes(dq.id);
                  return (
                    <button
                      key={dq.id}
                      onClick={() => handleDiamondQualityToggle(dq.id)}
                      className={cn(
                        'flex items-center justify-center p-4 rounded-2xl border text-center transition-all duration-300 cursor-pointer',
                        isChecked 
                          ? 'bg-[#5d463c]/15 border-[#5d463c] text-[#5d463c] font-bold'
                          : 'bg-slate-50 border border-slate-200 text-[#12100e]/60'
                      )}
                    >
                      <span className="text-[12px] uppercase tracking-wider">{dq.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Size Configurations */}
            <div className="space-y-6 pt-10 border-t border-slate-200/80">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-serif font-bold text-[#12100e]">Sizes Whitelist</h3>
                <span className="text-[9px] uppercase tracking-widest text-[#5d463c] font-bold">
                  {activeSizes.length} Selected
                </span>
              </div>
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-10 gap-3">
                {SIZES.map(sz => {
                  const isChecked = activeSizes.includes(sz);
                  return (
                    <button
                      key={sz}
                      onClick={() => handleSizeToggle(sz)}
                      className={cn(
                        'flex items-center justify-center py-3 rounded-xl border text-center transition-all duration-205 text-[11px] font-bold cursor-pointer',
                        isChecked 
                          ? 'bg-[#5d463c] text-[#efe7e5] border-[#5d463c]'
                          : 'bg-slate-50 border border-slate-200 text-[#12100e]/50 hover:border-[#5d463c]/30'
                      )}
                    >
                      {sz}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bangle Size configuration */}
            <div className="space-y-3 pt-10 border-t border-slate-200/80">
              <label className="text-[9px] uppercase tracking-[0.3em] font-black text-brand-gold ml-2 block">Bangle Size ID</label>
              <input 
                type="text" 
                value={formData.banglesize_id}
                onChange={(e) => setFormData({...formData, banglesize_id: e.target.value})}
                placeholder="e.g. 2.4, 2.6 or 0"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-6 text-[13px] text-[#12100e] focus:ring-1 focus:ring-brand-gold/50 transition-all shadow-inner"
              />
            </div>
          </div>
        )}


      </div>
    </div>
  );
}
