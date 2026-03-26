
-- Pets table (marketplace listings)
CREATE TABLE public.pets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  species TEXT NOT NULL,
  breed TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('mammals', 'birds', 'aquatic', 'reptiles')),
  price NUMERIC NOT NULL DEFAULT 0,
  age TEXT NOT NULL DEFAULT '',
  image_url TEXT,
  certified BOOLEAN NOT NULL DEFAULT false,
  certificate_id TEXT,
  description TEXT NOT NULL DEFAULT '',
  temperament TEXT,
  health_status TEXT NOT NULL DEFAULT 'Good',
  vaccinated BOOLEAN NOT NULL DEFAULT false,
  is_available BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Food products table
CREATE TABLE public.food_products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  brand TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL CHECK (category IN ('mammals', 'birds', 'aquatic', 'reptiles')),
  animal_type TEXT NOT NULL DEFAULT '',
  price NUMERIC NOT NULL DEFAULT 0,
  weight TEXT,
  description TEXT NOT NULL DEFAULT '',
  tag TEXT,
  image_url TEXT,
  is_available BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Medicines table
CREATE TABLE public.medicines (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('mammals', 'birds', 'aquatic', 'reptiles')),
  animal_type TEXT NOT NULL DEFAULT '',
  price NUMERIC NOT NULL DEFAULT 0,
  dosage TEXT,
  description TEXT NOT NULL DEFAULT '',
  prescription_required BOOLEAN NOT NULL DEFAULT false,
  image_url TEXT,
  is_available BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Cart items
CREATE TABLE public.cart_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  item_type TEXT NOT NULL CHECK (item_type IN ('pet', 'food', 'medicine')),
  item_id UUID NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Orders
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  total NUMERIC NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.order_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  item_type TEXT NOT NULL CHECK (item_type IN ('pet', 'food', 'medicine')),
  item_id UUID NOT NULL,
  item_name TEXT NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  price NUMERIC NOT NULL DEFAULT 0
);

-- Appointments
CREATE TABLE public.appointments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  doctor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  pet_name TEXT NOT NULL,
  appointment_date DATE NOT NULL,
  appointment_time TEXT NOT NULL,
  visit_type TEXT NOT NULL DEFAULT 'General Checkup',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Vet locations (doctors add their clinic)
CREATE TABLE public.vet_locations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  doctor_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  clinic_name TEXT NOT NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  phone TEXT,
  address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Pet health records
CREATE TABLE public.pet_health_records (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  pet_id UUID REFERENCES public.pets(id) ON DELETE CASCADE NOT NULL,
  recorded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  health_score INT NOT NULL DEFAULT 80,
  weight_kg NUMERIC,
  notes TEXT,
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.pets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.food_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medicines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vet_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pet_health_records ENABLE ROW LEVEL SECURITY;

-- PETS: anyone can view, only owners can CRUD their own
CREATE POLICY "Anyone can view available pets" ON public.pets FOR SELECT TO authenticated USING (true);
CREATE POLICY "Owners can insert pets" ON public.pets FOR INSERT TO authenticated WITH CHECK (auth.uid() = owner_id AND public.has_role(auth.uid(), 'owner'));
CREATE POLICY "Owners can update own pets" ON public.pets FOR UPDATE TO authenticated USING (auth.uid() = owner_id AND public.has_role(auth.uid(), 'owner'));
CREATE POLICY "Owners can delete own pets" ON public.pets FOR DELETE TO authenticated USING (auth.uid() = owner_id AND public.has_role(auth.uid(), 'owner'));

-- FOOD: anyone can view, only owners can CRUD
CREATE POLICY "Anyone can view food" ON public.food_products FOR SELECT TO authenticated USING (true);
CREATE POLICY "Owners can insert food" ON public.food_products FOR INSERT TO authenticated WITH CHECK (auth.uid() = owner_id AND public.has_role(auth.uid(), 'owner'));
CREATE POLICY "Owners can update own food" ON public.food_products FOR UPDATE TO authenticated USING (auth.uid() = owner_id AND public.has_role(auth.uid(), 'owner'));
CREATE POLICY "Owners can delete own food" ON public.food_products FOR DELETE TO authenticated USING (auth.uid() = owner_id AND public.has_role(auth.uid(), 'owner'));

-- MEDICINES: anyone can view, only owners can CRUD
CREATE POLICY "Anyone can view medicines" ON public.medicines FOR SELECT TO authenticated USING (true);
CREATE POLICY "Owners can insert medicines" ON public.medicines FOR INSERT TO authenticated WITH CHECK (auth.uid() = owner_id AND public.has_role(auth.uid(), 'owner'));
CREATE POLICY "Owners can update own medicines" ON public.medicines FOR UPDATE TO authenticated USING (auth.uid() = owner_id AND public.has_role(auth.uid(), 'owner'));
CREATE POLICY "Owners can delete own medicines" ON public.medicines FOR DELETE TO authenticated USING (auth.uid() = owner_id AND public.has_role(auth.uid(), 'owner'));

-- CART: users manage own cart
CREATE POLICY "Users can view own cart" ON public.cart_items FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can add to cart" ON public.cart_items FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own cart" ON public.cart_items FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete from cart" ON public.cart_items FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- ORDERS: users view own orders
CREATE POLICY "Users can view own orders" ON public.orders FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can create orders" ON public.orders FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view own order items" ON public.order_items FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()));
CREATE POLICY "Users can insert order items" ON public.order_items FOR INSERT TO authenticated WITH CHECK (EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()));

-- APPOINTMENTS: customers create, doctors view their own + pending
CREATE POLICY "Customers can view own appointments" ON public.appointments FOR SELECT TO authenticated USING (auth.uid() = customer_id OR auth.uid() = doctor_id OR public.has_role(auth.uid(), 'doctor'));
CREATE POLICY "Customers can create appointments" ON public.appointments FOR INSERT TO authenticated WITH CHECK (auth.uid() = customer_id);
CREATE POLICY "Doctors can update appointments" ON public.appointments FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'doctor'));

-- VET LOCATIONS: doctors manage, everyone can view
CREATE POLICY "Anyone can view vet locations" ON public.vet_locations FOR SELECT TO authenticated USING (true);
CREATE POLICY "Doctors can insert locations" ON public.vet_locations FOR INSERT TO authenticated WITH CHECK (auth.uid() = doctor_id AND public.has_role(auth.uid(), 'doctor'));
CREATE POLICY "Doctors can update own locations" ON public.vet_locations FOR UPDATE TO authenticated USING (auth.uid() = doctor_id AND public.has_role(auth.uid(), 'doctor'));
CREATE POLICY "Doctors can delete own locations" ON public.vet_locations FOR DELETE TO authenticated USING (auth.uid() = doctor_id AND public.has_role(auth.uid(), 'doctor'));

-- HEALTH RECORDS: viewable by pet owner + doctors
CREATE POLICY "View health records" ON public.pet_health_records FOR SELECT TO authenticated USING (true);
CREATE POLICY "Insert health records" ON public.pet_health_records FOR INSERT TO authenticated WITH CHECK (auth.uid() = recorded_by);
