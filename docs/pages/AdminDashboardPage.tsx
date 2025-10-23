import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { PlusCircle, Edit, Trash2, Save, X, Tag, GripVertical, ChevronDown, Archive, Package, AlertTriangle } from 'lucide-react';
import { Category, Product } from '../types';


const StatsPanel: React.FC = () => {
    const { products, categories } = useProducts();
    const outOfStockCount = products.filter(p => p.variants.every(v => v.stock === 0)).length;

    return (
        <div className="mb-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-blue-100 p-4 rounded-lg flex items-center">
                <Package size={24} className="text-blue-500 ml-4" />
                <div>
                    <div className="text-2xl font-bold">{products.length}</div>
                    <div className="text-sm text-gray-600">סה"כ מוצרים</div>
                </div>
            </div>
            <div className="bg-green-100 p-4 rounded-lg flex items-center">
                <Archive size={24} className="text-green-500 ml-4" />
                <div>
                    <div className="text-2xl font-bold">{categories.length}</div>
                    <div className="text-sm text-gray-600">סה"כ קטגוריות</div>
                </div>
            </div>
             <div className="bg-red-100 p-4 rounded-lg flex items-center">
                <AlertTriangle size={24} className="text-red-500 ml-4" />
                <div>
                    <div className="text-2xl font-bold">{outOfStockCount}</div>
                    <div className="text-sm text-gray-600">מוצרים שאזלו מהמלאי</div>
                </div>
            </div>
        </div>
    );
}

