import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useData } from '../context/DataContext'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import { useAuth } from '../context/AuthContext'
import { productApi } from '../api/api'
import { useSEO } from '../hooks/useSEO'
import Reveal from '../components/Reveal'

const COLOR_NAMES = {
  '#1a1510': 'Charcoal', '#0a0a0a': 'Black', '#2d2d2d': 'Dark Gray',
  '#f5f0e8': 'Cream', '#e8ddd0': 'Sand', '#1a1a2e': 'Navy',
  '#2d1b10': 'Espresso', '#f0e6d8': 'Ivory', '#101518': 'Slate',
  '#e2d5c0': 'Linen', '#1a1008': 'Umber', '#f8f4f0': 'Pearl',
  '#c8a97e': 'Gold', '#c85a3e': 'Terracotta', '#e6d5c3': 'Natural',
  '#3a2e28': 'Mocha', '#d4c4b0': 'Taupe', '#2c2c2c': 'Onyx',
  '#f5f5f5': 'White', '#d4a574': 'Caramel', '#8b7355': 'Walnut',
}

function getColorName(hex) {
  return COLOR_NAMES[hex] || hex
}

export default function ProductDetail() {
  const { id } = useParams()
  const { products, loading, fetchProducts } = useData()
  const { addItem } = useCart()
  const { toggleWishlist, isInWishlist } = useWishlist()
  const { currentUser, isLoggedIn } = useAuth()
  const product = products.find((p) => p.id === id)

  useSEO({
    title: product ? product.name : undefined,
    description: product ? product.description : undefined,
    path: `/product/${id}`,
  })

  useEffect(() => {
    if (!product) return
    const key = 'atelier-recently-viewed'
    const stored = JSON.parse(localStorage.getItem(key) || '[]')
    const filtered = stored.filter((p) => p.id !== product.id)
    filtered.unshift({ id: product.id, name: product.name, price: product.price, images: product.images, color: product.color, category: product.category })
    localStorage.setItem(key, JSON.stringify(filtered.slice(0, 10)))
  }, [product])

  const [selectedColor, setSelectedColor] = useState(null)
  const [selectedSize, setSelectedSize] = useState(null)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)
  const [expandedReview, setExpandedReview] = useState(null)
  const [showAllReviews, setShowAllReviews] = useState(false)
  const [reviewRating, setReviewRating] = useState(5)
  const [reviewText, setReviewText] = useState('')
  const [reviewSubmitting, setReviewSubmitting] = useState(false)
  const [reviewError, setReviewError] = useState(null)
  const [reviewSuccess, setReviewSuccess] = useState(false)

  if (loading && !product) {
    return (
      <div className="animate-fade-in min-h-[60vh] flex items-center justify-center">
        <div className="w-5 h-5 border border-white/10 border-t-white/40 rounded-full animate-spin" />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="animate-fade-in min-h-[60vh] flex flex-col items-center justify-center px-4">
        <p className="text-sm text-white/30 mb-6">Product not found</p>
        <Link to="/category/all" className="text-xs text-white/30 hover:text-white/50 transition-colors">Back to shop</Link>
      </div>
    )
  }

  const reviews = product.reviews || []
  const relatedProducts = products
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, 4)
  const hasImages = product.images && product.images.length > 0
  const hasColors = product.colors && product.colors.length > 0
  const hasSizes = product.sizes && product.sizes.length > 0
  const needsVariantSelection = hasColors || hasSizes
  const canAddToCart = !needsVariantSelection || (hasColors ? selectedColor : true) && (hasSizes ? selectedSize : true)

  const handleAddToCart = () => {
    if (!canAddToCart) return
    addItem(product, quantity, selectedColor, selectedSize)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const handleWishlist = () => {
    if (!isLoggedIn) {
      window.location.href = '/login'
      return
    }
    toggleWishlist(product)
  }

  const wishlisted = isInWishlist(product.id)

  const handleSubmitReview = async (e) => {
    e.preventDefault()
    if (!reviewText.trim()) {
      setReviewError('Please write a review')
      return
    }
    setReviewSubmitting(true)
    setReviewError(null)
    try {
      await productApi.addReview(product.id, { rating: reviewRating, text: reviewText.trim() })
      await fetchProducts()
      setReviewSuccess(true)
      setReviewText('')
      setReviewRating(5)
      setTimeout(() => setReviewSuccess(false), 3000)
    } catch (err) {
      setReviewError(err.response?.data?.detail || 'Failed to submit review')
    } finally {
      setReviewSubmitting(false)
    }
  }

  const averageRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : null

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-16">
          <Reveal direction="left">
            <div className="space-y-3 sm:space-y-4">
              <div className="aspect-square rounded-lg overflow-hidden flex items-center justify-center relative" style={{ background: hasImages ? 'transparent' : product.color }}>
                {hasImages ? (
                  <img
                    src={product.images[selectedImage]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] to-transparent" />
                    <div className="relative flex flex-col items-center gap-4 px-8">
                      <span className="text-4xl sm:text-5xl font-bold text-white/[0.08] text-center leading-tight">{product.name}</span>
                      <div className="w-12 h-px bg-white/10" />
                      <span className="text-[0.6rem] tracking-[0.3em] uppercase text-white/20">{product.category}</span>
                    </div>
                  </>
                )}
              </div>
              {hasImages && product.images.length > 1 && (
                <div className="flex gap-2">
                  {product.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImage(i)}
                      className={`w-16 h-16 sm:w-20 sm:h-20 rounded overflow-hidden flex-shrink-0 border-2 transition-colors ${selectedImage === i ? 'border-white/10' : 'border-transparent hover:border-white/10'}`}
                    >
                      <img src={img} alt={`${product.name} ${i + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
              {hasColors && product.colors.length > 1 && (
                <div className="flex gap-2">
                  {product.colors.map((c, i) => (
                    <div key={i} className="w-16 h-16 sm:w-20 sm:h-20 rounded flex-shrink-0" style={{ background: c }} />
                  ))}
                </div>
              )}
            </div>
          </Reveal>

          <Reveal direction="right">
            <div className="space-y-6 sm:space-y-8">
              <div>
                <p className="text-[0.6rem] tracking-[0.3em] uppercase text-white/30 mb-2">{product.category}</p>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-[-0.03em] mb-3 sm:mb-4">{product.name}</h1>
                <div className="flex items-center gap-3 mb-4 sm:mb-6">
                  <p className="text-xl sm:text-2xl text-white/50">₹{product.price}</p>
                  {product.compareAtPrice && (
                    <p className="text-sm text-white/30 line-through">₹{product.compareAtPrice}</p>
                  )}
                </div>
                {averageRating && (
                  <div className="flex items-center gap-2 text-sm text-white/30" aria-label={`Rating: ${averageRating} out of 5 stars`}>
                    <div className="flex gap-0.5" role="img" aria-label={`${averageRating} out of 5 stars`}>
                      {[1, 2, 3, 4, 5].map((s) => (
                        <span key={s} className={`text-sm ${s <= Math.round(averageRating) ? 'text-[#c8a97e]' : 'text-white/30'}`}>★</span>
                      ))}
                    </div>
                    <span className="text-xs text-white/30">{averageRating} ({reviews.length} reviews)</span>
                  </div>
                )}
              </div>

              <p className="text-sm text-white/30 leading-relaxed">{product.description}</p>

              {hasColors && (
                <div>
                  <p className="text-xs text-white/30 mb-3">Color{selectedColor ? `: ${getColorName(selectedColor)}` : ''}</p>
                  <div className="flex gap-2">
                    {product.colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 transition-all ${selectedColor === color ? 'border-white/100 scale-110' : 'border-white/10 hover:border-white/20'}`}
                        style={{ backgroundColor: color }}
                        aria-label={`Color: ${getColorName(color)}`}
                        aria-pressed={selectedColor === color}
                      />
                    ))}
                  </div>
                </div>
              )}

              {hasSizes && (
                <div>
                  <p className="text-xs text-white/30 mb-3">Size{selectedSize ? `: ${selectedSize}` : ''}</p>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`min-w-[44px] h-11 px-4 border text-xs transition-colors ${selectedSize === size ? 'border-white/10 text-white/70 bg-[#141414]' : 'border-white/10 text-white/30 hover:border-white/20'}`}
                        aria-pressed={selectedSize === size}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <p className="text-xs text-white/30">Quantity</p>
                <div className="flex items-center gap-0 w-fit">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-11 h-11 flex items-center justify-center border border-white/10 text-white/30 hover:text-white/70 hover:border-white/20 transition-colors text-lg" aria-label="Decrease quantity">−</button>
                  <span className="w-12 h-11 flex items-center justify-center text-sm text-white/50 border-y border-white/10">{quantity}</span>
                  <button onClick={() => setQuantity(Math.min(quantity + 1, product.stock))} disabled={quantity >= product.stock} className="w-11 h-11 flex items-center justify-center border border-white/10 text-white/30 hover:text-white/70 hover:border-white/20 transition-colors text-lg disabled:opacity-30 disabled:cursor-not-allowed" aria-label="Increase quantity">+</button>
                </div>
                {product.stock <= 5 && product.stock > 0 && (
                  <p className="text-[0.6rem] text-[#c8a97e]">Only {product.stock} left in stock</p>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0 || !canAddToCart}
                  className="flex-1 py-3.5 sm:py-4 bg-white text-black text-xs tracking-[0.15em] uppercase text-center hover:bg-white/90 transition-colors min-h-[48px] disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  {product.stock === 0 ? 'Sold Out' : added ? 'Added to Bag ✓' : 'Add to Bag'}
                </button>
                <button
                  onClick={handleWishlist}
                  className={`w-12 h-12 sm:w-14 sm:h-12 flex items-center justify-center border transition-colors ${wishlisted ? 'border-red-500/30 text-red-400' : 'border-white/10 text-white/30 hover:border-white/20 hover:text-white/50'}`}
                  aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill={wishlisted ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                </button>
              </div>

              {!canAddToCart && needsVariantSelection && (
                <p className="text-xs text-[#c85a3e]/70">
                  Please select{hasColors && !selectedColor ? ' a color' : ''}{hasColors && !selectedColor && hasSizes && !selectedSize ? ' and' : ''}{hasSizes && !selectedSize ? ' a size' : ''}
                </p>
              )}

              <div className="flex items-center gap-4 py-5 border-y border-white/10 text-[0.6rem] sm:text-xs text-white/30">
                <span className="flex items-center gap-2">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="1" y="3" width="15" height="13" />
                    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                    <circle cx="5.5" cy="18.5" r="2.5" />
                    <circle cx="18.5" cy="18.5" r="2.5" />
                  </svg>
                  Free shipping over ₹10,000
                </span>
                <span className="flex items-center gap-2">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                  </svg>
                  30-day returns
                </span>
              </div>
            </div>
          </Reveal>
        </div>

        {reviews.length > 0 && (
          <section className="mt-16 sm:mt-24">
            <Reveal>
              <div className="flex items-end justify-between mb-8 sm:mb-12">
                <div>
                  <p className="text-[0.6rem] tracking-[0.3em] uppercase text-white/30 mb-2">Reviews</p>
                  <h2 className="text-2xl sm:text-3xl font-bold tracking-[-0.03em]">{reviews.length} Reviews</h2>
                  {averageRating && (
                    <p className="text-sm text-white/30 mt-1">Average: {averageRating} / 5</p>
                  )}
                </div>
              </div>
            </Reveal>
            <div className="space-y-0">
              {(showAllReviews ? reviews : reviews.slice(0, 3)).map((review, i) => (
                <Reveal key={review.id} delay={i * 60}>
                  <div className="border-b border-white/10 py-6 sm:py-8">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#141414] flex items-center justify-center text-[0.6rem] text-white/30">
                          {review.author.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm text-white/50">{review.author}</p>
                          <p className="text-[0.6rem] text-white/30">{new Date(review.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                        </div>
                      </div>
                      <div className="flex gap-0.5" role="img" aria-label={`${review.rating} out of 5 stars`}>
                        {[1, 2, 3, 4, 5].map((s) => (
                          <span key={s} className={`text-sm ${s <= review.rating ? 'text-[#c8a97e]' : 'text-white/30'}`}>★</span>
                        ))}
                      </div>
                    </div>
                    {review.verified && (
                      <p className="text-[0.55rem] text-[#4ade80]/60 mb-2 flex items-center gap-1">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                        Verified Purchase
                      </p>
                    )}
                    <p className={`text-sm text-white/30 leading-relaxed ${expandedReview !== review.id ? 'line-clamp-3' : ''}`}>{review.text}</p>
                    {review.text.length > 150 && (
                      <button onClick={() => setExpandedReview(expandedReview === review.id ? null : review.id)} className="text-[0.6rem] text-white/30 hover:text-white/30 transition-colors mt-2">
                        {expandedReview === review.id ? 'Show less' : 'Read more'}
                      </button>
                    )}
                  </div>
                </Reveal>
              ))}
            </div>
            {reviews.length > 3 && !showAllReviews && (
              <button onClick={() => setShowAllReviews(true)} className="w-full py-4 border border-white/10 text-xs text-white/30 hover:text-white/50 hover:border-white/20 transition-colors mt-4">
                Show all {reviews.length} reviews
              </button>
            )}
          </section>
        )}

        {currentUser && (
          <Reveal>
            <section className="mt-16 sm:mt-24">
              <p className="text-[0.6rem] tracking-[0.3em] uppercase text-white/30 mb-2">Write a Review</p>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-[-0.03em] mb-8">Share Your Thoughts</h2>
              {reviewSuccess ? (
                <div className="bg-[#141414] rounded-lg border border-white/10 p-6 text-center">
                  <p className="text-sm text-[#4ade80]/70">Review submitted successfully</p>
                </div>
              ) : (
                <form onSubmit={handleSubmitReview} className="bg-[#141414] rounded-lg border border-white/10 p-6 space-y-5">
                  <div>
                    <p className="text-xs text-white/30 mb-3">Rating</p>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setReviewRating(s)}
                          className={`text-xl transition-colors ${s <= reviewRating ? 'text-[#c8a97e]' : 'text-white/30 hover:text-white/30'}`}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-white/30 mb-1.5">Your Review</label>
                    <textarea
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      rows={4}
                      placeholder="What did you like or dislike about this product?"
                      className="w-full px-4 py-3 bg-[#141414] border border-white/10 text-sm text-white/70 placeholder-white/30 focus:outline-none focus:border-white/20 transition-colors resize-none"
                    />
                  </div>
                  {reviewError && <p className="text-xs text-red-400/70" role="alert">{reviewError}</p>}
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={reviewSubmitting}
                      className="px-6 py-3 bg-white text-black text-xs tracking-[0.15em] uppercase hover:bg-white/90 transition-colors min-h-[44px] disabled:opacity-50"
                    >
                      {reviewSubmitting ? 'Submitting...' : 'Submit Review'}
                    </button>
                  </div>
                </form>
              )}
            </section>
          </Reveal>
        )}

        {!currentUser && (
          <Reveal>
            <section className="mt-16 sm:mt-24">
              <div className="bg-[#141414] rounded-lg border border-white/10 p-6 text-center">
                <p className="text-sm text-white/30 mb-4">Sign in to write a review</p>
                <Link to="/login" className="inline-flex items-center px-6 py-3 border border-white/10 text-xs tracking-[0.15em] uppercase text-white/50 hover:bg-white hover:text-black transition-all duration-500">
                  Sign In
                </Link>
              </div>
            </section>
          </Reveal>
        )}

        {relatedProducts.length > 0 && (
          <section className="mt-16 sm:mt-24">
            <Reveal>
              <p className="text-[0.6rem] tracking-[0.3em] uppercase text-white/30 mb-2">You may also like</p>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-[-0.03em] mb-8 sm:mb-12">Related Products</h2>
            </Reveal>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-3 sm:gap-x-4 gap-y-8 sm:gap-y-12 lg:gap-x-6">
              {relatedProducts.map((rp, i) => (
                <Reveal key={rp.id} delay={i * 80}>
                  <Link to={`/product/${rp.id}`} className="group block">
                    <div className="aspect-[4/5] rounded-sm mb-3 sm:mb-4 overflow-hidden group-hover:scale-[1.02] transition-transform duration-500" style={{ background: rp.images?.length ? 'transparent' : rp.color }}>
                      {rp.images?.length ? (
                        <img src={rp.images[0]} alt={rp.name} className="w-full h-full object-cover" loading="lazy" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-[0.5rem] tracking-[0.2em] uppercase text-white/30 text-center px-2">{rp.name}</span>
                        </div>
                      )}
                    </div>
                    <h3 className="text-sm text-white/70 mb-1 group-hover:text-white transition-colors truncate">{rp.name}</h3>
                    <p className="text-sm text-white/30">₹{rp.price}</p>
                  </Link>
                </Reveal>
              ))}
            </div>
          </section>
        )}

        {(() => {
          const recent = JSON.parse(localStorage.getItem('atelier-recently-viewed') || '[]')
            .filter((p) => p.id !== product.id)
            .slice(0, 4)
          if (recent.length === 0) return null
          return (
            <section className="mt-16 sm:mt-24">
              <Reveal>
                <p className="text-[0.6rem] tracking-[0.3em] uppercase text-white/30 mb-2">Browsing history</p>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-[-0.03em] mb-8 sm:mb-12">Recently Viewed</h2>
              </Reveal>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-x-3 sm:gap-x-4 gap-y-8 sm:gap-y-12 lg:gap-x-6">
                {recent.map((rp, i) => (
                  <Reveal key={rp.id} delay={i * 80}>
                    <Link to={`/product/${rp.id}`} className="group block">
                      <div className="aspect-[4/5] rounded-sm mb-3 sm:mb-4 overflow-hidden group-hover:scale-[1.02] transition-transform duration-500" style={{ background: rp.images?.length ? 'transparent' : rp.color }}>
                        {rp.images?.length ? (
                          <img src={rp.images[0]} alt={rp.name} className="w-full h-full object-cover" loading="lazy" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="text-[0.5rem] tracking-[0.2em] uppercase text-white/30 text-center px-2">{rp.name}</span>
                          </div>
                        )}
                      </div>
                      <h3 className="text-sm text-white/70 mb-1 group-hover:text-white transition-colors truncate">{rp.name}</h3>
                      <p className="text-sm text-white/30">₹{rp.price}</p>
                    </Link>
                  </Reveal>
                ))}
              </div>
            </section>
          )
        })()}
      </div>
    </>
  )
}
