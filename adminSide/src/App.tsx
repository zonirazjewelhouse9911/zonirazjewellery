import { useState, useEffect } from 'react';
import ProductEditor from './pages/ProductEditor';
import Orders from './pages/Orders';
import Categories from './pages/Categories';
import Customers from './pages/Customers';
import Collections from './pages/Collections';
import Coupons from './pages/Coupons';
import ExchangeInquiries from './pages/ExchangeInquiries';
import SellGoldInquiries from './pages/SellGoldInquiries';
import Banners from './pages/Banners';
import { resolveProductImage } from './lib/imageResolver';
import { 
  Grid, 
  ShoppingBag, 
  Package, 
  Tag, 
  Users, 
  Layers, 
  Ticket, 
  Gift, 
  Compass, 
  Building2, 
  LogOut,
  SlidersHorizontal,
  ChevronDown,
  Search,
  Loader2,
  RefreshCw,
  Coins,
  Image as ImageIcon
} from 'lucide-react';
import './App.css';

// Menu definitions matching the screenshot
const MENU_ITEMS = [
  { id: 'overview', label: 'Overview', icon: Grid },
  { id: 'products', label: 'Products', icon: Package },
  { id: 'orders', label: 'Orders', icon: ShoppingBag },
  { id: 'categories', label: 'Categories', icon: Tag },
  { id: 'customers', label: 'Customers', icon: Users },
  { id: 'collections', label: 'Collections', icon: Layers },
  { id: 'coupons', label: 'Coupons', icon: Ticket },
  { id: 'banners', label: 'Hero Banners', icon: ImageIcon },
  { id: 'giftcards', label: 'Gift Cards', icon: Gift },
  { id: 'luckywheel', label: 'Lucky Wheel', icon: Compass },
  { id: 'franchiseleads', label: 'Franchise Leads', icon: Building2 },
  { id: 'exchange', label: 'Exchange Leads', icon: RefreshCw },
  { id: 'sellgold', label: 'Sell Gold Leads', icon: Coins },
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

function App() {
  const [activeMenu, setActiveMenu] = useState('products');
  const [selectedProductId, setSelectedProductId] = useState<string | undefined>(undefined);
  const [isEditing, setIsEditing] = useState(false);

  // Dynamic Product State
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/products');
      const data = await res.json();
      if (data.success) {
        setProducts(data.data || []);
      } else {
        console.error('Failed to retrieve products:', data.message);
      }
    } catch (error) {
      console.error('Failed to establish API connection:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeMenu === 'products' && !isEditing) {
      fetchProducts();
    }
  }, [activeMenu, isEditing]);

  const handleEditProduct = (id: string) => {
    setSelectedProductId(id);
    setIsEditing(true);
  };

  const handleCreateProduct = () => {
    setSelectedProductId('new');
    setIsEditing(true);
  };

  const handleBackToList = () => {
    setIsEditing(false);
    setSelectedProductId(undefined);
  };

  const getCategoryName = (catId: string) => {
    const found = CATEGORIES.find(c => c.id === catId);
    return found ? found.name : 'Jewelry';
  };

  const getProductImage = (item: any): string => {
    let galleryObj: any = {};
    if (typeof item.gallery === 'string') {
      try {
        galleryObj = JSON.parse(item.gallery);
      } catch (e) {}
    } else if (item.gallery && typeof item.gallery === 'object') {
      galleryObj = item.gallery;
    }

    const keys = Object.keys(galleryObj);
    if (keys.length > 0) {
      const firstKeyImages = galleryObj[keys[0]];
      if (Array.isArray(firstKeyImages) && firstKeyImages.length > 0) {
        return firstKeyImages[0];
      }
    }
    return '';
  };

  // Filter products based on search query
  const filteredProducts = products.filter(p => {
    const title = (p.product_title || '').toLowerCase();
    const code = (p.product_code || '').toLowerCase();
    const slug = (p.product_slug || '').toLowerCase();
    const query = searchQuery.toLowerCase();
    return title.includes(query) || code.includes(query) || slug.includes(query);
  });

  return (
    <div className="flex min-h-screen bg-[#efe7e5] text-[#12100e] font-sans antialiased overflow-hidden">
      
      {/* Premium Sidebar */}
      <aside className="w-72 bg-[#5d463c] text-[#efe7e5] flex flex-col justify-between shrink-0 border-r border-black/10 select-none">
        
        {/* Brand Header */}
        <div className="p-8">
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#efe7e5] flex items-center justify-center shadow-sm">
              <span className="font-serif italic text-[#5d463c] font-black text-xl">Z</span>
            </div>
            <div className="flex flex-col">
              <span className="font-serif font-bold text-lg tracking-widest text-[#efe7e5]">ZONIRAZ</span>
              <span className="text-[9px] uppercase tracking-[0.25em] text-[#efe7e5]/60 font-black">Admin Portal</span>
            </div>
          </div>
        </div>

        {/* Sidebar Menu Items */}
        <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto">
          {MENU_ITEMS.map((item) => {
            const isActive = activeMenu === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveMenu(item.id);
                  if (item.id !== 'products') {
                    setIsEditing(false);
                  }
                }}
                className={`w-full flex items-center space-x-4 px-5 py-3.5 rounded-xl text-left text-xs uppercase tracking-widest font-black transition-all relative group cursor-pointer ${
                  isActive 
                    ? 'bg-black/20 text-[#efe7e5]' 
                    : 'text-[#efe7e5]/60 hover:text-[#efe7e5] hover:bg-white/5'
                }`}
              >
                <item.icon size={16} className={`shrink-0 ${isActive ? 'text-[#efe7e5]' : 'text-[#efe7e5]/50 group-hover:text-[#efe7e5]'}`} />
                <span>{item.label}</span>
                {isActive && (
                  <span className="w-1 h-5 bg-[#C5A880] rounded-full absolute right-5"></span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Sign Out */}
        <div className="p-6 border-t border-white/5">
          <button 
            onClick={() => alert('Signing out of Atelier...')}
            className="w-full flex items-center space-x-4 px-5 py-3.5 rounded-xl text-left text-xs uppercase tracking-widest font-black text-[#efe7e5]/60 hover:text-red-300 hover:bg-red-500/10 transition-all cursor-pointer"
          >
            <LogOut size={16} className="shrink-0" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-y-auto">
        
        {/* Main Content Wrapper */}
        <main className="flex-1 px-10 py-12 max-w-7xl w-full mx-auto">
          {isEditing && activeMenu === 'products' ? (
            <ProductEditor 
              productId={selectedProductId} 
              onBack={handleBackToList}
              onSaveSuccess={(product) => {
                alert(`Masterpiece successfully preserved with ID: ${product._id || product.product_id}`);
                handleBackToList();
              }}
            />
          ) : activeMenu === 'products' ? (
            <div className="space-y-8 animate-in fade-in duration-500">
              
              {/* Header Title Row */}
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                  <span className="text-[10px] uppercase tracking-[0.4em] font-black text-slate-500">Catalog Management</span>
                  <h1 className="text-4.5xl font-serif font-bold text-[#12100e] mt-2">
                    Products <span className="text-slate-400 font-normal italic not-serif text-2xl ml-1">({products.length})</span>
                  </h1>
                </div>
                <button 
                  onClick={handleCreateProduct}
                  className="px-8 py-4 bg-[#5d463c] hover:bg-[#4c3931] text-[#efe7e5] font-bold text-xs uppercase tracking-[0.2em] rounded-xl transition-all duration-300 shadow-md flex items-center gap-2 cursor-pointer"
                >
                  <span className="text-sm font-light">+</span> New Masterpiece
                </button>
              </div>

              {/* Search Bar + Filters + Sort Row */}
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between p-4 bg-white rounded-3xl border border-slate-200/60 shadow-sm">
                <div className="relative flex-1 w-full">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by name, slug, or category..."
                    className="w-full bg-[#f0f3f6] border-none rounded-2xl py-3 pl-12 pr-6 text-sm text-slate-800 placeholder-slate-450 focus:ring-1 focus:ring-brand-gold/50"
                  />
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto shrink-0">
                  <button className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-5 py-3 bg-[#f5ebe2] hover:bg-[#ebdccf] text-slate-700 font-bold text-[11px] uppercase tracking-widest rounded-xl transition-all border border-slate-200/50 cursor-pointer">
                    <SlidersHorizontal size={14} className="text-slate-500" />
                    <span>Filters</span>
                  </button>
                  <button className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-5 py-3 bg-[#f5ebe2] hover:bg-[#ebdccf] text-slate-700 font-bold text-[11px] uppercase tracking-widest rounded-xl transition-all border border-slate-200/50 cursor-pointer">
                    <span>Sort</span>
                    <ChevronDown size={14} className="text-slate-500" />
                  </button>
                </div>
              </div>

              {/* Products Table/List */}
              <div className="bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-sm">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                  <span className="text-[10px] uppercase tracking-widest font-black text-slate-400">Masterpiece Directory</span>
                  <span className="text-[9px] text-slate-500 uppercase tracking-widest">
                    Showing {filteredProducts.length} items
                  </span>
                </div>
                
                {loading ? (
                  <div className="py-20 flex flex-col items-center justify-center space-y-4">
                    <Loader2 className="animate-spin text-[#5d463c]" size={32} />
                    <span className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold">Querying vault...</span>
                  </div>
                ) : filteredProducts.length === 0 ? (
                  <div className="py-20 text-center space-y-4">
                    <span className="text-xs uppercase tracking-widest text-slate-450 font-bold block">No masterpieces in the vault</span>
                    <button 
                      onClick={handleCreateProduct}
                      className="px-6 py-2.5 bg-[#5d463c] text-[#efe7e5] rounded-xl text-[10px] uppercase tracking-widest font-bold hover:bg-[#4c3931] cursor-pointer"
                    >
                      Create First Masterpiece
                    </button>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {filteredProducts.map((item) => (
                      <div key={item._id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-slate-50/30 transition-colors">
                        <div className="flex items-center space-x-5 flex-1 min-w-0">
                          <div className="w-20 h-20 bg-[#efe7e5]/40 rounded-2xl flex items-center justify-center border border-slate-200/60 shadow-sm shrink-0 overflow-hidden relative group/img">
                            {getProductImage(item) ? (
                              <img 
                                src={resolveProductImage(getProductImage(item))} 
                                className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-125" 
                                alt={item.product_title} 
                              />
                            ) : (
                              <span className="text-xl font-serif italic text-brand-gold font-bold">{item.product_title ? item.product_title[0] : 'P'}</span>
                            )}
                          </div>
                          <div className="min-w-0">
                            <h3 className="font-serif text-md font-bold text-[#12100e] truncate">{item.product_title}</h3>
                            <p className="text-[9px] text-slate-400 uppercase tracking-widest mt-1 truncate">{item.product_code}</p>
                          </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-6 md:gap-14 shrink-0 text-left md:text-right">
                          <div>
                            <p className="text-[9px] text-slate-400 uppercase tracking-widest">Category</p>
                            <p className="text-xs font-bold text-slate-800 mt-0.5">{getCategoryName(item.category_id)}</p>
                            <p className="text-[8px] text-slate-400 uppercase tracking-wider mt-0.5">{item.product_type}</p>
                          </div>
                          <div>
                            <p className="text-[9px] text-slate-400 uppercase tracking-widest">Price (Base)</p>
                            <p className="text-xs font-bold text-slate-800 mt-0.5">
                              {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(item.price || 0)}
                            </p>
                          </div>
                          <div>
                            <p className="text-[9px] text-slate-400 uppercase tracking-widest">Stock Status</p>
                            <span className={`flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide mt-1 ${item.stock > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${item.stock > 0 ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                              {item.stock > 0 ? `${item.stock} Available` : 'Out of Stock'}
                            </span>
                          </div>
                          <div>
                            <p className="text-[9px] text-slate-400 uppercase tracking-widest">Visibility</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className={`w-7 h-4 rounded-full border flex items-center p-0.5 ${item.status === '1' ? 'bg-emerald-100 border-emerald-300 justify-end' : 'bg-slate-100 border-slate-300 justify-start'}`}>
                                <span className={`w-2.5 h-2.5 rounded-full ${item.status === '1' ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
                              </span>
                              <span className={`text-[10px] font-bold uppercase ${item.status === '1' ? 'text-emerald-600' : 'text-slate-400'}`}>
                                {item.status === '1' ? 'Live' : 'Archived'}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <button 
                              onClick={() => handleEditProduct(item._id)}
                              className="px-4 py-2 bg-[#5d463c] hover:bg-[#4c3931] text-[#efe7e5] rounded-lg text-[10px] uppercase tracking-widest font-bold transition-all border border-slate-200/50 shadow-sm cursor-pointer"
                            >
                              Refine
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : activeMenu === 'orders' ? (
            <Orders />
          ) : activeMenu === 'categories' ? (
            <Categories />
          ) : activeMenu === 'customers' ? (
            <Customers />
          ) : activeMenu === 'collections' ? (
            <Collections />
          ) : activeMenu === 'coupons' ? (
            <Coupons />
          ) : activeMenu === 'exchange' ? (
            <ExchangeInquiries />
          ) : activeMenu === 'sellgold' ? (
            <SellGoldInquiries />
          ) : activeMenu === 'banners' ? (
            <Banners />
          ) : (
            <div className="py-24 text-center">
              <span className="text-xs uppercase tracking-[0.4em] font-black text-slate-400">Atelier Admin Panel</span>
              <h2 className="text-2xl font-serif italic text-slate-700 mt-4">Section Under Refinement</h2>
              <p className="text-xs text-slate-400 mt-2">Please navigate to the &ldquo;Products&rdquo;, &ldquo;Orders&rdquo;, &ldquo;Categories&rdquo;, &ldquo;Customers&rdquo;, &ldquo;Collections&rdquo;, &ldquo;Coupons&rdquo;, &ldquo;Exchange Leads&rdquo;, or &ldquo;Sell Gold Leads&rdquo; sections to manage catalog ledger details.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
