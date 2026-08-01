create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'customer' check (role in ('customer', 'admin')),
  created_at timestamptz not null default timezone('utc', now())
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id) values (new.id)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  name text not null check (char_length(name) between 2 and 120),
  category text not null check (category in ('studs', 'grippers', 'socks', 'footballs')),
  description text not null check (char_length(description) between 20 and 1000),
  price numeric(10, 2) not null check (price >= 0),
  compare_at_price numeric(10, 2) check (compare_at_price is null or compare_at_price >= price),
  images text[] not null default '{}',
  sizes text[] not null default '{}',
  stock integer not null default 0 check (stock >= 0),
  featured boolean not null default false,
  badge text check (badge is null or char_length(badge) <= 40),
  active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

drop trigger if exists set_products_updated_at on public.products;
create trigger set_products_updated_at
  before update on public.products
  for each row execute procedure public.set_updated_at();

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references public.products(id) on delete set null,
  product_name text not null check (char_length(product_name) between 2 and 120),
  author text not null check (char_length(author) between 2 and 80),
  email text check (email is null or char_length(email) <= 254),
  rating integer not null check (rating between 1 and 5),
  title text not null check (char_length(title) between 2 and 100),
  body text not null check (char_length(body) between 20 and 1000),
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

drop trigger if exists set_reviews_updated_at on public.reviews;
create trigger set_reviews_updated_at
  before update on public.reviews
  for each row execute procedure public.set_updated_at();

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique default ('HS-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 10))),
  customer_name text not null,
  email text not null,
  phone text not null,
  address text not null,
  city text not null,
  postal_code text not null,
  notes text,
  total numeric(10, 2) not null default 0 check (total >= 0),
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'packed', 'shipped', 'cancelled')),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

drop trigger if exists set_orders_updated_at on public.orders;
create trigger set_orders_updated_at
  before update on public.orders
  for each row execute procedure public.set_updated_at();

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  product_name text not null,
  size text not null,
  quantity integer not null check (quantity between 1 and 20),
  unit_price numeric(10, 2) not null check (unit_price >= 0)
);

alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.reviews enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

drop policy if exists "profiles read own or admin" on public.profiles;
create policy "profiles read own or admin"
  on public.profiles for select
  using (id = auth.uid() or public.is_admin());

drop policy if exists "products public read" on public.products;
create policy "products public read"
  on public.products for select
  using (active or public.is_admin());

drop policy if exists "products admin insert" on public.products;
create policy "products admin insert"
  on public.products for insert
  with check (public.is_admin());

drop policy if exists "products admin update" on public.products;
create policy "products admin update"
  on public.products for update
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "products admin delete" on public.products;
create policy "products admin delete"
  on public.products for delete
  using (public.is_admin());

drop policy if exists "reviews public read approved" on public.reviews;
create policy "reviews public read approved"
  on public.reviews for select
  using (status = 'approved' or public.is_admin());

drop policy if exists "reviews public submit pending" on public.reviews;
create policy "reviews public submit pending"
  on public.reviews for insert
  with check (status = 'pending');

drop policy if exists "reviews admin update" on public.reviews;
create policy "reviews admin update"
  on public.reviews for update
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "reviews admin delete" on public.reviews;
create policy "reviews admin delete"
  on public.reviews for delete
  using (public.is_admin());

drop policy if exists "orders admin read" on public.orders;
create policy "orders admin read"
  on public.orders for select
  using (public.is_admin());

drop policy if exists "orders admin update" on public.orders;
create policy "orders admin update"
  on public.orders for update
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "order items admin read" on public.order_items;
create policy "order items admin read"
  on public.order_items for select
  using (public.is_admin());

create or replace function public.place_order(customer jsonb, items jsonb)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  new_order public.orders%rowtype;
  item jsonb;
  selected_product public.products%rowtype;
  requested_quantity integer;
  requested_size text;
  calculated_total numeric(10, 2) := 0;
begin
  if jsonb_typeof(customer) <> 'object' then
    raise exception 'Customer details are required.';
  end if;

  if jsonb_typeof(items) <> 'array' or jsonb_array_length(items) < 1 or jsonb_array_length(items) > 50 then
    raise exception 'The order must contain between 1 and 50 items.';
  end if;

  if char_length(trim(coalesce(customer->>'customerName', ''))) < 2
     or char_length(trim(coalesce(customer->>'email', ''))) < 5
     or char_length(trim(coalesce(customer->>'phone', ''))) < 5
     or char_length(trim(coalesce(customer->>'address', ''))) < 5
     or char_length(trim(coalesce(customer->>'city', ''))) < 2
     or char_length(trim(coalesce(customer->>'postalCode', ''))) < 2 then
    raise exception 'Complete all required customer fields.';
  end if;

  insert into public.orders (
    customer_name, email, phone, address, city, postal_code, notes
  ) values (
    left(trim(customer->>'customerName'), 140),
    left(lower(trim(customer->>'email')), 254),
    left(trim(customer->>'phone'), 80),
    left(trim(customer->>'address'), 240),
    left(trim(customer->>'city'), 120),
    left(trim(customer->>'postalCode'), 32),
    nullif(left(trim(coalesce(customer->>'notes', '')), 500), '')
  ) returning * into new_order;

  for item in select value from jsonb_array_elements(items)
  loop
    requested_quantity := coalesce((item->>'quantity')::integer, 0);
    requested_size := left(trim(coalesce(item->>'size', '')), 40);

    if requested_quantity < 1 or requested_quantity > 20 or requested_size = '' then
      raise exception 'Invalid order item.';
    end if;

    select * into selected_product
    from public.products
    where id = (item->>'product_id')::uuid and active = true
    for update;

    if not found then
      raise exception 'A selected product is unavailable.';
    end if;

    if not requested_size = any(selected_product.sizes) then
      raise exception 'A selected size is unavailable.';
    end if;

    if selected_product.stock < requested_quantity then
      raise exception 'Not enough stock for %.', selected_product.name;
    end if;

    insert into public.order_items (
      order_id, product_id, product_name, size, quantity, unit_price
    ) values (
      new_order.id,
      selected_product.id,
      selected_product.name,
      requested_size,
      requested_quantity,
      selected_product.price
    );

    update public.products
    set stock = stock - requested_quantity
    where id = selected_product.id;

    calculated_total := calculated_total + (selected_product.price * requested_quantity);
  end loop;

  update public.orders set total = calculated_total where id = new_order.id;
  return new_order.reference;
end;
$$;

revoke all on function public.place_order(jsonb, jsonb) from public;
grant execute on function public.place_order(jsonb, jsonb) to anon, authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'product-media',
  'product-media',
  true,
  10485760,
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "product media public read" on storage.objects;
create policy "product media public read"
  on storage.objects for select
  using (bucket_id = 'product-media');

drop policy if exists "product media admin insert" on storage.objects;
create policy "product media admin insert"
  on storage.objects for insert
  with check (bucket_id = 'product-media' and public.is_admin());

drop policy if exists "product media admin update" on storage.objects;
create policy "product media admin update"
  on storage.objects for update
  using (bucket_id = 'product-media' and public.is_admin())
  with check (bucket_id = 'product-media' and public.is_admin());

drop policy if exists "product media admin delete" on storage.objects;
create policy "product media admin delete"
  on storage.objects for delete
  using (bucket_id = 'product-media' and public.is_admin());
