import React, { useState, useEffect } from 'react';
import { Coins, Search, RefreshCw, Layers } from 'lucide-react';

export default function GoldMineWallets() {
  const [activeTab, setActiveTab] = useState<'wallets' | 'plans'>('wallets');
  const [walletStats, setWalletStats] = useState<any>(null);
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedWalletEmail, setExpandedWalletEmail] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [walletRes, plansRes] = await Promise.all([
        fetch('/api/admin/wallets'),
        fetch('/api/admin/goldmine/all-plans')
      ]);

      const walletData = await walletRes.json();
      const plansData = await plansRes.json();

      if (walletData.success) {
        setWalletStats(walletData.data);
      }
      if (plansData.success) {
        setPlans(plansData.data || []);
      }
    } catch (err) {
      console.error('Error fetching admin gold mine / wallet data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredWallets = (walletStats?.wallets || []).filter((w: any) =>
    (w.userEmail || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredPlans = plans.filter((p: any) =>
    (p.userEmail || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.planId || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.userName || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-amber-100 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-amber-50 rounded-lg text-amber-600">
              <Coins className="w-6 h-6" />
            </span>
            <h1 className="text-2xl font-bold text-gray-900">10+1 Gold Mine & User Wallets</h1>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Monitor user gold balances, EMI payments, 11th month bonus credits, and active savings plans.
          </p>
        </div>

        <button
          onClick={fetchData}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-xl text-sm transition-all shadow-xs"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh Data
        </button>
      </div>

      {/* Aggregate Stats Bar */}
      {walletStats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs">
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total User Wallets</div>
            <div className="text-2xl font-bold text-gray-900 mt-2">{walletStats.totalWalletsCount || 0}</div>
            <div className="text-xs text-amber-600 font-medium mt-1">Active Accounts</div>
          </div>

          <div className="bg-gradient-to-br from-amber-500 to-amber-600 p-5 rounded-2xl text-white shadow-xs">
            <div className="text-xs font-semibold text-amber-100 uppercase tracking-wider">Total Accumulated Gold</div>
            <div className="text-2xl font-black mt-2">{walletStats.aggregateGold24kGrams || 0} g</div>
            <div className="text-xs text-amber-100 mt-1">Pure 24K Gold</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs">
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Market Valuation</div>
            <div className="text-2xl font-bold text-emerald-600 mt-2">₹{(walletStats.aggregateMarketValue || 0).toLocaleString('en-IN')}</div>
            <div className="text-xs text-gray-400 mt-1">At ₹{walletStats.liveRate24k}/g 24K</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs">
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">User EMI Savings</div>
            <div className="text-2xl font-bold text-gray-900 mt-2">₹{(walletStats.aggregateAmountSaved || 0).toLocaleString('en-IN')}</div>
            <div className="text-xs text-gray-400 mt-1">Paid by customers</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-xs bg-emerald-50/20">
            <div className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Zoniraz Bonus Credited</div>
            <div className="text-2xl font-bold text-emerald-700 mt-2">₹{(walletStats.aggregateBonusEarned || 0).toLocaleString('en-IN')}</div>
            <div className="text-xs text-emerald-600 font-medium mt-1">11th Month Free Bonus</div>
          </div>
        </div>
      )}

      {/* Tabs & Search */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-2xl border border-gray-100">
        <div className="flex gap-2 w-full sm:w-auto">
          <button
            onClick={() => setActiveTab('wallets')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
              activeTab === 'wallets'
                ? 'bg-gray-900 text-white shadow-xs'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Coins className="w-4 h-4" />
            User Gold Wallets ({walletStats?.wallets?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab('plans')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
              activeTab === 'plans'
                ? 'bg-gray-900 text-white shadow-xs'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            10+1 Gold Mine Plans ({plans.length})
          </button>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search email, plan ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
      </div>

      {/* WALLETS TAB CONTENT */}
      {activeTab === 'wallets' && (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-xs">
          {loading ? (
            <div className="p-12 text-center text-gray-500">Loading Gold Wallets...</div>
          ) : filteredWallets.length === 0 ? (
            <div className="p-12 text-center text-gray-500">No Gold Wallets found matching search.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 uppercase text-xs tracking-wider border-b border-gray-100">
                    <th className="p-4">Customer Email</th>
                    <th className="p-4">Total 24K Gold</th>
                    <th className="p-4">22K / 18K Equiv.</th>
                    <th className="p-4">Market Valuation</th>
                    <th className="p-4">Total Saved</th>
                    <th className="p-4">Bonus Earned</th>
                    <th className="p-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredWallets.map((w: any) => (
                    <React.Fragment key={w._id}>
                      <tr className="hover:bg-amber-50/30 transition-colors">
                        <td className="p-4 font-semibold text-gray-900">{w.userEmail}</td>
                        <td className="p-4 font-bold text-amber-600">{w.totalGold24kGrams} g</td>
                        <td className="p-4 text-xs text-gray-600">
                          <div>22K: {w.karatWeights?.['22K']} g</div>
                          <div>18K: {w.karatWeights?.['18K']} g</div>
                        </td>
                        <td className="p-4 font-semibold text-emerald-600">
                          ₹{(w.currentMarketValue || 0).toLocaleString('en-IN')}
                        </td>
                        <td className="p-4 font-medium text-gray-700">
                          ₹{(w.totalAmountSaved || 0).toLocaleString('en-IN')}
                        </td>
                        <td className="p-4 text-emerald-700 font-semibold">
                          ₹{(w.totalBonusEarned || 0).toLocaleString('en-IN')}
                        </td>
                        <td className="p-4">
                          <button
                            onClick={() => setExpandedWalletEmail(expandedWalletEmail === w.userEmail ? null : w.userEmail)}
                            className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-lg transition-all"
                          >
                            {expandedWalletEmail === w.userEmail ? 'Hide Passbook' : 'View Passbook'}
                          </button>
                        </td>
                      </tr>

                      {/* Expanded Transaction Passbook */}
                      {expandedWalletEmail === w.userEmail && (
                        <tr>
                          <td colSpan={7} className="p-4 bg-gray-50 border-t border-b border-amber-100">
                            <div className="bg-white p-4 rounded-xl border border-gray-200">
                              <h4 className="font-bold text-gray-900 text-sm mb-3">
                                Passbook Transactions ({w.transactions?.length || 0}) for {w.userEmail}
                              </h4>
                              {(!w.transactions || w.transactions.length === 0) ? (
                                <p className="text-xs text-gray-500">No transactions recorded yet.</p>
                              ) : (
                                <div className="overflow-x-auto">
                                  <table className="w-full text-xs text-left">
                                    <thead>
                                      <tr className="bg-gray-100 text-gray-600 uppercase">
                                        <th className="p-2">Date</th>
                                        <th className="p-2">Description / Plan ID</th>
                                        <th className="p-2">Amount</th>
                                        <th className="p-2">24K Rate</th>
                                        <th className="p-2">Gold Credited</th>
                                        <th className="p-2">Type</th>
                                      </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                      {w.transactions.map((txn: any, tIdx: number) => (
                                        <tr key={txn.transactionId || tIdx} className={txn.paidBy === 'ZONIRAZ_BONUS' ? 'bg-emerald-50/50' : ''}>
                                          <td className="p-2 text-gray-500">{new Date(txn.date).toLocaleDateString()}</td>
                                          <td className="p-2 font-medium text-gray-800">
                                            {txn.description} {txn.planId ? `(${txn.planId})` : ''}
                                          </td>
                                          <td className="p-2 font-semibold">₹{txn.amount?.toLocaleString('en-IN')}</td>
                                          <td className="p-2 text-gray-500">₹{txn.goldRate24k}/g</td>
                                          <td className="p-2 font-bold text-amber-600">+{txn.goldWeight24kGrams} g</td>
                                          <td className="p-2">
                                            {txn.paidBy === 'ZONIRAZ_BONUS' ? (
                                              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold">
                                                🎁 BONUS
                                              </span>
                                            ) : (
                                              <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded font-medium">
                                                EMI PAID
                                              </span>
                                            )}
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* PLANS TAB CONTENT */}
      {activeTab === 'plans' && (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-xs">
          {loading ? (
            <div className="p-12 text-center text-gray-500">Loading 10+1 Gold Mine Plans...</div>
          ) : filteredPlans.length === 0 ? (
            <div className="p-12 text-center text-gray-500">No active 10+1 plans found matching search.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 uppercase text-xs tracking-wider border-b border-gray-100">
                    <th className="p-4">Plan ID</th>
                    <th className="p-4">Customer Email</th>
                    <th className="p-4">Monthly EMI</th>
                    <th className="p-4">Installments Paid</th>
                    <th className="p-4">Total Gold Weight</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Start Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredPlans.map((p: any) => (
                    <tr key={p.planId} className="hover:bg-amber-50/20">
                      <td className="p-4 font-mono font-bold text-amber-600">{p.planId}</td>
                      <td className="p-4 font-semibold text-gray-900">{p.userEmail}</td>
                      <td className="p-4 font-semibold text-gray-800">₹{p.monthlyAmount?.toLocaleString('en-IN')}/mo</td>
                      <td className="p-4">
                        <span className="font-bold text-gray-900">{p.totalPaidInstallments}</span> / 10 Paid
                      </td>
                      <td className="p-4 font-bold text-amber-600">{p.totalGold24kGrams} g</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                          p.status === 'COMPLETED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="p-4 text-xs text-gray-500">{new Date(p.startDate).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