const CategoryManager: React.FC = () => {
    const { categories, addCategory, updateCategory, deleteCategory, updateCategoryOrder } = useProducts();
    const [newCategoryName, setNewCategoryName] = useState('');
    const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
    const [editingCategoryName, setEditingCategoryName] = useState('');
    const [draggedCategoryId, setDraggedCategoryId] = useState<string | null>(null);

    const sortedCategories = [...categories].sort((a, b) => a.order - b.order);

    const handleAddCategory = () => {
        addCategory(newCategoryName);
        setNewCategoryName('');
    };

    const handleEdit = (category: Category) => {
        setEditingCategoryId(category.id);
        setEditingCategoryName(category.name);
    }
    
    const handleSaveEdit = (id: string) => {
        updateCategory(id, editingCategoryName);
        setEditingCategoryId(null);
        setEditingCategoryName('');
    }
    
    const handleCancelEdit = () => {
        setEditingCategoryId(null);
        setEditingCategoryName('');
    }
    
    const handleDragStart = (e: React.DragEvent<HTMLLIElement>, id: string) => {
        setDraggedCategoryId(id);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e: React.DragEvent<HTMLLIElement>) => {
        e.preventDefault();
    };

    const handleDrop = (e: React.DragEvent<HTMLLIElement>, targetCategoryId: string) => {
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
        <div className="mb-8 p-4 border rounded-lg bg-gray-50">
            <h2 className="text-xl font-semibold mb-4 text-gray-700 flex items-center"><Tag className="ml-2" />ניהול קטגוריות</h2>
            <div className="flex flex-col sm:flex-row gap-2 mb-4">
                <input 
                    type="text" 
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="שם קטגוריה חדשה"
                    className="flex-grow border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                <button onClick={handleAddCategory} className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition flex items-center justify-center">
                    <PlusCircle size={18} className="ml-2" /> הוסף
                </button>
            </div>
            <ul className="space-y-2">
                {sortedCategories.map(cat => (
                    <li 
                        key={cat.id} 
                        className={`flex items-center justify-between p-2 rounded-md bg-white border transition-opacity ${draggedCategoryId === cat.id ? 'opacity-50' : 'opacity-100'}`}
                        draggable={!editingCategoryId}
                        onDragStart={(e) => handleDragStart(e, cat.id)}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, cat.id)}
                        onDragEnd={() => setDraggedCategoryId(null)}
                    >
                        <div className="flex items-center">
                            <GripVertical className="cursor-move text-gray-400 ml-2" />
                            {editingCategoryId === cat.id ? (
                                <input
                                    type="text"
                                    value={editingCategoryName}
                                    onChange={(e) => setEditingCategoryName(e.target.value)}
                                    className="border border-gray-300 rounded-md py-1 px-2"
                                    autoFocus
                                />
                            ) : (
                                <span>{cat.name}</span>
                            )}
                        </div>
                        <div className="flex gap-2">
                            {editingCategoryId === cat.id ? (
                                <>
                                    <button onClick={() => handleSaveEdit(cat.id)} className="text-green-600 hover:text-green-800"><Save size={18} /></button>
                                    <button onClick={handleCancelEdit} className="text-gray-500 hover:text-gray-700"><X size={18} /></button>
                                </>
                            ) : (
                                <>
                                    <button onClick={() => handleEdit(cat)} className="text-indigo-600 hover:text-indigo-900"><Edit size={18} /></button>
                                    <button onClick={() => deleteCategory(cat.id)} className="text-red-600 hover:text-red-900"><Trash2 size={18} /></button>
                                </>
                            )}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

const ProductList: React.FC<{ category: Category }> = ({ category }) => {
    const { products, deleteProduct, updateProductOrder } = useProducts();
    const [draggedProductId, setDraggedProductId] = useState<string | null>(null);

    const categoryProducts = products.filter(p => p.categoryId === category.id).sort((a,b) => a.order - b.order);

    const handleDelete = (id: string, name: string) => {
        if (window.confirm(`האם אתה בטוח שברצונך למחוק את המוצר "${name}"?`)) {
            deleteProduct(id);
        }
    };

    const handleDragStart = (e: React.DragEvent<HTMLTableRowElement>, id: string) => {
        setDraggedProductId(id);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDrop = (e: React.DragEvent<HTMLTableRowElement>, targetProductId: string) => {
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
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
                <thead className="bg-gray-50 hidden md:table-header-group">
                    <tr>
                        <th className="w-10"></th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">תמונה</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">שם מוצר</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">מחיר</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">סטטוס</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">פעולות</th>
                    </tr>
                </thead>
                <tbody className="block md:table-row-group">
                    {categoryProducts.map(product => {
                        const totalStock = product.variants.reduce((sum, v) => sum + v.stock, 0);
                        const isInStock = totalStock > 0;
                        return (
                            <tr key={product.id}
                                draggable
                                onDragStart={(e) => handleDragStart(e, product.id)}
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={(e) => handleDrop(e, product.id)}
                                onDragEnd={() => setDraggedProductId(null)}
                                className={`block mb-4 p-4 border rounded-lg hover:bg-gray-50 md:table-row md:p-0 md:mb-0 md:border-0 md:border-b transition-opacity ${draggedProductId === product.id ? 'opacity-50' : 'opacity-100'}`}
                            >
                                <td className="hidden md:table-cell text-center cursor-move text-gray-400"><GripVertical /></td>
                                <td className="flex justify-between items-center py-2 border-b md:border-b-0 md:table-cell md:px-6 md:py-4">
                                    <span className="font-bold text-sm text-gray-600 md:hidden">תמונה</span>
                                    <img src={product.variants[0]?.imageUrls[0] || ''} alt={product.name} className="w-16 h-16 rounded-md object-cover"/>
                                </td>
                                <td className="flex justify-between items-center py-2 border-b md:border-b-0 md:table-cell md:px-6 md:py-4 text-sm font-medium text-gray-900">
                                    <span className="font-bold text-sm text-gray-600 md:hidden">שם מוצר</span>
                                    <span>{product.name}</span>
                                </td>
                                <td className="flex justify-between items-center py-2 border-b md:border-b-0 md:table-cell md:px-6 md:py-4 text-sm text-gray-500">
                                    <span className="font-bold text-sm text-gray-600 md:hidden">מחיר</span>
                                    <span>₪{product.variants[0]?.price || 'N/A'}</span>
                                </td>
                                <td className="flex justify-between items-center py-2 border-b md:border-b-0 md:table-cell md:px-6 md:py-4 text-sm">
                                    <span className="font-bold text-sm text-gray-600 md:hidden">סטטוס</span>
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${isInStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {isInStock ? 'במלאי' : 'אזל'}
                                    </span>
                                </td>
                                <td className="py-2 pt-4 md:pt-2 md:table-cell md:px-6 md:py-4 text-sm font-medium">
                                    <div className="flex items-center justify-center md:justify-end gap-4">
                                        <Link to={`/admin/product/edit/${product.id}`} className="text-indigo-600 hover:text-indigo-900" aria-label={`Edit ${product.name}`}>
                                            <Edit size={20} />
                                        </Link>
                                        <button onClick={() => handleDelete(product.id, product.name)} className="text-red-600 hover:text-red-900" aria-label={`Delete ${product.name}`}>
                                            <Trash2 size={20} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
            {categoryProducts.length === 0 && (
                <p className="text-center text-gray-500 py-4">אין מוצרים בקטגוריה זו.</p>
            )}
        </div>
    );
}

const AdminDashboardPage: React.FC = () => {
    const { categories } = useProducts();
    const sortedCategories = [...categories].sort((a, b) => a.order - b.order);

    return (
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h1 className="text-2xl font-bold text-gray-800">ניהול חנות</h1>
                <Link
                    to="/admin/product/new"
                    className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition w-full sm:w-auto"
                >
                    <PlusCircle className="ml-2 h-5 w-5" />
                    הוסף מוצר חדש
                </Link>
            </div>
            
            <StatsPanel />
            <CategoryManager />

            <div className="space-y-4">
                {sortedCategories.map(category => (
                    <details key={category.id} className="border rounded-lg group" open>
                        <summary className="flex justify-between items-center p-4 cursor-pointer bg-gray-50 hover:bg-gray-100 rounded-t-lg list-none">
                            <h2 className="text-xl font-semibold text-gray-700">{category.name}</h2>
                            <ChevronDown className="group-open:rotate-180 transition-transform"/>
                        </summary>
                        <div className="p-0 md:p-4 border-t">
                           <ProductList category={category} />
                        </div>
                    </details>
                ))}
            </div>
        </div>
    );
};

export default AdminDashboardPage;