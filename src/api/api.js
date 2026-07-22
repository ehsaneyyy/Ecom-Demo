import apiClient from './client'

export const authApi = {
  login: (email, password) =>
    apiClient.post('/auth/login', { email, password }).then((r) => r.data),

  register: (name, email, password, adminKey, phone) =>
    apiClient.post('/auth/register', { name, email, password, phone: phone || undefined, admin_key: adminKey || undefined }).then((r) => r.data),

  me: () => apiClient.get('/auth/me').then((r) => r.data),

  listUsers: () => apiClient.get('/auth/users').then((r) => r.data),

  updateProfile: (data) =>
    apiClient.put('/auth/me', data).then((r) => r.data),

  changePassword: (data) =>
    apiClient.put('/auth/me/password', data).then((r) => r.data),
}

export const productApi = {
  list: (params = {}) =>
    apiClient.get('/product', { params }).then((r) => r.data),

  get: (id) =>
    apiClient.get(`/product/${id}`).then((r) => r.data),

  create: (data) =>
    apiClient.post('/product', data).then((r) => r.data),

  update: (id, data) =>
    apiClient.put(`/product/${id}`, data).then((r) => r.data),

  delete: (id) =>
    apiClient.delete(`/product/${id}`).then((r) => r.data),

  uploadImage: (file) => {
    const formData = new FormData()
    formData.append('file', file)
    return apiClient.post('/product/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then((r) => r.data)
  },

  addReview: (productId, data) =>
    apiClient.post(`/product/${productId}/review`, data).then((r) => r.data),
}

export const orderApi = {
  list: () =>
    apiClient.get('/order').then((r) => r.data),

  get: (id) =>
    apiClient.get(`/order/${id}`).then((r) => r.data),

  create: (shippingAddress, items, promoCode) =>
    apiClient.post('/order', { shipping_address: shippingAddress, items, promo_code: promoCode || undefined }).then((r) => r.data),

  createCod: (shippingAddress, items, promoCode) =>
    apiClient.post('/order/cod', { shipping_address: shippingAddress, items, promo_code: promoCode || undefined }).then((r) => r.data),

  updateStatus: (id, status) =>
    apiClient.patch(`/order/${id}/status?status=${status}`).then((r) => r.data),

  cancel: (id) =>
    apiClient.post(`/order/${id}/cancel`).then((r) => r.data),

  sendEmail: (id) =>
    apiClient.post(`/order/${id}/send-email`).then((r) => r.data),

  track: (id, email) =>
    apiClient.get(`/order/${id}/track`, { params: { email } }).then((r) => r.data),
}

export const paymentApi = {
  createOrder: (shippingAddress, items) =>
    apiClient.post('/payments/create-order', { shipping_address: shippingAddress, items }).then((r) => r.data),

  verifyPayment: (data) =>
    apiClient.post('/payments/verify', data).then((r) => r.data),
}

export const categoryApi = {
  list: () => apiClient.get('/category').then((r) => r.data),
  create: (data) => apiClient.post('/category', data).then((r) => r.data),
  update: (id, data) => apiClient.put(`/category/${id}`, data).then((r) => r.data),
  delete: (id) => apiClient.delete(`/category/${id}`).then((r) => r.data),
}

export const addressApi = {
  list: () => apiClient.get('/address').then((r) => r.data),
  create: (data) => apiClient.post('/address', data).then((r) => r.data),
  update: (id, data) => apiClient.put(`/address/${id}`, data).then((r) => r.data),
  delete: (id) => apiClient.delete(`/address/${id}`).then((r) => r.data),
}

export const promoApi = {
  validate: (code, subtotal) =>
    apiClient.post('/promo/validate', { code, subtotal }).then((r) => r.data),

  list: () => apiClient.get('/promo').then((r) => r.data),

  create: (data) => apiClient.post('/promo', data).then((r) => r.data),

  delete: (id) => apiClient.delete(`/promo/${id}`).then((r) => r.data),
}
