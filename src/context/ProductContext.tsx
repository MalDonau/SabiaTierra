import { createContext, useContext, ReactNode, useState, useCallback, useEffect } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { Product, Category } from '../types';

interface ProductContextType {
  products: Product[];
  categories: Category[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  addCategory: (name: string) => void;
  deleteCategory: (id: string) => void;
  bulkUpdatePrices: (percentage: number, categoryId?: string) => void;
  roundPrices: (categoryId?: string) => void;
  importData: (data: { products: Product[], categories: Category[] }) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProductsInternal] = useLocalStorage<Product[]>('sabia-tierra-products', [
    // Frutos Secos
    { id: '1', name: 'Nueces', price1kg: 22400, price500g: 11200, price250g: 5600, category: '1' },
    { id: '2', name: 'Almendras', price1kg: 23100, price500g: 11600, price250g: 5800, category: '1' },
    { id: '3', name: 'Pistachos', price1kg: 42000, price500g: 21000, price250g: 10500, category: '1' },
    { id: '4', name: 'Castañas de Cajú', price1kg: 21700, price500g: 10900, price250g: 5500, category: '1' },
    { id: '5', name: 'Maní tostado s/sal', price1kg: 6300, price500g: 3200, price250g: 1600, category: '1' },
    // Frutas
    { id: '6', name: 'Pasas Negras', price1kg: 7000, price500g: 3500, price250g: 1800, category: '2' },
    { id: '7', name: 'Arándanos', price1kg: 35000, price500g: 17500, price250g: 8800, category: '2' },
    { id: '8', name: 'Coco Rallado', price1kg: 13300, price500g: 6700, price250g: 3300, category: '2' },
    // Mix Frutos Secos
    { id: '9', name: 'Mix Pasas', price1kg: 13200, price500g: 6600, price250g: 3300, category: '3', description: 'Nuez, almendra, maní, pasas.' },
    { id: '10', name: 'Mix Tropical s/maní', price1kg: 15400, price500g: 7700, price250g: 3900, category: '3', description: 'Nuez, almendra, castaña, fruta, banana, pasas.' },
    { id: '11', name: 'Mix Arándanos', price1kg: 21700, price500g: 10900, price250g: 5400, category: '3', description: 'Arándano, nuez, almendra, maní, castaña.' },
    { id: '12', name: 'Mix Pasas s/maní', price1kg: 16300, price500g: 8100, price250g: 4100, category: '3', description: 'Nuez, almendra, castaña, pasas' },
    { id: '13', name: 'Mix Picada', price1kg: 9800, price500g: 4900, price250g: 2500, category: '3' },
    { id: '14', name: 'Mix s/pasas', price1kg: 16000, price500g: 8000, price250g: 4000, category: '3', description: 'Nuez, almendra, maní, castaña.' },
    { id: '15', name: 'Mix chocolate arándanos', price1kg: 19800, price500g: 9900, price250g: 5000, category: '3', description: 'Nuez, almendra, maní, choco, arándanos.' },
    { id: '16', name: 'Mix c/chocolate', price1kg: 17200, price500g: 8600, price250g: 4300, category: '3', description: 'Nuez, almendra, maní, castañas, chocolate.' },
    // Sales (Note: Mapping to columns based on intuition since units differ)
    { id: '17', name: 'Sal Marina', price500g: 3600, category: '4' },
    { id: '18', name: 'Sal con mix pimientas (330gr)', price250g: 4100, category: '4' }, 
    { id: '19', name: 'Sal Hierbas/chimichurri/ajo', price250g: 2500, category: '4' },
    // Semillas
    { id: '20', name: 'Mix 4 semillas', price1kg: 6700, price500g: 3400, price250g: 1700, category: '5' },
    { id: '21', name: 'Mix 7 semillas', price1kg: 8700, price500g: 4400, price250g: 2200, category: '5' },
    // Granolas
    { id: '22', name: 'Granola Tradicional', price1kg: 9800, price500g: 4900, price250g: 2500, category: '6' },
    { id: '23', name: 'Granola con Miel', price1kg: 10500, price500g: 5300, price250g: 2600, category: '6' },
    // Otros
    { id: '24', name: 'Aceite de Oliva 500cc', price500g: 12600, category: '7' },
  ]);

