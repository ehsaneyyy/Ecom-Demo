import apiClient from './client'

export const authApi = {
  login: (email, password) =>
    apiClient.post('/auth/login', { email, password }).then((r) => r.data),

  register: (name, email, password, adminKey, phone) =>
    apiClient.post('/auth/register', { name, email, password, phone: phone || undefined, admin_key: adminKey || undefined }).then((r) => r.data),

  me: () => apiClient.get('/auth/me').then((r) => r.data),

  listUsers: () => apiClient.get('/auth/users').then((r) => r.data),
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

  create: (shippingAddress, items) =>
    apiClient.post('/order', { shipping_address: shippingAddress, items }).then((r) => r.data),

  updateStatus: (id, status) =>
    apiClient.patch(`/order/${id}/status?status=${status}`).then((r) => r.data),
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
