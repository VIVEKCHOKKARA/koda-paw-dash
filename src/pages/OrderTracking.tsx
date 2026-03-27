import { useState, useEffect } from "react";
import { PageLayout } from "@/components/PageLayout";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import {
  Package, Clock, CheckCircle2, XCircle, ChevronDown, ChevronUp,
  Truck, ShoppingBag, MapPin, Calendar,
} from "lucide-react";
import { cn } from "@/lib/utils";

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
  items: OrderItem[];
}

const statusConfig: Record<string, { color: string; bgColor: string; icon: React.ComponentType<{ className?: string }>; label: string }> = {
  confirmed: { color: "text-koda-warm", bgColor: "bg-koda-warm/10", icon: Clock, label: "Order Placed" },
  accepted: { color: "text-primary", bgColor: "bg-primary/10", icon: CheckCircle2, label: "Accepted" },
  rejected: { color: "text-destructive", bgColor: "bg-destructive/10", icon: XCircle, label: "Rejected" },
  shipped: { color: "text-koda-sky", bgColor: "bg-koda-sky/10", icon: Truck, label: "Shipped" },
  delivered: { color: "text-primary", bgColor: "bg-primary/10", icon: CheckCircle2, label: "Delivered" },
};

const statusSteps = ["confirmed", "accepted", "shipped", "delivered"];

