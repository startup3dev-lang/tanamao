-- Categorias iniciais exibidas atualmente no frontend.
insert into service_categories (slug, name, icon_key, display_order) values
  ('eletricista', 'Eletricista', 'eletricista', 10),
  ('encanador', 'Encanador', 'encanador', 20),
  ('pedreiro', 'Pedreiro', 'pedreiro', 30),
  ('pintor', 'Pintor', 'pintor', 40),
  ('diarista', 'Diarista', 'diarista', 50),
  ('ar-condicionado', 'Ar-condicionado', 'arcondicionado', 60),
  ('jardineiro', 'Jardineiro', 'jardineiro', 70),
  ('montador-de-moveis', 'Montador de Móveis', 'montador', 80),
  ('chaveiro', 'Chaveiro', 'chaveiro', 90),
  ('marceneiro', 'Marceneiro', 'marceneiro', 100),
  ('gesseiro', 'Gesseiro', 'gesseiro', 110),
  ('servicos-gerais', 'Serviços Gerais', 'gerais', 120)
on conflict (slug) do update set
  name = excluded.name,
  icon_key = excluded.icon_key,
  display_order = excluded.display_order;

insert into services (category_id, slug, name, price_unit)
select id, slug, name, 'quote'
from service_categories
on conflict (slug) do update set name = excluded.name;

