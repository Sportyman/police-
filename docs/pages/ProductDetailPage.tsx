import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { ArrowRight, MessageCircle, Tag, CheckCircle } from 'lucide-react';
import ProductCard from '../components/ProductCard';

const ProductDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { products, getProductById, categories } = useProducts();
    const product = getProductById(id || '');

    const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);
    const [mainImage, setMainImage] = useState<string>('');
    const [notificationSent, setNotificationSent] = useState(false);

    useEffect(() => {
        if (product && product.variants.length > 0) {
            const defaultVariant = product.variants.find(v => v.stock > 0) || product.variants[0];
            setSelectedVariantId(defaultVariant.id);
            if (defaultVariant.imageUrls.length > 0) {
                setMainImage(defaultVariant.imageUrls[0]);
            }
        }
    }, [product]);

    if (!product) {
        return <div className="text-center py-10">מוצר לא נמצא.</div>;
    }

    const selectedVariant = product.variants.find(v => v.id === selectedVariantId);
    const category = categories.find(c => c.id === product.categoryId);
    const relatedProducts = products.filter(p => p.categoryId === product.categoryId && p.id !== product.id).slice(0, 4);

    const handleVariantChange = (variantId: string) => {
        setSelectedVariantId(variantId);
        const newVariant = product.variants.find(v => v.id === variantId);
        if (newVariant && newVariant.imageUrls.length > 0) {
            setMainImage(newVariant.imageUrls[0]);
        }
    };
    
    const handleNotifySubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // In a real app, this would send the email to a backend service.
        console.log(`Notification request for ${product.name} - ${selectedVariant?.name}`);
        setNotificationSent(true);
    };

    const whatsappNumber = "+972500000000"; // Placeholder
    const encodedMessage = encodeURIComponent(`היי, אני מעוניין להזמין את המוצר "${product.name} - ${selectedVariant?.name}".`);
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

    return (
        <div className="space-y-10">
            <div className="bg-white p-4 sm:p-6 md:p-8 rounded-lg shadow-lg max-w-5xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Image Gallery */}
                    <div>
                        <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
                            <img src={mainImage} alt={`${product.name} - ${selectedVariant?.name}`} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex gap-2 overflow-x-auto">
                            {selectedVariant?.imageUrls.map((url, index) => (
                                <button key={index} onClick={() => setMainImage(url)} className={`w-16 h-16 rounded-md overflow-hidden flex-shrink-0 border-2 ${mainImage === url ? 'border-blue-500' : 'border-transparent'}`}>
                                    <img src={url} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover"/>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Product Details */}
                    <div className="flex flex-col">
                        <div className="flex justify-between items-start">
                             {category && (
                                <span className="flex items-center text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded-full self-start mb-2">
                                    <Tag size={14} className="ml-1" />
                                    {category.name}
                                </span>
                            )}
                             {product.tags && product.tags.length > 0 && (
                                 <div className="flex flex-wrap gap-2">
                                    {product.tags.map(tag => (
                                        <span key={tag} className="text-xs font-semibold px-2.5 py-1 rounded-full bg-red-100 text-red-800">{tag}</span>
                                    ))}
                                 </div>
                            )}
                        </div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mt-2">{product.name}</h1>
                        
                        {selectedVariant && (
                            <p className="text-2xl md:text-3xl font-bold text-blue-600 mt-2">{`₪${selectedVariant.price}`}</p>
                        )}
                        
                        <p className="text-gray-600 mt-4 leading-relaxed">{product.description}</p>
                        
                        {/* Variant Selector */}
                        {product.variants.length > 1 && (
                            <div className="mt-6">
                                <h3 className="text-sm font-medium text-gray-900">{product.variants[0].name.match(/\d/) ? 'מידה' : 'צבע'}</h3>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {product.variants.map(variant => (
                                        <button 
                                            key={variant.id}
                                            onClick={() => handleVariantChange(variant.id)}
                                            className={`px-4 py-2 border rounded-md text-sm font-medium transition ${selectedVariantId === variant.id ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                                        >
                                            {variant.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                        
                        <div className="mt-auto pt-6">
                            {selectedVariant && selectedVariant.stock > 0 ? (
                                <a 
                                    href={whatsappUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition-transform hover:scale-105"
                                >
                                    <MessageCircle className="ml-3 h-5 w-5" />
                                    הזמנה דרך WhatsApp
                                </a>
                            ) : notificationSent ? (
                                <div className="text-center p-3 rounded-md bg-green-100 text-green-800 flex items-center justify-center">
                                    <CheckCircle size={20} className="ml-2" />
                                    קיבלנו! נעדכן אותך במייל כשהמוצר יחזור למלאי.
                                </div>
                            ) : (
                                <div className="p-4 border rounded-md bg-gray-50">
                                    <h4 className="font-semibold text-gray-800">אזל מהמלאי</h4>
                                    <p className="text-sm text-gray-600 mb-2">רוצה לקבל עדכון כשהמוצר יחזור למלאי?</p>
                                    <form onSubmit={handleNotifySubmit} className="flex gap-2">
                                        <input type="email" placeholder="האימייל שלך" required className="flex-grow border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"/>
                                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition">שלח</button>
                                    </form>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {product.videoUrl && (
                    <div className="mt-10 pt-6 border-t border-gray-200">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">סרטון מוצר</h2>
                        <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden shadow-inner">
                            <video src={product.videoUrl} autoPlay muted loop playsInline controls className="w-full h-full object-cover" />
                        </div>
                    </div>
                )}

                {/* Specifications */}
                {product.specifications.length > 0 && (
                     <div className="mt-10 pt-6 border-t border-gray-200">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">מפרט טכני</h2>
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <ul className="space-y-2">
                                {product.specifications.map(spec => (
                                    <li key={spec.key} className="flex justify-between text-sm">
                                        <span className="font-semibold text-gray-700">{spec.key}:</span>
                                        <span className="text-gray-600">{spec.value}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                     </div>
                )}
                 <div className="mt-8 pt-6 border-t border-gray-200">
                    <Link to="/" className="text-blue-600 hover:text-blue-800 flex items-center">
                        <ArrowRight className="ml-2 h-4 w-4" />
                        חזרה לקטלוג
                    </Link>
                </div>
            </div>

             {/* Related Products */}
            {relatedProducts.length > 0 && (
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">מוצרים קשורים</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {relatedProducts.map(p => <ProductCard key={p.id} product={p} />)}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductDetailPage;