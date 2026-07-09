-- ============================================
-- Seed Data: 30 Products & 5 Training Plans
-- Run this in your Supabase SQL Editor to populate the store
-- ============================================

-- Disable RLS temporarily to ensure clean deletes and inserts
alter table public.product_images disable row level security;
alter table public.products disable row level security;
alter table public.categories disable row level security;
alter table public.brands disable row level security;
alter table public.training_plans disable row level security;

-- 1. Clear existing data
truncate table public.product_images cascade;
truncate table public.products cascade;
truncate table public.categories cascade;
truncate table public.brands cascade;
truncate table public.training_plans cascade;

-- 2. Insert Categories
insert into public.categories (id, name, slug, position, is_active) values
  ('c1000000-0000-0000-0000-000000000001', 'Protein', 'protein', 1, true),
  ('c1000000-0000-0000-0000-000000000002', 'Pre-Workout', 'pre-workout', 2, true),
  ('c1000000-0000-0000-0000-000000000003', 'Creatine', 'creatine', 3, true),
  ('c1000000-0000-0000-0000-000000000004', 'Amino Acids', 'amino-acids', 4, true),
  ('c1000000-0000-0000-0000-000000000005', 'Health & Wellness', 'health-wellness', 5, true),
  ('c1000000-0000-0000-0000-000000000006', 'Gear & Accessories', 'gear-accessories', 6, true);

-- 3. Insert Brands
insert into public.brands (id, name, slug, is_active) values
  ('b2000000-0000-0000-0000-000000000001', 'Optimum Nutrition', 'optimum-nutrition', true),
  ('b2000000-0000-0000-0000-000000000002', 'Cellucor', 'cellucor', true),
  ('b2000000-0000-0000-0000-000000000003', 'Gym Nation', 'gym-nation', true),
  ('b2000000-0000-0000-0000-000000000004', 'Rogue Fitness', 'rogue-fitness', true),
  ('b2000000-0000-0000-0000-000000000005', 'Transparent Labs', 'transparent-labs', true),
  ('b2000000-0000-0000-0000-000000000006', 'MuscleTech', 'muscletech', true),
  ('b2000000-0000-0000-0000-000000000007', 'Dymatize', 'dymatize', true);

