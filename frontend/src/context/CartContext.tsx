import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { CartItem, MenuItem } from '@/types';
import { useAuth } from './AuthContext';

type CartItemWithMeta = CartItem & { dbId?: string; itemType?: 'menu' | 'room' | 'event' };

interface CartState {
  items: CartItemWithMeta[];
  totalItems: number;
  subtotal: number;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItemWithMeta }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: CartItemWithMeta[] };

interface CartContextType extends CartState {
  addItem: (item: MenuItem, itemType?: 'menu' | 'room' | 'event') => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  updateQuantity: (id: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  getItemQuantity: (id: string) => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const calculateTotals = (items: CartItemWithMeta[]) => {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => {
    const discountedPrice = item.discountPercentage
      ? item.price * (1 - item.discountPercentage / 100)
      : item.price;
    return sum + discountedPrice * item.quantity;
  }, 0);
  return { totalItems, subtotal };
};

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'LOAD_CART': {
      const newTotals = calculateTotals(action.payload);
      return { ...state, items: action.payload, ...newTotals };
    }
    case 'ADD_ITEM': {
      const existingIndex = state.items.findIndex(item => item.id === action.payload.id);
      let newItems: CartItemWithMeta[];

      if (existingIndex > -1) {
        newItems = state.items.map((item, index) =>
          index === existingIndex
            ? { ...item, quantity: item.quantity + action.payload.quantity }
            : item
        );
      } else {
        newItems = [...state.items, action.payload];
      }

      return { ...state, items: newItems, ...calculateTotals(newItems) };
    }

    case 'REMOVE_ITEM': {
      const newItems = state.items.filter(item => item.id !== action.payload);
      return { ...state, items: newItems, ...calculateTotals(newItems) };
    }

    case 'UPDATE_QUANTITY': {
      if (action.payload.quantity <= 0) {
        const newItems = state.items.filter(item => item.id !== action.payload.id);
        return { ...state, items: newItems, ...calculateTotals(newItems) };
      }

      const newItems = state.items.map(item =>
        item.id === action.payload.id
          ? { ...item, quantity: action.payload.quantity }
          : item
      );
      return { ...state, items: newItems, ...calculateTotals(newItems) };
    }

    case 'CLEAR_CART':
      return { items: [], totalItems: 0, subtotal: 0 };

    default:
      return state;
  }
};

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth();
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    totalItems: 0,
    subtotal: 0,
  });

  useEffect(() => {
    const loadCart = async () => {
      if (!user || isLoading) return;

      try {
        const response = await fetch(`http://localhost:5050/api/cart/${user.id}`);
        if (response.ok) {
          const cartItems = await response.json();
          const transformedItems: CartItemWithMeta[] = (cartItems || []).map((item: any) => ({
            id: item.item_id,
            name: item.item_name,
            price: parseFloat(item.price),
            image: item.image || '',
            category: item.category || 'menu',
            description: '',
            isBestSeller: false,
            isHotToday: false,
            discountPercentage: undefined,
            quantity: item.quantity,
            dbId: item.id,
            itemType: item.item_type,
          }));
          dispatch({ type: 'LOAD_CART', payload: transformedItems });
        }
      } catch (error) {
        console.error('Error loading cart:', error);
      }
    };

    if (user) {
      loadCart();
    } else {
      dispatch({ type: 'CLEAR_CART' });
    }
  }, [user, isLoading]);

  const addItem = async (item: MenuItem, itemType: 'menu' | 'room' | 'event' = 'menu') => {
    const basePayload: CartItemWithMeta = { ...item, quantity: 1, itemType };

    if (user) {
      try {
        const response = await fetch('http://localhost:5050/api/cart', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user_id: user.id,
            item_type: itemType,
            item_id: item.id,
            item_name: item.name,
            quantity: 1,
            price: item.price,
            image: item.image,
            category: item.category,
          }),
        });

        if (response.ok) {
          const saved = await response.json();
          dispatch({
            type: 'ADD_ITEM',
            payload: { ...basePayload, quantity: saved.quantity, dbId: saved.id },
          });
          return;
        }
      } catch (error) {
        console.error('Error syncing cart to database:', error);
      }
    }

    // Fallback: local-only update when not authenticated or on sync failure
    dispatch({ type: 'ADD_ITEM', payload: basePayload });
  };

  const removeItem = async (id: string) => {
    const item = state.items.find(i => i.id === id);
    dispatch({ type: 'REMOVE_ITEM', payload: id });

    if (user && item?.dbId) {
      try {
        await fetch(`http://localhost:5050/api/cart/${item.dbId}`, {
          method: 'DELETE',
        });
      } catch (error) {
        console.error('Error removing item from database:', error);
      }
    }
  };

  const updateQuantity = async (id: string, quantity: number) => {
    const item = state.items.find(i => i.id === id);
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });

    if (user && item?.dbId) {
      try {
        if (quantity <= 0) {
          await fetch(`http://localhost:5050/api/cart/${item.dbId}`, {
            method: 'DELETE',
          });
        } else {
          await fetch(`http://localhost:5050/api/cart/${item.dbId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ quantity }),
          });
        }
      } catch (error) {
        console.error('Error updating cart in database:', error);
      }
    }
  };

  const clearCart = async () => {
    dispatch({ type: 'CLEAR_CART' });

    if (user) {
      try {
        await fetch(`http://localhost:5050/api/cart/user/${user.id}`, {
          method: 'DELETE',
        });
      } catch (error) {
        console.error('Error clearing cart in database:', error);
      }
    }
  };

  const getItemQuantity = (id: string) => {
    const item = state.items.find(item => item.id === id);
    return item?.quantity || 0;
  };

  return (
    <CartContext.Provider
      value={{
        ...state,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        getItemQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
