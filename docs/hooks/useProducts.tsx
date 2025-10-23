import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Product, Category, Variant } from '../types';

interface ProductContextType {
  products: Product[];
  categories: Category[];
  getProductById: (id: string) => Product | undefined;
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  addCategory: (name: string) => void;
  updateCategory: (id: string, name: string) => void;
  deleteCategory: (id: string) => void;
  updateCategoryOrder: (reorderedCategories: Category[]) => void;
  updateProductOrder: (categoryId: string, reorderedProducts: Product[]) => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

const initialCategories: Category[] = [
  { id: '1', name: 'ציוד אישי', order: 0 },
  { id: '2', name: 'ציוד כללי', order: 1 },
  { id: '3', name: 'מיגון ונרתיקים', order: 2 },
  { id: '4', name: 'רפואה', order: 3 },
];

const initialProducts: Product[] = [
  { 
    id: '1', name: 'תג שם טקטי', 
    description: 'תג שם אישי בהתאמה אישית, עשוי מחומרים עמידים במיוחד. זמן הכנה - עד 14 ימי עסקים.',
    categoryId: '1', order: 1, isPopular: true,
    tags: ['רב מכר'],
    specifications: [{key: 'חומר', value: 'Cordura 500D'}, {key: 'מידות', value: '9x5 ס"מ'}],
    variants: [
      { id: 'v1-1', name: 'שחור', price: 50, stock: 99, imageUrls: ['https://picsum.photos/seed/nametag-black/400/300'] },
      { id: 'v1-2', name: 'ירוק זית', price: 50, stock: 99, imageUrls: ['https://picsum.photos/seed/nametag-green/400/300'] }
    ]
  },
  { 
    id: '2', name: 'פנס טקטי עוצמתי',
    description: 'פנס LED עם מספר מצבי תאורה, עמיד במים ואבק. כולל סוללה נטענת.',
    categoryId: '2', order: 1, isPopular: true,
    tags: ['חדש!'],
    specifications: [{key: 'עוצמה', value: '1200 לומן'}, {key: 'סוללה', value: '18650 נטענת'}],
    variants: [
      { id: 'v2-1', name: 'Standard', price: 250, stock: 15, imageUrls: ['https://picsum.photos/seed/flashlight/400/300', 'https://picsum.photos/seed/flashlight-beam/400/300'] }
    ]
  },
    { 
    id: '3', name: 'אזיקונים טקטיים (10 יח\')',
    description: 'סט של 10 אזיקונים חזקים לשימוש מבצעי.',
    categoryId: '2', order: 2,
    tags: [],
    specifications: [{key: 'כמות', value: '10 יחידות'}],
    variants: [
      { id: 'v3-1', name: 'Standard', price: 30, stock: 100, imageUrls: ['https://picsum.photos/seed/cuffs/400/300'] }
    ]
  },
  { 
    id: '4', name: 'אפוד מגן קרמי',
    description: 'אפוד מגן קל משקל עם פלטות קרמיות להגנה מרבית. לא כולל פלטות.',
    categoryId: '3', order: 1,
    tags: [],
    specifications: [{key: 'חומר', value: 'Cordura 1000D'}, {key: 'תאימות', value: 'פלטות 10x12'}],
    variants: [
      { id: 'v4-1', name: 'שחור', price: 1200, stock: 0, imageUrls: ['https://picsum.photos/seed/vest-black/400/300'] },
      { id: 'v4-2', name: 'Coyote', price: 1250, stock: 5, imageUrls: ['https://picsum.photos/seed/vest-coyote/400/300'] }
    ]
  },
  { 
    id: '5', name: 'נרתיק לאקדח',
    description: 'נרתיק פולימרי איכותי לאקדח גלוק 19. מתאים לנשיאה פנימית וחיצונית.',
    categoryId: '3', order: 2,
    tags: [],
    specifications: [{key: 'דגם אקדח', value: 'גלוק 19 / 19X / 45'}, {key: 'חומר', value: 'Kydex'}],
    variants: [
      { id: 'v5-1', name: 'ימני', price: 180, stock: 20, imageUrls: ['https://picsum.photos/seed/holster-rh/400/300'] },
      { id: 'v5-2', name: 'שמאלי', price: 180, stock: 8, imageUrls: ['https://picsum.photos/seed/holster-lh/400/300'] }
    ]
  },
  { 
    id: '6', name: 'ערכת עזרה ראשונה IFAK',
    description: 'ערכה קומפקטית הכוללת חוסם עורקים, תחבושת אישית וציוד חירום בסיסי.',
    categoryId: '4', order: 1, isPopular: true,
    tags: [],
    specifications: [],
    variants: [
      { id: 'v6-1', name: 'Standard', price: 350, stock: 12, imageUrls: ['https://picsum.photos/seed/ifak/400/300'] }
    ]
  },
];

export const ProductProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [categories, setCategories] = useState<Category[]>(initialCategories);

  const getProductById = (id: string): Product | undefined => {
    return products.find(p => p.id === id);
  };

  const addProduct = (productData: Omit<Product, 'id'>) => {
    const newProduct: Product = { ...productData, id: Date.now().toString() };
    setProducts(prev => [...prev, newProduct]);
  };

  const updateProduct = (updatedProduct: Product) => {
    setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const addCategory = (name: string) => {
    if (name.trim() === '') return;
    const maxOrder = categories.reduce((max, cat) => cat.order > max ? cat.order : max, -1);
    const newCategory: Category = { id: Date.now().toString(), name, order: maxOrder + 1 };
    setCategories(prev => [...prev, newCategory]);
  };

  const updateCategory = (id: string, name: string) => {
     if (name.trim() === '') return;
    setCategories(prev => prev.map(c => c.id === id ? { ...c, name } : c));
  };

  const deleteCategory = (id: string) => {
    if(products.some(p => p.categoryId === id)) {
      alert('לא ניתן למחוק קטגוריה שיש בה מוצרים.');
      return;
    }
    setCategories(prev => prev.filter(c => c.id !== id));
  };

  const updateCategoryOrder = (reorderedCategories: Category[]) => {
    setCategories(reorderedCategories);
  };

  const updateProductOrder = (categoryId: string, reorderedProducts: Product[]) => {
    setProducts(prev => {
        const otherCategoryProducts = prev.filter(p => p.categoryId !== categoryId);
        return [...otherCategoryProducts, ...reorderedProducts];
    });
  }

  return (
    <ProductContext.Provider value={{ 
        products, 
        categories, 
        getProductById, 
        addProduct, 
        updateProduct, 
        deleteProduct,
        addCategory,
        updateCategory,
        deleteCategory,
        updateCategoryOrder,
        updateProductOrder
    }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};