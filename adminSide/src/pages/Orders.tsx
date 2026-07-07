import { useState, useEffect } from 'react';
import { Loader2, Search, SlidersHorizontal, ChevronDown, X } from 'lucide-react';
import { cn } from '../lib/utils';
import { resolveProductImage } from '../lib/imageResolver';

interface OrderItem {
  productId: string;
  name: string;
  slug: string;
  price: number;
  quantity: number;
  image: string;
  configuration: {
    metal: string;
    purity: string;
    size: string;
    stone: string;
  };
}

interface Order {
  _id: string;
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  shippingAddress: {
    fullName: string;
    phone: string;
    addressLine: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  paymentStatus: string;
  orderStatus: string;
  currency: string;
  exchangeRate: number;
  discountAmount: number;
  digiGoldRedeemedAmount: number;
  digiGoldRedeemedGrams: number;
  giftCardAmountRedeemed: number;
  timeline: string[];
  razorpayOrderId: string;
  createdAt: string;
  updatedAt: string;
}

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/orders');
      const data = await res.json();
      if (data.success) {
        setOrders(data.data || []);
      } else {
        console.error('Failed to retrieve orders:', data.message);
      }
    } catch (error) {
      console.error('Failed to connect to API:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    setUpdatingStatus(true);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      const data = await res.json();
      if (data.success) {
        alert('Order status updated successfully');
        // Refresh local states
        setOrders(orders.map(o => o._id === orderId ? { ...o, orderStatus: status } : o));
        if (selectedOrder && selectedOrder._id === orderId) {
          setSelectedOrder({ ...selectedOrder, orderStatus: status });
        }
      } else {
        alert(data.message || 'Failed to update status');
      }
    } catch (e) {
      alert('Network error occurred');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleUpdatePaymentStatus = async (orderId: string, status: string) => {
    setUpdatingStatus(true);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/payment`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      const data = await res.json();
      if (data.success) {
        alert('Payment status updated successfully');
        setOrders(orders.map(o => o._id === orderId ? { ...o, paymentStatus: status } : o));
        if (selectedOrder && selectedOrder._id === orderId) {
          setSelectedOrder({ ...selectedOrder, paymentStatus: status });
        }
      } else {
        alert(data.message || 'Failed to update payment status');
      }
    } catch (e) {
      alert('Network error occurred');
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

  const filteredOrders = orders.filter(o => {
    const name = (o.shippingAddress?.fullName || '').toLowerCase();
    const city = (o.shippingAddress?.city || '').toLowerCase();
    const phone = (o.shippingAddress?.phone || '').toLowerCase();
    const razorpayId = (o.razorpayOrderId || '').toLowerCase();
    const orderId = o._id.toLowerCase();
    const query = searchQuery.toLowerCase();

    return name.includes(query) || city.includes(query) || phone.includes(query) || razorpayId.includes(query) || orderId.includes(query);
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500 font-sans text-left text-[#12100e]">
      
      {/* Header Row */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span className="text-[10px] uppercase tracking-[0.4em] font-black text-slate-500">Order Management</span>
          <h1 className="text-4.5xl font-serif font-bold text-[#12100e] mt-2">
            Orders <span className="text-slate-400 font-normal italic not-serif text-2xl ml-1">({orders.length})</span>
          </h1>
        </div>
      </div>

      {/* Search Bar + Filters + Sort Row */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between p-4 bg-white rounded-3xl border border-slate-200/60 shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by customer name, order ID, city, or phone..."
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

      {/* Directory Table/List */}
      <div className="bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <span className="text-[10px] uppercase tracking-widest font-black text-slate-400">Order Directory</span>
          <span className="text-[9px] text-slate-500 uppercase tracking-widest">
            Latest Orders First
          </span>
        </div>

        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-4">
            <Loader2 className="animate-spin text-[#5d463c]" size={32} />
            <span className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold">Querying ledger...</span>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="py-20 text-center text-slate-500 uppercase tracking-widest text-xs font-bold">
            No order transactions found in ledger
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredOrders.map((order) => {
              const itemsCount = order.items ? order.items.reduce((acc, curr) => acc + curr.quantity, 0) : 0;
              const dateStr = order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN', {
                day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
              }) : 'N/A';

              return (
                <div key={order._id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-slate-50/30 transition-colors">
                  <div className="flex items-center space-x-5 flex-1 min-w-0">
                    <div className="w-14 h-14 bg-[#efe7e5]/40 rounded-2xl flex items-center justify-center border border-slate-200/60 shadow-sm shrink-0">
                      <span className="text-xl font-serif italic text-brand-gold font-bold">{order.shippingAddress?.fullName ? order.shippingAddress.fullName[0].toUpperCase() : 'O'}</span>
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-serif text-md font-bold text-[#12100e] truncate">{order.shippingAddress?.fullName || 'Guest Customer'}</h3>
                      <p className="text-[9px] text-slate-450 uppercase tracking-widest mt-1 truncate">
                        ID: {order._id} {order.razorpayOrderId ? `| RpID: ${order.razorpayOrderId}` : ''}
                      </p>
                      <p className="text-[8px] text-slate-400 font-mono mt-0.5">{dateStr}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-6 md:gap-14 shrink-0 text-left md:text-right">
                    <div>
                      <p className="text-[9px] text-slate-400 uppercase tracking-widest">Items count</p>
                      <p className="text-xs font-bold text-slate-800 mt-0.5">{itemsCount} piece{itemsCount !== 1 ? 's' : ''}</p>
                    </div>
                    
                    <div>
                      <p className="text-[9px] text-slate-400 uppercase tracking-widest">Total Amount</p>
                      <p className="text-xs font-bold text-slate-800 mt-0.5">{formatPrice(order.totalAmount)}</p>
                    </div>

                    <div>
                      <p className="text-[9px] text-slate-400 uppercase tracking-widest">Payment</p>
                      <span className={cn(
                        'inline-block px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider mt-1 border',
                        order.paymentStatus === 'paid' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600' :
                        order.paymentStatus === 'pending' ? 'bg-amber-500/10 border-amber-500/20 text-amber-600' :
                        'bg-red-500/10 border-red-500/20 text-red-500'
                      )}>
                        {order.paymentStatus}
                      </span>
                    </div>

                    <div>
                      <p className="text-[9px] text-slate-400 uppercase tracking-widest">Order Status</p>
                      <span className={cn(
                        'inline-block px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider mt-1 border',
                        order.orderStatus === 'delivered' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600' :
                        order.orderStatus === 'cancelled' ? 'bg-red-500/10 border-red-500/20 text-red-500' :
                        'bg-blue-500/10 border-blue-500/20 text-blue-600'
                      )}>
                        {order.orderStatus}
                      </span>
                    </div>

                    <div className="flex items-center space-x-3">
                      <button 
                        type="button"
                        onClick={() => setSelectedOrder(order)}
                        className="px-4 py-2 bg-[#5d463c] hover:bg-[#4c3931] text-[#efe7e5] rounded-lg text-[10px] uppercase tracking-widest font-bold transition-all border border-slate-200/50 shadow-sm cursor-pointer"
                      >
                        Refine
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-6 backdrop-blur-xs animate-in fade-in duration-300">
          <div className="bg-[#efe7e5] text-[#12100e] w-full max-w-4xl rounded-4xl shadow- premium border border-slate-200 overflow-hidden max-h-[85vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="p-6 bg-white border-b border-slate-200/60 flex items-center justify-between shrink-0">
              <div>
                <span className="text-[9px] uppercase tracking-[0.3em] font-black text-slate-400">Order Ledger Detail</span>
                <h3 className="text-xl font-serif font-bold italic mt-1 text-[#12100e]">
                  Customer: <span className="not-italic text-brand-gold">{selectedOrder.shippingAddress?.fullName}</span>
                </h3>
              </div>
              <button 
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="p-2 text-slate-400 hover:text-[#12100e] transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-8 space-y-8 text-left">
              
              {/* Order Metadata Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white rounded-3xl p-6 border border-slate-200/60">
                <div className="space-y-1">
                  <span className="text-[9px] uppercase tracking-widest font-black text-slate-400 block">Mongoose ID</span>
                  <span className="text-xs font-mono text-slate-700 block select-all">{selectedOrder._id}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] uppercase tracking-widest font-black text-slate-400 block">Razorpay Order ID</span>
                  <span className="text-xs font-mono text-slate-700 block select-all">{selectedOrder.razorpayOrderId || 'N/A'}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] uppercase tracking-widest font-black text-slate-400 block">Order Date</span>
                  <span className="text-xs text-slate-700 block font-bold">
                    {new Date(selectedOrder.createdAt).toLocaleString('en-IN', {
                      day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                    })}
                  </span>
                </div>
              </div>

              {/* Status Manager controls */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-white/60 border border-slate-200 rounded-3xl">
                <div className="space-y-3">
                  <label className="text-[9px] uppercase tracking-widest font-black text-[#5d463c] block">Update Order Status</label>
                  <select 
                    value={selectedOrder.orderStatus}
                    disabled={updatingStatus}
                    onChange={(e) => handleUpdateOrderStatus(selectedOrder._id, e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-xs text-[#12100e] focus:ring-1 focus:ring-brand-gold/50 cursor-pointer disabled:opacity-50"
                  >
                    <option value="placed">Placed (New)</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div className="space-y-3">
                  <label className="text-[9px] uppercase tracking-widest font-black text-[#5d463c] block">Update Payment Status</label>
                  <select 
                    value={selectedOrder.paymentStatus}
                    disabled={updatingStatus}
                    onChange={(e) => handleUpdatePaymentStatus(selectedOrder._id, e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-xs text-[#12100e] focus:ring-1 focus:ring-brand-gold/50 cursor-pointer disabled:opacity-50"
                  >
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="failed">Failed</option>
                    <option value="refunded">Refunded</option>
                  </select>
                </div>
              </div>

              {/* Ordered Items List */}
              <div className="space-y-4">
                <h4 className="text-[10px] uppercase tracking-[0.3em] font-black text-slate-500">Ordered Items</h4>
                <div className="bg-white border border-slate-200/60 rounded-3xl overflow-hidden divide-y divide-slate-100">
                  {selectedOrder.items && selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="p-5 flex flex-col sm:flex-row items-center gap-4 hover:bg-slate-50/20 transition-colors group/ordrow">
                      <div className="w-20 h-20 bg-slate-50 border border-slate-200 rounded-xl overflow-hidden flex items-center justify-center shrink-0 relative shadow-inner">
                        <img 
                          src={resolveProductImage(item.image)} 
                          className="w-full h-full object-contain p-1 transition-transform duration-500 group-hover/ordrow:scale-125" 
                          alt={item.name} 
                        />
                      </div>
                      <div className="flex-1 text-center sm:text-left">
                        <h5 className="font-serif text-sm font-bold text-slate-800">{item.name}</h5>
                        <p className="text-[8px] text-slate-450 uppercase tracking-widest mt-1">Slug: {item.slug}</p>
                        
                        {/* Configuration tags */}
                        {item.configuration && (
                          <div className="flex flex-wrap gap-2 mt-2 justify-center sm:justify-start">
                            {item.configuration.metal && (
                              <span className="text-[7px] uppercase font-bold bg-[#efe7e5]/80 text-[#5d463c] px-2 py-0.5 rounded-md border border-[#5d463c]/20">
                                Metal: {item.configuration.metal}
                              </span>
                            )}
                            {item.configuration.purity && (
                              <span className="text-[7px] uppercase font-bold bg-[#efe7e5]/80 text-[#5d463c] px-2 py-0.5 rounded-md border border-[#5d463c]/20">
                                Purity: {item.configuration.purity}
                              </span>
                            )}
                            {item.configuration.size && (
                              <span className="text-[7px] uppercase font-bold bg-[#efe7e5]/80 text-[#5d463c] px-2 py-0.5 rounded-md border border-[#5d463c]/20">
                                Size: {item.configuration.size}
                              </span>
                            )}
                            {item.configuration.stone && (
                              <span className="text-[7px] uppercase font-bold bg-[#efe7e5]/80 text-[#5d463c] px-2 py-0.5 rounded-md border border-[#5d463c]/20">
                                Stone: {item.configuration.stone}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="text-center sm:text-right shrink-0">
                        <p className="text-xs text-slate-700 font-bold">{formatPrice(item.price)}</p>
                        <p className="text-[10px] text-slate-450 uppercase tracking-widest mt-0.5">Quantity: {item.quantity}</p>
                        <p className="text-xs font-bold text-brand-gold mt-1">Subtotal: {formatPrice(item.price * item.quantity)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping and Checkout breakdown grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-slate-200/60">
                
                {/* Shipping Details */}
                <div className="space-y-4">
                  <h4 className="text-[10px] uppercase tracking-[0.3em] font-black text-slate-500">Shipping Address</h4>
                  <div className="bg-white border border-slate-200/60 rounded-3xl p-6 space-y-3.5 text-xs text-slate-700">
                    <p><strong className="text-slate-500">Name:</strong> {selectedOrder.shippingAddress?.fullName}</p>
                    <p><strong className="text-slate-500">Phone:</strong> {selectedOrder.shippingAddress?.phone}</p>
                    <p>
                      <strong className="text-slate-500">Address:</strong> {selectedOrder.shippingAddress?.addressLine}, {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} - {selectedOrder.shippingAddress?.pincode}
                    </p>
                    <p><strong className="text-slate-500">Country:</strong> {selectedOrder.shippingAddress?.country || 'India'}</p>
                  </div>
                </div>

                {/* Amount breakdown */}
                <div className="space-y-4">
                  <h4 className="text-[10px] uppercase tracking-[0.3em] font-black text-slate-500">Checkout Breakdown</h4>
                  <div className="bg-white border border-slate-200/60 rounded-3xl p-6 space-y-3 text-xs text-slate-700">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Discount Amount:</span>
                      <span>{formatPrice(selectedOrder.discountAmount || 0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Digital Gold Redeemed:</span>
                      <span>{formatPrice(selectedOrder.digiGoldRedeemedAmount || 0)} ({selectedOrder.digiGoldRedeemedGrams || 0}g)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Gift Card Redeemed:</span>
                      <span>{formatPrice(selectedOrder.giftCardAmountRedeemed || 0)}</span>
                    </div>
                    <div className="flex justify-between border-t border-slate-100 pt-3">
                      <span className="font-bold text-[#12100e]">Net Paid Amount:</span>
                      <span className="font-bold text-brand-gold text-sm">{formatPrice(selectedOrder.totalAmount)}</span>
                    </div>
                  </div>
                </div>

              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-6 bg-white border-t border-slate-200/60 flex items-center justify-end shrink-0 gap-4">
              <button 
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="px-6 py-3 bg-[#5d463c] hover:bg-[#4c3931] text-[#efe7e5] rounded-xl text-[10px] font-bold uppercase tracking-widest cursor-pointer shadow-sm"
              >
                Close Details
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
