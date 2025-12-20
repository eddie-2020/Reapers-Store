
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

import DeleteModal from '../components/DeleteModal';

const Dashboard = () => {
    const [products, setProducts] = useState([]);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);
    const navigate = useNavigate();
    const { logout } = useAuth();

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/products/`);
            setProducts(response.data);
        } catch (error) {
            console.error('Error fetching products', error);
            toast.error('Failed to load products');
        }
    };

    const handleDeleteClick = (id) => {
        setProductToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!productToDelete) return;

        const toastId = toast.loading('Deleting...');
        try {
            await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/products/${productToDelete}/`);
            toast.success('Product deleted successfully', { id: toastId });
            fetchProducts();
            setIsDeleteModalOpen(false);
            setProductToDelete(null);
        } catch (error) {
            console.error('Error deleting product', error);
            toast.error('Failed to delete product', { id: toastId });
        }
    };

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setProductToDelete(null);
    };

    return (
        <div className="min-h-screen bg-white p-8">
            <div className="max-w-7xl mx-auto">
                <header className="flex justify-between items-center mb-10">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Products</h1>
                        <p className="text-gray-500 mt-1">Manage your inventory</p>
                    </div>
                    <div className="flex gap-4">
                        <button
                            onClick={() => navigate('/products/new')}
                            className="bg-black text-white px-6 py-2.5 rounded-lg font-medium hover:bg-gray-800 transition-all shadow-md hover:shadow-lg active:scale-95 cursor-pointer"
                        >
                            Add Product
                        </button>
                        <button
                            onClick={() => logout()}
                            className="text-gray-600 hover:text-black font-medium px-4 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                        >
                            Logout
                        </button>
                    </div>
                </header>

                <div className="flex justify-end mb-6">
                    <button
                        onClick={() => navigate('/announcements')}
                        className="bg-black text-white text-xs px-3 py-3 rounded-lg font-medium hover:bg-gray-800 transition-all shadow-sm active:scale-95 cursor-pointer flex items-center gap-1"
                    >
                        Manage Announcements
                    </button>
                </div>

                <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="py-4 px-6 font-semibold text-gray-700 text-sm uppercase tracking-wider">Image</th>
                                <th className="py-4 px-6 font-semibold text-gray-700 text-sm uppercase tracking-wider">Name</th>
                                <th className="py-4 px-6 font-semibold text-gray-700 text-sm uppercase tracking-wider">Price</th>
                                <th className="py-4 px-6 font-semibold text-gray-700 text-sm uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {products.map(product => (
                                <tr key={product.id} className="hover:bg-gray-50 transition-colors group">
                                    <td className="py-4 px-6">
                                        {product.images && product.images.length > 0 ? (
                                            <div className="h-12 w-12 rounded-lg overflow-hidden border border-gray-200">
                                                <img src={product.images[0].image} alt={product.name} className="h-full w-full object-cover" />
                                            </div>
                                        ) : (
                                            <div className="h-12 w-12 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 text-xs">No Img</div>
                                        )}
                                    </td>
                                    <td className="py-4 px-6 text-gray-900 font-medium">{product.name}</td>
                                    <td className="py-4 px-6 text-gray-600 font-mono">${product.price}</td>
                                    <td className="py-4 px-6 text-right">
                                        <button
                                            onClick={() => navigate(`/products/${product.id}/edit`)}
                                            className="text-gray-500 hover:text-black font-medium mr-4 transition-colors cursor-pointer"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDeleteClick(product.id)}
                                            className="text-gray-400 hover:text-red-600 font-medium transition-colors cursor-pointer"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {products.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="py-12 text-center text-gray-400">No products found. Add one to get started.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <DeleteModal
                isOpen={isDeleteModalOpen}
                onClose={closeDeleteModal}
                onConfirm={confirmDelete}
                title="Delete Product"
                message="Are you sure you want to delete this product? This action cannot be undone."
            />
        </div>
    );
};

export default Dashboard;