-- 4. Insert Products (30 Items)
insert into public.products (
  id, name, slug, description, short_description, price, compare_at_price, 
  category_id, brand_id, flavor, servings, serving_size, ingredients, is_featured, is_active, sku, stock_quantity
) values
  -- Protein (6 items)
  (
    'a3000000-0000-0000-0000-000000000001', '100% Whey Gold Standard Isolate', 'whey-gold-standard-isolate',
    'Our high-quality whey protein isolate undergoes ultra-filtration processes to deliver clean, fast-digesting protein with minimal fats and carbohydrates. Excellent for post-workout muscle synthesis and recovery.',
    'Premium whey protein isolate, 25g protein per serving', 44.99, 54.99,
    'c1000000-0000-0000-0000-000000000001', 'b2000000-0000-0000-0000-000000000001',
    'Double Rich Chocolate', 30, '1 Scoop (31g)',
    'Whey Protein Isolate, Cocoa Powder, Natural Flavors, Soy Lecithin, Sucralose.',
    true, true, 'ON-WEY-ISO-01', 120
  ),
  (
    'a3000000-0000-0000-0000-000000000002', 'ISO100 Hydrolyzed Whey Protein', 'iso100-hydrolyzed-whey',
    'ISO100 is formulated using a multi-step purification process that preserves important muscle-building protein fractions while removing excess carbohydrates, fat, lactose, and cholesterol.',
    'Hydrolyzed whey isolate with rapid absorption', 49.99, 59.99,
    'c1000000-0000-0000-0000-000000000001', 'b2000000-0000-0000-0000-000000000007',
    'Gourmet Vanilla', 28, '1 Scoop (30g)',
    'Hydrolyzed Whey Protein Isolate, Whey Protein Isolate, Natural and Artificial Flavors, Salt, Soy Lecithin, Stevia.',
    false, true, 'DY-ISO-100-02', 85
  ),
  (
    'a3000000-0000-0000-0000-000000000003', 'Plant Gold Organic Vegan Protein', 'plant-gold-organic-vegan-protein',
    'A clean, plant-based protein powder delivering 20g of complete protein per serving from organic yellow peas, brown rice, and chia seeds. Naturally sweetened and easy on digestion.',
    '100% organic pea and brown rice protein blend', 36.99, 42.99,
    'c1000000-0000-0000-0000-000000000001', 'b2000000-0000-0000-0000-000000000005',
    'Chocolate Vegan Blend', 25, '1 Scoop (33g)',
    'Organic Pea Protein Isolate, Organic Rice Protein Concentrate, Organic Cocoa, Organic Stevia Extract.',
    false, true, 'TL-PLT-ORG-03', 90
  ),
  (
    'a3000000-0000-0000-0000-000000000004', 'Premium Casein Night Support', 'premium-casein-night-support',
    'Micellar casein is a slow-digesting protein that releases amino acids gradually over 7-8 hours. Ideal for consumption before sleep to prevent muscle breakdown during overnight fasting.',
    'Slow-release micellar casein for overnight recovery', 39.99, null,
    'c1000000-0000-0000-0000-000000000001', 'b2000000-0000-0000-0000-000000000001',
    'Chocolate Peanut Butter', 32, '1 Scoop (34g)',
    'Micellar Casein, Cocoa, Natural and Artificial Flavors, Salt, Lecithin, Acesulfame Potassium.',
    true, true, 'ON-CAS-NGT-04', 70
  ),
  (
    'a3000000-0000-0000-0000-000000000005', 'Hydrolyzed Beef Protein Isolate', 'hydrolyzed-beef-protein-isolate',
    'Derived from premium beef sources, this hydrolyzed isolate delivers 24g of pure protein with zero dairy, zero lactose, and zero sugar. Packed with naturally occurring BCAAs and creatine.',
    'Lactose-free, highly concentrated beef protein', 42.99, 49.99,
    'c1000000-0000-0000-0000-000000000001', 'b2000000-0000-0000-0000-000000000006',
    'Fudge Chocolate', 30, '1 Scoop (32g)',
    'Hydrolyzed Beef Protein Isolate, Cocoa, Medium Chain Triglycerides (MCT), Sucralose.',
    false, true, 'MT-BEEF-ISO-05', 60
  ),
  (
    'a3000000-0000-0000-0000-000000000006', 'Whey Protein Plus Blend', 'whey-protein-plus-blend',
    'Our signature blend offers three tiers of whey proteins to deliver immediate and sustained amino acid release. High solubility and rich, creamy textures make it a daily staple.',
    'Multi-source whey isolate, concentrate and hydrolysate', 32.99, 39.99,
    'c1000000-0000-0000-0000-000000000001', 'b2000000-0000-0000-0000-000000000003',
    'Strawberry Cream', 30, '1 Scoop (31g)',
    'Whey Protein Blend (Concentrate, Isolate, Hydrolysate), Natural Strawberry Flavor, Red Beet Powder, Sucralose.',
    true, true, 'GN-WEY-PLS-06', 150
  ),

  -- Pre-Workout (5 items)
  (
    'a3000000-0000-0000-0000-000000000007', 'C4 Original Explosive Energy', 'c4-original-explosive-energy',
    'C4 Original is the legendary pre-workout trusted by millions to take their workouts from ordinary to extraordinary. Contains 150mg of caffeine, Beta-Alanine, and Creatine Nitrate.',
    'Explosive energy and performance formula', 29.99, 34.99,
    'c1000000-0000-0000-0000-000000000002', 'b2000000-0000-0000-0000-000000000002',
    'Fruit Punch', 30, '1 Scoop (6g)',
    'CarnoSyn Beta-Alanine, Micronized Creatine Monohydrate, Arginine Alpha-Ketoglutarate, Caffeine Anhydrous (150mg).',
    true, true, 'CC-C4-ORG-07', 200
  ),
  (
    'a3000000-0000-0000-0000-000000000008', 'C4 Extreme High Stimulant', 'c4-extreme-high-stimulant',
    'Engineered for high-intensity training. C4 Extreme packs a heavy dose of caffeine alongside standard performance ingredients to push your focus, stamina, and energy past any limit.',
    '300mg caffeine pre-workout for advanced athletes', 39.99, 44.99,
    'c1000000-0000-0000-0000-000000000002', 'b2000000-0000-0000-0000-000000000002',
    'Icy Blue Razz', 30, '1 Scoop (9g)',
    'Beta-Alanine, Citrulline Malate, Caffeine Anhydrous (300mg), Tyrosine, Huperzine A.',
    false, true, 'CC-C4-EXT-08', 110
  ),
  (
    'a3000000-0000-0000-0000-000000000009', 'Stim-Free Bulk Pre-Workout', 'stim-free-bulk-pre-workout',
    'Perfect for late-evening workouts or caffeine-sensitive athletes. Features high concentrations of L-Citrulline, Beta-Alanine, and Nootropics for maximum nitric oxide production and mental clarity.',
    'Zero caffeine, high focus and skin-splitting pumps', 42.99, null,
    'c1000000-0000-0000-0000-000000000002', 'b2000000-0000-0000-0000-000000000005',
    'Sour Peach', 30, '1 Scoop (14g)',
    'L-Citrulline Malate 2:1 (6000mg), Beta-Alanine (3200mg), Betaine Anhydrous (2500mg), Taurine.',
    true, true, 'TL-STM-FREE-09', 95
  ),
  (
    'a3000000-0000-0000-0000-000000000010', 'VaporX Nitric Oxide Pump', 'vaporx-nitric-oxide-pump',
    'Designed strictly for hemodilution and vascular fullness. Formulated with GlycerPump and Nitrosigine to keep your muscles saturated with oxygen-rich blood during high-volume sessions.',
    'Ultimate vaso-dilation pump enhancer', 34.99, 39.99,
    'c1000000-0000-0000-0000-000000000002', 'b2000000-0000-0000-0000-000000000006',
    'Blueberry Lemonade', 25, '1 Scoop (11g)',
    'L-Citrulline, Glycerol Powder, Nitrosigine, Pine Bark Extract.',
    false, true, 'MT-VAP-PMP-10', 80
  ),
  (
    'a3000000-0000-0000-0000-000000000011', 'Gym Nation Ignition Pre-Workout', 'gym-nation-ignition-pre-workout',
    'Our signature in-house pre-workout. Perfectly balanced with 200mg of caffeine, L-Tyrosine for tunnel-vision focus, and L-Citrulline for robust muscle pumps without any crash.',
    'Balanced energy, focus, and pump formula', 31.99, 39.99,
    'c1000000-0000-0000-0000-000000000002', 'b2000000-0000-0000-0000-000000000003',
    'Sour Green Apple', 30, '1 Scoop (10g)',
    'L-Citrulline (4000mg), Beta-Alanine (2000mg), L-Tyrosine, Caffeine Anhydrous (200mg), Pink Himalayan Salt.',
    true, true, 'GN-IGN-PRE-11', 140
  ),

  -- Creatine (4 items)
  (
    'a3000000-0000-0000-0000-000000000012', 'Micronized Creatine Monohydrate', 'micronized-creatine-monohydrate',
    'Creatine monohydrate is the most researched sports supplement in the world. Our micronized formula dissolves instantly in liquid and supports power output, strength, and cellular hydration.',
    '100% pure micronized creatine monohydrate', 24.99, 29.99,
    'c1000000-0000-0000-0000-000000000003', 'b2000000-0000-0000-0000-000000000001',
    'Unflavored', 60, '1 Scoop (5g)',
    'Pure Micronized Creatine Monohydrate (5g).',
    true, true, 'ON-CRE-MON-12', 250
  ),
  (
    'a3000000-0000-0000-0000-000000000013', 'Creatine HCL Strength Builder', 'creatine-hcl-strength-builder',
    'Creatine hydrochloride offers superior solubility and bioavailability, reducing the required serving size and eliminating bloating or digestive discomfort associated with loading phases.',
    'High solubility creatine hydrochloride', 28.99, null,
    'c1000000-0000-0000-0000-000000000003', 'b2000000-0000-0000-0000-000000000005',
    'Blue Raspberry', 60, '1 Scoop (2g)',
    'Creatine Hydrochloride (HCL) (2g), Natural Blue Raspberry Flavor, Stevia.',
    false, true, 'TL-CRE-HCL-13', 105
  ),
  (
    'a3000000-0000-0000-0000-000000000014', 'Cell-Tech Creatine Formula', 'cell-tech-creatine-formula',
    'A highly engineered creatine formula combining creatine monohydrate and creatine HCl with quick-digesting carbohydrates to trigger insulin spikes for faster muscle uptake.',
    'Creatine delivery system with carbs and aminos', 36.99, 42.99,
    'c1000000-0000-0000-0000-000000000003', 'b2000000-0000-0000-0000-000000000006',
    'Orange Rush', 28, '1 Scoop (49g)',
    'Multi-Stage Carb Blend, Creatine Monohydrate, Creatine HCl, Taurine, L-Alanine, Alpha Lipoic Acid.',
    true, true, 'MT-CEL-TEC-14', 90
  ),
  (
    'a3000000-0000-0000-0000-000000000015', 'Gym Nation Tri-Creatine Blend', 'gym-nation-tri-creatine-blend',
    'Combining three distinct forms of creatine to maximize absorption rates across various digestive conditions. Zero bloating, maximum strength gains, and easy blending.',
    'Monohydrate, HCL, and Pyruvate hybrid', 26.99, 32.99,
    'c1000000-0000-0000-0000-000000000003', 'b2000000-0000-0000-0000-000000000003',
    'Unflavored', 50, '1 Scoop (5g)',
    'Creatine Monohydrate, Creatine Hydrochloride, Creatine Pyruvate.',
    false, true, 'GN-TRI-CRE-15', 130
  ),

  -- Amino Acids (5 items)
  (
    'a3000000-0000-0000-0000-000000000016', 'Amino Energy Essential BCAAs', 'amino-energy-essential-bcaas',
    'A perfect blend of essential amino acids for recovery coupled with green coffee and green tea extracts for clean morning focus or mid-day energy boosts.',
    'Essential amino acids with natural caffeine energy', 27.99, 32.99,
    'c1000000-0000-0000-0000-000000000004', 'b2000000-0000-0000-0000-000000000001',
    'Watermelon Splash', 30, '2 Scoops (9g)',
    'Amino Acid Blend (Taurine, L-Glutamine, L-Arginine, BCAAs), Energy Blend (Caffeine 100mg from Coffee & Green Tea).',
    true, true, 'ON-AMN-NRG-16', 180
  ),
  (
    'a3000000-0000-0000-0000-000000000017', 'EAA Hydration Recovery Complex', 'eaa-hydration-recovery-complex',
    'Features all 9 essential amino acids necessary for lean muscle maintenance and growth. Enhanced with raw coconut water powder and pink Himalayan salt to optimize intra-workout hydration.',
    'Full spectrum EAAs with coconut water hydration', 34.99, 39.99,
    'c1000000-0000-0000-0000-000000000004', 'b2000000-0000-0000-0000-000000000005',
    'Pineapple Coconut', 30, '1 Scoop (12g)',
    'Full Spectrum EAA Blend (8g), Coconut Water Powder (1000mg), Electrolyte Blend.',
    false, true, 'TL-EAA-REC-17', 85
  ),
  (
    'a3000000-0000-0000-0000-000000000018', 'Dymatize All 9 Amino Recovery', 'dymatize-all-9-amino-recovery',
    'An advanced recovery formula supplying all 9 essential amino acids to accelerate protein synthesis and prevent catabolism during long, exhausting workouts.',
    'Full spectrum EAAs with 7.2g of BCAAs', 29.99, null,
    'c1000000-0000-0000-0000-000000000004', 'b2000000-0000-0000-0000-000000000007',
    'Jolly Blueberry', 30, '1 Scoop (15g)',
    'Essential Amino Acid Blend, Citric Acid, Natural and Artificial Flavors, Sucralose.',
    false, true, 'DY-ALL-9-18', 95
  ),
  (
    'a3000000-0000-0000-0000-000000000019', 'Pure L-Glutamine Recovery Powder', 'pure-l-glutamine-recovery-powder',
    'Glutamine is the most abundant amino acid in the body and plays an essential role in muscle recovery, immune system health, and gut integrity. Completely unflavored to blend into any shake.',
    '100% pure micronized L-Glutamine', 19.99, 24.99,
    'c1000000-0000-0000-0000-000000000004', 'b2000000-0000-0000-0000-000000000006',
    'Unflavored', 60, '1 Scoop (5g)',
    'Pure Micronized L-Glutamine (5g).',
    false, true, 'MT-GLT-PURE-19', 140
  ),
  (
    'a3000000-0000-0000-0000-000000000020', 'Gym Nation BCAA 2:1:1 Fuel', 'gym-nation-bcaa-2-1-1-fuel',
    'Formulated using the clinically-proven 2:1:1 ratio of Leucine, Isoleucine, and Valine. Minimizes muscle soreness and speeds up recovery without any synthetic coloring.',
    'Classic BCAA ratio with recovery stimulants', 22.99, 29.99,
    'c1000000-0000-0000-0000-000000000004', 'b2000000-0000-0000-0000-000000000003',
    'Mango Tango', 30, '1 Scoop (8g)',
    'L-Leucine (2500mg), L-Isoleucine (1250mg), L-Valine (1250mg), Citric Acid, Stevia.',
    true, true, 'GN-BCA-211-20', 160
  ),

  -- Health & Wellness (4 items)
  (
    'a3000000-0000-0000-0000-000000000021', 'Complete Athlete Multivitamin', 'complete-athlete-multivitamin',
    'A comprehensive daily multi formulated with key vitamins, macro-minerals, and antioxidants to bridge nutritional gaps and support immune wellness under intensive athletic stress.',
    'High potency vitamins & minerals for active profiles', 18.99, 22.99,
    'c1000000-0000-0000-0000-000000000005', 'b2000000-0000-0000-0000-000000000001',
    'Tablet Form', 60, '2 Tablets',
    'Vitamin A, C, D, E, B6, B12, Calcium, Zinc, Magnesium, Green Tea Extract.',
    true, true, 'ON-MVI-ATH-21', 110
  ),
  (
    'a3000000-0000-0000-0000-000000000022', 'Ultra-Pure Omega-3 Fish Oil', 'ultra-pure-omega-3-fish-oil',
    'Extracted from deep-sea fish, our molecularly distilled softgels supply concentrated quantities of EPA and DHA to aid joint mobility, lower inflammation, and support cardiovascular health.',
    'Triple-strength EPA/DHA joint and heart health', 21.99, 26.99,
    'c1000000-0000-0000-0000-000000000005', 'b2000000-0000-0000-0000-000000000005',
    'Softgel (No Fishy Aftertaste)', 60, '2 Softgels',
    'Purified Deep Sea Fish Oil, Gelatin, Glycerin, Purified Water, Natural Lemon Flavor.',
    false, true, 'TL-FSH-OIL-22', 95
  ),
  (
    'a3000000-0000-0000-0000-000000000023', 'Joint Shield Support Formula', 'joint-shield-support-formula',
    'Designed for lifters and endurance athletes experiencing repetitive mechanical impact. Protects cartilage, lubricates joint cavities, and speeds up connective tissue repair.',
    'Glucosamine, Chondroitin, and MSM complex', 24.99, null,
    'c1000000-0000-0000-0000-000000000005', 'b2000000-0000-0000-0000-000000000003',
    'Capsule Form', 30, '3 Capsules',
    'Glucosamine Sulfate (1500mg), Chondroitin Sulfate, MSM, Boswellia Serrata.',
    false, true, 'GN-JNT-SHD-23', 85
  ),
  (
    'a3000000-0000-0000-0000-000000000024', 'Sleep & Recovery Rest Aid', 'sleep-recovery-rest-aid',
    'Optimizes sleep architecture to ensure deep REM phases where muscle building hormones are naturally released. Promotes relaxation, eases stress, and ensures you wake up fully refreshed.',
    'Melatonin, L-Theanine, and Zinc calming aid', 22.99, 27.99,
    'c1000000-0000-0000-0000-000000000005', 'b2000000-0000-0000-0000-000000000003',
    'Capsule Form', 30, '2 Capsules',
    'ZMA (Zinc, Magnesium, Vitamin B6), L-Theanine, Chamomile Extract, Melatonin (3mg).',
    true, true, 'GN-SLP-REC-24', 120
  ),

  -- Gear & Accessories (6 items)
  (
    'a3000000-0000-0000-0000-000000000025', 'Rogue Leather Weightlifting Belt', 'rogue-leather-weightlifting-belt',
    'Crafted from vegetable-tanned leather, this 10mm thick belt provides uniform lumbar abdominal pressure for heavy squats, deadlifts, and overhead presses. Heavy-buckle steel pin setup.',
    'Heavy-duty 4-inch leather powerlifting belt', 85.00, 95.00,
    'c1000000-0000-0000-0000-000000000006', 'b2000000-0000-0000-0000-000000000004',
    'Black Leather', null, '1 Belt',
    '100% Genuine Sole Leather, Steel Buckle, Reinforced Stitching.',
    true, true, 'RF-BELT-LTH-25', 50
  ),
  (
    'a3000000-0000-0000-0000-000000000026', 'Rogue Ohio Barbell Grips', 'rogue-ohio-barbell-grips',
    'Adapter wraps that slip onto standard barbells, dumbbells, and cable pull-downs to increase diameter. Recruits more muscle fibers in the forearms and hands, helping to build crushing grip strength.',
    'Thick bar rubber training adapters', 25.00, null,
    'c1000000-0000-0000-0000-000000000006', 'b2000000-0000-0000-0000-000000000004',
    'Red Silicone', null, '1 Pair',
    'High-density vulcanized rubber compound.',
    false, true, 'RF-GRPS-OHIO-26', 150
  ),
  (
    'a3000000-0000-0000-0000-000000000027', 'Gym Nation Classic Steel Shaker', 'gym-nation-classic-steel-shaker',
    'Double-wall vacuum insulation keeps your drinks ice-cold for up to 24 hours. Leak-proof lid with integrated loop handle and a internal metallic spring whisk for lump-free protein shakes.',
    'Insulated 24oz stainless steel shaker bottle', 24.99, 29.99,
    'c1000000-0000-0000-0000-000000000006', 'b2000000-0000-0000-0000-000000000003',
    'Matte Black Steel', null, '1 Bottle',
    'Food-grade 18/8 Stainless Steel, BPA-free Plastic Lid.',
    true, true, 'GN-SHK-STL-27', 300
  ),
  (
    'a3000000-0000-0000-0000-000000000028', 'Heavy Duty Wrist Wraps', 'heavy-duty-wrist-wraps',
    'Delivers maximum wrist stabilization for bench press, shoulder presses, and overhead lifting. Features elastic thumb loops and heavy-duty velcro fasteners to guarantee wraps remain snug under tension.',
    '18-inch support wraps for heavy presses', 14.99, 19.99,
    'c1000000-0000-0000-0000-000000000006', 'b2000000-0000-0000-0000-000000000003',
    'Orange/Black Elastic', null, '1 Pair',
    'Polyester and Elastic Blend, Steel Loop Hook.',
    false, true, 'GN-WRST-WRP-28', 250
  ),
  (
    'a3000000-0000-0000-0000-000000000029', 'Padded Lifting Straps', 'padded-lifting-straps',
    'Cotton canvas straps that wrap securely around any knurled bar to eliminate grip fatigue during heavy deadlifts, rows, and shrugs. Built-in neoprene pad protects wrists from abrasions.',
    'Neoprene padded cotton deadlift straps', 12.99, 15.99,
    'c1000000-0000-0000-0000-000000000006', 'b2000000-0000-0000-0000-000000000003',
    'Black Canvas', null, '1 Pair',
    'Woven Cotton Webbing, Neoprene Padding.',
    false, true, 'GN-LFT-STRP-29', 180
  ),
  (
    'a3000000-0000-0000-0000-000000000030', 'Gym Nation Resistance Bands Set', 'gym-nation-resistance-bands-set',
    'Full loop resistance bands ranging from light (15 lbs) to extra-heavy (125 lbs) resistance. Perfect for pull-up assists, speed training, flexibility work, and general active warmups.',
    '5 heavy-duty latex loop exercise bands', 29.99, 39.99,
    'c1000000-0000-0000-0000-000000000006', 'b2000000-0000-0000-0000-000000000003',
    '5 Band Loop Bundle', null, '5 Bands',
    '100% Natural Malaysian Latex.',
    true, true, 'GN-RST-BND-30', 160
  );

