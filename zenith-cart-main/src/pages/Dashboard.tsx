import { TrendingUp, ShoppingBag, DollarSign, Users, Loader2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useOrders } from '@/hooks/useOrders';
import { format } from 'date-fns';

const revenueData = [
  { month: 'Jan', revenue: 4200 }, { month: 'Feb', revenue: 5800 },
  { month: 'Mar', revenue: 4900 }, { month: 'Apr', revenue: 7200 },
  { month: 'May', revenue: 6100 }, { month: 'Jun', revenue: 8400 },
];

const orderStatusData = [
  { name: 'Pending', value: 12, color: 'hsl(33,100%,50%)' },
  { name: 'Shipped', value: 8, color: 'hsl(207,78%,39%)' },
  { name: 'Delivered', value: 45, color: 'hsl(145,63%,49%)' },
  { name: 'Cancelled', value: 5, color: 'hsl(4,78%,57%)' },
];

const statusColors: Record<string, string> = {
  Delivered: 'bg-success/10 text-success border-success/20',
  Shipped: 'bg-accent/10 text-accent border-accent/20',
  Pending: 'bg-primary/10 text-primary border-primary/20',
  Cancelled: 'bg-destructive/10 text-destructive border-destructive/20',
};

const Dashboard = () => {
  const { data: ordersData, isLoading } = useOrders({ pageSize: 5 });

  const stats = [
    { label: 'Revenue', value: '$36,600', change: '+12.5%', icon: DollarSign, color: 'text-primary' },
    { label: 'Orders', value: '1,120', change: '+8.2%', icon: ShoppingBag, color: 'text-accent' },
    { label: 'Customers', value: '3,842', change: '+15.3%', icon: Users, color: 'text-success' },
    { label: 'Growth', value: '23.1%', change: '+4.1%', icon: TrendingUp, color: 'text-primary' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground text-sm">Welcome back! Here's your overview.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-card rounded-xl p-5 shadow-sm border border-border">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground">{s.label}</span>
              <s.icon className={`h-5 w-5 ${s.color}`} />
            </div>
            <p className="text-2xl font-bold">{s.value}</p>
            <p className="text-xs text-success font-medium mt-1">{s.change} from last month</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-card rounded-xl p-5 shadow-sm border border-border">
          <h2 className="text-lg font-semibold mb-4">Revenue Overview</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,13%,89%)" />
              <XAxis dataKey="month" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip />
              <Bar dataKey="revenue" fill="hsl(33,100%,50%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card rounded-xl p-5 shadow-sm border border-border">
          <h2 className="text-lg font-semibold mb-4">Orders by Status</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={orderStatusData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
              >
                {orderStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-4 mt-2">
            {orderStatusData.map((item) => (
              <div key={item.name} className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-xs text-muted-foreground">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-card rounded-xl p-5 shadow-sm border border-border">
        <h2 className="text-lg font-semibold mb-4">Recent Orders</h2>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-muted-foreground">
                  <th className="text-left py-3 px-2 font-medium">Order ID</th>
                  <th className="text-left py-3 px-2 font-medium">Date</th>
                  <th className="text-left py-3 px-2 font-medium">Total</th>
                  <th className="text-left py-3 px-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {ordersData?.items.map((order) => (
                  <tr key={order.id} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                    <td className="py-3 px-2 font-medium">#{order.id}</td>
                    <td className="py-3 px-2 text-muted-foreground">{format(new Date(order.createdAt), 'MMM d, yyyy')}</td>
                    <td className="py-3 px-2">${order.totalAmount.toFixed(2)}</td>
                    <td className="py-3 px-2">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusColors[order.status] || ''}`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {(!ordersData || ordersData.items.length === 0) && (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-muted-foreground">
                      No recent orders
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
