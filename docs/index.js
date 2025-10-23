import React from 'https://aistudiocdn.com/react@^19.2.0';
import ReactDOM from 'https://aistudiocdn.com/react-dom@^19.2.0/client';
import { HashRouter, Routes, Route, Navigate, Link, useNavigate, useParams, useSearchParams } from 'https://aistudiocdn.com/react-router-dom@^7.9.4';
import { Shield, LogOut, UserCog, Search, Star, ArrowRight, MessageCircle, Tag, CheckCircle, PlusCircle, Edit, Trash2, Save, X, GripVertical, ChevronDown, Archive, Package, AlertTriangle } from 'https://aistudiocdn.com/lucide-react@^0.546.0';
import Fuse from 'https://aistudiocdn.com/fuse.js@^7.0.0';

// --- hooks/useAuth.tsx ---
const AuthContext = React.createContext(undefined);
const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const login = () => {
    console.log("Simulating Google Login...");
    setIsAuthenticated(true);
  };
  const logout = () => {
    setIsAuthenticated(false);
  };
  return (
    React.createElement(AuthContext.Provider, { value: { isAuthenticated, login, logout } }, children)
  );
};
const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// --- hooks/useProducts.tsx ---
const ProductContext = React.createContext(undefined);
const initialCategories = [
  { id: '1', name: 'ציוד אישי', order: 0 },
  { id: '2', name: 'ציוד כללי', order: 1 },
  { id: '3', name: 'מיגון ונרתיקים', order: 2 },
  { id: '4', name: 'רפואה', order: 3 },
];
const initialProducts = [
  { 
    id: '1', name: 'תג שם טקטי', 
    description: 'תג שם אישי בהתאמה אישית, עשוי מחומרים עמידים במיוחד. זמן הכנה - עד 14 ימי עסקים.',
    categoryId: '1', order: 1, isPopular: true,
    tags: ['רב מכר'],
    specifications: [{key: 'חומר', value: 'Cordura 500D'}, {key: 'מידות', value: '9x5 ס"מ'}],
    variants: [
      { id: 'v1-1', name: 'שחור', price: 50, stock: 99, imageUrls: ['https://images.unsplash.com/photo-1581555282565-94e241c09813?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80'] },
      { id: 'v1-2', name: 'ירוק זית', price: 50, stock: 99, imageUrls: ['https://images.unsplash.com/photo-1581555282565-94e241c09813?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80'] }
    ]
  },
  { 
    id: '2', name: 'פנס טקטי עוצמתי',
    description: 'פנס LED עם מספר מצבי תאורה, עמיד במים ואבק. כולל סוללה נטענת.',
    categoryId: '2', order: 1, isPopular: true,
    tags: ['חדש!'],
    specifications: [{key: 'עוצמה', value: '1200 לומן'}, {key: 'סוללה', value: '18650 נטענת'}],
    variants: [
      { id: 'v2-1', name: 'Standard', price: 250, stock: 15, imageUrls: ['https://images.unsplash.com/photo-1610212570262-b8a739643445?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80', 'https://images.unsplash.com/photo-1574296272333-e6e7c1f3f3a2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80'] }
    ]
  },
  { 
    id: '3', name: 'אזיקונים טקטיים (10 יח\')',
    description: 'סט של 10 אזיקונים חזקים לשימוש מבצעי.',
    categoryId: '2', order: 2,
    tags: [],
    specifications: [{key: 'כמות', value: '10 יחידות'}],
    variants: [
      { id: 'v3-1', name: 'Standard', price: 30, stock: 100, imageUrls: ['https://images.unsplash.com/photo-1628191139395-5555e1a1b1c7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80'] }
    ]
  },
  { 
    id: '4', name: 'אפוד מגן קרמי',
    description: 'אפוד מגן קל משקל עם פלטות קרמיות להגנה מרבית. לא כולל פלטות.',
    categoryId: '3', order: 1,
    tags: [],
    specifications: [{key: 'חומר', value: 'Cordura 1000D'}, {key: 'תאימות', value: 'פלטות 10x12'}],
    variants: [
      { id: 'v4-1', name: 'שחור', price: 1200, stock: 0, imageUrls: ['https://images.unsplash.com/photo-1594283099395-c29b6e8a5d3f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80'] },
      { id: 'v4-2', name: 'Coyote', price: 1250, stock: 5, imageUrls: ['https://images.unsplash.com/photo-1578335384318-2c2a1a454d6d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80'] }
    ]
  },
  { 
    id: '5', name: 'נרתיק לאקדח',
    description: 'נרתיק פולימרי איכותי לאקדח גלוק 19. מתאים לנשיאה פנימית וחיצונית.',
    categoryId: '3', order: 2,
    tags: [],
    specifications: [{key: 'דגם אקדח', value: 'גלוק 19 / 19X / 45'}, {key: 'חומר', value: 'Kydex'}],
    variants: [
      { id: 'v5-1', name: 'ימני', price: 180, stock: 20, imageUrls: ['https://images.unsplash.com/photo-1607235286124-e9a06a6c0b0b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80'] },
      { id: 'v5-2', name: 'שמאלי', price: 180, stock: 8, imageUrls: ['https://images.unsplash.com/photo-1607235286124-e9a06a6c0b0b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80'] }
    ]
  },
  { 
    id: '6', name: 'ערכת עזרה ראשונה IFAK',
    description: 'ערכה קומפקטית הכוללת חוסם עורקים, תחבושת אישית וציוד חירום בסיסי.',
    categoryId: '4', order: 1, isPopular: true,
    tags: [],
    specifications: [],
    variants: [
      { id: 'v6-1', name: 'Standard', price: 350, stock: 12, imageUrls: ['https://images.unsplash.com/photo-1600959905230-86d1f5654a93?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80'] }
    ]
  },
];

const ProductProvider = ({ children }) => {
  const [products, setProducts] = React.useState(initialProducts);
  const [categories, setCategories] = React.useState(initialCategories);

  const getProductById = (id) => {
    return products.find(p => p.id === id);
  };
  const addProduct = (productData) => {
    const newProduct = { ...productData, id: Date.now().toString() };
    setProducts(prev => [...prev, newProduct]);
  };
  const updateProduct = (updatedProduct) => {
    setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
  };
  const deleteProduct = (id) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };
  const addCategory = (name) => {
    if (name.trim() === '') return;
    const maxOrder = categories.reduce((max, cat) => cat.order > max ? cat.order : max, -1);
    const newCategory = { id: Date.now().toString(), name, order: maxOrder + 1 };
    setCategories(prev => [...prev, newCategory]);
  };
  const updateCategory = (id, name) => {
     if (name.trim() === '') return;
    setCategories(prev => prev.map(c => c.id === id ? { ...c, name } : c));
  };
  const deleteCategory = (id) => {
    if(products.some(p => p.categoryId === id)) {
      alert('לא ניתן למחוק קטגוריה שיש בה מוצרים.');
      return;
    }
    setCategories(prev => prev.filter(c => c.id !== id));
  };
  const updateCategoryOrder = (reorderedCategories) => {
    setCategories(reorderedCategories);
  };
  const updateProductOrder = (categoryId, reorderedProducts) => {
    setProducts(prev => {
        const otherCategoryProducts = prev.filter(p => p.categoryId !== categoryId);
        return [...otherCategoryProducts, ...reorderedProducts];
    });
  }

  return (
    React.createElement(ProductContext.Provider, { value: { 
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
    }}, children)
  );
};

const useProducts = () => {
  const context = React.useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};

// --- components/Footer.tsx ---
const Footer = () => {
    return (
        React.createElement('footer', { className: "bg-gray-800 text-white mt-auto" },
            React.createElement('div', { className: "container mx-auto px-4 py-6 text-center" },
                React.createElement('p', null, `© ${new Date().getFullYear()} הלוחם - ציוד טקטי. כל הזכויות שמורות.`),
                React.createElement('p', { className: "text-sm text-gray-400 mt-1" }, "נוצר עבור שוטרים, על ידי שוטרים.")
            )
        )
    );
};

// --- components/ProductCard.tsx ---
const ProductCard = ({ product }) => {
    const firstVariant = product.variants[0];
    if (!firstVariant) return null;

    const totalStock = product.variants.reduce((sum, v) => sum + v.stock, 0);
    const inStock = totalStock > 0;
    const displayPrice = firstVariant.price;
    const displayImageUrl = firstVariant.imageUrls[0] || 'https://picsum.photos/400/300';
    
    const statusText = inStock ? 'במלאי' : 'אזל מהמלאי';
    const statusStyles = inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';

    return (
        React.createElement('div', { className: "bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-xl flex flex-col h-full relative" },
            product.tags && product.tags.length > 0 && (
                 React.createElement('div', { className: "absolute top-2 right-2 flex flex-col items-end gap-1 z-10" },
                    product.tags.map(tag => (
                        React.createElement('span', { key: tag, className: "bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full" }, tag)
                    ))
                 )
            ),
            React.createElement(Link, { to: `/product/${product.id}`, className: "block" },
                React.createElement('img', { src: displayImageUrl, alt: product.name, className: "w-full h-48 object-cover" })
            ),
            React.createElement('div', { className: "p-4 flex flex-col flex-grow" },
                React.createElement('span', { className: `text-xs font-semibold mr-2 px-2.5 py-0.5 rounded-full self-start ${statusStyles}` },
                    statusText
                ),
                React.createElement('h3', { className: "mt-2 text-lg font-bold text-gray-900" }, product.name),
                React.createElement('p', { className: "mt-1 text-sm text-gray-600 flex-grow" }, `${product.description.substring(0, 70)}...`),
                React.createElement('div', { className: "mt-4 flex justify-between items-center" },
                    React.createElement('p', { className: "text-xl font-bold text-blue-600" }, `₪${displayPrice}`),
                    React.createElement(Link, { to: `/product/${product.id}`, className: "text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center transition" },
                        "צפה בפרטים"
                    )
                )
            )
        )
    );
};

