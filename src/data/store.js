export const PRODUCTS = [
  {
    id: 1, name: 'Minimal Leather Bag', price: 189, compareAtPrice: 220, tag: 'New',
    category: 'Living', color: '#2a2218',
    description: 'Hand-stitched full-grain leather tote with solid brass hardware. Vegetable-tanned leather develops a rich patina with use. Interior pocket with zipper closure.',
    colors: ['#2a2218', '#5c3d2e', '#1a1a1a'], sizes: null, stock: 12, rating: 4.8,
    reviews: [
      { id: 1, author: 'Sarah C.', rating: 5, date: '2026-07-01', text: "The leather quality is exceptional. It's already developing a beautiful patina after just two weeks of daily use.", verified: true },
      { id: 2, author: 'Marcus W.', rating: 4, date: '2026-06-28', text: 'Well-made bag with great attention to detail. Slightly smaller than expected but love it nonetheless.', verified: true },
      { id: 3, author: 'Elena R.', rating: 5, date: '2026-06-15', text: 'This is my second purchase from Atelier. The craftsmanship is truly remarkable and worth every penny.', verified: true },
    ],
  },
  {
    id: 2, name: 'Ceramic Vase Set', price: 74, compareAtPrice: null, tag: null,
    category: 'Living', color: '#1e2228',
    description: 'Set of three hand-thrown ceramic vases in matte finishes. Each piece is unique with subtle variations in glaze. Ranges from 15cm to 25cm tall.',
    colors: ['#e8e0d4', '#2c2c2c', '#8b7355'], sizes: null, stock: 18, rating: 4.7,
    reviews: [
      { id: 4, author: 'James P.', rating: 5, date: '2026-07-05', text: 'These vases are stunning. Each one is slightly different which adds to the charm. Perfect for dried arrangements.', verified: true },
      { id: 5, author: 'Anika P.', rating: 4, date: '2026-06-20', text: 'Beautiful set. The matte finish is exactly what I was looking for. Packaging was also excellent.', verified: true },
    ],
  },
  {
    id: 3, name: 'Linen Throw Blanket', price: 129, compareAtPrice: 155, tag: 'Sale',
    category: 'Bedroom', color: '#22201a',
    description: 'Stonewashed Belgian linen in a generous 150x200cm size. Pre-washed for softness out of the box. Gets softer with every wash. 100% flax linen.',
    colors: ['#d4c8b8', '#8c8278', '#f5f0eb'], sizes: null, stock: 24, rating: 4.9,
    reviews: [
      { id: 6, author: 'Tom F.', rating: 5, date: '2026-07-08', text: 'Incredibly soft and the perfect size. Already ordered another one for the guest room.', verified: true },
      { id: 7, author: 'Sarah C.', rating: 4, date: '2026-06-22', text: "Great quality linen. It gets softer with every wash as promised.", verified: true },
    ],
  },
  {
    id: 4, name: 'Handmade Candle Trio', price: 56, compareAtPrice: null, tag: null,
    category: 'Living', color: '#1a1e22',
    description: 'Three soy wax candles in hand-poured concrete vessels. Cedar & Sage, Bergamot & Fig, and Vanilla & Tonka. 40 hour burn time each.',
    colors: null, sizes: null, stock: 30, rating: 4.6,
    reviews: [
      { id: 8, author: 'Lily W.', rating: 5, date: '2026-07-03', text: 'The scent is divine and the concrete vessels look amazing on my coffee table.', verified: true },
    ],
  },
  {
    id: 5, name: 'Walnut Desk Organizer', price: 95, compareAtPrice: null, tag: 'New',
    category: 'Office', color: '#201a18',
    description: 'Solid American walnut organizer with precision-cut compartments for pens, cards, phone, and small accessories. Food-safe oil finish. 30cm x 12cm x 8cm.',
    colors: ['#5c3d2e', '#3d2b1f'], sizes: null, stock: 8, rating: 4.9,
    reviews: [
      { id: 9, author: 'Marcus W.', rating: 5, date: '2026-07-10', text: 'Finally an organizer that looks as good as it functions. The walnut grain is beautiful.', verified: true },
      { id: 10, author: 'Elena R.', rating: 4, date: '2026-06-30', text: 'Solid craftsmanship. Fits perfectly on my desk.', verified: true },
    ],
  },
  {
    id: 6, name: 'Merino Wool Scarf', price: 68, compareAtPrice: null, tag: null,
    category: 'Bedroom', color: '#181a1e',
    description: 'Extra-fine 180gsm merino wool scarf in a timeless herringbone weave. 180cm x 35cm. Naturally temperature-regulating and itch-free.',
    colors: ['#2c2c2c', '#6b5b4b', '#b8a99a'], sizes: null, stock: 22, rating: 4.5,
    reviews: [],
  },
  {
    id: 7, name: 'Stoneware Mug Set', price: 42, compareAtPrice: null, tag: null,
    category: 'Kitchen', color: '#221e1a',
    description: 'Set of four hand-glazed stoneware mugs. 350ml capacity. Dishwasher and microwave safe. Each mug has a unique glaze pattern.',
    colors: ['#e8e0d4', '#4a6741', '#8b6f47'], sizes: null, stock: 35, rating: 4.8,
    reviews: [
      { id: 11, author: 'Anika P.', rating: 5, date: '2026-07-02', text: 'These mugs have the perfect weight and the glaze is gorgeous.', verified: true },
    ],
  },
  {
    id: 8, name: 'Canvas Tote', price: 64, compareAtPrice: 78, tag: 'Sale',
    category: 'Living', color: '#1a1c20',
    description: 'Heavy-duty 18oz canvas tote with reinforced leather handles and inner zip pocket. Waxed cotton bottom for water resistance. 40cm x 35cm x 15cm.',
    colors: ['#d4c8b8', '#2c2c2c'], sizes: null, stock: 0, rating: 4.4,
    reviews: [],
  },
  {
    id: 9, name: 'Oak Cutting Board', price: 88, compareAtPrice: null, tag: 'New',
    category: 'Kitchen', color: '#1e1a16',
    description: 'End-grain white oak cutting board with deep juice groove. 40cm x 30cm x 3cm. Naturally antimicrobial. Hand-oiled with food-safe mineral oil.',
    colors: ['#c8a97e', '#8b7355'], sizes: null, stock: 15, rating: 4.9,
    reviews: [
      { id: 12, author: 'James P.', rating: 5, date: '2026-07-09', text: 'The end-grain construction is top notch. Juice groove is deep and functional.', verified: true },
    ],
  },
  {
    id: 10, name: 'Brass Desk Lamp', price: 156, compareAtPrice: null, tag: null,
    category: 'Office', color: '#1a1818',
    description: 'Adjustable solid brass desk lamp with natural linen shade. Warm 2700K LED bulb included. Weighted base for stability. 45cm height.',
    colors: ['#c8a97e', '#1a1a1a'], sizes: null, stock: 6, rating: 4.7,
    reviews: [
      { id: 13, author: 'Tom F.', rating: 4, date: '2026-06-25', text: 'Elegant design with great build quality. The warm light is perfect for late night work.', verified: true },
    ],
  },
  {
    id: 11, name: 'Woven Basket Set', price: 78, compareAtPrice: null, tag: null,
    category: 'Living', color: '#201c18',
    description: 'Set of three hand-woven seagrass baskets in graduated sizes. Small: 20cm, Medium: 28cm, Large: 35cm diameter.',
    colors: ['#b8a99a', '#8b7355'], sizes: null, stock: 20, rating: 4.6,
    reviews: [],
  },
  {
    id: 12, name: 'Japanese Teapot', price: 62, compareAtPrice: 75, tag: 'Sale',
    category: 'Kitchen', color: '#1a1e1c',
    description: 'Cast iron tetsubin with enamel interior and stainless steel infuser. Includes two matching cups. 800ml capacity.',
    colors: ['#1a1a1a', '#5c3d2e'], sizes: null, stock: 10, rating: 4.8,
    reviews: [
      { id: 14, author: 'Lily W.', rating: 5, date: '2026-07-06', text: 'A true work of art. The cast iron retains heat beautifully.', verified: true },
      { id: 15, author: 'Sarah C.', rating: 5, date: '2026-06-18', text: 'Worth every penny. The matching cups are a lovely touch.', verified: true },
    ],
  },
  {
    id: 13, name: 'Handwoven Throw Pillow', price: 48, compareAtPrice: null, tag: null,
    category: 'Living', color: '#1c1a18',
    description: 'Handwoven cotton throw pillow with textured diamond pattern. 45cm x 45cm. Includes hypoallergenic insert. Dry clean recommended.',
    colors: ['#e8e0d4', '#4a6741', '#c8a97e'], sizes: null, stock: 28, rating: 4.5,
    reviews: [],
  },
  {
    id: 14, name: 'Marble Bookends', price: 72, compareAtPrice: null, tag: 'New',
    category: 'Office', color: '#1a1c1e',
    description: 'Pair of solid Carrara marble bookends with brushed brass accents. 18cm x 12cm x 8cm each. Each pair has unique natural veining.',
    colors: ['#e8e0d4', '#1a1a1a'], sizes: null, stock: 9, rating: 4.7,
    reviews: [],
  },
  {
    id: 15, name: 'Copper Pour-Over Set', price: 94, compareAtPrice: null, tag: null,
    category: 'Kitchen', color: '#1e1816',
    description: 'Precision copper pour-over coffee dripper with borosilicate glass carafe. Makes 2-4 cups. Copper develops natural patina over time.',
    colors: ['#c85a3e', '#1a1a1a'], sizes: null, stock: 14, rating: 4.8,
    reviews: [],
  },
  {
    id: 16, name: 'Velvet Eye Mask', price: 32, compareAtPrice: null, tag: null,
    category: 'Bedroom', color: '#18161a',
    description: 'Silk-lined velvet sleep mask with adjustable elastic strap. Blocks 99% of light. Comes in a linen travel pouch. 20cm x 8cm.',
    colors: ['#2c2c2c', '#5c3d2e', '#8b6f47'], sizes: null, stock: 40, rating: 4.3,
    reviews: [],
  },
]

