const API_BASE_URL = '/api';

export const menuAPI = {
  // Get all menu items
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/menu`);
    if (!response.ok) throw new Error('Failed to fetch menu items');
    return response.json();
  },

  // Get items by category
  getByCategory: async (category: string) => {
    const response = await fetch(`${API_BASE_URL}/menu/category/${category}`);
    if (!response.ok) throw new Error(`Failed to fetch ${category} items`);
    return response.json();
  },

  // Get best-selling items
  getBestSelling: async () => {
    const response = await fetch(`${API_BASE_URL}/menu/best-selling/all`);
    if (!response.ok) throw new Error('Failed to fetch best-selling items');
    return response.json();
  },

  // Get single item
  getById: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/menu/${id}`);
    if (!response.ok) throw new Error('Failed to fetch menu item');
    return response.json();
  },
};

export const roomAPI = {
  // Get all rooms
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/rooms`);
    if (!response.ok) throw new Error('Failed to fetch rooms');
    return response.json();
  },

  // Get rooms by category
  getByCategory: async (category: string) => {
    const response = await fetch(`${API_BASE_URL}/rooms/category/${category}`);
    if (!response.ok) throw new Error(`Failed to fetch ${category} rooms`);
    return response.json();
  },

  // Get single room
  getById: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/rooms/${id}`);
    if (!response.ok) throw new Error('Failed to fetch room');
    return response.json();
  },
};
