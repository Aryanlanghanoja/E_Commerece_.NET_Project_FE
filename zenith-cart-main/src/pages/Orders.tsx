import { useState } from 'react';
import { Loader2, Search, ChevronDown, ChevronUp } from 'lucide-react';
import { useOrders, useCancelOrder } from '@/hooks/useOrders';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

const statusColors: Record<string, string> = {
  Delivered: 'bg-success/10 text-success border-success/20',
  Shipped: 'bg-accent/10 text-accent border-accent/20',
  Pending: 'bg-primary/10 text-primary border-primary/20',
  Cancelled: 'bg-destructive/10 text-destructive border-destructive/20',
};

const Orders = () => {
  const [page, setPage] = useState(1);
  const [expandedOrder, setExpandedOrder] = useState<number | null>(null);
  
  const { data: ordersData, isLoading } = useOrders({ page, pageSize: 10 });
  const cancelOrder = useCancelOrder();

  const handleCancelOrder = async (orderId: number) => {
    try {
      await cancelOrder.mutateAsync(orderId);
      toast.success('Order cancelled successfully');
    } catch {
      toast.error('Failed to cancel order');
    }
  };

  const toggleExpand = (orderId: number) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Orders</h1>
        <p className="text-muted-foreground text-sm">Track and manage your orders</p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50 text-muted-foreground">
                  <th className="text-left py-3 px-4 font-medium">Order ID</th>
                  <th className="text-left py-3 px-4 font-medium">Date</th>
                  <th className="text-left py-3 px-4 font-medium">Total</th>
                  <th className="text-left py-3 px-4 font-medium">Status</th>
                  <th className="text-left py-3 px-4 font-medium">Items</th>
                  <th className="text-left py-3 px-4 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {ordersData?.items.map((order) => (
                  <>
                    <tr 
                      key={order.id} 
                      className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors cursor-pointer"
                      onClick={() => toggleExpand(order.id)}
                    >
                      <td className="py-3 px-4 font-medium">#{order.id}</td>
                      <td className="py-3 px-4 text-muted-foreground">
                        {format(new Date(order.createdAt), 'MMM d, yyyy')}
                      </td>
                      <td className="py-3 px-4 font-medium">${order.totalAmount.toFixed(2)}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusColors[order.status] || ''}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">{order.items.length} items</td>
                      <td className="py-3 px-4">
                        {expandedOrder === order.id ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </td>
                    </tr>
                    {expandedOrder === order.id && (
                      <tr key={`${order.id}-details`} className="bg-muted/30">
                        <td colSpan={6} className="p-4">
                          <div className="space-y-3">
                            <h4 className="font-semibold text-sm">Order Items</h4>
                            <div className="space-y-2">
                              {order.items.map((item) => (
                                <div key={item.id} className="flex justify-between items-center text-sm bg-card p-3 rounded-lg">
                                  <span className="text-muted-foreground">Product #{item.productId}</span>
                                  <span className="font-medium">Qty: {item.itemCount}</span>
                                  <span>${item.purchasePrice.toFixed(2)}</span>
                                </div>
                              ))}
                            </div>
                            {order.status === 'Pending' && (
                              <Button 
                                variant="destructive" 
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCancelOrder(order.id);
                                }}
                                disabled={cancelOrder.isPending}
                              >
                                Cancel Order
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
                {(!ordersData || ordersData.items.length === 0) && (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-muted-foreground">
                      No orders found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {ordersData && ordersData.totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={!ordersData.hasPreviousPage}
          >
            Previous
          </Button>
          <span className="px-4 py-2 text-sm">
            Page {ordersData.page} of {ordersData.totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(p => p + 1)}
            disabled={!ordersData.hasNextPage}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default Orders;
