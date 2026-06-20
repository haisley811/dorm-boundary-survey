alter table responses
add column if not exists respondent_id text;

alter table responses add column if not exists region text;
alter table responses add column if not exists is_beijing_school text;
alter table responses add column if not exists dorm_size text;
alter table responses add column if not exists dorm_type text;
alter table responses add column if not exists boundary_methods text[];
alter table responses add column if not exists main_boundary text;
alter table responses add column if not exists boundary_metaphor_action text;
alter table responses add column if not exists intrusion_types text[];
alter table responses add column if not exists worst_intrusion text;
alter table responses add column if not exists failure_moment text;
alter table responses add column if not exists response_behavior text;
alter table responses add column if not exists psychological_effects text[];
alter table responses add column if not exists responsibility text;
alter table responses add column if not exists boundary_metaphor_object text;
alter table responses add column if not exists result_type text;
alter table responses add column if not exists user_agent text;

create unique index if not exists responses_respondent_id_unique
on responses (respondent_id)
where respondent_id is not null;

grant usage on schema public to anon;
grant insert, select on table responses to anon;

alter table responses enable row level security;

drop policy if exists responses_insert_anon on responses;
create policy responses_insert_anon
on responses
for insert
to anon
with check (true);

drop policy if exists responses_select_anon on responses;
create policy responses_select_anon
on responses
for select
to anon
using (true);
