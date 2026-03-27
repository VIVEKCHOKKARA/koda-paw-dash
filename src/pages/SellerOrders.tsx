import { useState, useEffect } from "react";
import { PageLayout } from "@/components/PageLayout";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import {
  Package, Clock, CheckCircle2, XCircle, ChevronDown, ChevronUp,
  User, ShoppingBag, DollarSign, TrendingUp, Truck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

interface OrderItem {
  id: string;
  item_type: string;
  item_id: string;
  item_name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  user_id: string;
  total: number;
  status: string;
  created_at: string;
  customer_name?: string;
  items: OrderItem[];
}

const statusConfig: Record<string, { color: string; icon: React.ComponentType<{ className?: string }> }> = {
  confirmed: { color: "bg-koda-warm/10 text-koda-warm", icon: Clock },
  accepted: { color: "bg-primary/10 text-primary", icon: CheckCircle2 },
  rejected: { color: "bg-destructive/10 text-destructive", icon: XCircle },
  shipped: { color: "bg-koda-sky/10 text-koda-sky", icon: Truck },
  delivered: { color: "bg-primary/10 text-primary", icon: CheckCircle2 },
};

export default function SellerOrders() {
  const { user, role } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState("all");

  const fetchOrders = async () => {
    if (!user || role !== "owner") return;
    setLoading(true);

    // Fetch ALL orders (not just from seller's items) — sellers see all customer orders
    const { data: allOrders } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (!allOrders || allOrders.length === 0) { setOrders([]); setLoading(false); return; }

    // Get all order items
    const orderIds = allOrders.map(o => o.id);
    const { data: allItems } = await supabase
      .from("order_items")
      .select("*")
      .in("order_id", orderIds);

    // Enrich with customer names
    const enrichedOrders: Order[] = [];
    for (const order of allOrders) {
      const { data: prof } = await supabase
        .from("profiles")
        .select("display_name")
        .eq("user_id", order.user_id)
        .single();

      const orderItems = allItems?.filter(i => i.order_id === order.id) || [];

      enrichedOrders.push({
        ...order,
        customer_name: prof?.display_name || "Customer",
        items: orderItems,
      });
    }

    setOrders(enrichedOrders);
    setLoading(false);
  };

  useEffect(() => { fetchOrders(); }, [user, role]);

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    await supabase.from("orders").update({ status: newStatus }).eq("id", orderId);
    const labels: Record<string, string> = {
      accepted: "Order Accepted ✅",
      rejected: "Order Rejected ❌",
      shipped: "Marked as Shipped 🚚",
      delivered: "Marked as Delivered ✅",
    };
    toast({ title: labels[newStatus] || "Order Updated" });
    fetchOrders();
  };

  const filteredOrders = filterStatus === "all" ? orders : orders.filter(o => o.status === filterStatus);

  const totalRevenue = orders.filter(o => o.status !== "rejected").reduce((sum, o) => sum + o.total, 0);
  const pendingCount = orders.filter(o => o.status === "confirmed").length;
  const acceptedCount = orders.filter(o => o.status === "accepted" || o.status === "delivered" || o.status === "shipped").length;

  if (role !== "owner") {
    return (
      <PageLayout>
        <div className="max-w-6xl mx-auto px-8 py-8 text-center">
          <p className="text-muted-foreground text-lg">Only sellers can access this page.</p>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="max-w-6xl mx-auto px-8 py-8">
        <div className="mb-8 animate-reveal-up">
          <p className="text-sm text-muted-foreground">Manage incoming orders 📦</p>
          <h1 className="text-3xl font-display font-bold text-foreground mt-1" style={{ lineHeight: 1.1 }}>
            Customer Orders
          </h1>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Orders", value: orders.length.toString(), icon: ShoppingBag, color: "bg-primary/10 text-primary" },
            { label: "Pending", value: pendingCount.toString(), icon: Clock, color: "bg-koda-warm/10 text-koda-warm" },
            { label: "Accepted", value: acceptedCount.toString(), icon: CheckCircle2, color: "bg-koda-sky/10 text-koda-sky" },
            { label: "Revenue", value: `$${totalRevenue.toFixed(2)}`, icon: DollarSign, color: "bg-koda-rose/10 text-koda-rose" },
          ].map((stat, i) => (
            <div key={stat.label} className="glass-card-elevated rounded-2xl p-5 animate-reveal-up" style={{ animationDelay: `${i * 80}ms` }}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <p className="text-2xl font-display font-bold text-foreground">{stat.value}</p>
              <p className="text-sm text-muted-foreground mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Filter */}
        <div className="flex gap-2 mb-6 animate-reveal-up stagger-3 flex-wrap">
          {["all", "confirmed", "accepted", "shipped", "delivered", "rejected"].map(s => (
            <button key={s} onClick={() => setFilterStatus(s)}
              className={cn("px-4 py-2 rounded-xl text-sm font-medium transition-all active:scale-[0.98] capitalize",
                filterStatus === s ? "bg-primary text-primary-foreground shadow-md" : "bg-card/60 text-muted-foreground hover:bg-muted border border-border/30")}>
              {s === "all" ? "All Orders" : s}
              <span className={cn("ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full",
                filterStatus === s ? "bg-primary-foreground/20" : "bg-muted")}>
                {s === "all" ? orders.length : orders.filter(o => o.status === s).length}
              </span>
            </button>
          ))}
        </div>

        {/* Orders List */}
        <div className="space-y-4 animate-reveal-up stagger-4">
          {loading ? (
            <div className="text-center py-20"><p className="text-muted-foreground">Loading orders...</p></div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-20">
              <Package className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-lg text-muted-foreground">No orders yet</p>
              <p className="text-sm text-muted-foreground">Orders from customers will appear here</p>
            </div>
          ) : (
            filteredOrders.map((order) => {
              const isExpanded = expandedOrder === order.id;
              const config = statusConfig[order.status] || statusConfig.confirmed;

              return (
                <div key={order.id} className="glass-card-elevated rounded-2xl overflow-hidden hover:shadow-xl transition-shadow duration-300">
                  {/* Order Header */}
                  <div
                    className="flex items-center gap-4 p-5 cursor-pointer hover:bg-muted/30 transition-colors"
                    onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                  >
                    <div className="w-11 h-11 rounded-xl bg-koda-sage-light flex items-center justify-center">
                      <Package className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground flex items-center gap-2">
                        Order #{order.id.slice(0, 8)}
                        <span className={cn("text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full", config.color)}>
                          {order.status}
                        </span>
                      </p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                        <User className="w-3 h-3" /> {order.customer_name} · {order.items.length} item(s) · {new Date(order.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right flex items-center gap-4">
                      <span className="text-lg font-bold text-foreground">${order.total.toFixed(2)}</span>
                      {isExpanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className="border-t border-border/50 p-5 bg-muted/20 animate-reveal-up">
                      {/* Items */}
                      <div className="space-y-2 mb-4">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex items-center justify-between p-3 rounded-xl bg-background/50">
                            <div>
                              <p className="text-sm font-medium text-foreground">{item.item_name}</p>
                              <p className="text-xs text-muted-foreground capitalize">{item.item_type} · Qty: {item.quantity}</p>
                            </div>
                            <span className="text-sm font-semibold text-foreground">${(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>

                      {/* Status Timeline */}
                      <div className="flex items-center gap-2 mb-4 p-3 rounded-xl bg-background/30">
                        {["confirmed", "accepted", "shipped", "delivered"].map((step, i) => {
                          const stepOrder = ["confirmed", "accepted", "shipped", "delivered"];
                          const currentIdx = stepOrder.indexOf(order.status);
                          const stepIdx = i;
                          const isComplete = stepIdx <= currentIdx && order.status !== "rejected";
                          const isCurrent = stepIdx === currentIdx && order.status !== "rejected";
                          return (
                            <div key={step} className="flex items-center gap-2 flex-1">
                              <div className={cn(
                                "w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 transition-all",
                                isComplete ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
                                isCurrent && "ring-2 ring-primary/30 ring-offset-1"
                              )}>
                                {isComplete ? "✓" : i + 1}
                              </div>
                              <span className={cn("text-[10px] uppercase tracking-wider font-medium", isComplete ? "text-primary" : "text-muted-foreground")}>{step}</span>
                              {i < 3 && <div className={cn("flex-1 h-0.5 rounded-full", stepIdx < currentIdx ? "bg-primary" : "bg-muted")} />}
                            </div>
                          );
                        })}
                      </div>

                      {/* Actions */}
                      {order.status === "confirmed" && (
                        <div className="flex gap-3 pt-2">
                          <button
                            onClick={(e) => { e.stopPropagation(); handleUpdateStatus(order.id, "accepted"); }}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 active:scale-[0.98] transition-all"
                          >
                            <CheckCircle2 className="w-4 h-4" /> Accept Order
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleUpdateStatus(order.id, "rejected"); }}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-destructive/30 text-destructive text-sm font-medium hover:bg-destructive/10 active:scale-[0.98] transition-all"
                          >
                            <XCircle className="w-4 h-4" /> Reject Order
                          </button>
                        </div>
                      )}
                      {order.status === "accepted" && (
                        <div className="flex gap-3 pt-2">
                          <button
                            onClick={(e) => { e.stopPropagation(); handleUpdateStatus(order.id, "shipped"); }}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-koda-sky text-primary-foreground text-sm font-medium hover:bg-koda-sky/90 active:scale-[0.98] transition-all"
                          >
                            <Truck className="w-4 h-4" /> Mark as Shipped
                          </button>
                        </div>
                      )}
                      {order.status === "shipped" && (
                        <div className="flex gap-3 pt-2">
                          <button
                            onClick={(e) => { e.stopPropagation(); handleUpdateStatus(order.id, "delivered"); }}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 active:scale-[0.98] transition-all"
                          >
                            <CheckCircle2 className="w-4 h-4" /> Mark as Delivered
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </PageLayout>
  );
}
