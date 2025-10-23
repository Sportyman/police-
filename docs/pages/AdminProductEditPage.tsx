import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { Product, Variant, Specification, Category, ProductTag } from '../types';
import { PlusCircle, Trash2, X } from 'lucide-react';

const createNewProductState = (products: Product[], categories: Category[]): Omit<Product, 'id'> => {
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

const AdminProductEditPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { getProductById, addProduct, updateProduct, categories, products } = useProducts();
    
    const isEditing = Boolean(id);

    const [product, setProduct] = useState<Omit<Product, 'id'>>(() => createNewProductState(products, categories));
    const [tagInput, setTagInput] = useState('');

    useEffect(() => {
        if (isEditing && id) {
            const existingProduct = getProductById(id);
            if (existingProduct) {
                // Deep copy to prevent state mutation issues
                setProduct(JSON.parse(JSON.stringify(existingProduct)));
            }
        } else {
            setProduct(createNewProductState(products, categories));
        }
    }, [id, isEditing, getProductById, products, categories]);

    // Effect to clean up blob URLs to prevent memory leaks
    useEffect(() => {
        const videoUrl = product.videoUrl;
        return () => {
            if (videoUrl && videoUrl.startsWith('blob:')) {
                URL.revokeObjectURL(videoUrl);
            }
        };
    }, [product.videoUrl]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;
        setProduct(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleAddTag = () => {
        const newTag = tagInput.trim();
        if (newTag && !(product.tags || []).includes(newTag)) {
            setProduct(prev => ({ ...prev, tags: [...(prev.tags || []), newTag]}));
            setTagInput('');
        }
    };
    
    const handleRemoveTag = (tagToRemove: string) => {
        setProduct(prev => ({ ...prev, tags: (prev.tags || []).filter(t => t !== tagToRemove)}));
    };

    const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddTag();
        }
    };
    
    const handleVariantChange = (variantId: string, field: keyof Variant, value: string | number | string[]) => {
        setProduct(prev => ({
            ...prev,
            variants: prev.variants.map(v => v.id === variantId ? {...v, [field]: value} : v)
        }));
    };

    const handleVariantImageFilesChange = (variantId: string, files: FileList | null) => {
        if (!files) return;

        const filePromises = Array.from(files).map(file => {
            return new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = (event) => resolve(event.target?.result as string);
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
    
    const removeVariantImage = (variantId: string, imageUrl: string) => {
        setProduct(prev => ({
            ...prev,
            variants: prev.variants.map(v => 
                v.id === variantId 
                ? {...v, imageUrls: v.imageUrls.filter(url => url !== imageUrl)} 
                : v
            )
        }));
    };
    
    const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

    const removeVariant = (variantId: string) => {
        if (product.variants.length <= 1) {
            alert("חייבת להיות לפחות וריאציה אחת למוצר.");
            return;
        }
        setProduct(prev => ({ ...prev, variants: prev.variants.filter(v => v.id !== variantId) }));
    };

    const handleSpecChange = (index: number, field: 'key' | 'value', value: string) => {
        const newSpecs = [...product.specifications];
        newSpecs[index][field] = value;
        setProduct(prev => ({ ...prev, specifications: newSpecs }));
    };
    
    const addSpec = () => {
        setProduct(prev => ({ ...prev, specifications: [...prev.specifications, {key: '', value: ''}]}));
    }

    const removeSpec = (index: number) => {
        setProduct(prev => ({ ...prev, specifications: prev.specifications.filter((_, i) => i !== index)}));
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Clean up empty specifications
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
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">{isEditing ? 'עריכת מוצר' : 'הוספת מוצר חדש'}</h1>
            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Main Product Details */}
                <div className="p-4 border rounded-md space-y-4">
                    <h2 className="text-lg font-semibold">פרטים כלליים</h2>
                    <input type="text" name="name" placeholder="שם מוצר" value={product.name} onChange={handleChange} className="w-full form-input" required />
                    <textarea name="description" placeholder="תיאור" value={product.description} onChange={handleChange} rows={4} className="w-full form-input" required />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <select name="categoryId" value={product.categoryId} onChange={handleChange} className="w-full form-select">
                           {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                        </select>
                        <input type="number" name="order" placeholder="סדר תצוגה" value={product.order} onChange={handleChange} className="w-full form-input" required />
                    </div>
                     <div className="space-y-2">
                        <label className="font-medium">תגיות</label>
                        <div className="flex flex-wrap gap-2 mb-2 p-2 border rounded-md min-h-[40px]">
                            {(product.tags || []).map(tag => (
                                <span key={tag} className="flex items-center gap-1 bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
                                    {tag}
                                    <button type="button" onClick={() => handleRemoveTag(tag)} className="text-blue-600 hover:text-blue-900">
                                        <X size={14} />
                                    </button>
                                </span>
                            ))}
                        </div>
                        <div className="flex gap-2">
                             <input
                                id="tags-input"
                                type="text"
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyDown={handleTagInputKeyDown}
                                placeholder="הקלד תגית ולחץ Enter"
                                className="form-input flex-grow"
                            />
                            <button type="button" onClick={handleAddTag} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">הוסף</button>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="videoUrl" className="block text-sm font-medium text-gray-700 mb-1">העלה סרטון (אופציונלי)</label>
                        <input type="file" id="videoUrl" name="videoUrl" accept="video/*" onChange={handleVideoFileChange} className="w-full form-input" />
                        {product.videoUrl && (
                             <div className="relative mt-2">
                                <video src={product.videoUrl} controls className="w-full rounded max-h-48" />
                                <button type="button" onClick={handleRemoveVideo} className="absolute top-2 right-2 bg-black bg-opacity-50 text-white rounded-full p-1 hover:bg-opacity-75" aria-label="Remove video">
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                         <input type="checkbox" name="isPopular" id="isPopular" checked={!!product.isPopular} onChange={handleChange} className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                        <label htmlFor="isPopular">סמן כמוצר פופולרי</label>
                    </div>
                </div>

                {/* Variants */}
                <div className="p-4 border rounded-md">
                    <h2 className="text-lg font-semibold mb-4">וריאציות (צבע / מידה)</h2>
                    <div className="space-y-4">
                        {product.variants.map((variant) => (
                            <div key={variant.id} className="p-3 border rounded-md bg-gray-50 relative">
                                {product.variants.length > 1 && (
                                    <button type="button" onClick={() => removeVariant(variant.id)} className="absolute top-2 left-2 text-red-500 hover:text-red-700">
                                        <Trash2 size={18} />
                                    </button>
                                )}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <input type="text" placeholder="שם וריאציה (למשל, שחור)" value={variant.name} onChange={e => handleVariantChange(variant.id, 'name', e.target.value)} className="form-input" required />
                                    <input type="number" placeholder="מחיר" value={variant.price} onChange={e => handleVariantChange(variant.id, 'price', parseFloat(e.target.value))} className="form-input" required />
                                    <input type="number" placeholder="כמות במלאי" value={variant.stock} onChange={e => handleVariantChange(variant.id, 'stock', parseInt(e.target.value))} className="form-input" required />
                                </div>
                                <div className="mt-4">
                                     <label className="block text-sm font-medium text-gray-700 mb-1">תמונות וריאציה</label>
                                     <input type="file" multiple accept="image/*" onChange={(e) => handleVariantImageFilesChange(variant.id, e.target.files)} className="w-full form-input" />
                                     <div className="flex flex-wrap gap-2 mt-2">
                                        {variant.imageUrls.map((url, idx) => (
                                            <div key={idx} className="relative">
                                                <img src={url} className="w-16 h-16 object-cover rounded" alt={`variant thumbnail ${idx}`} />
                                                <button type="button" onClick={() => removeVariantImage(variant.id, url)} className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs">X</button>
                                            </div>
                                        ))}
                                     </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button type="button" onClick={addVariant} className="mt-4 flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800">
                        <PlusCircle size={16} /> הוסף וריאציה
                    </button>
                </div>
                
                 {/* Specifications */}
                <div className="p-4 border rounded-md">
                    <h2 className="text-lg font-semibold mb-4">מפרט טכני</h2>
                    <div className="space-y-2">
                        {product.specifications.map((spec, index) => (
                             <div key={index} className="flex gap-2 items-center">
                                <input type="text" placeholder="תכונה (למשל, חומר)" value={spec.key} onChange={(e) => handleSpecChange(index, 'key', e.target.value)} className="form-input w-1/3"/>
                                <input type="text" placeholder="ערך (למשל, קורדורה)" value={spec.value} onChange={(e) => handleSpecChange(index, 'value', e.target.value)} className="form-input flex-grow"/>
                                <button type="button" onClick={() => removeSpec(index)} className="text-red-500 hover:text-red-700"><Trash2 size={18}/></button>
                             </div>
                        ))}
                    </div>
                    <button type="button" onClick={addSpec} className="mt-4 flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800">
                        <PlusCircle size={16} /> הוסף שורת מפרט
                    </button>
                </div>

                <div className="flex justify-end gap-4 pt-4">
                     <button type="button" onClick={() => navigate('/admin')} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition">ביטול</button>
                    <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">{isEditing ? 'שמור שינויים' : 'הוסף מוצר'}</button>
                </div>
            </form>
        </div>
    );
};

export default AdminProductEditPage;