// --- components/Header.tsx ---
const Header = () => {
    const { isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = React.useState('');

    const handleLogout = () => {
        logout();
        navigate('/');
    };
    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
            setSearchQuery('');
        }
    };

    return (
        React.createElement('header', { className: "bg-gray-800 text-white shadow-lg sticky top-0 z-50" },
            React.createElement('div', { className: "container mx-auto px-4 py-3 flex justify-between items-center gap-4 flex-wrap" },
                React.createElement(Link, { to: "/", className: "flex items-center gap-2 hover:text-blue-400 transition-colors" },
                    React.createElement(Shield, { size: 28 }),
                    React.createElement('span', { className: "text-lg sm:text-xl font-bold" }, "הלוחם")
                ),
                React.createElement('form', { onSubmit: handleSearch, className: "relative flex-grow max-w-lg order-3 sm:order-2 w-full sm:w-auto" },
                    React.createElement('input', {
                        type: "search",
                        value: searchQuery,
                        onChange: (e) => setSearchQuery(e.target.value),
                        placeholder: "חיפוש מוצרים...",
                        className: "w-full pl-10 pr-4 py-2 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    }),
                    React.createElement('button', { type: "submit", className: "absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white" },
                        React.createElement(Search, { size: 20 })
                    )
                ),
                React.createElement('nav', { className: "flex items-center gap-4 order-2 sm:order-3" },
                    isAuthenticated ? (
                        React.createElement(React.Fragment, null,
                            React.createElement(Link, { to: "/admin", className: "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 transition-colors" },
                                React.createElement(UserCog, { size: 16 }),
                                React.createElement('span', { className: "hidden sm:inline" }, "ניהול")
                            ),
                            React.createElement('button', { onClick: handleLogout, className: "flex items-center gap-2 bg-red-600 px-3 py-2 rounded-md text-sm font-medium hover:bg-red-700 transition-colors" },
                                React.createElement(LogOut, { size: 16 }),
                                React.createElement('span', { className: "hidden sm:inline" }, "התנתק")
                            )
                        )
                    ) : (
                        React.createElement(Link, { to: "/admin", className: "text-sm font-medium hover:text-blue-400 transition-colors" },
                            "כניסת מנהל"
                        )
                    )
                )
            )
        )
    );
};

// --- pages/HomePage.tsx ---
const HomePage = () => {
  const { products, categories } = useProducts();
  const popularProducts = products.filter(p => p.isPopular);
  const sortedCategories = [...categories].sort((a, b) => a.order - b.order);

  const getCategoryProducts = (categoryId) => {
    return products
      .filter(p => p.categoryId === categoryId)
      .sort((a, b) => a.order - b.order);
  }
  const handleScrollToCatalog = () => {
    const popularSection = document.getElementById('popular-products');
    if (popularSection) {
      popularSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    React.createElement('div', { className: "space-y-12" },
      React.createElement('div', {
        className: "relative bg-cover bg-center h-[60vh] min-h-[450px] rounded-xl shadow-2xl overflow-hidden flex items-end justify-center text-white p-8",
        style: { backgroundImage: "url('https://images.unsplash.com/photo-1629033403212-3329f70d3810?q=80&w=1974&auto=format&fit=crop')" }
      },
        React.createElement('div', { className: "absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" }),
        React.createElement('div', { className: "relative z-10 text-center pb-4" },
          React.createElement('h1', { className: "text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight", style: { textShadow: '2px 2px 10px rgba(0,0,0,0.8)' } },
            "היתרון שלך בשטח"
          ),
          React.createElement('p', { className: "mt-4 text-lg md:text-xl max-w-2xl mx-auto", style: { textShadow: '1px 1px 6px rgba(0,0,0,0.7)' } },
            "ציוד טקטי מקצועי. שירות אישי."
          ),
          React.createElement('button', {
            onClick: handleScrollToCatalog,
            className: "mt-8 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold rounded-lg shadow-lg transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-opacity-50"
          },
            "גלה את הציוד"
          )
        )
      ),
      popularProducts.length > 0 && (
        React.createElement('section', { id: "popular-products" },
          React.createElement('div', { className: "flex items-center mb-4" },
            React.createElement(Star, { className: "text-yellow-500 ml-2" }),
            React.createElement('h2', { className: "text-2xl font-bold text-gray-800" }, "מוצרים פופולריים")
          ),
          React.createElement('div', { className: "relative" },
            React.createElement('div', { className: "flex overflow-x-auto space-x-4 space-x-reverse pb-4" },
              popularProducts.map(product => (
                React.createElement('div', { key: product.id, className: "flex-shrink-0 w-64 sm:w-72" },
                  React.createElement(ProductCard, { product: product })
                )
              ))
            )
          )
        )
      ),
      React.createElement('div', { className: "space-y-10" },
        sortedCategories.map(category => {
          const categoryProducts = getCategoryProducts(category.id);
          if (categoryProducts.length === 0) return null;
          
          return (
            React.createElement('div', { key: category.id },
              React.createElement('h2', { className: "text-2xl font-bold text-gray-800 mb-4 border-b-2 border-blue-500 pb-2" }, category.name),
              React.createElement('div', { className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6" },
                categoryProducts.map(product => (
                  React.createElement(ProductCard, { key: product.id, product: product })
                ))
              )
            )
          )
        })
      )
    )
  );
};

// --- pages/ProductDetailPage.tsx ---
const ProductDetailPage = () => {
    const { id } = useParams();
    const { products, getProductById, categories } = useProducts();
    const product = getProductById(id || '');

    const [selectedVariantId, setSelectedVariantId] = React.useState(null);
    const [mainImage, setMainImage] = React.useState('');
    const [notificationSent, setNotificationSent] = React.useState(false);

    React.useEffect(() => {
        if (product && product.variants.length > 0) {
            const defaultVariant = product.variants.find(v => v.stock > 0) || product.variants[0];
            setSelectedVariantId(defaultVariant.id);
            if (defaultVariant.imageUrls.length > 0) {
                setMainImage(defaultVariant.imageUrls[0]);
            }
        }
    }, [product]);

    if (!product) {
        return React.createElement('div', { className: "text-center py-10" }, "מוצר לא נמצא.");
    }

    const selectedVariant = product.variants.find(v => v.id === selectedVariantId);
    const category = categories.find(c => c.id === product.categoryId);
    const relatedProducts = products.filter(p => p.categoryId === product.categoryId && p.id !== product.id).slice(0, 4);

    const handleVariantChange = (variantId) => {
        setSelectedVariantId(variantId);
        const newVariant = product.variants.find(v => v.id === variantId);
        if (newVariant && newVariant.imageUrls.length > 0) {
            setMainImage(newVariant.imageUrls[0]);
        }
    };
    
    const handleNotifySubmit = (e) => {
        e.preventDefault();
        console.log(`Notification request for ${product.name} - ${selectedVariant?.name}`);
        setNotificationSent(true);
    };

    const whatsappNumber = "+972500000000"; // Placeholder
    const encodedMessage = encodeURIComponent(`היי, אני מעוניין להזמין את המוצר "${product.name} - ${selectedVariant?.name}".`);
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

    return (
        React.createElement('div', { className: "space-y-10" },
            React.createElement('div', { className: "bg-white p-4 sm:p-6 md:p-8 rounded-lg shadow-lg max-w-5xl mx-auto" },
                React.createElement('div', { className: "grid grid-cols-1 md:grid-cols-2 gap-8" },
                    React.createElement('div', null,
                        React.createElement('div', { className: "aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4" },
                            React.createElement('img', { src: mainImage, alt: `${product.name} - ${selectedVariant?.name}`, className: "w-full h-full object-cover" })
                        ),
                        React.createElement('div', { className: "flex gap-2 overflow-x-auto" },
                            selectedVariant?.imageUrls.map((url, index) => (
                                React.createElement('button', { key: index, onClick: () => setMainImage(url), className: `w-16 h-16 rounded-md overflow-hidden flex-shrink-0 border-2 ${mainImage === url ? 'border-blue-500' : 'border-transparent'}` },
                                    React.createElement('img', { src: url, alt: `Thumbnail ${index + 1}`, className: "w-full h-full object-cover"})
                                )
                            ))
                        )
                    ),
                    React.createElement('div', { className: "flex flex-col" },
                        React.createElement('div', { className: "flex justify-between items-start" },
                             category && (
                                React.createElement('span', { className: "flex items-center text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded-full self-start mb-2" },
                                    React.createElement(Tag, { size: 14, className: "ml-1" }),
                                    category.name
                                )
                            ),
                             product.tags && product.tags.length > 0 && (
                                 React.createElement('div', { className: "flex flex-wrap gap-2" },
                                    product.tags.map(tag => (
                                        React.createElement('span', { key: tag, className: "text-xs font-semibold px-2.5 py-1 rounded-full bg-red-100 text-red-800" }, tag)
                                    ))
                                 )
                            )
                        ),
                        React.createElement('h1', { className: "text-2xl md:text-3xl font-bold text-gray-900 mt-2" }, product.name),
                        selectedVariant && (
                            React.createElement('p', { className: "text-2xl md:text-3xl font-bold text-blue-600 mt-2" }, `₪${selectedVariant.price}`)
                        ),
                        React.createElement('p', { className: "text-gray-600 mt-4 leading-relaxed" }, product.description),
                        product.variants.length > 1 && (
                            React.createElement('div', { className: "mt-6" },
                                React.createElement('h3', { className: "text-sm font-medium text-gray-900" }, product.variants[0].name.match(/\d/) ? 'מידה' : 'צבע'),
                                React.createElement('div', { className: "flex flex-wrap gap-2 mt-2" },
                                    product.variants.map(variant => (
                                        React.createElement('button', { 
                                            key: variant.id,
                                            onClick: () => handleVariantChange(variant.id),
                                            className: `px-4 py-2 border rounded-md text-sm font-medium transition ${selectedVariantId === variant.id ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`
                                        },
                                            variant.name
                                        )
                                    ))
                                )
                            )
                        ),
                        React.createElement('div', { className: "mt-auto pt-6" },
                            selectedVariant && selectedVariant.stock > 0 ? (
                                React.createElement('a', { 
                                    href: whatsappUrl, 
                                    target: "_blank", 
                                    rel: "noopener noreferrer",
                                    className: "w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition-transform hover:scale-105"
                                },
                                    React.createElement(MessageCircle, { className: "ml-3 h-5 w-5" }),
                                    "הזמנה דרך WhatsApp"
                                )
                            ) : notificationSent ? (
                                React.createElement('div', { className: "text-center p-3 rounded-md bg-green-100 text-green-800 flex items-center justify-center" },
                                    React.createElement(CheckCircle, { size: 20, className: "ml-2" }),
                                    "קיבלנו! נעדכן אותך במייל כשהמוצר יחזור למלאי."
                                )
                            ) : (
                                React.createElement('div', { className: "p-4 border rounded-md bg-gray-50" },
                                    React.createElement('h4', { className: "font-semibold text-gray-800" }, "אזל מהמלאי"),
                                    React.createElement('p', { className: "text-sm text-gray-600 mb-2" }, "רוצה לקבל עדכון כשהמוצר יחזור למלאי?"),
                                    React.createElement('form', { onSubmit: handleNotifySubmit, className: "flex gap-2" },
                                        React.createElement('input', { type: "email", placeholder: "האימייל שלך", required: true, className: "flex-grow border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"}),
                                        React.createElement('button', { type: "submit", className: "px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition" }, "שלח")
                                    )
                                )
                            )
                        )
                    )
                ),
                product.videoUrl && (
                    React.createElement('div', { className: "mt-10 pt-6 border-t border-gray-200" },
                        React.createElement('h2', { className: "text-xl font-bold text-gray-800 mb-4" }, "סרטון מוצר"),
                        React.createElement('div', { className: "aspect-video bg-gray-100 rounded-lg overflow-hidden shadow-inner" },
                            React.createElement('video', { src: product.videoUrl, autoPlay: true, muted: true, loop: true, playsInline: true, controls: true, className: "w-full h-full object-cover" })
                        )
                    )
                ),
                product.specifications.length > 0 && (
                     React.createElement('div', { className: "mt-10 pt-6 border-t border-gray-200" },
                        React.createElement('h2', { className: "text-xl font-bold text-gray-800 mb-4" }, "מפרט טכני"),
                        React.createElement('div', { className: "bg-gray-50 p-4 rounded-lg" },
                            React.createElement('ul', { className: "space-y-2" },
                                product.specifications.map(spec => (
                                    React.createElement('li', { key: spec.key, className: "flex justify-between text-sm" },
                                        React.createElement('span', { className: "font-semibold text-gray-700" }, `${spec.key}:`),
                                        React.createElement('span', { className: "text-gray-600" }, spec.value)
                                    )
                                ))
                            )
                        )
                     )
                ),
                 React.createElement('div', { className: "mt-8 pt-6 border-t border-gray-200" },
                    React.createElement(Link, { to: "/", className: "text-blue-600 hover:text-blue-800 flex items-center" },
                        React.createElement(ArrowRight, { className: "ml-2 h-4 w-4" }),
                        "חזרה לקטלוג"
                    )
                )
            ),
             relatedProducts.length > 0 && (
                React.createElement('div', { className: "max-w-5xl mx-auto" },
                    React.createElement('h2', { className: "text-2xl font-bold text-gray-800 mb-4" }, "מוצרים קשורים"),
                    React.createElement('div', { className: "grid grid-cols-2 md:grid-cols-4 gap-6" },
                        relatedProducts.map(p => React.createElement(ProductCard, { key: p.id, product: p }))
                    )
                )
            )
        )
    );
};

// --- pages/AdminLoginPage.tsx ---
const GoogleIcon = () => (
    React.createElement('svg', { className: "w-5 h-5 mr-2", viewBox: "0 0 48 48" },
        React.createElement('path', { fill: "#4285F4", d: "M24 9.5c3.23 0 5.45.98 7.2 2.6l5.5-5.5C33.56 3.82 29.27 2 24 2 14.53 2 6.86 7.6 4.14 15.86l6.4 4.93C12.01 14.2 17.5 9.5 24 9.5z" }),
        React.createElement('path', { fill: "#34A853", d: "M46.2 25.18c0-1.68-.15-3.3-.44-4.88H24v9.1h12.45c-.54 2.97-2.1 5.48-4.63 7.18l6.1 4.73C42.85 37.47 46.2 31.87 46.2 25.18z" }),
        React.createElement('path', { fill: "#FBBC05", d: "M10.54 20.79c-.4-.98-.64-2.08-.64-3.23s.23-2.25.64-3.23l-6.4-4.93C2.46 12.2 1 15.93 1 20s1.46 7.8 4.14 10.54l6.4-4.75z" }),
        React.createElement('path', { fill: "#EA4335", d: "M24 46c5.27 0 9.56-1.75 12.75-4.7l-6.1-4.73c-1.75 1.18-4 1.9-6.65 1.9-6.5 0-11.99-4.7-13.86-11.14l-6.4 4.93C6.86 38.4 14.53 46 24 46z" }),
        React.createElement('path', { fill: "none", d: "M0 0h48v48H0z" })
    )
);
const AdminLoginPage = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const handleLogin = () => {
        login();
        navigate('/admin');
    };
    return (
        React.createElement('div', { className: "flex items-center justify-center min-h-[60vh]" },
            React.createElement('div', { className: "w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-lg text-center" },
                React.createElement('div', null,
                    React.createElement('h2', { className: "text-3xl font-bold text-gray-900" }, "כניסת מנהל"),
                    React.createElement('p', { className: "mt-2 text-gray-600" }, "התחבר עם חשבון גוגל כדי לנהל את החנות.")
                ),
                React.createElement('div', { className: "pt-4" },
                    React.createElement('button', {
                        onClick: handleLogin,
                        className: "w-full inline-flex justify-center items-center px-4 py-3 border border-gray-300 rounded-md shadow-sm bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
                    },
                        React.createElement(GoogleIcon, null),
                        "התחבר עם Google"
                    )
                ),
                React.createElement('p', { className: "text-xs text-gray-500" },
                    React.createElement('strong', null, "הערה: "), "זוהי הדגמה. במערכת האמיתית, ההתחברות תהיה מאובטחת ותקושר לחשבון הגוגל שסיפקת."
                )
            )
        )
    );
};

// --- pages/AdminDashboardPage.tsx ---
const StatsPanel = () => {
    const { products, categories } = useProducts();
    const outOfStockCount = products.filter(p => p.variants.every(v => v.stock === 0)).length;

    return (
        React.createElement('div', { className: "mb-8 grid grid-cols-1 sm:grid-cols-3 gap-4" },
            React.createElement('div', { className: "bg-blue-100 p-4 rounded-lg flex items-center" },
                React.createElement(Package, { size: 24, className: "text-blue-500 ml-4" }),
                React.createElement('div', null,
                    React.createElement('div', { className: "text-2xl font-bold" }, products.length),
                    React.createElement('div', { className: "text-sm text-gray-600" }, "סה\"כ מוצרים")
                )
            ),
            React.createElement('div', { className: "bg-green-100 p-4 rounded-lg flex items-center" },
                React.createElement(Archive, { size: 24, className: "text-green-500 ml-4" }),
                React.createElement('div', null,
                    React.createElement('div', { className: "text-2xl font-bold" }, categories.length),
                    React.createElement('div', { className: "text-sm text-gray-600" }, "סה\"כ קטגוריות")
                )
            ),
             React.createElement('div', { className: "bg-red-100 p-4 rounded-lg flex items-center" },
                React.createElement(AlertTriangle, { size: 24, className: "text-red-500 ml-4" }),
                React.createElement('div', null,
                    React.createElement('div', { className: "text-2xl font-bold" }, outOfStockCount),
                    React.createElement('div', { className: "text-sm text-gray-600" }, "מוצרים שאזלו מהמלאי")
                )
            )
        )
    );
}
const CategoryManager = () => {
    const { categories, addCategory, updateCategory, deleteCategory, updateCategoryOrder } = useProducts();
    const [newCategoryName, setNewCategoryName] = React.useState('');
    const [editingCategoryId, setEditingCategoryId] = React.useState(null);
    const [editingCategoryName, setEditingCategoryName] = React.useState('');
    const [draggedCategoryId, setDraggedCategoryId] = React.useState(null);

    const sortedCategories = [...categories].sort((a, b) => a.order - b.order);

    const handleAddCategory = () => {
        addCategory(newCategoryName);
        setNewCategoryName('');
    };
    const handleEdit = (category) => {
        setEditingCategoryId(category.id);
        setEditingCategoryName(category.name);
    }
    const handleSaveEdit = (id) => {
        updateCategory(id, editingCategoryName);
        setEditingCategoryId(null);
        setEditingCategoryName('');
    }
    const handleCancelEdit = () => {
        setEditingCategoryId(null);
        setEditingCategoryName('');
    }
    const handleDragStart = (e, id) => {
        setDraggedCategoryId(id);
        e.dataTransfer.effectAllowed = 'move';
    };
    const handleDragOver = (e) => {
        e.preventDefault();
    };
    const handleDrop = (e, targetCategoryId) => {
        e.preventDefault();
        if (!draggedCategoryId || draggedCategoryId === targetCategoryId) return;
        const draggedIndex = sortedCategories.findIndex(c => c.id === draggedCategoryId);
        const targetIndex = sortedCategories.findIndex(c => c.id === targetCategoryId);
        if (draggedIndex === -1 || targetIndex === -1) return;
        const reordered = [...sortedCategories];
        const [draggedItem] = reordered.splice(draggedIndex, 1);
        reordered.splice(targetIndex, 0, draggedItem);
        const updatedOrder = reordered.map((cat, index) => ({...cat, order: index}));
        updateCategoryOrder(updatedOrder);
        setDraggedCategoryId(null);
    };

    return (
        React.createElement('div', { className: "mb-8 p-4 border rounded-lg bg-gray-50" },
            React.createElement('h2', { className: "text-xl font-semibold mb-4 text-gray-700 flex items-center" }, React.createElement(Tag, { className: "ml-2" }), "ניהול קטגוריות"),
            React.createElement('div', { className: "flex flex-col sm:flex-row gap-2 mb-4" },
                React.createElement('input', { 
                    type: "text", 
                    value: newCategoryName,
                    onChange: (e) => setNewCategoryName(e.target.value),
                    placeholder: "שם קטגוריה חדשה",
                    className: "flex-grow border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                }),
                React.createElement('button', { onClick: handleAddCategory, className: "px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition flex items-center justify-center" },
                    React.createElement(PlusCircle, { size: 18, className: "ml-2" }), " הוסף"
                )
            ),
            React.createElement('ul', { className: "space-y-2" },
                sortedCategories.map(cat => (
                    React.createElement('li', { 
                        key: cat.id, 
                        className: `flex items-center justify-between p-2 rounded-md bg-white border transition-opacity ${draggedCategoryId === cat.id ? 'opacity-50' : 'opacity-100'}`,
                        draggable: !editingCategoryId,
                        onDragStart: (e) => handleDragStart(e, cat.id),
                        onDragOver: handleDragOver,
                        onDrop: (e) => handleDrop(e, cat.id),
                        onDragEnd: () => setDraggedCategoryId(null)
                    },
                        React.createElement('div', { className: "flex items-center" },
                            React.createElement(GripVertical, { className: "cursor-move text-gray-400 ml-2" }),
                            editingCategoryId === cat.id ? (
                                React.createElement('input', {
                                    type: "text",
                                    value: editingCategoryName,
                                    onChange: (e) => setEditingCategoryName(e.target.value),
                                    className: "border border-gray-300 rounded-md py-1 px-2",
                                    autoFocus: true
                                })
                            ) : (
                                React.createElement('span', null, cat.name)
                            )
                        ),
                        React.createElement('div', { className: "flex gap-2" },
                            editingCategoryId === cat.id ? (
                                React.createElement(React.Fragment, null,
                                    React.createElement('button', { onClick: () => handleSaveEdit(cat.id), className: "text-green-600 hover:text-green-800" }, React.createElement(Save, { size: 18 })),
                                    React.createElement('button', { onClick: handleCancelEdit, className: "text-gray-500 hover:text-gray-700" }, React.createElement(X, { size: 18 }))
                                )
                            ) : (
                                React.createElement(React.Fragment, null,
                                    React.createElement('button', { onClick: () => handleEdit(cat), className: "text-indigo-600 hover:text-indigo-900" }, React.createElement(Edit, { size: 18 })),
                                    React.createElement('button', { onClick: () => deleteCategory(cat.id), className: "text-red-600 hover:text-red-900" }, React.createElement(Trash2, { size: 18 }))
                                )
                            )
                        )
                    )
                ))
            )
        )
    );
}
const ProductList = ({ category }) => {
    const { products, deleteProduct, updateProductOrder } = useProducts();
    const [draggedProductId, setDraggedProductId] = React.useState(null);

    const categoryProducts = products.filter(p => p.categoryId === category.id).sort((a,b) => a.order - b.order);

    const handleDelete = (id, name) => {
        if (window.confirm(`האם אתה בטוח שברצונך למחוק את המוצר "${name}"?`)) {
            deleteProduct(id);
        }
    };
    const handleDragStart = (e, id) => {
        setDraggedProductId(id);
        e.dataTransfer.effectAllowed = 'move';
    };
    const handleDrop = (e, targetProductId) => {
        e.preventDefault();
        if (!draggedProductId || draggedProductId === targetProductId) return;

        const draggedIndex = categoryProducts.findIndex(p => p.id === draggedProductId);
        const targetIndex = categoryProducts.findIndex(p => p.id === targetProductId);

        const reordered = [...categoryProducts];
        const [draggedItem] = reordered.splice(draggedIndex, 1);
        reordered.splice(targetIndex, 0, draggedItem);
        
        const updatedOrder = reordered.map((p, index) => ({...p, order: index}));
        updateProductOrder(category.id, updatedOrder);
        setDraggedProductId(null);
    };

    return (
        React.createElement('div', { className: "overflow-x-auto" },
            React.createElement('table', { className: "min-w-full bg-white" },
                React.createElement('thead', { className: "bg-gray-50 hidden md:table-header-group" },
                    React.createElement('tr', null,
                        React.createElement('th', { className: "w-10" }),
                        React.createElement('th', { className: "px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider" }, "תמונה"),
                        React.createElement('th', { className: "px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider" }, "שם מוצר"),
                        React.createElement('th', { className: "px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider" }, "מחיר"),
                        React.createElement('th', { className: "px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider" }, "סטטוס"),
                        React.createElement('th', { className: "px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider" }, "פעולות")
                    )
                ),
                React.createElement('tbody', { className: "block md:table-row-group" },
                    categoryProducts.map(product => {
                        const totalStock = product.variants.reduce((sum, v) => sum + v.stock, 0);
                        const isInStock = totalStock > 0;
                        return (
                            React.createElement('tr', { key: product.id,
                                draggable: true,
                                onDragStart: (e) => handleDragStart(e, product.id),
                                onDragOver: (e) => e.preventDefault(),
                                onDrop: (e) => handleDrop(e, product.id),
                                onDragEnd: () => setDraggedProductId(null),
                                className: `block mb-4 p-4 border rounded-lg hover:bg-gray-50 md:table-row md:p-0 md:mb-0 md:border-0 md:border-b transition-opacity ${draggedProductId === product.id ? 'opacity-50' : 'opacity-100'}`
                            },
                                React.createElement('td', { className: "hidden md:table-cell text-center cursor-move text-gray-400" }, React.createElement(GripVertical, null)),
                                React.createElement('td', { className: "flex justify-between items-center py-2 border-b md:border-b-0 md:table-cell md:px-6 md:py-4" },
                                    React.createElement('span', { className: "font-bold text-sm text-gray-600 md:hidden" }, "תמונה"),
                                    React.createElement('img', { src: product.variants[0]?.imageUrls[0] || '', alt: product.name, className: "w-16 h-16 rounded-md object-cover"})
                                ),
                                React.createElement('td', { className: "flex justify-between items-center py-2 border-b md:border-b-0 md:table-cell md:px-6 md:py-4 text-sm font-medium text-gray-900" },
                                    React.createElement('span', { className: "font-bold text-sm text-gray-600 md:hidden" }, "שם מוצר"),
                                    React.createElement('span', null, product.name)
                                ),
                                React.createElement('td', { className: "flex justify-between items-center py-2 border-b md:border-b-0 md:table-cell md:px-6 md:py-4 text-sm text-gray-500" },
                                    React.createElement('span', { className: "font-bold text-sm text-gray-600 md:hidden" }, "מחיר"),
                                    React.createElement('span', null, `₪${product.variants[0]?.price || 'N/A'}`)
                                ),
                                React.createElement('td', { className: "flex justify-between items-center py-2 border-b md:border-b-0 md:table-cell md:px-6 md:py-4 text-sm" },
                                    React.createElement('span', { className: "font-bold text-sm text-gray-600 md:hidden" }, "סטטוס"),
                                    React.createElement('span', { className: `px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${isInStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}` },
                                        isInStock ? 'במלאי' : 'אזל'
                                    )
                                ),
                                React.createElement('td', { className: "py-2 pt-4 md:pt-2 md:table-cell md:px-6 md:py-4 text-sm font-medium" },
                                    React.createElement('div', { className: "flex items-center justify-center md:justify-end gap-4" },
                                        React.createElement(Link, { to: `/admin/product/edit/${product.id}`, className: "text-indigo-600 hover:text-indigo-900", "aria-label": `Edit ${product.name}` },
                                            React.createElement(Edit, { size: 20 })
                                        ),
                                        React.createElement('button', { onClick: () => handleDelete(product.id, product.name), className: "text-red-600 hover:text-red-900", "aria-label": `Delete ${product.name}` },
                                            React.createElement(Trash2, { size: 20 })
                                        )
                                    )
                                )
                            )
                        )
                    })
                )
            ),
            categoryProducts.length === 0 && (
                React.createElement('p', { className: "text-center text-gray-500 py-4" }, "אין מוצרים בקטגוריה זו.")
            )
        )
    );
}
const AdminDashboardPage = () => {
    const { categories } = useProducts();
    const sortedCategories = [...categories].sort((a, b) => a.order - b.order);

    return (
        React.createElement('div', { className: "bg-white p-4 sm:p-6 rounded-lg shadow-lg" },
            React.createElement('div', { className: "flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4" },
                React.createElement('h1', { className: "text-2xl font-bold text-gray-800" }, "ניהול חנות"),
                React.createElement(Link, {
                    to: "/admin/product/new",
                    className: "inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition w-full sm:w-auto"
                },
                    React.createElement(PlusCircle, { className: "ml-2 h-5 w-5" }),
                    "הוסף מוצר חדש"
                )
            ),
            React.createElement(StatsPanel, null),
            React.createElement(CategoryManager, null),
            React.createElement('div', { className: "space-y-4" },
                sortedCategories.map(category => (
                    React.createElement('details', { key: category.id, className: "border rounded-lg group", open: true },
                        React.createElement('summary', { className: "flex justify-between items-center p-4 cursor-pointer bg-gray-50 hover:bg-gray-100 rounded-t-lg list-none" },
                            React.createElement('h2', { className: "text-xl font-semibold text-gray-700" }, category.name),
                            React.createElement(ChevronDown, { className: "group-open:rotate-180 transition-transform"})
                        ),
                        React.createElement('div', { className: "p-0 md:p-4 border-t" },
                           React.createElement(ProductList, { category: category })
                        )
                    )
                ))
            )
        )
    );
};

// --- pages/AdminProductEditPage.tsx ---
const createNewProductState = (products, categories) => {
    const maxOrder = products.reduce((max, p) => p.order > max ? p.order : max, -1);
    return {
        name: '',
        description: '',
        categoryId: categories[0]?.id || '',
        order: maxOrder + 1,
        variants: [{ id: `v${Date.now()}`, name: 'Standard', price: 0, stock: 0, imageUrls: [] }],
        specifications: [{ key: '', value: '' }],
        tags: [],
        isPopular: false,
        videoUrl: '',
    };
};
const AdminProductEditPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { getProductById, addProduct, updateProduct, categories, products } = useProducts();
    
    const isEditing = Boolean(id);

    const [product, setProduct] = React.useState(() => createNewProductState(products, categories));
    const [tagInput, setTagInput] = React.useState('');

    React.useEffect(() => {
        if (isEditing && id) {
            const existingProduct = getProductById(id);
            if (existingProduct) {
                setProduct(JSON.parse(JSON.stringify(existingProduct)));
            }
        } else {
            setProduct(createNewProductState(products, categories));
        }
    }, [id, isEditing, getProductById, products, categories]);

    React.useEffect(() => {
        const videoUrl = product.videoUrl;
        return () => {
            if (videoUrl && videoUrl.startsWith('blob:')) {
                URL.revokeObjectURL(videoUrl);
            }
        };
    }, [product.videoUrl]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setProduct(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleAddTag = () => {
        const newTag = tagInput.trim();
        if (newTag && !(product.tags || []).includes(newTag)) {
            setProduct(prev => ({ ...prev, tags: [...(prev.tags || []), newTag]}));
            setTagInput('');
        }
    };
    
    const handleRemoveTag = (tagToRemove) => {
        setProduct(prev => ({ ...prev, tags: (prev.tags || []).filter(t => t !== tagToRemove)}));
    };

    const handleTagInputKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddTag();
        }
    };
    
    const handleVariantChange = (variantId, field, value) => {
        setProduct(prev => ({
            ...prev,
            variants: prev.variants.map(v => v.id === variantId ? {...v, [field]: value} : v)
        }));
    };

    const handleVariantImageFilesChange = (variantId, files) => {
        if (!files) return;

        const filePromises = Array.from(files).map(file => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = (event) => resolve(event.target?.result);
                reader.onerror = (error) => reject(error);
                reader.readAsDataURL(file);
            });
        });

        Promise.all(filePromises).then(base64Urls => {
             setProduct(prev => ({
                ...prev,
                variants: prev.variants.map(v => 
                    v.id === variantId 
                    ? {...v, imageUrls: [...v.imageUrls, ...base64Urls]} 
                    : v
                )
            }));
        });
    };
    
    const removeVariantImage = (variantId, imageUrl) => {
        setProduct(prev => ({
            ...prev,
            variants: prev.variants.map(v => 
                v.id === variantId 
                ? {...v, imageUrls: v.imageUrls.filter(url => url !== imageUrl)} 
                : v
            )
        }));
    };
    
    const handleVideoFileChange = (e) => {
        if (product.videoUrl && product.videoUrl.startsWith('blob:')) {
            URL.revokeObjectURL(product.videoUrl);
        }

        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const videoObjectURL = URL.createObjectURL(file);
            setProduct(prev => ({ ...prev, videoUrl: videoObjectURL }));
        } else {
             setProduct(prev => ({ ...prev, videoUrl: '' }));
        }
    };

    const handleRemoveVideo = () => {
        if (product.videoUrl && product.videoUrl.startsWith('blob:')) {
            URL.revokeObjectURL(product.videoUrl);
        }
        setProduct(prev => ({ ...prev, videoUrl: '' }));
    };

    const addVariant = () => {
        setProduct(prev => ({
            ...prev,
            variants: [...prev.variants, { id: `v${Date.now()}`, name: '', price: 0, stock: 0, imageUrls: [] }]
        }));
    };

    const removeVariant = (variantId) => {
        if (product.variants.length <= 1) {
            alert("חייבת להיות לפחות וריאציה אחת למוצר.");
            return;
        }
        setProduct(prev => ({ ...prev, variants: prev.variants.filter(v => v.id !== variantId) }));
    };

    const handleSpecChange = (index, field, value) => {
        const newSpecs = [...product.specifications];
        newSpecs[index][field] = value;
        setProduct(prev => ({ ...prev, specifications: newSpecs }));
    };
    
    const addSpec = () => {
        setProduct(prev => ({ ...prev, specifications: [...prev.specifications, {key: '', value: ''}]}));
    }

    const removeSpec = (index) => {
        setProduct(prev => ({ ...prev, specifications: prev.specifications.filter((_, i) => i !== index)}));
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const finalProduct = {
            ...product,
            specifications: product.specifications.filter(s => s.key.trim() !== '' && s.value.trim() !== '')
        };

        if (isEditing && id) {
            updateProduct({ ...finalProduct, id });
        } else {
            addProduct(finalProduct);
        }
        navigate('/admin');
    };

    return (
        React.createElement('div', { className: "bg-white p-6 rounded-lg shadow-lg max-w-4xl mx-auto" },
            React.createElement('h1', { className: "text-2xl font-bold text-gray-800 mb-6" }, isEditing ? 'עריכת מוצר' : 'הוספת מוצר חדש'),
            React.createElement('form', { onSubmit: handleSubmit, className: "space-y-8" },
                React.createElement('div', { className: "p-4 border rounded-md space-y-4" },
                    React.createElement('h2', { className: "text-lg font-semibold" }, "פרטים כלליים"),
                    React.createElement('input', { type: "text", name: "name", placeholder: "שם מוצר", value: product.name, onChange: handleChange, className: "w-full form-input", required: true }),
                    React.createElement('textarea', { name: "description", placeholder: "תיאור", value: product.description, onChange: handleChange, rows: 4, className: "w-full form-input", required: true }),
                    React.createElement('div', { className: "grid grid-cols-1 sm:grid-cols-2 gap-4" },
                        React.createElement('select', { name: "categoryId", value: product.categoryId, onChange: handleChange, className: "w-full form-select" },
                           categories.map(cat => React.createElement('option', { key: cat.id, value: cat.id }, cat.name))
                        ),
                        React.createElement('input', { type: "number", name: "order", placeholder: "סדר תצוגה", value: product.order, onChange: handleChange, className: "w-full form-input", required: true })
                    ),
                     React.createElement('div', { className: "space-y-2" },
                        React.createElement('label', { className: "font-medium" }, "תגיות"),
                        React.createElement('div', { className: "flex flex-wrap gap-2 mb-2 p-2 border rounded-md min-h-[40px]" },
                            (product.tags || []).map(tag => (
                                React.createElement('span', { key: tag, className: "flex items-center gap-1 bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded-full" },
                                    tag,
                                    React.createElement('button', { type: "button", onClick: () => handleRemoveTag(tag), className: "text-blue-600 hover:text-blue-900" },
                                        React.createElement(X, { size: 14 })
                                    )
                                )
                            ))
                        ),
                        React.createElement('div', { className: "flex gap-2" },
                             React.createElement('input', {
                                id: "tags-input",
                                type: "text",
                                value: tagInput,
                                onChange: (e) => setTagInput(e.target.value),
                                onKeyDown: handleTagInputKeyDown,
                                placeholder: "הקלד תגית ולחץ Enter",
                                className: "form-input flex-grow"
                            }),
                            React.createElement('button', { type: "button", onClick: handleAddTag, className: "px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300" }, "הוסף")
                        )
                    ),
                    React.createElement('div', null,
                        React.createElement('label', { htmlFor: "videoUrl", className: "block text-sm font-medium text-gray-700 mb-1" }, "העלה סרטון (אופציונלי)"),
                        React.createElement('input', { type: "file", id: "videoUrl", name: "videoUrl", accept: "video/*", onChange: handleVideoFileChange, className: "w-full form-input" }),
                        product.videoUrl && (
                             React.createElement('div', { className: "relative mt-2" },
                                React.createElement('video', { src: product.videoUrl, controls: true, className: "w-full rounded max-h-48" }),
                                React.createElement('button', { type: "button", onClick: handleRemoveVideo, className: "absolute top-2 right-2 bg-black bg-opacity-50 text-white rounded-full p-1 hover:bg-opacity-75", "aria-label": "Remove video" },
                                    React.createElement(Trash2, { size: 18 })
                                )
                            )
                        )
                    ),
                    React.createElement('div', { className: "flex items-center gap-2" },
                         React.createElement('input', { type: "checkbox", name: "isPopular", id: "isPopular", checked: !!product.isPopular, onChange: handleChange, className: "h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" }),
                        React.createElement('label', { htmlFor: "isPopular" }, "סמן כמוצר פופולרי")
                    )
                ),
                React.createElement('div', { className: "p-4 border rounded-md" },
                    React.createElement('h2', { className: "text-lg font-semibold mb-4" }, "וריאציות (צבע / מידה)"),
                    React.createElement('div', { className: "space-y-4" },
                        product.variants.map((variant) => (
                            React.createElement('div', { key: variant.id, className: "p-3 border rounded-md bg-gray-50 relative" },
                                product.variants.length > 1 && (
                                    React.createElement('button', { type: "button", onClick: () => removeVariant(variant.id), className: "absolute top-2 left-2 text-red-500 hover:text-red-700" },
                                        React.createElement(Trash2, { size: 18 })
                                    )
                                ),
                                React.createElement('div', { className: "grid grid-cols-1 sm:grid-cols-3 gap-4" },
                                    React.createElement('input', { type: "text", placeholder: "שם וריאציה (למשל, שחור)", value: variant.name, onChange: e => handleVariantChange(variant.id, 'name', e.target.value), className: "form-input", required: true }),
                                    React.createElement('input', { type: "number", placeholder: "מחיר", value: variant.price, onChange: e => handleVariantChange(variant.id, 'price', parseFloat(e.target.value)), className: "form-input", required: true }),
                                    React.createElement('input', { type: "number", placeholder: "כמות במלאי", value: variant.stock, onChange: e => handleVariantChange(variant.id, 'stock', parseInt(e.target.value)), className: "form-input", required: true })
                                ),
                                React.createElement('div', { className: "mt-4" },
                                     React.createElement('label', { className: "block text-sm font-medium text-gray-700 mb-1" }, "תמונות וריאציה"),
                                     React.createElement('input', { type: "file", multiple: true, accept: "image/*", onChange: (e) => handleVariantImageFilesChange(variant.id, e.target.files), className: "w-full form-input" }),
                                     React.createElement('div', { className: "flex flex-wrap gap-2 mt-2" },
                                        variant.imageUrls.map((url, idx) => (
                                            React.createElement('div', { key: idx, className: "relative" },
                                                React.createElement('img', { src: url, className: "w-16 h-16 object-cover rounded", alt: `variant thumbnail ${idx}` }),
                                                React.createElement('button', { type: "button", onClick: () => removeVariantImage(variant.id, url), className: "absolute -top-1 -right-1 bg-red-500 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs" }, "X")
                                            )
                                        ))
                                     )
                                )
                            )
                        ))
                    ),
                    React.createElement('button', { type: "button", onClick: addVariant, className: "mt-4 flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800" },
                        React.createElement(PlusCircle, { size: 16 }), " הוסף וריאציה"
                    )
                ),
                React.createElement('div', { className: "p-4 border rounded-md" },
                    React.createElement('h2', { className: "text-lg font-semibold mb-4" }, "מפרט טכני"),
                    React.createElement('div', { className: "space-y-2" },
                        product.specifications.map((spec, index) => (
                             React.createElement('div', { key: index, className: "flex gap-2 items-center" },
                                React.createElement('input', { type: "text", placeholder: "תכונה (למשל, חומר)", value: spec.key, onChange: (e) => handleSpecChange(index, 'key', e.target.value), className: "form-input w-1/3"}),
                                React.createElement('input', { type: "text", placeholder: "ערך (למשל, קורדורה)", value: spec.value, onChange: (e) => handleSpecChange(index, 'value', e.target.value), className: "form-input flex-grow"}),
                                React.createElement('button', { type: "button", onClick: () => removeSpec(index), className: "text-red-500 hover:text-red-700" }, React.createElement(Trash2, { size: 18}))
                             )
                        ))
                    ),
                    React.createElement('button', { type: "button", onClick: addSpec, className: "mt-4 flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800" },
                        React.createElement(PlusCircle, { size: 16 }), " הוסף שורת מפרט"
                    )
                ),
                React.createElement('div', { className: "flex justify-end gap-4 pt-4" },
                     React.createElement('button', { type: "button", onClick: () => navigate('/admin'), className: "px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition" }, "ביטול"),
                    React.createElement('button', { type: "submit", className: "px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition" }, isEditing ? 'שמור שינויים' : 'הוסף מוצר')
                )
            )
        )
    );
};

