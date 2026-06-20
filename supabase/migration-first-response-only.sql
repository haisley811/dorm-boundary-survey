alter table responses
add column if not exists respondent_id text;

create unique index if not exists responses_respondent_id_unique
on responses (respondent_id)
where respondent_id is not null;

grant usage on schema public to anon;
grant insert, select on table responses to anon;
