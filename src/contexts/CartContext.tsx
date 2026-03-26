import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

export interface CartItem {
  id: string;
  item_type: "pet" | "food" | "medicine";
  item_id: string;
  quantity: number;
  name?: string;
  price?: number;
}

interface CartContextType {
  items: CartItem[];
  loading: boolean;
  addToCart: (itemType: "pet" | "food" | "medicine", itemId: string, name: string, price: number, quantity?: number) => Promise<void>;
  removeFromCart: (id: string) => Promise<void>;
  updateQuantity: (id: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  checkout: () => Promise<void>;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [itemDetails, setItemDetails] = useState<Map<string, { name: string; price: number }>>(new Map());

  const fetchCart = async () => {
    if (!user) { setItems([]); return; }
    setLoading(true);
    const { data } = await supabase.from("cart_items").select("*").eq("user_id", user.id);
    if (data) {
      // Fetch item details for names/prices
      const details = new Map<string, { name: string; price: number }>();
      for (const item of data) {
        const table = item.item_type === "pet" ? "pets" : item.item_type === "food" ? "food_products" : "medicines";
        const { data: detail } = await supabase.from(table).select("name, price").eq("id", item.item_id).single();
        if (detail) details.set(item.item_id, { name: detail.name, price: Number(detail.price) });
      }
      setItemDetails(details);
      setItems(data.map((d: any) => ({
        id: d.id,
        item_type: d.item_type,
        item_id: d.item_id,
        quantity: d.quantity,
        name: details.get(d.item_id)?.name,
        price: details.get(d.item_id)?.price,
      })));
    }
    setLoading(false);
  };

  useEffect(() => { fetchCart(); }, [user]);

  const addToCart = async (itemType: "pet" | "food" | "medicine", itemId: string, name: string, price: number, quantity = 1) => {
    if (!user) return;
    const existing = items.find(i => i.item_id === itemId && i.item_type === itemType);
    if (existing) {
      await supabase.from("cart_items").update({ quantity: existing.quantity + quantity }).eq("id", existing.id);
    } else {
      await supabase.from("cart_items").insert({ user_id: user.id, item_type: itemType, item_id: itemId, quantity });
    }
    toast({ title: "Added to cart 🛒", description: `${name} added` });
    await fetchCart();
  };

  const removeFromCart = async (id: string) => {
    await supabase.from("cart_items").delete().eq("id", id);
    await fetchCart();
  };

  const updateQuantity = async (id: string, quantity: number) => {
    if (quantity <= 0) return removeFromCart(id);
    await supabase.from("cart_items").update({ quantity }).eq("id", id);
    await fetchCart();
  };

  const clearCart = async () => {
    if (!user) return;
    await supabase.from("cart_items").delete().eq("user_id", user.id);
    setItems([]);
  };

  const checkout = async () => {
    if (!user || items.length === 0) return;
    const total = items.reduce((sum, i) => sum + (i.price || 0) * i.quantity, 0);
    const { data: order } = await supabase.from("orders").insert({ user_id: user.id, total, status: "confirmed" }).select().single();
    if (order) {
      const orderItems = items.map(i => ({
        order_id: order.id,
        item_type: i.item_type,
        item_id: i.item_id,
        item_name: i.name || "Item",
        quantity: i.quantity,
        price: i.price || 0,
      }));
      await supabase.from("order_items").insert(orderItems);
      await clearCart();
      toast({ title: "Order placed! 🎉", description: `Total: $${total.toFixed(2)}` });
    }
  };

  const totalItems = items.reduce((s, i) => s + i.quantity, 0);
  const totalPrice = items.reduce((s, i) => s + (i.price || 0) * i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, loading, addToCart, removeFromCart, updateQuantity, clearCart, checkout, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
