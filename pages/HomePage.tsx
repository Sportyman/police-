import React from 'react';
import { useProducts } from '../hooks/useProducts';
import ProductCard from '../components/ProductCard';
import { Star } from 'lucide-react';

const HomePage: React.FC = () => {
  const { products, categories } = useProducts();
  const popularProducts = products.filter(p => p.isPopular);
  const sortedCategories = [...categories].sort((a, b) => a.order - b.order);

  const getCategoryProducts = (categoryId: string) => {
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
    <div className="space-y-12">
      <div
        className="relative bg-cover bg-center h-[60vh] min-h-[450px] rounded-xl shadow-2xl overflow-hidden flex items-end justify-center text-white p-8"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1612128362147-b5025d5d886a?q=80&w=2070&auto=format&fit=crop')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="relative z-10 text-center pb-4">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight" style={{ textShadow: '2px 2px 10px rgba(0,0,0,0.8)' }}>
            ציוד טקטי. אפס פשרות.
          </h1>
          <p className="mt-4 text-lg md:text-xl max-w-2xl mx-auto" style={{ textShadow: '1px 1px 6px rgba(0,0,0,0.7)' }}>
            ציוד מקצועי שנבחר בקפידה, מלוחמים עבור לוחמים.
          </p>
          <button
            onClick={handleScrollToCatalog}
            className="mt-8 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold rounded-lg shadow-lg transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-opacity-50"
          >
            גלה את הציוד
          </button>
        </div>
      </div>

      {/* Popular Products Section */}
      {popularProducts.length > 0 && (
        <section id="popular-products">
          <div className="flex items-center mb-4">
            <Star className="text-yellow-500 ml-2" />
            <h2 className="text-2xl font-bold text-gray-800">מוצרים פופולריים</h2>
          </div>
          <div className="relative">
            <div className="flex overflow-x-auto space-x-4 space-x-reverse pb-4">
              {popularProducts.map(product => (
                <div key={product.id} className="flex-shrink-0 w-64 sm:w-72">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}


      {/* All Products by Category Section */}
      <div className="space-y-10">
        {sortedCategories.map(category => {
          const categoryProducts = getCategoryProducts(category.id);
          if (categoryProducts.length === 0) return null;
          
          return (
            <div key={category.id}>
              <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-blue-500 pb-2">{category.name}</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {categoryProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  );
};

export default HomePage;