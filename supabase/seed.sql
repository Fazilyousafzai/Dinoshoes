insert into public.products (
  id, slug, name, category, description, price, compare_at_price, images, sizes, stock, featured, badge
) values
  ('8a7aaf6f-8360-40b0-b715-d37325ee7721', 'velocity-fg-cobalt', 'Velocity FG Cobalt', 'studs', 'A close-to-ball knit upper with a stable molded plate for firm natural ground.', 128, 148, array['/images/category-studs.png', '/images/hero-boot.png'], array['6', '7', '8', '9', '10', '11'], 18, true, 'New drop'),
  ('5f8b9a5f-f153-4e9d-85a4-657dbfc48ea8', 'lock-in-grip-sleeves', 'Lock-In Grip Sleeves', 'grippers', 'Technical compression sleeves with mapped silicone traction for less movement inside the boot.', 24, null, array['/images/category-grippers.png'], array['S/M', 'L/XL'], 34, true, 'Training essential'),
  ('fb5c6d34-9675-42a2-9825-1f9863233582', 'matchday-pro-socks', 'Matchday Pro Socks', 'socks', 'Knee-high ribbed match socks with cushioned impact zones and a locked-in arch.', 20, null, array['/images/category-socks.png'], array['S', 'M', 'L'], 41, true, '2 colours'),
  ('075efaf9-e6d7-47d8-93ea-d01c40a9bd93', 'crossline-match-ball', 'Crossline Match Ball', 'footballs', 'A thermally bonded match ball with a textured casing for a clean, predictable flight.', 46, null, array['/images/category-footballs.png'], array['5'], 22, true, 'Match ready')
on conflict (id) do nothing;