-- 5. Insert Product Images (matching the 30 products)
insert into public.product_images (product_id, url, alt_text, position, is_primary) values
  ('a3000000-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1579758629938-03607ccdbaba?q=80&w=800&auto=format&fit=crop', 'Whey Protein Isolate', 1, true),
  ('a3000000-0000-0000-0000-000000000002', 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?q=80&w=800&auto=format&fit=crop', 'ISO100 Protein', 1, true),
  ('a3000000-0000-0000-0000-000000000003', 'https://images.unsplash.com/photo-1543362906-acfc16c67564?q=80&w=800&auto=format&fit=crop', 'Vegan Protein', 1, true),
  ('a3000000-0000-0000-0000-000000000004', 'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?q=80&w=800&auto=format&fit=crop', 'Micellar Casein', 1, true),
  ('a3000000-0000-0000-0000-000000000005', 'https://images.unsplash.com/photo-1608408821367-6a78b545fcf3?q=80&w=800&auto=format&fit=crop', 'Beef Protein Isolate', 1, true),
  ('a3000000-0000-0000-0000-000000000006', 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?q=80&w=800&auto=format&fit=crop', 'Whey Plus Blend', 1, true),
  
  ('a3000000-0000-0000-0000-000000000007', 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=800&auto=format&fit=crop', 'C4 Original', 1, true),
  ('a3000000-0000-0000-0000-000000000008', 'https://images.unsplash.com/photo-1546483875-ad9014c88eba?q=80&w=800&auto=format&fit=crop', 'C4 Extreme', 1, true),
  ('a3000000-0000-0000-0000-000000000009', 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=800&auto=format&fit=crop', 'Stim-Free Bulk', 1, true),
  ('a3000000-0000-0000-0000-000000000010', 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=800&auto=format&fit=crop', 'VaporX Pump', 1, true),
  ('a3000000-0000-0000-0000-000000000011', 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=800&auto=format&fit=crop', 'GN Ignition Pre', 1, true),
  
  ('a3000000-0000-0000-0000-000000000012', 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?q=80&w=800&auto=format&fit=crop', 'Creatine Monohydrate', 1, true),
  ('a3000000-0000-0000-0000-000000000013', 'https://images.unsplash.com/photo-1611078489935-0cb964de46d6?q=80&w=800&auto=format&fit=crop', 'Creatine HCL', 1, true),
  ('a3000000-0000-0000-0000-000000000014', 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=800&auto=format&fit=crop', 'Cell-Tech Creatine', 1, true),
  ('a3000000-0000-0000-0000-000000000015', 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?q=80&w=800&auto=format&fit=crop', 'GN Tri-Creatine', 1, true),
  
  ('a3000000-0000-0000-0000-000000000016', 'https://images.unsplash.com/photo-1574672280600-4accfa5b6f98?q=80&w=800&auto=format&fit=crop', 'Amino Energy', 1, true),
  ('a3000000-0000-0000-0000-000000000017', 'https://images.unsplash.com/photo-1610970881699-44a5587caaec?q=80&w=800&auto=format&fit=crop', 'EAA Hydration', 1, true),
  ('a3000000-0000-0000-0000-000000000018', 'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?q=80&w=800&auto=format&fit=crop', 'All 9 Amino', 1, true),
  ('a3000000-0000-0000-0000-000000000019', 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?q=80&w=800&auto=format&fit=crop', 'L-Glutamine Powder', 1, true),
  ('a3000000-0000-0000-0000-000000000020', 'https://images.unsplash.com/photo-1534723452862-4c874018d66d?q=80&w=800&auto=format&fit=crop', 'GN BCAA Fuel', 1, true),
  
  ('a3000000-0000-0000-0000-000000000021', 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=800&auto=format&fit=crop', 'Athlete Multivitamin', 1, true),
  ('a3000000-0000-0000-0000-000000000022', 'https://images.unsplash.com/photo-1611926653458-09294b3142bf?q=80&w=800&auto=format&fit=crop', 'Omega-3 Fish Oil', 1, true),
  ('a3000000-0000-0000-0000-000000000023', 'https://images.unsplash.com/photo-1550572017-edd951b55104?q=80&w=800&auto=format&fit=crop', 'Joint Shield', 1, true),
  ('a3000000-0000-0000-0000-000000000024', 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?q=80&w=800&auto=format&fit=crop', 'Sleep & Rest Aid', 1, true),
  
  ('a3000000-0000-0000-0000-000000000025', 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=800&auto=format&fit=crop', 'Weightlifting Belt', 1, true),
  ('a3000000-0000-0000-0000-000000000026', 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?q=80&w=800&auto=format&fit=crop', 'Barbell Grips', 1, true),
  ('a3000000-0000-0000-0000-000000000027', 'https://images.unsplash.com/photo-1579758629938-03607ccdbaba?q=80&w=800&auto=format&fit=crop', 'Steel Shaker Bottle', 1, true),
  ('a3000000-0000-0000-0000-000000000028', 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=800&auto=format&fit=crop', 'Heavy Wrist Wraps', 1, true),
  ('a3000000-0000-0000-0000-000000000029', 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=800&auto=format&fit=crop', 'Padded Lifting Straps', 1, true),
  ('a3000000-0000-0000-0000-000000000030', 'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=800&auto=format&fit=crop', 'Resistance Bands Set', 1, true);

-- 6. Insert Training Plans (5 Items)
insert into public.training_plans (
  id, name, slug, description, short_description, price, compare_at_price, 
  duration_weeks, difficulty, goal, category, equipment_needed, workout_schedule, nutrition_recommendations, image_url, is_featured, is_active, creator_id
) values
  (
    'e4000000-0000-0000-0000-000000000001', 'Hypertrophy 101', 'hypertrophy-101',
    'This 12-week program focuses on progressive overload, varied rep ranges, and strategic exercise selection to maximize muscle growth. Designed for intermediate lifters looking to break through plateaus.',
    'Build serious muscle mass over 12 weeks with this science-based hypertrophy program.',
    49.99, 99.99, 12, 'intermediate', 'Build Muscle', 'Bodybuilding',
    array['Barbell', 'Dumbbells', 'Cables', 'Machines'], '[]'::jsonb, 'High-protein diet, moderate carbs, calorie surplus.', 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800&auto=format&fit=crop',
    true, true, (select id from auth.users limit 1)
  ),
  (
    'e4000000-0000-0000-0000-000000000002', 'Shred 60', 'shred-60',
    'Get shredded for summer. This program combines heavy compound lifts to maintain muscle with metabolic conditioning to torch fat, optimized for rapid body recomposition.',
    'A high-intensity 60-day fat loss protocol combining lifting and conditioning.',
    39.99, 79.99, 8, 'advanced', 'Lose Fat', 'Conditioning',
    array['Dumbbells', 'Kettlebells', 'Bodyweight'], '[]'::jsonb, 'Caloric deficit, high-protein intake, low-sugar diet.', 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=800&auto=format&fit=crop',
    true, true, (select id from auth.users limit 1)
  ),
  (
    'e4000000-0000-0000-0000-000000000003', 'Strength Foundations', 'strength-foundations',
    'Learn proper form for the squat, bench press, and deadlift while building foundational strength that will serve you for a lifetime of lifting. Simple progressive overload cycles.',
    'Perfect for beginners. Master the big three lifts and build a base of raw strength.',
    29.99, null, 6, 'beginner', 'Increase Strength', 'Powerlifting',
    array['Barbell', 'Squat Rack', 'Bench'], '[]'::jsonb, 'Balanced macro distribution, maintenance calories.', 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=800&auto=format&fit=crop',
    false, true, (select id from auth.users limit 1)
  ),
  (
    'e4000000-0000-0000-0000-000000000004', 'Athletic Performance & Speed', 'athletic-performance-speed',
    'Designed for field and court sport athletes. Focuses on explosive power, plyometrics, directional changes, and high-intensity interval conditioning to expand your active athletic limits.',
    'Unleash your inner athlete. Speed, power, agility, and stamina protocol.',
    44.99, 59.99, 10, 'advanced', 'Athletic Performance', 'Athletics',
    array['Bands', 'Med Balls', 'Agility Ladder', 'Dumbbells'], '[]'::jsonb, 'High carb for energy replenishment, lean proteins.', 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?q=80&w=800&auto=format&fit=crop',
    true, true, (select id from auth.users limit 1)
  ),
  (
    'e4000000-0000-0000-0000-000000000005', 'General Fitness Blueprint', 'general-fitness-blueprint',
    'A great program to build healthy habits, combine moderate cardiovascular training with basic resistance training, build energy levels, and improve joint health. Perfect for long-term consistency.',
    'Balanced workouts for overall fitness, health, and cardiovascular wellness.',
    19.99, 39.99, 8, 'beginner', 'General Fitness', 'Wellness',
    array['Dumbbells', 'Bodyweight'], '[]'::jsonb, 'Whole foods based nutrition, plenty of hydration.', 'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=800&auto=format&fit=crop',
    false, true, (select id from auth.users limit 1)
  );

-- Re-enable RLS
alter table public.product_images enable row level security;
alter table public.products enable row level security;
alter table public.categories enable row level security;
alter table public.brands enable row level security;
alter table public.training_plans enable row level security;
