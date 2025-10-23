import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';

interface ProductCardProps {
    product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    const firstVariant = product.variants[0];
    if (!firstVariant) {
        // Render a placeholder or nothing if a product has no variants
        return null;
    }

    const totalStock = product.variants.reduce((sum, v) => sum + v.stock, 0);
    const inStock = totalStock > 0;
    const displayPrice = firstVariant.price;
    const displayImageUrl = firstVariant.imageUrls[0] || 'https://picsum.photos/400/300';
    
    const statusText = inStock ? 'במלאי' : 'אזל מהמלאי';
    const statusStyles = inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-xl flex flex-col h-full relative">
            {product.tags && product.tags.length > 0 && (
                 <div className="absolute top-2 right-2 flex flex-col items-end gap-1 z-10">
                    {product.tags.map(tag => (
                        <span key={tag} className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">{tag}</span>
                    ))}
                 </div>
            )}
            <Link to={`/product/${product.id}`} className="block">
                <img src={displayImageUrl} alt={product.name} className="w-full h-48 object-cover" />
            </Link>
            <div className="p-4 flex flex-col flex-grow">
                <span className={`text-xs font-semibold mr-2 px-2.5 py-0.5 rounded-full self-start ${statusStyles}`}>
                    {statusText}
                </span>
                <h3 className="mt-2 text-lg font-bold text-gray-900">{product.name}</h3>
                <p className="mt-1 text-sm text-gray-600 flex-grow">{product.description.substring(0, 70)}...</p>
                <div className="mt-4 flex justify-between items-center">
                    <p className="text-xl font-bold text-blue-600">{`₪${displayPrice}`}</p>
                    <Link to={`/product/${product.id}`} className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center transition">
                        צפה בפרטים
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;