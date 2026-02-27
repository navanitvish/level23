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
  getAlls:   ()        => axiosInstance.get("/users"),
  getById:  (id)      => axiosInstance.get(`/users/${id}`),
  create:   (data)    => axiosInstance.post("/users", data),
  update:   (id, data)=> axiosInstance.put(`/users/${id}`, data),
  remove:   (id)      => axiosInstance.delete(`/users/${id}`),
  getAll: (role) => axiosInstance.get(`/users/getAll${role ? `?role=${role}` : ''}`),
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

// ─── SUBCATEGORIES ────────────────────────────────────────
export const subCategoryApi = {
  getAll:   ()               => axiosInstance.get('/subCategories/getAll'),  // ← ADD THIS
  create:   (categoryId, data) => axiosInstance.post(`/subCategories/${categoryId}/create`, data, {
    headers: { "Content-Type": "multipart/form-data" }
  }),
  update:   (id, data)       => axiosInstance.put(`/subCategories/${id}`, data, {
    headers: { "Content-Type": "multipart/form-data" }
  }),
  remove:   (id)             => axiosInstance.delete(`/subCategories/${id}`),
}
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
  getAll:   () => axiosInstance.get("/demandLetters/getAll"),
  getById:  (id) => axiosInstance.get(`/demandLetters/get/${id}`),
  create:   (data) => axiosInstance.post("/demandLetters/create", data),
  update:   (id, data) => axiosInstance.put(`/demandLetters/update/${id}`, data),
  remove:   (id) => axiosInstance.delete(`/demandLetters/delete/${id}`),
};
export const propertyApi = {
  getAll:  ()         => axiosInstance.get("/properties/getAll"),
  getById: (id)       => axiosInstance.get(`/properties/${id}`),
  create:  (data)     => axiosInstance.post("/properties/create", data),
  update:  (id, data) => axiosInstance.put(`/properties/update/${id}`, data),
  remove:  (id)       => axiosInstance.delete(`/properties/delete/${id}`),
};


// ─── Add/replace these in src/api/endpoints.js ─────────────────

// ─── WINGS / TOWERS ───────────────────────────────────────────
export const wingApi = {
  getAll:       ()           => axiosInstance.get('/towers/getAll'),
  getByProject: (projectId)  => axiosInstance.get(`/towers/getAll?projectId=${projectId}`),
  getById:      (id)         => axiosInstance.get(`/towers/${id}`),
  create:       (data)       => axiosInstance.post('/towers/create', data),
  // Body: { projectId, name, number, description }
  update:       (id, data)   => axiosInstance.put(`/towers/${id}`, data),
  remove:       (id)         => axiosInstance.delete(`/towers/${id}`),
}

// ─── FLOORS ───────────────────────────────────────────────────
export const floorApi = {
  getAll:     ()             => axiosInstance.get('/floors/getAll'),
  getByWing:  (towerId)      => axiosInstance.get(`/floors/getAll?towerId=${towerId}`),  // ✅ towerId (not wingId)
  getById:    (id)           => axiosInstance.get(`/floors/${id}`),
  create:     (data)         => axiosInstance.post('/floors/create', data),
  // Body: { towerId, projectId, name, number(as Number) }   ← wingId NOT allowed
  update:     (id, data)     => axiosInstance.put(`/floors/${id}`, data),
  remove:     (id)           => axiosInstance.delete(`/floors/${id}`),
}

// ─── UNITS ────────────────────────────────────────────────────
export const unitApi = {
  getAll:       ()           => axiosInstance.get('/units/getAll'),
  getByFloor:   (floorId)    => axiosInstance.get(`/units/getAll?floorId=${floorId}`),
  getByWing:    (wingId)     => axiosInstance.get(`/units/getAll?wingId=${wingId}`),
  getByProject: (projectId)  => axiosInstance.get(`/units/getAll?projectId=${projectId}`),
  getById:      (id)         => axiosInstance.get(`/units/${id}`),
  create:       (data)       => axiosInstance.post('/units/create', data),
  // Body: { floorId, name, number, carpetArea, saleableArea, unitType, facing, status }
  update:       (id, data)   => axiosInstance.put(`/units/update/${id}`, data),
  remove:       (id)         => axiosInstance.delete(`/units/delete/${id}`),

}


// ─── CHANNEL PARTNERS ─────────────────────────────────────
export const channelPartnerApi = {
  getAll:      ()         => axiosInstance.get("/partners/getAll"),
  getById:     (id)       => axiosInstance.get(`/channel-partners/${id}`),
  create:      (data)     => axiosInstance.post("/auth/register", data),
  update:      (id, data) => axiosInstance.put(`/channel-partners/${id}`, data),
  remove:      (id)       => axiosInstance.delete(`/channel-partners/${id}`),
  sendCreative: (data)    => axiosInstance.post("/channel-partners/send-creative", data),
};


// ─── PROJECTS ─────────────────────────────────────────────
export const projectApi = {
  getAll:   ()         => axiosInstance.get("/projects/getAll"),
  getById:  (id)       => axiosInstance.get(`/projects/${id}`),
  create:   (data)     => axiosInstance.post("/projects/create", data),
  update:   (id, data) => axiosInstance.put(`/projects/${id}`, data),
  remove:   (id)       => axiosInstance.delete(`/projects/${id}`),
};

// ─── API (add these to your endpoints.js) ─────────────────
export const reraApi = {
  getByProject: (projectId) => axiosInstance.get(`/reras/getAll?projectId=${projectId}`),
  getById:      (id)        => axiosInstance.get(`/rera/${id}`),
  create:       (data)      => axiosInstance.post('/reras/create', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update:       (id, data)  => axiosInstance.put(`/rera/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete:       (id)        => axiosInstance.delete(`/rera/${id}`),
}


export const costSheetApi = {
  create: (data) => axiosInstance.post('/costSheets/create', data),
  getAll: ()     => axiosInstance.get('/costSheets/getAll'),
}


export const adminSettingsApi = {
  get:    ()     => axiosInstance.get('/adminSettings/get'),
  create: (data) => axiosInstance.post('/adminSettings/create', data),
  update: (data) => axiosInstance.put('/adminSettings/update', data),
}