  const [categories, setCategories] = useLocalStorage<Category[]>('sabia-tierra-categories', [
    { id: '1', name: 'FRUTOS SECOS' },
    { id: '2', name: 'FRUTAS' },
    { id: '3', name: 'MIX FRUTOS SECOS' },
    { id: '4', name: 'SALES' },
    { id: '5', name: 'SEMILLAS' },
    { id: '6', name: 'GRANOLAS' },
    { id: '7', name: 'OTROS' },
  ]);

  // Undo/Redo history
  const [past, setPast] = useState<Product[][]>([]);
  const [future, setFuture] = useState<Product[][]>([]);

  const setProducts = useCallback((newProducts: Product[] | ((val: Product[]) => Product[]), saveHistory = true) => {
    setProductsInternal(prevProducts => {
      const nextProducts = typeof newProducts === 'function' ? newProducts(prevProducts) : newProducts;
      
      if (saveHistory) {
        setPast(prevPast => [...prevPast, prevProducts].slice(-50)); // Limit to 50 steps
        setFuture([]);
      }
      
      return nextProducts;
    });
  }, [setProductsInternal]);

  const undo = useCallback(() => {
    if (past.length === 0) return;
    
    const previous = past[past.length - 1];
    const newPast = past.slice(0, past.length - 1);
    
    setFuture(prevFuture => [products, ...prevFuture]);
    setPast(newPast);
    setProductsInternal(previous);
  }, [past, products, setProductsInternal]);

  const redo = useCallback(() => {
    if (future.length === 0) return;
    
    const next = future[0];
    const newFuture = future.slice(1);
    
    setPast(prevPast => [...prevPast, products]);
    setFuture(newFuture);
    setProductsInternal(next);
  }, [future, products, setProductsInternal]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        if (e.shiftKey) {
          e.preventDefault();
          redo();
        } else {
          e.preventDefault();
          undo();
        }
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        redo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo]);

  const addProduct = (productData: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...productData,
      id: crypto.randomUUID(),
    };
    setProducts(prev => [...prev, newProduct]);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const addCategory = (name: string) => {
    if (categories.some(c => c.name.toLowerCase() === name.toLowerCase())) return;
    setCategories([...categories, { id: crypto.randomUUID(), name }]);
  };

  const deleteCategory = (id: string) => {
    setCategories(categories.filter(c => c.id !== id));
  };

  const bulkUpdatePrices = (percentage: number, categoryId?: string) => {
    setProducts(prev => prev.map(p => {
      if (categoryId && p.category !== categoryId) return p;
      const factor = 1 + percentage / 100;
      return { 
        ...p, 
        price1kg: p.price1kg ? Math.round(p.price1kg * factor) : undefined,
        price500g: p.price500g ? Math.round(p.price500g * factor) : undefined,
        price250g: p.price250g ? Math.round(p.price250g * factor) : undefined
      };
    }));
  };

  const roundPrices = (categoryId?: string) => {
    const roundTo50 = (num: number) => Math.round(num / 50) * 50;
    
    setProducts(prev => prev.map(p => {
      if (categoryId && p.category !== categoryId) return p;
      return {
        ...p,
        price1kg: p.price1kg ? roundTo50(p.price1kg) : undefined,
        price500g: p.price500g ? roundTo50(p.price500g) : undefined,
        price250g: p.price250g ? roundTo50(p.price250g) : undefined
      };
    }));
  };

  const importData = (data: { products: Product[], categories: Category[] }) => {
    setProducts(data.products);
    setCategories(data.categories);
  };

  return (
    <ProductContext.Provider value={{
      products,
      categories,
      addProduct,
      updateProduct,
      deleteProduct,
      addCategory,
      deleteCategory,
      bulkUpdatePrices,
      roundPrices,
      importData,
      undo,
      redo,
      canUndo: past.length > 0,
      canRedo: future.length > 0
    }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};
