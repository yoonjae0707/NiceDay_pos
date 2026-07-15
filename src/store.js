import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const initialProducts = [
  { id: '1', name: '아메리카노', price: 4500, category: '커피', stock: 100 },
  { id: '2', name: '카페라떼', price: 5000, category: '커피', stock: 80 },
  { id: '3', name: '초코 무스 케이크', price: 6500, category: '디저트', stock: 20 },
  { id: '4', name: '크로와상', price: 3500, category: '베이커리', stock: 30 },
];

export const useStore = create(
  persist(
    (set, get) => ({
      // State
      products: initialProducts,
      cart: [],
      theme: 'light',
      bankAccount: '',
      salesRecords: [],

      // Theme
      toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),

      // Settings
      updateBankAccount: (account) => set({ bankAccount: account }),

      // Product Actions
      addProduct: (product) => set((state) => ({
        products: [...state.products, { ...product, id: Date.now().toString() }]
      })),
      updateStock: (id, amount) => set((state) => ({
        products: state.products.map(p => 
          p.id === id ? { ...p, stock: p.stock + amount } : p
        )
      })),
      setExactStock: (id, exactAmount) => set((state) => ({
        products: state.products.map(p => 
          p.id === id ? { ...p, stock: Math.max(0, exactAmount) } : p
        )
      })),
      deleteProduct: (id) => set((state) => ({
        products: state.products.filter(p => p.id !== id),
        cart: state.cart.filter(c => c.id !== id) // Remove from cart if it was there
      })),

      // Cart Actions
      addToCart: (product) => set((state) => {
        const existing = state.cart.find(item => item.id === product.id);
        if (existing) {
          return {
            cart: state.cart.map(item =>
              item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
            )
          };
        }
        return { cart: [...state.cart, { ...product, quantity: 1 }] };
      }),
      removeFromCart: (id) => set((state) => ({
        cart: state.cart.filter(item => item.id !== id)
      })),
      updateCartQuantity: (id, quantity) => set((state) => ({
        cart: state.cart.map(item => 
          item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
        )
      })),
      clearCart: () => set({ cart: [] }),
      
      // Checkout
      checkout: (paymentMethod, totalAmount) => {
        const { cart, products, salesRecords } = get();
        if (cart.length === 0) return;

        // Create Receipt
        const receipt = {
          id: Date.now().toString(),
          timestamp: new Date().toISOString(),
          items: [...cart],
          total: totalAmount,
          paymentMethod: paymentMethod // 'Cash' | 'BankTransfer'
        };

        // Deduct stock
        const newProducts = products.map(p => {
          const cartItem = cart.find(c => c.id === p.id);
          if (cartItem) {
            return { ...p, stock: Math.max(0, p.stock - cartItem.quantity) };
          }
          return p;
        });

        set({ 
          products: newProducts, 
          cart: [],
          salesRecords: [receipt, ...salesRecords]
        });
      },

      // Sales Actions
      deleteSalesRecord: (id) => set((state) => ({
        salesRecords: state.salesRecords.filter(record => record.id !== id)
      })),
      clearAllSalesRecords: () => set({ salesRecords: [] })
    }),
    {
      name: 'niceday-pos-storage',
    }
  )
);