// --- pages/SearchPage.tsx ---
const SearchPage = () => {
    const [searchParams] = useSearchParams();
    const { products } = useProducts();
    const query = searchParams.get('q') || '';

    const fuse = React.useMemo(() => new Fuse(products, {
        keys: ['name', 'description', 'tags'],
        includeScore: true,
        threshold: 0.4,
    }), [products]);

    const results = React.useMemo(() => {
        if (!query) return [];
        return fuse.search(query).map(result => result.item);
    }, [query, fuse]);

    return (
        React.createElement('div', null,
            React.createElement('div', { className: "mb-8" },
                React.createElement('h1', { className: "text-2xl md:text-3xl font-bold text-gray-800" },
                    "תוצאות חיפוש עבור: ", React.createElement('span', { className: "text-blue-600" }, `"${query}"`)
                ),
                React.createElement('p', { className: "text-gray-600 mt-2" }, `${results.length} תוצאות נמצאו`)
            ),
            results.length > 0 ? (
                React.createElement('div', { className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6" },
                    results.map(product => (
                        React.createElement(ProductCard, { key: product.id, product: product })
                    ))
                )
            ) : (
                React.createElement('div', { className: "text-center py-16 bg-white rounded-lg shadow" },
                    React.createElement('h2', { className: "text-xl font-semibold text-gray-700" }, "לא נמצאו תוצאות"),
                    React.createElement('p', { className: "text-gray-500 mt-2" }, "נסה לחפש מונח אחר או בדוק את איות המילים.")
                )
            )
        )
    );
};

// --- App.tsx ---
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? React.createElement(React.Fragment, null, children) : React.createElement(Navigate, { to: "/admin/login" });
};
function AppContent() {
    return (
        React.createElement('div', { className: "flex flex-col min-h-screen bg-gray-50" },
            React.createElement(Header, null),
            React.createElement('main', { className: "flex-grow container mx-auto px-4 py-8" },
                React.createElement(Routes, null,
                    React.createElement(Route, { path: "/", element: React.createElement(HomePage, null) }),
                    React.createElement(Route, { path: "/search", element: React.createElement(SearchPage, null) }),
                    React.createElement(Route, { path: "/product/:id", element: React.createElement(ProductDetailPage, null) }),
                    React.createElement(Route, { path: "/admin/login", element: React.createElement(AdminLoginPage, null) }),
                    React.createElement(Route, { 
                        path: "/admin", 
                        element: React.createElement(ProtectedRoute, null, React.createElement(AdminDashboardPage, null)) 
                    }),
                    React.createElement(Route, { 
                        path: "/admin/product/new", 
                        element: React.createElement(ProtectedRoute, null, React.createElement(AdminProductEditPage, null)) 
                    }),
                    React.createElement(Route, { 
                        path: "/admin/product/edit/:id", 
                        element: React.createElement(ProtectedRoute, null, React.createElement(AdminProductEditPage, null)) 
                    })
                )
            ),
            React.createElement(Footer, null)
        )
    );
}
function App() {
  return (
    React.createElement(AuthProvider, null,
      React.createElement(ProductProvider, null,
        React.createElement(HashRouter, null,
          React.createElement(AppContent, null)
        )
      )
    )
  );
}

// --- index.tsx ---
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}
const root = ReactDOM.createRoot(rootElement);
root.render(
  React.createElement(React.StrictMode, null,
    React.createElement(App, null)
  )
);
