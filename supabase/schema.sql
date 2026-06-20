create table responses (
  id uuid primary key default gen_random_uuid(),
  created_at timestamp with time zone default now(),
  respondent_id text unique,

  region text,
  is_beijing_school text,

  dorm_size text,
  dorm_type text,

  boundary_methods text[],
  main_boundary text,
  boundary_metaphor_action text,

  intrusion_types text[],
  worst_intrusion text,
  failure_moment text,
  response_behavior text,

  psychological_effects text[],
  responsibility text,
  boundary_metaphor_object text,

  result_type text,
  user_agent text
);

grant usage on schema public to anon;
grant insert, select on table responses to anon;
