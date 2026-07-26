import api, { tokenStorage } from './api';

// All endpoints below are placeholders that match common REST conventions.
// Point VITE_API_URL at your backend and adjust the paths here if yours differ.
const authService = {
  // POST /auth/signup { fullname, email, password } -> { user, token }
  signUp: async ({ fullname, email, password }) => {
    const { data } = await api.post('/auth/signup', { fullname, email, password });

    if (data.token) tokenStorage.set(data.token);
    return data.user;
  },

  // POST /auth/signin { email, password } -> { user, token }
  signIn: async (email, password) => {
    const { data } = await api.post('/auth/signin', { email, password });

    if (data.token) tokenStorage.set(data.token);
    return data.user;
  },

  // Clears the local session. Also pings the API in case it tracks
  // server-side sessions/refresh tokens; failure to reach it is not fatal.
  signOut: async () => {
    try {
      await api.post('/auth/signout');
    } finally {
      tokenStorage.clear();
    }
  },

  // GET /auth/me -> user
  // Used on app load to restore the session from a stored token,
  // replacing Firebase's onAuthStateChanged.
  getCurrentUser: async () => {
    const { data } = await api.get('/auth/me');

    return data.user || data;
  },

  // POST /auth/reset-password { email }
  resetPassword: (email) => api.post('/auth/reset-password', { email }),

  // PUT /auth/password { currentPassword, newPassword }
  changePassword: async (currentPassword, newPassword) => {
    await api.put('/auth/password', { currentPassword, newPassword });
    return 'Password updated successfully!';
  },

  // PUT /auth/email { currentPassword, newEmail }
  updateEmail: async (currentPassword, newEmail) => {
    await api.put('/auth/email', { currentPassword, newEmail });
    return 'Email Successfully updated';
  },

  // PATCH /users/:id { ...updates } -> updated fields
  updateProfile: async (id, updates) => {
    const { data } = await api.patch(`/users/${id}`, updates);

    return data;
  },

  // PUT /users/:id/basket { items }
  saveBasketItems: (items, userId) => api.put(`/users/${userId}/basket`, { items }),

  // POST /uploads (multipart/form-data) -> { url }
  // folder lets the backend organize uploads, e.g. 'avatar', 'banner', 'products'
  uploadImage: async (file, folder = 'misc') => {
    const formData = new FormData();

    formData.append('image', file);
    formData.append('folder', folder);

    const { data } = await api.post('/uploads', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });

    return data.url;
  }
};

export default authService;
