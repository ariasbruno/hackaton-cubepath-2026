import { create } from 'zustand';

export interface ApiTransaction {
  id: string;
  method: string;
  endpoint: string;
  timestamp: string;
  status?: number;
  requestHeaders?: Record<string, string>;
  responseHeaders?: Record<string, string>;
  requestBody?: any;
  responseBody?: any;
  error?: string;
  duration?: number;
}

interface DebugState {
  transactions: ApiTransaction[];
  addTransaction: (tx: ApiTransaction) => void;
  updateTransaction: (id: string, updates: Partial<ApiTransaction>) => void;
  clearTransactions: () => void;
}

const DEBUG_CHANNEL = 'impostor_debug_sync';
const broadcast = new BroadcastChannel(DEBUG_CHANNEL);

export const useDebugStore = create<DebugState>()(
  (set) => ({
    transactions: [],
    addTransaction: (tx) => {
      set((state) => ({ 
        transactions: [tx, ...state.transactions].slice(0, 50) 
      }));
      broadcast.postMessage({ type: 'ADD_TX', tx });
    },
    updateTransaction: (id, updates) => {
      set((state) => ({
        transactions: state.transactions.map((t) => t.id === id ? { ...t, ...updates } : t)
      }));
      broadcast.postMessage({ type: 'UPDATE_TX', id, updates });
    },
    clearTransactions: () => {
      set({ transactions: [] });
      broadcast.postMessage({ type: 'CLEAR_TX' });
    },
  })
);

// Listen for messages from other tabs
broadcast.onmessage = (event) => {
  const { type, tx, id, updates } = event.data;
  
  if (type === 'ADD_TX') {
    useDebugStore.setState((state) => ({
      transactions: [tx, ...state.transactions.filter(t => t.id !== tx.id)].slice(0, 50)
    }));
  } else if (type === 'UPDATE_TX') {
    useDebugStore.setState((state) => ({
      transactions: state.transactions.map((t) => t.id === id ? { ...t, ...updates } : t)
    }));
  } else if (type === 'CLEAR_TX') {
    useDebugStore.setState({ transactions: [] });
  }
};
