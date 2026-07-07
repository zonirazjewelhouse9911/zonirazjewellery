import { useState, useEffect } from 'react';
import { Loader2, Search, MapPin, Clock, FileText, X, Check, Phone, Mail, HelpCircle, AlertTriangle } from 'lucide-react';

interface ExchangeInquiry {
  _id: string;
  fullName: string;
  phone: string;
  email: string;
  city: string;
  consultationType: 'phone' | 'email' | 'in-person' | 'video';
  status: 'new' | 'contacted' | 'resolved' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export default function ExchangeInquiries() {
  const [inquiries, setInquiries] = useState<ExchangeInquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modal detail state
  const [selectedInquiry, setSelectedInquiry] = useState<ExchangeInquiry | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const fetchInquiries = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/exchange-inquiries');
      const data = await res.json();
      if (data.success) {
        setInquiries(data.data || []);
      } else {
        console.error('Failed to fetch exchange leads:', data.message);
      }
    } catch (error) {
      console.error('Error fetching inquiries:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    setUpdatingStatus(true);
    try {
      const res = await fetch(`/api/admin/exchange-inquiries/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        // Update local state
        setInquiries(inquiries.map(inq => inq._id === id ? { ...inq, status: newStatus as any } : inq));
        if (selectedInquiry && selectedInquiry._id === id) {
          setSelectedInquiry({ ...selectedInquiry, status: newStatus as any });
        }
      } else {
        alert(data.message || 'Status transition failed.');
      }
    } catch (e) {
      alert('Network communication error.');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric'
    }).toUpperCase();
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return (
          <span className="bg-amber-500/10 border border-amber-500/20 text-amber-600 rounded-md px-2.5 py-1 text-[8.5px] font-black tracking-widest uppercase flex items-center gap-1.5 shrink-0">
            <Clock size={10} className="shrink-0" />
            <span>New</span>
          </span>
        );
      case 'contacted':
        return (
          <span className="bg-blue-500/10 border border-blue-500/20 text-blue-600 rounded-md px-2.5 py-1 text-[8.5px] font-black tracking-widest uppercase flex items-center gap-1.5 shrink-0">
            <Phone size={10} className="shrink-0" />
            <span>Contacted</span>
          </span>
        );
      case 'resolved':
        return (
          <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 rounded-md px-2.5 py-1 text-[8.5px] font-black tracking-widest uppercase flex items-center gap-1.5 shrink-0">
            <Check size={10} className="shrink-0" />
            <span>Resolved</span>
          </span>
        );
      case 'cancelled':
        return (
          <span className="bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-md px-2.5 py-1 text-[8.5px] font-black tracking-widest uppercase flex items-center gap-1.5 shrink-0">
            <X size={10} className="shrink-0" />
            <span>Cancelled</span>
          </span>
        );
      default:
        return (
          <span className="bg-slate-100 border border-slate-200 text-slate-500 rounded-md px-2.5 py-1 text-[8.5px] font-black tracking-widest uppercase flex items-center gap-1.5 shrink-0">
            <HelpCircle size={10} className="shrink-0" />
            <span>{status}</span>
          </span>
        );
    }
  };

  const getConsultationIcon = (type: string) => {
    switch (type) {
      case 'phone':
        return <Phone size={14} className="text-slate-400 shrink-0" />;
      case 'email':
        return <Mail size={14} className="text-slate-400 shrink-0" />;
      default:
        return <HelpCircle size={14} className="text-slate-400 shrink-0" />;
    }
  };

  const filteredInquiries = inquiries.filter(inq => {
    const name = inq.fullName.toLowerCase();
    const email = inq.email.toLowerCase();
    const phone = inq.phone.toLowerCase();
    const city = inq.city.toLowerCase();
    const query = searchQuery.toLowerCase();

    const matchesSearch = name.includes(query) || email.includes(query) || phone.includes(query) || city.includes(query);
    const matchesStatus = statusFilter === 'all' || inq.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleOpenDetailModal = (inq: ExchangeInquiry) => {
    setSelectedInquiry(inq);
    setModalOpen(true);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 font-sans text-left text-[#12100e]">
      
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span className="text-[10px] uppercase tracking-[0.45em] font-black text-[#a88265] block">Exchange Program</span>
          <h1 className="text-4.5xl font-serif font-bold text-[#12100e] mt-2">
            Exchange Inquiries
          </h1>
        </div>
      </div>

      {/* Search Input and status select */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between p-4 bg-white rounded-3xl border border-slate-200/60 shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search customers..."
            className="w-full bg-[#f0f3f6] border-none rounded-2xl py-3 pl-12 pr-6 text-sm text-slate-800 placeholder-slate-450 focus:ring-1 focus:ring-brand-gold/50"
          />
        </div>
        
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-[#f5ebe2] hover:bg-[#ebdccf] text-slate-700 font-bold text-[11px] uppercase tracking-widest rounded-xl transition-all border border-slate-200/50 py-3 px-5 cursor-pointer outline-none w-full md:w-auto"
        >
          <option value="all">All Status</option>
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="resolved">Resolved</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Inquiries Ledger Table */}
      <div className="bg-white border border-slate-200/80 rounded-[32px] overflow-hidden shadow-sm">
        
        {/* Table Headers */}
        <div className="p-6 border-b border-slate-100 grid grid-cols-12 gap-4 text-[10px] tracking-[0.2em] font-black text-slate-400 bg-slate-50/50 uppercase">
          <div className="col-span-3">Customer</div>
          <div className="col-span-3">Location</div>
          <div className="col-span-2">Est. Value</div>
          <div className="col-span-2 text-center sm:text-left">Status</div>
          <div className="col-span-1">Date</div>
          <div className="col-span-1 text-center">Action</div>
        </div>

        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-4">
            <Loader2 className="animate-spin text-[#5d463c]" size={32} />
            <span className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold">Retrieving inquiries...</span>
          </div>
        ) : filteredInquiries.length === 0 ? (
          <div className="py-20 text-center text-slate-500 uppercase tracking-widest text-xs font-bold bg-white rounded-3xl">
            No inquiries found in database
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredInquiries.map((inq) => (
              <div key={inq._id} className="p-6 grid grid-cols-12 gap-4 items-center hover:bg-slate-50/30 transition-colors">
                
                {/* Customer name and email */}
                <div className="col-span-3 flex items-center space-x-4 min-w-0">
                  <div className="w-12 h-12 rounded-full bg-[#efe7e5]/40 border border-slate-200/60 flex items-center justify-center shrink-0 shadow-sm">
                    <span className="text-lg font-serif italic text-[#5d463c] font-black">{inq.fullName[0].toUpperCase()}</span>
                  </div>
                  <div className="min-w-0 text-left">
                    <h4 className="font-serif text-md font-bold text-slate-800 truncate">{inq.fullName}</h4>
                    <span className="text-[11px] text-slate-400 truncate block mt-0.5">{inq.email}</span>
                  </div>
                </div>

                {/* Location */}
                <div className="col-span-3 text-left flex items-center space-x-2 text-xs text-slate-650 min-w-0">
                  <MapPin size={13} className="text-slate-400 shrink-0" />
                  <span className="truncate">{inq.city || 'Unknown'}</span>
                </div>

                {/* Est Value */}
                <div className="col-span-2 text-left text-xs font-bold text-slate-800">
                  To be evaluated
                </div>

                {/* Status badge */}
                <div className="col-span-2 flex justify-start">
                  {getStatusBadge(inq.status)}
                </div>

                {/* Date */}
                <div className="col-span-1 text-left text-[11px] text-slate-400 uppercase font-black tracking-wider flex items-center gap-1.5">
                  <Clock size={11} className="text-slate-350 shrink-0" />
                  <span>{formatDate(inq.createdAt)}</span>
                </div>

                {/* Action button */}
                <div className="col-span-1 flex justify-center">
                  <button 
                    type="button"
                    onClick={() => handleOpenDetailModal(inq)}
                    className="w-10 h-10 rounded-full bg-[#efe7e5]/40 hover:bg-[#5d463c] hover:text-[#efe7e5] text-[#5d463c] flex items-center justify-center transition-all cursor-pointer shadow-inner border border-slate-200/50"
                    title="View Details"
                  >
                    <FileText size={14} />
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

      {/* Inquiry Detail View Modal */}
      {modalOpen && selectedInquiry && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-6 backdrop-blur-xs animate-in fade-in duration-300">
          <div className="bg-[#efe7e5] text-[#12100e] w-full max-w-xl rounded-4xl shadow-premium border border-slate-200 overflow-hidden flex flex-col">
            
            {/* Modal Header */}
            <div className="p-6 bg-white border-b border-slate-200/60 flex items-center justify-between shrink-0">
              <div>
                <span className="text-[9px] uppercase tracking-[0.3em] font-black text-slate-400">Exchange Consultation Program</span>
                <h3 className="text-xl font-serif font-bold italic mt-1 text-[#12100e]">Inquiry Ledger File</h3>
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
            <div className="p-8 space-y-6 text-left overflow-y-auto flex-1">
              
              {/* Profile Card */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200/60 space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 rounded-full bg-[#efe7e5]/40 border border-slate-200/60 flex items-center justify-center shadow-inner">
                    <span className="text-xl font-serif italic text-[#5d463c] font-black">{selectedInquiry.fullName[0].toUpperCase()}</span>
                  </div>
                  <div>
                    <h4 className="font-serif text-lg font-bold text-slate-800">{selectedInquiry.fullName}</h4>
                    <p className="text-[10px] text-slate-400 font-mono select-all">UID: {selectedInquiry._id.toUpperCase()}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100 text-xs text-slate-650">
                  <div className="flex items-center space-x-3">
                    <Mail size={14} className="text-slate-400 shrink-0" />
                    <span className="select-all truncate">{selectedInquiry.email}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone size={14} className="text-slate-400 shrink-0" />
                    <span className="select-all">{selectedInquiry.phone}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin size={14} className="text-slate-400 shrink-0" />
                    <span>{selectedInquiry.city}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    {getConsultationIcon(selectedInquiry.consultationType)}
                    <span className="capitalize">{selectedInquiry.consultationType} Consultation</span>
                  </div>
                </div>
              </div>

              {/* Status Update block */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200/60 space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-[9px] uppercase tracking-widest font-black text-[#5d463c] block">Current Lead Status</label>
                  <div>{getStatusBadge(selectedInquiry.status)}</div>
                </div>
                
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <label className="text-[9px] uppercase tracking-widest font-black text-[#5d463c] block">Transition Lead To</label>
                  <select
                    value={selectedInquiry.status}
                    disabled={updatingStatus}
                    onChange={(e) => handleUpdateStatus(selectedInquiry._id, e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 px-4 text-xs text-[#12100e] cursor-pointer outline-none font-bold"
                  >
                    <option value="new">New Lead</option>
                    <option value="contacted">Contacted / In Progress</option>
                    <option value="resolved">Resolved / Success</option>
                    <option value="cancelled">Cancelled / Inactive</option>
                  </select>
                </div>
              </div>

              <div className="text-[8.5px] uppercase tracking-widest font-bold text-slate-400 flex items-center gap-1.5 justify-center">
                <AlertTriangle size={11} />
                <span>Status changes apply immediately to customer transaction logs</span>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 bg-white border-t border-slate-200/60 flex justify-end shrink-0">
              <button 
                type="button"
                onClick={() => setModalOpen(false)}
                className="px-6 py-3 bg-[#5d463c] hover:bg-[#4c3931] text-[#efe7e5] rounded-xl text-[10px] font-bold uppercase tracking-widest cursor-pointer shadow-sm"
              >
                Close File
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
