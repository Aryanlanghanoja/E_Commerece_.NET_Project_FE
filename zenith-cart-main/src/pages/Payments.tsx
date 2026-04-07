import { useState, useEffect } from 'react';
import { CreditCard, Smartphone, Building2, ArrowUpDown, Search, Loader2 } from 'lucide-react';
import { useOrders } from '@/hooks/useOrders';
import { format } from 'date-fns';
import type { Order } from '@/services/apiService';

interface PaymentDisplay {
  id: number;
  orderId: number;
  amount: number;
  paymentMode: 'UPI' | 'NetBanking' | 'CashOnDelivery';
  status: 'Pending' | 'Success' | 'Failed';
  createdAt: string;
}

const statusStyles: Record<string, string> = {
  Success: 'bg-success/10 text-success',
  Pending: 'bg-primary/10 text-primary',
  Failed: 'bg-destructive/10 text-destructive',
};

const Payments = () => {
  const [page, setPage] = useState(1);
  const [payments, setPayments] = useState<PaymentDisplay[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { data: ordersData } = useOrders({ page, pageSize: 50 });

  useEffect(() => {
    if (ordersData?.items) {
      const mockPayments: PaymentDisplay[] = ordersData.items.map((order) => ({
        id: order.id,
        orderId: order.id,
        amount: order.totalAmount,
        paymentMode: 'UPI' as const,
        status: order.status === 'Cancelled' ? 'Failed' : order.status === 'Delivered' ? 'Success' : 'Pending',
        createdAt: order.createdAt,
      }));
      setPayments(mockPayments);
    }
    setIsLoading(false);
  }, [ordersData]);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortDesc, setSortDesc] = useState(true);

  const filtered = payments
    .filter((p) => {
      const matchesSearch =
        p.id.toString().includes(search.toLowerCase()) ||
        p.orderId.toString().includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'all' || p.status.toLowerCase() === statusFilter.toLowerCase();
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => sortDesc ? b.createdAt.localeCompare(a.createdAt) : a.createdAt.localeCompare(b.createdAt));

  const totalCompleted = payments
    .filter((p) => p.status === 'Success')
    .reduce((s, p) => s + p.amount, 0);

  const totalPending = payments
    .filter((p) => p.status === 'Pending')
    .reduce((s, p) => s + p.amount, 0);

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Payments</h1>
        <p className="text-muted-foreground text-sm">Track all your transactions</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Total Received</p>
          <p className="text-2xl font-bold text-success mt-1">${totalCompleted.toFixed(2)}</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Pending</p>
          <p className="text-2xl font-bold text-primary mt-1">${totalPending.toFixed(2)}</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Total Payments</p>
          <p className="text-2xl font-bold mt-1">{payments.length}</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by payment or order ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 h-10 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="all">All Status</option>
            <option value="Success">Completed</option>
            <option value="Pending">Pending</option>
            <option value="Failed">Failed</option>
          </select>
          <button
            onClick={() => setSortDesc(!sortDesc)}
            className="h-10 px-3 rounded-lg border border-input bg-background hover:bg-muted transition-colors"
            title="Toggle sort order"
          >
            <ArrowUpDown className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Payment ID</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Order</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Method</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Date</th>
                <th className="text-right px-4 py-3 font-semibold text-muted-foreground">Amount</th>
                <th className="text-center px-4 py-3 font-semibold text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
                  </td>
                </tr>
              ) : filtered.length > 0 ? (
                filtered.map((payment) => (
                  <tr key={payment.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 font-medium">#{payment.id}</td>
                    <td className="px-4 py-3 text-accent font-medium">#{payment.orderId}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1.5">
                        {payment.paymentMode === 'UPI' && <Smartphone className="h-4 w-4" />}
                        {payment.paymentMode === 'NetBanking' && <Building2 className="h-4 w-4" />}
                        {payment.paymentMode === 'CashOnDelivery' && <CreditCard className="h-4 w-4" />}
                        <span>{payment.paymentMode === 'CashOnDelivery' ? 'COD' : payment.paymentMode}</span>
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {format(new Date(payment.createdAt), 'MMM d, yyyy')}
                    </td>
                    <td className="px-4 py-3 text-right font-semibold">${payment.amount.toFixed(2)}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${statusStyles[payment.status] || ''}`}>
                        {payment.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">
                    No payments found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Payments;
