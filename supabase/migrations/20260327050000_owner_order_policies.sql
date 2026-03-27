-- Allow owners to view ALL orders (not just their own)
CREATE POLICY "Owners can view all orders"
  ON public.orders FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'owner'));

-- Allow owners to update order status
CREATE POLICY "Owners can update orders"
  ON public.orders FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'owner'));

-- Allow owners to view all order items
CREATE POLICY "Owners can view all order items"
  ON public.order_items FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'owner'));

-- Expand the status constraint to include 'accepted' and 'rejected'
ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS orders_status_check;
ALTER TABLE public.orders ADD CONSTRAINT orders_status_check
  CHECK (status IN ('pending', 'confirmed', 'accepted', 'rejected', 'shipped', 'delivered', 'cancelled'));