export default function OrderTracking() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  useEffect(() => {
    if (user) fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    if (!user) return;
    setLoading(true);

    const { data: myOrders } = await supabase
      .from("orders")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (!myOrders || myOrders.length === 0) { setOrders([]); setLoading(false); return; }

    const orderIds = myOrders.map(o => o.id);
    const { data: allItems } = await supabase
      .from("order_items")
      .select("*")
      .in("order_id", orderIds);

    const enriched: Order[] = myOrders.map(order => ({
      ...order,
      items: allItems?.filter(i => i.order_id === order.id) || [],
    }));

    setOrders(enriched);
    setLoading(false);
  };

  const getStepStatus = (orderStatus: string, step: string) => {
    if (orderStatus === "rejected") return step === "confirmed" ? "complete" : "rejected";
    const currentIdx = statusSteps.indexOf(orderStatus);
    const stepIdx = statusSteps.indexOf(step);
    if (stepIdx < currentIdx) return "complete";
    if (stepIdx === currentIdx) return "current";
    return "pending";
  };

  return (
    <PageLayout>
      <div className="max-w-6xl mx-auto px-8 py-8">
        <div className="mb-8 animate-reveal-up">
          <p className="text-sm text-muted-foreground">Track your purchases 📦</p>
          <h1 className="text-3xl font-display font-bold text-foreground mt-1" style={{ lineHeight: 1.1 }}>
            My Orders
          </h1>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Orders", value: orders.length, icon: ShoppingBag, color: "bg-primary/10 text-primary" },
            { label: "In Progress", value: orders.filter(o => o.status === "confirmed" || o.status === "accepted").length, icon: Clock, color: "bg-koda-warm/10 text-koda-warm" },
            { label: "Shipped", value: orders.filter(o => o.status === "shipped").length, icon: Truck, color: "bg-koda-sky/10 text-koda-sky" },
            { label: "Delivered", value: orders.filter(o => o.status === "delivered").length, icon: CheckCircle2, color: "bg-primary/10 text-primary" },
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

        {/* Orders */}
        <div className="space-y-4 animate-reveal-up stagger-3">
          {loading ? (
            <div className="text-center py-20"><p className="text-muted-foreground">Loading your orders...</p></div>
          ) : orders.length === 0 ? (
            <div className="text-center py-20">
              <ShoppingBag className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-lg text-muted-foreground">No orders yet</p>
              <p className="text-sm text-muted-foreground">Your purchases will appear here after checkout</p>
            </div>
          ) : (
            orders.map((order) => {
              const isExpanded = expandedOrder === order.id;
              const config = statusConfig[order.status] || statusConfig.confirmed;
              const StatusIcon = config.icon;

              return (
                <div key={order.id} className="glass-card-elevated rounded-2xl overflow-hidden hover:shadow-xl transition-shadow duration-300">
                  {/* Header */}
                  <div
                    className="flex items-center gap-4 p-5 cursor-pointer hover:bg-muted/30 transition-colors"
                    onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                  >
                    <div className={cn("w-11 h-11 rounded-xl flex items-center justify-center", config.bgColor)}>
                      <StatusIcon className={cn("w-5 h-5", config.color)} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground flex items-center gap-2">
                        Order #{order.id.slice(0, 8)}
                        <span className={cn("text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full", config.bgColor, config.color)}>
                          {config.label}
                        </span>
                      </p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                        <Calendar className="w-3 h-3" /> {new Date(order.created_at).toLocaleDateString()} · {order.items.length} item(s)
                      </p>
                    </div>
                    <div className="text-right flex items-center gap-4">
                      <span className="text-lg font-bold text-foreground">${order.total.toFixed(2)}</span>
                      {isExpanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                    </div>
                  </div>

                  {/* Expanded */}
                  {isExpanded && (
                    <div className="border-t border-border/50 p-5 bg-muted/20 animate-reveal-up">
                      {/* Status Timeline */}
                      <div className="mb-5">
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Order Status</h3>
                        <div className="flex items-center gap-1">
                          {statusSteps.map((step, i) => {
                            const stepStatus = getStepStatus(order.status, step);
                            const stepConf = statusConfig[step];
                            const StepIcon = stepConf.icon;
                            return (
                              <div key={step} className="flex items-center gap-1 flex-1">
                                <div className="flex flex-col items-center gap-1">
                                  <div className={cn(
                                    "w-8 h-8 rounded-full flex items-center justify-center transition-all",
                                    stepStatus === "complete" ? "bg-primary text-primary-foreground" :
                                    stepStatus === "current" ? "bg-primary/20 text-primary ring-2 ring-primary/30" :
                                    stepStatus === "rejected" ? "bg-destructive/10 text-destructive" :
                                    "bg-muted text-muted-foreground"
                                  )}>
                                    {stepStatus === "complete" ? (
                                      <CheckCircle2 className="w-4 h-4" />
                                    ) : stepStatus === "rejected" ? (
                                      <XCircle className="w-4 h-4" />
                                    ) : (
                                      <StepIcon className="w-4 h-4" />
                                    )}
                                  </div>
                                  <span className={cn(
                                    "text-[10px] uppercase tracking-wider font-medium text-center",
                                    stepStatus === "complete" || stepStatus === "current" ? "text-primary" :
                                    stepStatus === "rejected" ? "text-destructive" :
                                    "text-muted-foreground"
                                  )}>
                                    {step === "confirmed" ? "Placed" : step}
                                  </span>
                                </div>
                                {i < statusSteps.length - 1 && (
                                  <div className={cn(
                                    "flex-1 h-0.5 rounded-full mx-1 mb-4",
                                    stepStatus === "complete" ? "bg-primary" : "bg-muted"
                                  )} />
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Items */}
                      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Items</h3>
                      <div className="space-y-2 mb-2">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex items-center justify-between p-3 rounded-xl bg-background/50">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center">
                                <Package className="w-4 h-4 text-muted-foreground" />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-foreground">{item.item_name}</p>
                                <p className="text-xs text-muted-foreground capitalize">{item.item_type} · Qty: {item.quantity}</p>
                              </div>
                            </div>
                            <span className="text-sm font-semibold text-foreground">${(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>

                      <div className="flex justify-between text-sm pt-3 border-t border-border/30">
                        <span className="text-muted-foreground">Total</span>
                        <span className="font-bold text-foreground">${order.total.toFixed(2)}</span>
                      </div>
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
