-- ============================================================
-- DRITHI AGRO — Replace Categories with new structure
-- Run this in MySQL to update categories
-- ============================================================
USE drithi_agro;

-- Disable FK checks temporarily
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE categories;
SET FOREIGN_KEY_CHECKS = 1;

-- ── PARENT CATEGORIES ──
INSERT INTO categories (id, name, slug, icon, parent_id, sort_order) VALUES
(1,  'Irrigation',          'irrigation',          '💧', NULL, 1),
(2,  'Gardening',           'gardening',           '🌿', NULL, 2),
(3,  'Cattle & Bird Care',  'cattle-bird-care',    '🐄', NULL, 3);

-- ── IRRIGATION SUB-CATEGORIES ──
INSERT INTO categories (name, slug, icon, parent_id, sort_order) VALUES
('Sprinkler',                    'sprinkler',                    '🌧️',  1, 1),
('Drip Irrigation Accessories',  'drip-irrigation-accessories',  '💦',  1, 2),
('Pipe & Fitting',               'pipe-fitting',                 '🔩',  1, 3),
('Drip Irrigation Kit',          'drip-irrigation-kit',          '🪣',  1, 4),
('Rain Pipe',                    'rain-pipe',                    '🌂',  1, 5);

-- ── GARDENING SUB-CATEGORIES ──
INSERT INTO categories (name, slug, icon, parent_id, sort_order) VALUES
('Tools',                        'gardening-tools',              '🔧',  2, 1),
('Spray Pumps',                  'spray-pumps',                  '🧴',  2, 2),
('Lawn Mowers',                  'lawn-mowers',                  '🌱',  2, 3),
('Pebbles',                      'pebbles',                      '🪨',  2, 4),
('Accessories',                  'gardening-accessories',        '🎒',  2, 5),
('Seeds',                        'gardening-seeds',              '🌰',  2, 6),
('Fertilizer',                   'gardening-fertilizer',         '🧪',  2, 7),
('Pesticides',                   'gardening-pesticides',         '🛡️',  2, 8),
('Garden Shade Net',             'garden-shade-net',             '🕸️',  2, 9),
('Coco Peat',                    'coco-peat',                    '🥥',  2, 10),
('Water Compost Management',     'water-compost-management',     '♻️',  2, 11),
('Gardening Kit',                'gardening-kit',                '🧰',  2, 12),
('Grow Bag',                     'grow-bag',                     '🛍️',  2, 13),
('De Oiled Cake',                'de-oiled-cake',                '🌾',  2, 14),
('Flower Seeds',                 'flower-seeds',                 '🌸',  2, 15),
('Fertilizer Blend',             'fertilizer-blend',             '⚗️',  2, 16),
('Transplanting / Repotting Mat','transplanting-repotting-mat',  '🪴',  2, 17);

-- ── CATTLE & BIRD CARE SUB-CATEGORIES ──
INSERT INTO categories (name, slug, icon, parent_id, sort_order) VALUES
('Fodder Seed',                  'fodder-seed',                  '🌿',  3, 1),
('Mineral Mixture',              'mineral-mixture',              '💊',  3, 2),
('Bird Food',                    'bird-food',                    '🐦',  3, 3),
('Mosquito Net',                 'mosquito-net',                 '🦟',  3, 4),
('Aqua Care',                    'aqua-care',                    '🐟',  3, 5),
('Aquaculture Feed Additives',   'aquaculture-feed-additives',   '🦐',  3, 6),
('Goat and Sheep Care',          'goat-sheep-care',              '🐑',  3, 7),
('Poultry Feed Supplements',     'poultry-feed-supplements',     '🐔',  3, 8),
('Swine Supplement',             'swine-supplement',             '🐷',  3, 9),
('Silage Bag (Murghas Bag)',     'silage-bag',                   '🎒',  3, 10),
('Animal Health Supplements',    'animal-health-supplements',    '💉',  3, 11);
