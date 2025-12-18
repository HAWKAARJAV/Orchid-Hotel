-- Orders + daily token system (sequential per day, concurrency-safe)

-- 1) Orders table
create table if not exists public.orders (
  id uuid default gen_random_uuid() primary key,
  customer_name text,
  customer_phone text,
  total_amount numeric(10,2) not null,
  payment_status text not null check (payment_status in ('PENDING','SUCCESS','FAILED','COD')),
  token_number int,
  order_date date default current_date,
  created_at timestamptz default now()
);

-- Safety: ensure existing orders table has required columns
alter table public.orders
  add column if not exists order_date date default current_date,
  add column if not exists token_number int;
-- Ensure payment_status allows COD
do $$
begin
  alter table public.orders drop constraint if exists orders_payment_status_check;
  alter table public.orders
    add constraint orders_payment_status_check
    check (payment_status in ('PENDING','SUCCESS','FAILED','COD'));
exception when others then null;
end $$;

-- 2) Daily counter table
create table if not exists public.daily_token_counter (
  order_date date primary key,
  last_token int not null
);

-- Safety: drop trigger and function before recreation (handles signature changes)
drop trigger if exists trigger_generate_token on public.orders;
drop function if exists public.generate_order_token();

-- 3) Token generator function
create or replace function public.generate_order_token()
returns trigger as $$
declare
  new_token int;
begin
  -- Only assign when token is missing and payment is successful or COD
  if new.token_number is null and (new.payment_status = 'SUCCESS' or new.payment_status = 'COD') then
    insert into public.daily_token_counter (order_date, last_token)
    values (new.order_date, 1)
    on conflict (order_date)
    do update set last_token = public.daily_token_counter.last_token + 1
    returning last_token into new_token;

    new.token_number := new_token;
  end if;

  return new;
end;
$$ language plpgsql;

-- 4) Trigger (handles insert and payment status updates)
create trigger trigger_generate_token
before insert or update on public.orders
for each row
execute function public.generate_order_token();

-- 5) Helpful indexes
do $$
begin
  create index if not exists idx_orders_order_date on public.orders(order_date);
  create index if not exists idx_orders_payment_status on public.orders(payment_status);
end $$;
