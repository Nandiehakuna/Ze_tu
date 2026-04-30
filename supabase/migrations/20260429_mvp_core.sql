-- Core MVP schema hardening for Zetu

alter table if exists users
  add column if not exists telegram_chat_id text unique;

alter table if exists transactions
  add column if not exists status text default 'pending',
  add column if not exists voice_message_url text,
  add column if not exists voice_played boolean default false,
  add column if not exists delivered_at timestamptz,
  add column if not exists confirmed_at timestamptz;

create index if not exists idx_transactions_sender_created_at
  on transactions(sender_id, created_at desc);

create index if not exists idx_transactions_lightning_hash
  on transactions(lightning_hash);

insert into storage.buckets (id, name, public)
values ('voice-messages', 'voice-messages', true)
on conflict (id) do nothing;

-- Storage policy examples for authenticated reads/writes in MVP demo.
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'voice messages public read'
  ) then
    create policy "voice messages public read"
      on storage.objects
      for select
      using (bucket_id = 'voice-messages');
  end if;
end $$;
