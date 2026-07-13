export const PRODUCTS = [
  { id: 1, name: 'Minimal Leather Bag', price: 189, tag: 'New', color: '#2a2218', category: 'Living', desc: 'Hand-stitched full-grain leather bag with brass hardware. Ages beautifully over time.' },
  { id: 2, name: 'Ceramic Vase Set', price: 74, tag: null, color: '#1e2228', category: 'Living', desc: 'Set of three hand-thrown ceramic vases in matte finishes. Each piece is unique.' },
  { id: 3, name: 'Linen Throw Blanket', price: 129, tag: 'Sale', color: '#22201a', category: 'Bedroom', desc: 'Stonewashed Belgian linen in a generous 150x200cm size. Softens with every wash.' },
  { id: 4, name: 'Handmade Candle Trio', price: 56, tag: null, color: '#1a1e22', category: 'Living', desc: 'Three soy wax candles in concrete vessels. 40 hour burn time each.' },
  { id: 5, name: 'Walnut Desk Organizer', price: 95, tag: 'New', color: '#201a18', category: 'Office', desc: 'Solid walnut organizer with compartments for pens, cards, and small items.' },
  { id: 6, name: 'Merino Wool Scarf', price: 68, tag: null, color: '#181a1e', category: 'Bedroom', desc: 'Extra-fine merino wool scarf in a timeless herringbone weave.' },
  { id: 7, name: 'Stoneware Mug Set', price: 42, tag: null, color: '#221e1a', category: 'Kitchen', desc: 'Set of four hand-glazed stoneware mugs. Dishwasher and microwave safe.' },
  { id: 8, name: 'Canvas Tote', price: 64, tag: 'Sale', color: '#1a1c20', category: 'Living', desc: 'Heavy-duty 18oz canvas tote with reinforced handles and inner pocket.' },
  { id: 9, name: 'Oak Cutting Board', price: 88, tag: 'New', color: '#1e1a16', category: 'Kitchen', desc: 'End-grain white oak cutting board with juice groove. Naturally antimicrobial.' },
  { id: 10, name: 'Brass Desk Lamp', price: 156, tag: null, color: '#1a1818', category: 'Office', desc: 'Adjustable brass desk lamp with linen shade. Warm 2700K LED included.' },
  { id: 11, name: 'Woven Basket Set', price: 78, tag: null, color: '#201c18', category: 'Living', desc: 'Set of three seagrass baskets in graduated sizes. Perfect for storage.' },
  { id: 12, name: 'Japanese Teapot', price: 62, tag: 'Sale', color: '#1a1e1c', category: 'Kitchen', desc: 'Cast iron tetsubin with enamel interior. Includes two matching cups.' },
]

export const CATEGORIES = [
  { id: 1, name: 'Living', count: 24, color: '#1a1510' },
  { id: 2, name: 'Bedroom', count: 18, color: '#101518' },
  { id: 3, name: 'Kitchen', count: 31, color: '#181a14' },
  { id: 4, name: 'Office', count: 12, color: '#1a1418' },
]

export const ORDERS = [
  { id: 'ORD-001', customer: 'Sarah Chen', date: '2026-07-12', total: 318, status: 'Delivered', items: 2 },
  { id: 'ORD-002', customer: 'Marcus Webb', date: '2026-07-11', total: 156, status: 'Shipped', items: 1 },
  { id: 'ORD-003', customer: 'Elena Rodriguez', date: '2026-07-11', total: 243, status: 'Processing', items: 3 },
  { id: 'ORD-004', customer: 'James Park', date: '2026-07-10', total: 89, status: 'Delivered', items: 1 },
  { id: 'ORD-005', customer: 'Anika Patel', date: '2026-07-10', total: 425, status: 'Delivered', items: 4 },
  { id: 'ORD-006', customer: 'Tom Fischer', date: '2026-07-09', total: 124, status: 'Shipped', items: 2 },
  { id: 'ORD-007', customer: 'Lily Wang', date: '2026-07-09', total: 67, status: 'Cancelled', items: 1 },
  { id: 'ORD-008', customer: 'Omar Hassan', date: '2026-07-08', total: 298, status: 'Delivered', items: 2 },
]

