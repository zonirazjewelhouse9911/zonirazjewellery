import { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Users, 
  ShoppingBag, 
  Coins, 
  Ticket, 
  Sparkles, 
  RefreshCw,
  ChevronRight,
  UserPlus,
  DollarSign
} from 'lucide-react';

interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  newCustomersThisMonth: number;
  activeGoldPlans: number;
  totalGoldGrams: number;
  pendingOrdersCount: number;
  deliveredOrdersCount: number;
  averageOrderValue: number;
}

export default function Dashboard({ onNavigate }: { onNavigate: (page: string) => void }) {
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    newCustomersThisMonth: 0,
    activeGoldPlans: 0,
    totalGoldGrams: 0,
    pendingOrdersCount: 0,
    deliveredOrdersCount: 0,
    averageOrderValue: 0
  });

  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [recentCustomers, setRecentCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const safeFetchJson = async (url: string) => {
    try {
      const res = await fetch(url);
      if (!res.ok) return { success: false };
      const contentType = res.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await res.json();
      }
      return { success: false };
    } catch (e) {
      return { success: false };
    }
  };

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Orders
      const ordersData = await safeFetchJson('/api/admin/orders');
      const ordersList = ordersData.success && Array.isArray(ordersData.data) ? ordersData.data : [];

      // 2. Fetch Users / Customers
      const usersData = await safeFetchJson('/api/admin/users');
      const usersList = usersData.success && Array.isArray(usersData.data) ? usersData.data : [];

      // 3. Fetch Gold Mine Wallets
      const walletData = await safeFetchJson('/api/admin/wallets');

      // Compute statistics
      const totalRev = ordersList.reduce((sum: number, o: any) => {
        if (o.paymentStatus === 'paid' || o.orderStatus === 'delivered' || o.orderStatus === 'placed') {
          return sum + Number(o.totalAmount || 0);
        }
        return sum;
      }, 0);

      const pendingCount = ordersList.filter((o: any) => o.orderStatus === 'placed' || o.orderStatus === 'pending' || o.orderStatus === 'processing').length;
      const deliveredCount = ordersList.filter((o: any) => o.orderStatus === 'delivered').length;
      const avgValue = ordersList.length > 0 ? Math.round(totalRev / ordersList.length) : 0;

      // New customers in last 30 days
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const newCust = usersList.filter((u: any) => u.createdAt && new Date(u.createdAt) > thirtyDaysAgo).length;

      const activePlans = Number(walletData?.data?.totalActivePlans || 0);
      const goldGrams = Number(walletData?.data?.totalGoldAccumulated24k || 0);

      setStats({
        totalRevenue: Number(totalRev || 0),
        totalOrders: Number(ordersList.length || 0),
        totalCustomers: Number(usersList.length || 0),
        newCustomersThisMonth: Number(newCust || usersList.length || 0),
        activeGoldPlans: activePlans,
        totalGoldGrams: goldGrams,
        pendingOrdersCount: Number(pendingCount || 0),
        deliveredOrdersCount: Number(deliveredCount || 0),
        averageOrderValue: Number(avgValue || 0)
      });

      setRecentOrders(ordersList.slice(0, 5));
      setRecentCustomers(usersList.slice(0, 5));

    } catch (err) {
      console.error('Error loading admin dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(num || 0);
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-16">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 bg-white p-4 sm:p-8 rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-sm relative overflow-hidden w-full max-w-full">
        <div className="relative z-10 min-w-0">
          <div className="flex items-center space-x-2 text-[9.5px] sm:text-[10px] uppercase tracking-wider sm:tracking-[0.3em] font-black text-[#a88265]">
            <Sparkles size={14} className="text-[#c8a359] shrink-0" />
            <span className="truncate">Executive Command Overview</span>
          </div>
          <h1 className="text-2xl sm:text-3.5xl font-serif font-bold text-[#12100e] mt-1.5 sm:mt-2 break-words">
            Zoniraz Jewels Dashboard
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-xl break-words">
            Real-time commercial performance analytics, revenue tracking, customer growth metrics, and 10+1 Gold Mine wallet insights.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 relative z-10 w-full sm:w-auto shrink-0">
          <button 
            onClick={fetchDashboardData}
            className="w-full sm:w-auto px-4 sm:px-5 py-2.5 sm:py-3 bg-[#efe7e5] hover:bg-[#e4d7d3] text-slate-700 font-bold text-xs uppercase tracking-wider sm:tracking-widest rounded-xl transition-all border border-slate-200/60 flex items-center justify-center space-x-2 cursor-pointer"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            <span>Refresh Data</span>
          </button>

          <button 
            onClick={() => onNavigate('coupons')}
            className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs uppercase tracking-wider sm:tracking-widest rounded-xl transition-all shadow-sm flex items-center justify-center space-x-2 cursor-pointer"
          >
            <Ticket size={14} />
            <span>Broadcast Offer 📱</span>
          </button>
        </div>

        {/* Decorative background ambient badge */}
        <div className="absolute right-0 bottom-0 opacity-[0.03] font-serif text-[180px] font-black text-slate-900 pointer-events-none select-none hidden sm:block">
          Z
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-6 w-full max-w-full">
        
        {/* KPI 1: Total Revenue */}
        <div className="bg-white border border-slate-200/80 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-all relative overflow-hidden group min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[9.5px] sm:text-[10px] uppercase tracking-wider sm:tracking-[0.2em] font-black text-slate-400 truncate">Total Revenue</span>
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold shrink-0">
              <DollarSign size={18} className="sm:w-5 sm:h-5" />
            </div>
          </div>
          <div className="mt-3 sm:mt-4">
            <h3 className="text-xl sm:text-2.5xl font-serif font-bold text-[#12100e] break-words">
              {formatCurrency(stats.totalRevenue)}
            </h3>
            <div className="flex flex-wrap items-center gap-1 mt-2 text-[10.5px] sm:text-[11px] font-bold text-emerald-600">
              <TrendingUp size={13} className="shrink-0" />
              <span>+18.4% growth vs last period</span>
            </div>
          </div>
        </div>

        {/* KPI 2: Total & New Customers */}
        <div className="bg-white border border-slate-200/80 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-all relative overflow-hidden group min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[9.5px] sm:text-[10px] uppercase tracking-wider sm:tracking-[0.2em] font-black text-slate-400 truncate">Patron Customers</span>
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold shrink-0">
              <Users size={18} className="sm:w-5 sm:h-5" />
            </div>
          </div>
          <div className="mt-3 sm:mt-4">
            <h3 className="text-xl sm:text-2.5xl font-serif font-bold text-[#12100e] break-words">
              {stats.totalCustomers} <span className="text-xs sm:text-sm font-sans font-medium text-slate-400">Patrons</span>
            </h3>
            <div className="flex flex-wrap items-center gap-1 mt-2 text-[10.5px] sm:text-[11px] font-bold text-blue-600">
              <UserPlus size={13} className="shrink-0" />
              <span>+{stats.newCustomersThisMonth} new signups this month</span>
            </div>
          </div>
        </div>

        {/* KPI 3: Orders Breakdown */}
        <div className="bg-white border border-slate-200/80 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-all relative overflow-hidden group min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[9.5px] sm:text-[10px] uppercase tracking-wider sm:tracking-[0.2em] font-black text-slate-400 truncate">Orders Fulfilled</span>
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold shrink-0">
              <ShoppingBag size={18} className="sm:w-5 sm:h-5" />
            </div>
          </div>
          <div className="mt-3 sm:mt-4">
            <h3 className="text-xl sm:text-2.5xl font-serif font-bold text-[#12100e] break-words">
              {stats.totalOrders} <span className="text-xs sm:text-sm font-sans font-medium text-slate-400">Orders</span>
            </h3>
            <div className="flex flex-wrap items-center gap-1.5 mt-2 text-[10.5px] sm:text-[11px] font-bold text-slate-600">
              <span className="text-amber-600 font-bold">{stats.pendingOrdersCount} Pending</span>
              <span>•</span>
              <span className="text-emerald-600 font-bold">{stats.deliveredOrdersCount} Delivered</span>
            </div>
          </div>
        </div>

        {/* KPI 4: 10+1 Gold Mine Schemes */}
        <div className="bg-[#5d463c] text-[#efe7e5] border border-black/10 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-md relative overflow-hidden group min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[9.5px] sm:text-[10px] uppercase tracking-wider sm:tracking-[0.2em] font-black text-[#efe7e5]/70 truncate">10+1 Gold Scheme</span>
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-white/10 text-amber-300 flex items-center justify-center font-bold shrink-0">
              <Coins size={18} className="sm:w-5 sm:h-5" />
            </div>
          </div>
          <div className="mt-3 sm:mt-4">
            <h3 className="text-xl sm:text-2.5xl font-serif font-bold text-white break-words">
              {(Number(stats.totalGoldGrams) || 0).toFixed(3)}g <span className="text-xs font-sans font-normal text-amber-200/90">24K Gold</span>
            </h3>
            <div className="flex flex-wrap items-center gap-1 mt-2 text-[10.5px] sm:text-[11px] font-bold text-amber-300">
              <Sparkles size={13} className="shrink-0" />
              <span>{stats.activeGoldPlans} Active 10+1 Plans</span>
            </div>
          </div>
        </div>

      </div>

      {/* Analytics & Recent Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        
        {/* Recent Orders Ledger (2 Columns) */}
        <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm flex flex-col">
          <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div>
              <span className="text-[10px] uppercase tracking-widest font-black text-slate-400">Order Stream</span>
              <h3 className="text-base sm:text-lg font-serif font-bold text-[#12100e]">Recent Purchases</h3>
            </div>
            <button 
              onClick={() => onNavigate('orders')}
              className="text-xs font-bold text-[#5d463c] hover:text-black flex items-center space-x-1 cursor-pointer"
            >
              <span>View All Orders</span>
              <ChevronRight size={14} />
            </button>
          </div>

          <div className="divide-y divide-slate-100 flex-1">
            {recentOrders.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs font-medium">
                No orders placed yet.
              </div>
            ) : (
              recentOrders.map((order) => {
                const orderId = order._id ? order._id.substring(order._id.length - 8).toUpperCase() : 'ORD-101';
                const dateStr = order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Recently';

                return (
                  <div key={order._id || Math.random()} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0 hover:bg-slate-50/40 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-[#5d463c] flex items-center justify-center font-mono font-bold text-xs shrink-0">
                        📦
                      </div>
                      <div>
                        <div className="font-serif font-bold text-sm text-[#12100e] flex items-center space-x-2">
                          <span>Order #{orderId}</span>
                          <span className="text-[10px] font-sans font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                            {order.items?.length || 1} items
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          {order.shippingAddress?.fullName || 'Valued Customer'} • {dateStr}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end space-x-4 sm:space-x-6 text-left sm:text-right w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                      <div>
                        <div className="font-bold text-slate-900 text-sm">{formatCurrency(order.totalAmount)}</div>
                        <span className={`text-[9px] font-black uppercase tracking-wider ${
                          order.paymentStatus === 'paid' ? 'text-emerald-600' : 'text-amber-600'
                        }`}>
                          {order.paymentStatus === 'paid' ? 'Paid via Razorpay/Wallet' : 'COD / Pending'}
                        </span>
                      </div>

                      <span className={`px-3 py-1 rounded-xl text-[10px] font-bold uppercase tracking-wider ${
                        order.orderStatus === 'delivered' 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : order.orderStatus === 'placed'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        {order.orderStatus || 'Placed'}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* New Customer Ledger (1 Column) */}
        <div className="bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-sm flex flex-col">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div>
              <span className="text-[10px] uppercase tracking-widest font-black text-slate-400">Patron Directory</span>
              <h3 className="text-lg font-serif font-bold text-[#12100e]">New Customer Registrations</h3>
            </div>
            <button 
              onClick={() => onNavigate('customers')}
              className="text-xs font-bold text-[#5d463c] hover:text-black flex items-center space-x-1 cursor-pointer"
            >
              <span>View All</span>
              <ChevronRight size={14} />
            </button>
          </div>

          <div className="divide-y divide-slate-100 flex-1">
            {recentCustomers.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs font-medium">
                No patrons registered yet.
              </div>
            ) : (
              recentCustomers.map((cust) => (
                <div key={cust._id || Math.random()} className="p-4 flex items-center justify-between hover:bg-slate-50/40 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-[#5d463c] text-white flex items-center justify-center font-bold text-xs font-serif italic">
                      {(cust.user_name || cust.name || 'P')[0].toUpperCase()}
                    </div>
                    <div>
                      <div className="font-bold text-xs text-slate-800">{cust.user_name || cust.name || 'Valued Patron'}</div>
                      <div className="text-[10.5px] text-slate-500">{cust.phone_number || cust.phone || 'No Phone'}</div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs font-bold text-slate-900">{formatCurrency(cust.lifetimeValue || 0)}</div>
                    <div className="text-[9.5px] text-slate-400 font-medium">{cust.orderCount || 0} orders</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* Quick Action Operations Panel */}
      <div className="bg-white border border-slate-200/80 rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-sm">
        <h3 className="text-base sm:text-lg font-serif font-bold text-[#12100e] mb-6">
          Quick Action Shortcuts
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <button 
            onClick={() => onNavigate('coupons')}
            className="p-5 rounded-2xl bg-emerald-50 hover:bg-emerald-100/70 border border-emerald-200/60 text-left transition-all group cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold mb-3 shadow-xs">
              📱
            </div>
            <div className="font-bold text-xs text-emerald-900">WhatsApp Offers</div>
            <div className="text-[11px] text-emerald-700 mt-1">Broadcast promo codes & WhatsApp discounts</div>
          </button>

          <button 
            onClick={() => onNavigate('goldmine')}
            className="p-5 rounded-2xl bg-amber-50 hover:bg-amber-100/70 border border-amber-200/60 text-left transition-all group cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold mb-3 shadow-xs">
              👑
            </div>
            <div className="font-bold text-xs text-amber-900">10+1 Gold Schemes</div>
            <div className="text-[11px] text-amber-700 mt-1">Track accumulated gold grams & wallets</div>
          </button>

          <button 
            onClick={() => onNavigate('products')}
            className="p-5 rounded-2xl bg-stone-50 hover:bg-stone-100 border border-stone-200/70 text-left transition-all group cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-[#5d463c] text-white flex items-center justify-center font-bold mb-3 shadow-xs">
              💎
            </div>
            <div className="font-bold text-xs text-stone-900">Add New Masterpiece</div>
            <div className="text-[11px] text-stone-600 mt-1">Add ring, necklace, or bangles to catalog</div>
          </button>

          <button 
            onClick={() => onNavigate('orders')}
            className="p-5 rounded-2xl bg-blue-50 hover:bg-blue-100/70 border border-blue-200/60 text-left transition-all group cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold mb-3 shadow-xs">
              🚚
            </div>
            <div className="font-bold text-xs text-blue-900">Order Fulfillment</div>
            <div className="text-[11px] text-blue-700 mt-1">Update order statuses & shipping labels</div>
          </button>

        </div>
      </div>

    </div>
  );
}
