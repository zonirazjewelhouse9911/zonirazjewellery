import { useState, useEffect } from 'react';
import { Loader2, Search, SlidersHorizontal, ChevronDown, Eye, Mail, Phone, Calendar, Clock, ShoppingBag, CreditCard, Box, MapPin } from 'lucide-react';
import { cn } from '../lib/utils';

interface Address {
  fullName: string;
  phone: string;
  addressLine: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  isDefault: boolean;
}

interface CartItem {
  name: string;
  quantity: number;
  price: number;
}

interface OrderRecord {
  _id: string;
  razorpayOrderId?: string;
  paymentStatus: string;
  orderStatus: string;
  totalAmount: number;
  createdAt: string;
}

interface Customer {
  _id: string;
  name: string;
  email: string;
  status: string;
  isActive: boolean;
  phone?: string;
  gender?: string;
  createdAt: string;
  lastLogin?: string;
  addresses?: Address[];
  cart?: CartItem[];
  orders?: OrderRecord[];
  orderCount?: number;
  lifetimeValue?: number;
}

export default function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Navigation / Detail State
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [customerDetail, setCustomerDetail] = useState<Customer | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      if (data.success) {
        setCustomers(data.data || []);
      } else {
        console.error('Failed to retrieve patrons:', data.message);
      }
    } catch (error) {
      console.error('Failed to establish API connection:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomerDetail = async (id: string) => {
    setLoadingDetail(true);
    try {
      const res = await fetch(`/api/admin/users/${id}`);
      const data = await res.json();
      if (data.success) {
        setCustomerDetail(data.data);
      } else {
        console.error('Failed to retrieve patron detail:', data.message);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingDetail(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    if (selectedCustomerId) {
      fetchCustomerDetail(selectedCustomerId);
    } else {
      setCustomerDetail(null);
    }
  }, [selectedCustomerId]);

  const handleToggleStatus = async (customer: Customer) => {
    const nextStatus = customer.status === 'active' ? 'suspended' : 'active';
    if (!window.confirm(`Are you sure you want to ${nextStatus === 'active' ? 'ACTIVATE' : 'SUSPEND'} this user account?`)) {
      return;
    }

    setUpdatingStatus(true);
    try {
      const res = await fetch(`/api/admin/users/${customer._id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus })
      });
      const data = await res.json();
      if (data.success) {
        alert(data.message);
        // Refresh local details
        if (customerDetail && customerDetail._id === customer._id) {
          setCustomerDetail({ ...customerDetail, status: nextStatus, isActive: nextStatus === 'active' });
        }
        setCustomers(customers.map(c => c._id === customer._id ? { ...c, status: nextStatus, isActive: nextStatus === 'active' } : c));
      } else {
        alert(data.message || 'Status transition failed.');
      }
    } catch (e) {
      alert('Network communication error.');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const formatDate = (dateStr: string, includeTime = false) => {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    if (includeTime) {
      return date.toLocaleDateString('en-IN', {
        day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', hour12: true
      });
    }
    return date.toLocaleDateString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric'
    });
  };

  const getJoinedMonthYear = (dateStr: string) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-IN', {
      month: 'short', year: 'numeric'
    }).toUpperCase();
  };

  const filteredCustomers = customers.filter(c => {
    const name = c.name.toLowerCase();
    const email = c.email.toLowerCase();
    const phone = (c.phone || '').toLowerCase();
    const query = searchQuery.toLowerCase();
    return name.includes(query) || email.includes(query) || phone.includes(query);
  });

  // Render detailed profile page
  if (selectedCustomerId && (loadingDetail || !customerDetail)) {
    return (
      <div className="py-32 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="animate-spin text-[#5d463c]" size={32} />
        <span className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold">Querying ledger profile...</span>
      </div>
    );
  }

  if (selectedCustomerId && customerDetail) {
    const c = customerDetail;
    const dateJoined = getJoinedMonthYear(c.createdAt);
    const dateLastSeen = c.lastLogin ? formatDate(c.lastLogin, true) : 'Never';

    return (
      <div className="space-y-8 animate-in fade-in duration-500 font-sans text-left text-[#12100e]">
        {/* Detail Header navigation row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <button 
              onClick={() => setSelectedCustomerId(null)}
              className="text-[10px] uppercase tracking-[0.3em] font-black text-[#a88265] flex items-center gap-1 hover:text-[#5d463c] transition-colors cursor-pointer"
            >
              &larr; Patron Ledger
            </button>
            <h1 className="text-4.5xl font-serif font-bold text-[#12100e]">{c.name}</h1>
            <p className="text-[9px] text-slate-400 font-mono tracking-widest select-all">UID: {c._id.toUpperCase()}</p>
          </div>

          <button
            type="button"
            disabled={updatingStatus}
            onClick={() => handleToggleStatus(c)}
            className={cn(
              'px-6 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest cursor-pointer shadow-sm transition-all border',
              c.status === 'active' 
                ? 'bg-red-500/10 border-red-500/25 text-red-600 hover:bg-red-500/20' 
                : 'bg-emerald-500/10 border-emerald-500/25 text-emerald-600 hover:bg-emerald-500/20'
            )}
          >
            {c.status === 'active' ? 'Suspend Account' : 'Activate Account'}
          </button>
        </div>

        {/* Dashboard Grid split */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Left profile overview card and KPI cards */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white border border-slate-200/60 rounded-[32px] p-8 flex flex-col items-center text-center space-y-6 shadow-sm">
              <div className="w-24 h-24 rounded-full bg-[#efe7e5]/40 border border-slate-200 flex items-center justify-center relative shadow-inner">
                <span className="text-3xl font-serif italic text-[#5d463c] font-black">{c.name[0].toUpperCase()}</span>
                
                {/* Micro status dot */}
                <span className={cn(
                  'absolute bottom-1 right-1 w-4 h-4 rounded-full border-2 border-white',
                  c.status === 'active' ? 'bg-emerald-500' : 'bg-red-500'
                )}></span>
              </div>

              <div>
                <span className={cn(
                  'inline-block px-2.5 py-0.5 rounded-full text-[8px] font-black tracking-widest uppercase border',
                  c.status === 'active' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600' : 'bg-red-500/10 border-red-500/20 text-red-500'
                )}>
                  {c.status}
                </span>
                <h3 className="font-serif text-xl font-bold text-slate-800 mt-3">{c.name}</h3>
                <p className="text-xs text-slate-400 mt-1 select-all">{c.email}</p>
              </div>

              {/* Attributes lists */}
              <div className="w-full pt-6 border-t border-slate-100/80 text-left space-y-4 text-xs text-slate-600">
                <div className="flex items-center space-x-3">
                  <Phone size={14} className="text-slate-400 shrink-0" />
                  <span>{c.phone || 'No phone provided'}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Calendar size={14} className="text-slate-400 shrink-0" />
                  <span>Joined {dateJoined}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock size={14} className="text-slate-400 shrink-0" />
                  <span>Last seen {dateLastSeen}</span>
                </div>
              </div>
            </div>

            {/* KPI Badges */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white border border-slate-200/60 rounded-3xl p-6 flex flex-col justify-between h-32 shadow-sm">
                <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-200/30 text-slate-500 shadow-sm shrink-0">
                  <ShoppingBag size={14} />
                </div>
                <div>
                  <span className="text-[14px] font-black text-slate-800 block leading-none">{c.orderCount || 0}</span>
                  <span className="text-[7.5px] uppercase tracking-wider text-slate-400 font-bold block mt-1.5">Total Orders</span>
                </div>
              </div>

              <div className="bg-[#12100e] rounded-3xl p-6 flex flex-col justify-between h-32 shadow-md">
                <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center border border-white/5 text-[#efe7e5]/80 shadow-sm shrink-0">
                  <CreditCard size={14} />
                </div>
                <div>
                  <span className="text-[14px] font-black text-[#efe7e5] block leading-none">{formatPrice(c.lifetimeValue || 0)}</span>
                  <span className="text-[7.5px] uppercase tracking-wider text-[#efe7e5]/60 font-bold block mt-1.5">Lifetime Spend</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel purchase logs & addresses */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Purchase History */}
            <div className="space-y-4">
              <h4 className="text-[10px] uppercase tracking-[0.3em] font-black text-[#5d463c] flex items-center gap-2">
                <Box size={14} />
                <span>Purchase History</span>
              </h4>
              
              {!c.orders || c.orders.length === 0 ? (
                <div className="border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center text-slate-400 text-xs font-bold uppercase tracking-widest bg-white/40">
                  No purchase records found.
                </div>
              ) : (
                <div className="bg-white border border-slate-200/60 rounded-3xl overflow-hidden shadow-sm divide-y divide-slate-100">
                  <div className="p-4 grid grid-cols-4 gap-4 text-[9px] uppercase tracking-widest font-black text-slate-400 bg-slate-50/50">
                    <span>Order ID</span>
                    <span>Status</span>
                    <span>Total</span>
                    <span>Date</span>
                  </div>
                  {c.orders.map((ord) => (
                    <div key={ord._id} className="p-4 grid grid-cols-4 gap-4 text-xs items-center hover:bg-slate-50/20 transition-colors">
                      <span className="font-mono text-slate-700 truncate select-all">{ord._id}</span>
                      <div>
                        <span className={cn(
                          'inline-block px-2 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-wider border',
                          ord.paymentStatus === 'paid' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600' : 'bg-amber-500/10 border-amber-500/20 text-amber-600'
                        )}>
                          {ord.paymentStatus}
                        </span>
                      </div>
                      <span className="font-bold text-slate-800">{formatPrice(ord.totalAmount)}</span>
                      <span className="text-slate-400 font-mono text-[9px]">{formatDate(ord.createdAt)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Address Vault */}
            <div className="space-y-4">
              <h4 className="text-[10px] uppercase tracking-[0.3em] font-black text-[#5d463c] flex items-center gap-2">
                <MapPin size={14} />
                <span>Address Vault</span>
              </h4>

              {!c.addresses || c.addresses.length === 0 ? (
                <div className="border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center text-slate-400 text-xs font-bold uppercase tracking-widest bg-white/40">
                  No addresses registered yet.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {c.addresses.map((addr, idx) => (
                    <div key={idx} className="bg-white border border-slate-200/60 rounded-2xl p-5 space-y-2.5 relative shadow-sm hover:border-[#5d463c]/30 transition-all">
                      <div className="flex items-center justify-between">
                        <strong className="text-xs text-slate-800">{addr.fullName}</strong>
                        {addr.isDefault && (
                          <span className="text-[7.5px] font-black uppercase tracking-widest bg-[#5d463c]/15 text-[#5d463c] px-2 py-0.5 rounded border border-[#5d463c]/20">Default</span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        {addr.addressLine}, {addr.city}, {addr.state} - {addr.pincode}
                      </p>
                      <p className="text-xs text-slate-400 font-bold">{addr.phone}</p>
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

  // Render list view
  return (
    <div className="space-y-8 animate-in fade-in duration-500 font-sans text-left text-[#12100e]">
      
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span className="text-[10px] uppercase tracking-[0.45em] font-black text-[#a88265] block">Patron Ledger</span>
          <h1 className="text-4.5xl font-serif font-bold text-[#12100e] mt-2">
            Customers <span className="text-slate-350 font-normal italic not-serif text-3xl ml-1">({customers.length})</span>
          </h1>
        </div>
      </div>

      {/* Search Bar + Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between p-4 bg-white rounded-3xl border border-slate-200/60 shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Name, Email, or Phone..."
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

      {/* Customers Table Container */}
      <div className="bg-white border border-slate-200/80 rounded-[32px] overflow-hidden shadow-sm">
        
        {/* Table Headers */}
        <div className="p-6 border-b border-slate-100 grid grid-cols-12 gap-4 text-[10px] tracking-[0.2em] font-black text-slate-400 bg-slate-50/50">
          <div className="col-span-3">Patron Info</div>
          <div className="col-span-3">Contact</div>
          <div className="col-span-2">Activity</div>
          <div className="col-span-2">Value</div>
          <div className="col-span-1">Joined</div>
          <div className="col-span-1 text-center">Action</div>
        </div>

        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-4">
            <Loader2 className="animate-spin text-[#5d463c]" size={32} />
            <span className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold">Querying ledger...</span>
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div className="py-20 text-center text-slate-500 uppercase tracking-widest text-xs font-bold">
            No customer accounts found in ledger
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredCustomers.map((customer) => {
              const joinedMonth = getJoinedMonthYear(customer.createdAt);
              const lastSeenDate = customer.lastLogin ? new Date(customer.lastLogin).toLocaleDateString('en-US', {
                month: 'numeric', day: 'numeric', year: 'numeric'
              }) : 'N/A';

              return (
                <div key={customer._id} className="p-6 grid grid-cols-12 gap-4 items-center hover:bg-slate-50/30 transition-colors">
                  
                  {/* Patron Info */}
                  <div className="col-span-3 flex items-center space-x-4 min-w-0">
                    <div className="w-12 h-12 rounded-full bg-[#efe7e5]/40 border border-slate-200/60 flex items-center justify-center shrink-0 shadow-sm">
                      <span className="text-lg font-serif italic text-[#5d463c] font-black">{customer.name[0].toUpperCase()}</span>
                    </div>
                    <div className="min-w-0 text-left">
                      <h4 className="font-serif text-md font-bold text-slate-800 truncate">{customer.name}</h4>
                      <span className={cn(
                        'inline-block px-2.5 py-0.5 rounded-md text-[8px] font-black tracking-widest uppercase mt-1 border',
                        customer.status === 'active' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600' : 'bg-red-500/10 border-red-500/20 text-red-500'
                      )}>
                        {customer.status}
                      </span>
                    </div>
                  </div>

                  {/* Contact */}
                  <div className="col-span-3 text-left space-y-1.5 min-w-0 text-xs text-slate-650">
                    <div className="flex items-center space-x-2 truncate">
                      <Mail size={12} className="text-slate-400 shrink-0" />
                      <span className="truncate select-all">{customer.email}</span>
                    </div>
                    {customer.phone && (
                      <div className="flex items-center space-x-2">
                        <Phone size={12} className="text-slate-400 shrink-0" />
                        <span className="select-all">{customer.phone}</span>
                      </div>
                    )}
                  </div>

                  {/* Activity */}
                  <div className="col-span-2 text-left">
                    <p className="text-xs font-bold text-slate-800">{customer.orderCount || 0} Orders</p>
                    <div className="flex items-center space-x-1 mt-1 text-[9px] uppercase tracking-wider text-slate-400 font-bold">
                      <Clock size={10} className="shrink-0" />
                      <span>Last seen {lastSeenDate}</span>
                    </div>
                  </div>

                  {/* Value */}
                  <div className="col-span-2 text-left">
                    <p className="text-xs font-bold text-slate-800">{formatPrice(customer.lifetimeValue || 0)}</p>
                    <p className="text-[8px] uppercase tracking-wider text-slate-400 mt-0.5 font-bold">Lifetime Value</p>
                  </div>

                  {/* Joined */}
                  <div className="col-span-1 text-left text-[11px] text-slate-400 uppercase font-black tracking-wider">
                    {joinedMonth}
                  </div>

                  {/* Action */}
                  <div className="col-span-1 flex justify-center">
                    <button 
                      type="button"
                      onClick={() => setSelectedCustomerId(customer._id)}
                      className="w-10 h-10 rounded-full bg-[#5d463c] hover:bg-[#4c3931] text-[#efe7e5] flex items-center justify-center transition-all cursor-pointer shadow-sm border border-slate-200/50"
                      title="View Details"
                    >
                      <Eye size={14} />
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