export const CUSTOMERS = [
  { id: 1, name: 'Sarah Chen', email: 'sarah@email.com', orders: 5, spent: 892, joined: '2025-11-03' },
  { id: 2, name: 'Marcus Webb', email: 'marcus@email.com', orders: 3, spent: 445, joined: '2026-01-15' },
  { id: 3, name: 'Elena Rodriguez', email: 'elena@email.com', orders: 8, spent: 1240, joined: '2025-08-22' },
  { id: 4, name: 'James Park', email: 'james@email.com', orders: 2, spent: 178, joined: '2026-03-01' },
  { id: 5, name: 'Anika Patel', email: 'anika@email.com', orders: 12, spent: 2150, joined: '2025-06-10' },
  { id: 6, name: 'Tom Fischer', email: 'tom@email.com', orders: 1, spent: 124, joined: '2026-07-01' },
]

export const REVIEWS = [
  { id: 1, productId: 1, author: 'Sarah C.', rating: 5, date: '2026-07-01', text: "The leather quality is exceptional. It's already developing a beautiful patina after just two weeks.", verified: true },
  { id: 2, productId: 1, author: 'Marcus W.', rating: 4, date: '2026-06-28', text: 'Well-made bag with great attention to detail. Slightly smaller than expected but love it nonetheless.', verified: true },
  { id: 3, productId: 1, author: 'Elena R.', rating: 5, date: '2026-06-15', text: 'This is my second purchase from Atelier. The craftsmanship is truly remarkable.', verified: true },
  { id: 4, productId: 2, author: 'James P.', rating: 5, date: '2026-07-05', text: 'These vases are stunning. Each one is slightly different which adds to the charm.', verified: true },
  { id: 5, productId: 2, author: 'Anika P.', rating: 4, date: '2026-06-20', text: 'Beautiful set. The matte finish is exactly what I was looking for.', verified: true },
  { id: 6, productId: 3, author: 'Tom F.', rating: 5, date: '2026-07-08', text: 'Incredibly soft and the perfect size. Already ordered another one for the guest room.', verified: true },
  { id: 7, productId: 3, author: 'Sarah C.', rating: 4, date: '2026-06-22', text: "Great quality linen. It gets softer with every wash as promised.", verified: true },
  { id: 8, productId: 4, author: 'Lily W.', rating: 5, date: '2026-07-03', text: 'The scent is divine and the concrete vessels look amazing on my coffee table.', verified: true },
  { id: 9, productId: 5, author: 'Marcus W.', rating: 5, date: '2026-07-10', text: 'Finally an organizer that looks as good as it functions. The walnut grain is beautiful.', verified: true },
  { id: 10, productId: 5, author: 'Elena R.', rating: 4, date: '2026-06-30', text: 'Solid craftsmanship. Fits perfectly on my desk.', verified: true },
  { id: 11, productId: 7, author: 'Anika P.', rating: 5, date: '2026-07-02', text: 'These mugs have the perfect weight and the glaze is gorgeous. My morning coffee ritual just got an upgrade.', verified: true },
  { id: 12, productId: 9, author: 'James P.', rating: 5, date: '2026-07-09', text: 'The end-grain construction is top notch. Juice groove is deep and functional.', verified: true },
  { id: 13, productId: 10, author: 'Tom F.', rating: 4, date: '2026-06-25', text: 'Elegant design with great build quality. The warm light is perfect for late night work.', verified: true },
  { id: 14, productId: 12, author: 'Lily W.', rating: 5, date: '2026-07-06', text: 'A true work of art. The cast iron retains heat beautifully and the enamel interior makes cleaning easy.', verified: true },
  { id: 15, productId: 12, author: 'Sarah C.', rating: 5, date: '2026-06-18', text: 'Worth every penny. The matching cups are a lovely touch.', verified: true },
]
