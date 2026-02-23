// src/api/endpoints.js
import axiosInstance from "./axiosInstance";

// ─── POSTS ────────────────────────────────────────────────
export const postApi = {
  getAll:   ()        => axiosInstance.get("/posts"),
  getById:  (id)      => axiosInstance.get(`/posts/${id}`),
  create:   (data)    => axiosInstance.post("/posts", data),
  update:   (id, data)=> axiosInstance.put(`/posts/${id}`, data),
  patch:    (id, data)=> axiosInstance.patch(`/posts/${id}`, data),
  remove:   (id)      => axiosInstance.delete(`/posts/${id}`),
};

// ─── USERS ────────────────────────────────────────────────
export const userApi = {
  getAll:   ()        => axiosInstance.get("/users"),
  getById:  (id)      => axiosInstance.get(`/users/${id}`),
  create:   (data)    => axiosInstance.post("/users", data),
  update:   (id, data)=> axiosInstance.put(`/users/${id}`, data),
  remove:   (id)      => axiosInstance.delete(`/users/${id}`),
};

// ─── COMMENTS ─────────────────────────────────────────────
export const commentApi = {
  getByPost: (postId) => axiosInstance.get("/comments", { params: { postId } }),
  create:    (data)   => axiosInstance.post("/comments", data),
};

// ─── AUTH ─────────────────────────────────────────────────
export const authApi = {
  // POST /auth/login
  // Body: { type, email, password, role? }
  login: (data) => axiosInstance.post("/auth/login", data),

  logout: ()     => axiosInstance.post("/auth/logout"),
  me:     ()     => axiosInstance.get("/auth/me"),
};

// ─── CATEGORIES ───────────────────────────────────────────
export const categoryApi = {
  getAll:   ()             => axiosInstance.get("/categories/getAll"),
  getById:  (id)           => axiosInstance.get(`/categories/get/${id}`),
  create:   (data)         => axiosInstance.post("/categories/create", data),
  update:   (id, data)     => axiosInstance.put(`/categories/update/${id}`, data),
  remove:   (id)           => axiosInstance.delete(`/categories/delete/${id}`),
};

// Terms & Conditions
export const termsApi = {
  getAll:  ()         => axiosInstance.get("/terms-and-conditions/getAll"),
  create:  (data)     => axiosInstance.post("/terms-and-conditions/create", data),
  update:  (id, data) => axiosInstance.put(`/terms-and-conditions/update/${id}`, data),
  remove:  (id)       => axiosInstance.delete(`/terms-and-conditions/delete/${id}`),
}

// Privacy Policy
export const policyApi = {
  getAll:  ()         => axiosInstance.get("/policies"),
  create:  (data)     => axiosInstance.post("/policies", data),
  update:  (id, data) => axiosInstance.put(`/policies/${id}`, data),
  remove:  (id)       => axiosInstance.delete(`/policies/${id}`),
}

// FAQ
export const faqApi = {
  getAll:  ()         => axiosInstance.get("/faqs"),
  create:  (data)     => axiosInstance.post("/faqs", data),
  update:  (id, data) => axiosInstance.put(`/faqs/${id}`, data),
  remove:  (id)       => axiosInstance.delete(`/faqs/${id}`),
}

// Also added: aboutApi, contactApi
export const inventoryApi = {
  getAll:  ()         => axiosInstance.get("/inventory/getAll"),
  create:  (data)     => axiosInstance.post("/inventory/create", data),
  update:  (id, data) => axiosInstance.put(`/inventory/${id}`, data),
  remove:  (id)       => axiosInstance.delete(`/inventory/${id}`),
};


// ─── BOOKINGS ─────────────────────────────────────────────
export const bookingApi = {
  getAll:             ()         => axiosInstance.get("/bookings/getAll"),
  getById:            (id)       => axiosInstance.get(`/bookings/${id}`),
  create:             (data)     => axiosInstance.post("/bookings/create", data),
  updatePersonal:     (id, data) => axiosInstance.put(`/bookings/updatePersonal/${id}`, data),
  updateKyc:          (id, data) => axiosInstance.put(`/bookings/updateKyc/${id}`, data),
  updateProperty:     (id, data) => axiosInstance.put(`/bookings/updateProperty/${id}`, data),
  updatePayment:      (id, data) => axiosInstance.put(`/bookings/updatePayment/${id}`, data),
  submit:             (id)       => axiosInstance.put(`/bookings/submit/${id}`),
  remove:             (id)       => axiosInstance.delete(`/bookings/${id}`),
};

// ─── DEMAND LETTERS ───────────────────────────────────────
export const demandLetterApi = {
  getAll:      ()         => axiosInstance.get("/demand-letters"),
  getById:     (id)       => axiosInstance.get(`/demand-letters/${id}`),
  create:      (data)     => axiosInstance.post("/demand-letters/create", data),
  update:      (id, data) => axiosInstance.put(`/demand-letters/${id}`, data),
  remove:      (id)       => axiosInstance.delete(`/demand-letters/${id}`),
  generate:    (id)       => axiosInstance.get(`/demand-letters/${id}/generate`, { responseType: 'blob' }),
};

export const propertyApi = {
  getAll:  ()         => axiosInstance.get("/properties/getAll"),
  getById: (id)       => axiosInstance.get(`/properties/${id}`),
  create:  (data)     => axiosInstance.post("/properties/create", data),
  update:  (id, data) => axiosInstance.put(`/properties/update/${id}`, data),
  remove:  (id)       => axiosInstance.delete(`/properties/delete/${id}`),
};


// ─── Add these to your existing src/api/endpoints.js ───────────

export const wingApi = {
  getAll:        ()         => axiosInstance.get("/wings"),
  getByProject:  (projectId)=> axiosInstance.get(`/wings?projectId=${projectId}`),
  getById:       (id)       => axiosInstance.get(`/wings/${id}`),
  create:        (data)     => axiosInstance.post("/wings/create", data),
  update:        (id, data) => axiosInstance.put(`/wings/${id}`, data),
  remove:        (id)       => axiosInstance.delete(`/wings/${id}`),
};

export const unitApi = {
  getAll:        ()         => axiosInstance.get("/units"),
  getByWing:     (wingId)   => axiosInstance.get(`/units?wingId=${wingId}`),
  getByProject:  (projectId)=> axiosInstance.get(`/units?projectId=${projectId}`),
  getById:       (id)       => axiosInstance.get(`/units/${id}`),
  create:        (data)     => axiosInstance.post("/units/create", data),
  update:        (id, data) => axiosInstance.put(`/units/${id}`, data),
  remove:        (id)       => axiosInstance.delete(`/units/${id}`),
};


// ─── CHANNEL PARTNERS ─────────────────────────────────────
export const channelPartnerApi = {
  getAll:      ()         => axiosInstance.get("/channel-partners"),
  getById:     (id)       => axiosInstance.get(`/channel-partners/${id}`),
  create:      (data)     => axiosInstance.post("/channel-partners/create", data),
  update:      (id, data) => axiosInstance.put(`/channel-partners/${id}`, data),
  remove:      (id)       => axiosInstance.delete(`/channel-partners/${id}`),
  sendCreative: (data)    => axiosInstance.post("/channel-partners/send-creative", data),
};