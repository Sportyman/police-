import React, { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import ProductCard from '../components/ProductCard';
import Fuse from 'fuse.js';

const SearchPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const { products } = useProducts();
    const query = searchParams.get('q') || '';

    const fuse = useMemo(() => new Fuse(products, {
        keys: ['name', 'description', 'tags'],
        includeScore: true,
        threshold: 0.4, // Adjust for more/less fuzzy matching
    }), [products]);

    const results = useMemo(() => {
        if (!query) return [];
        return fuse.search(query).map(result => result.item);
    }, [query, fuse]);

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                    תוצאות חיפוש עבור: <span className="text-blue-600">"{query}"</span>
                </h1>
                <p className="text-gray-600 mt-2">{results.length} תוצאות נמצאו</p>
            </div>

            {results.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {results.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 bg-white rounded-lg shadow">
                    <h2 className="text-xl font-semibold text-gray-700">לא נמצאו תוצאות</h2>
                    <p className="text-gray-500 mt-2">נסה לחפש מונח אחר או בדוק את איות המילים.</p>
                </div>
            )}
        </div>
    );
};

export default SearchPage;