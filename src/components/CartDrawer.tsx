import { useCart } from "@/contexts/CartContext";
import { X, ShoppingCart, Plus, Minus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function CartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { items, removeFromCart, updateQuantity, checkout, totalItems, totalPrice, loading } = useCart();

  return (
    <>
      {open && <div className="fixed inset-0 z-40 bg-background/60 backdrop-blur-sm animate-fade-in" onClick={onClose} />}
      <div className={cn(
        "fixed top-0 right-0 h-full w-96 z-50 bg-card border-l border-border shadow-2xl transition-transform duration-300 flex flex-col",
        open ? "translate-x-0" : "translate-x-full"
      )}>
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h2 className="text-lg font-display font-semibold text-foreground flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-primary" /> Cart ({totalItems})
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-muted"><X className="w-5 h-5" /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {items.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-12">Your cart is empty</p>
          ) : items.map((item) => (
            <div key={item.id} className="flex items-center gap-3 p-3 rounded-xl bg-muted/40">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{item.name || "Item"}</p>
                <p className="text-xs text-muted-foreground capitalize">{item.item_type} · ${(item.price || 0).toFixed(2)}</p>
              </div>
              <div className="flex items-center gap-1 border border-border rounded-lg">
                <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-7 h-7 flex items-center justify-center hover:bg-muted">
                  <Minus className="w-3 h-3" />
                </button>
                <span className="w-7 h-7 flex items-center justify-center text-xs font-medium">{item.quantity}</span>
                <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-7 h-7 flex items-center justify-center hover:bg-muted">
                  <Plus className="w-3 h-3" />
                </button>
              </div>
              <button onClick={() => removeFromCart(item.id)} className="p-1.5 rounded-lg hover:bg-destructive/10">
                <Trash2 className="w-4 h-4 text-muted-foreground hover:text-destructive" />
              </button>
            </div>
          ))}
        </div>

        {items.length > 0 && (
          <div className="p-5 border-t border-border space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total</span>
              <span className="font-bold text-foreground">${totalPrice.toFixed(2)}</span>
            </div>
            <button onClick={checkout} disabled={loading} className="w-full py-3 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 active:scale-[0.98] transition-all shadow-md">
              Checkout
            </button>
          </div>
        )}
      </div>
    </>
  );
}