export const CATEGORIES = [
  { id: 1, name: 'Living', count: 7, color: '#1a1510' },
  { id: 2, name: 'Bedroom', count: 3, color: '#101518' },
  { id: 3, name: 'Kitchen', count: 4, color: '#181a14' },
  { id: 4, name: 'Office', count: 3, color: '#1a1418' },
]

export const ORDERS = [
  {
    id: 'ORD-001', date: '2026-07-12', total: 318, status: 'delivered',
    customer: { name: 'Sarah Chen', email: 'sarah@email.com' },
    items: [
      { name: 'Minimal Leather Bag', price: 189, quantity: 1 },
      { name: 'Ceramic Vase Set', price: 74, quantity: 1 },
    ],
    shippingAddress: '142 Oak Lane, Portland, OR 97201',
    paymentMethod: '**** 4242',
  },
  {
    id: 'ORD-002', date: '2026-07-11', total: 156, status: 'shipped',
    customer: { name: 'Marcus Webb', email: 'marcus@email.com' },
    items: [
      { name: 'Brass Desk Lamp', price: 156, quantity: 1 },
    ],
    shippingAddress: '88 Pine St, Seattle, WA 98101',
    paymentMethod: '**** 8372',
  },
  {
    id: 'ORD-003', date: '2026-07-11', total: 243, status: 'processing',
    customer: { name: 'Elena Rodriguez', email: 'elena@email.com' },
    items: [
      { name: 'Walnut Desk Organizer', price: 95, quantity: 1 },
      { name: 'Linen Throw Blanket', price: 129, quantity: 1 },
    ],
    shippingAddress: '230 Elm Ave, San Francisco, CA 94102',
    paymentMethod: '**** 5591',
  },
  {
    id: 'ORD-004', date: '2026-07-10', total: 89, status: 'delivered',
    customer: { name: 'James Park', email: 'james@email.com' },
    items: [
      { name: 'Oak Cutting Board', price: 88, quantity: 1 },
    ],
    shippingAddress: '45 Maple Dr, Austin, TX 78701',
    paymentMethod: '**** 7734',
  },
  {
    id: 'ORD-005', date: '2026-07-10', total: 425, status: 'delivered',
    customer: { name: 'Anika Patel', email: 'anika@email.com' },
    items: [
      { name: 'Stoneware Mug Set', price: 42, quantity: 2 },
      { name: 'Japanese Teapot', price: 62, quantity: 1 },
      { name: 'Canvas Tote', price: 64, quantity: 1 },
    ],
    shippingAddress: '77 Birch Rd, Chicago, IL 60601',
    paymentMethod: '**** 3028',
  },
  {
    id: 'ORD-006', date: '2026-07-09', total: 124, status: 'shipped',
    customer: { name: 'Tom Fischer', email: 'tom@email.com' },
    items: [
      { name: 'Handmade Candle Trio', price: 56, quantity: 1 },
      { name: 'Merino Wool Scarf', price: 68, quantity: 1 },
    ],
    shippingAddress: '12 Cedar Ct, Denver, CO 80202',
    paymentMethod: '**** 6619',
  },
  {
    id: 'ORD-007', date: '2026-07-09', total: 32, status: 'cancelled',
    customer: { name: 'Lily Wang', email: 'lily@email.com' },
    items: [
      { name: 'Velvet Eye Mask', price: 32, quantity: 1 },
    ],
    shippingAddress: '90 Walnut St, Boston, MA 02101',
    paymentMethod: '**** 1147',
  },
  {
    id: 'ORD-008', date: '2026-07-08', total: 298, status: 'delivered',
    customer: { name: 'Omar Hassan', email: 'omar@email.com' },
    items: [
      { name: 'Copper Pour-Over Set', price: 94, quantity: 1 },
      { name: 'Oak Cutting Board', price: 88, quantity: 1 },
    ],
    shippingAddress: '310 Spruce Ave, Nashville, TN 37201',
    paymentMethod: '**** 9983',
  },
]

export const CUSTOMERS = [
  { id: 1, name: 'Sarah Chen', email: 'sarah@email.com', orders: 5, spent: 892, joined: '2025-11-03' },
  { id: 2, name: 'Marcus Webb', email: 'marcus@email.com', orders: 3, spent: 445, joined: '2026-01-15' },
  { id: 3, name: 'Elena Rodriguez', email: 'elena@email.com', orders: 8, spent: 1240, joined: '2025-08-22' },
  { id: 4, name: 'James Park', email: 'james@email.com', orders: 2, spent: 178, joined: '2026-03-01' },
  { id: 5, name: 'Anika Patel', email: 'anika@email.com', orders: 12, spent: 2150, joined: '2025-06-10' },
  { id: 6, name: 'Tom Fischer', email: 'tom@email.com', orders: 1, spent: 124, joined: '2026-07-01' },
  { id: 7, name: 'Lily Wang', email: 'lily@email.com', orders: 4, spent: 567, joined: '2025-09-18' },
  { id: 8, name: 'Omar Hassan', email: 'omar@email.com', orders: 6, spent: 1089, joined: '2025-07-05' },
]
