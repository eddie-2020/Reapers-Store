import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import DeleteModal from '../components/DeleteModal';

const Announcements = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);
    const [formData, setFormData] = useState({ text: '', is_active: true, order: 0 });
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);

    const navigate = useNavigate();
    const { logout } = useAuth();
    const API_URL = 'http://localhost:8000/api/core/announcements/';

    useEffect(() => {
        fetchAnnouncements();
    }, []);

    const fetchAnnouncements = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(API_URL);
            setAnnouncements(response.data);
        } catch (error) {
            console.error('Error fetching announcements', error);
            toast.error('Failed to load announcements');
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const toastId = toast.loading(isEditing ? 'Updating...' : 'Creating...');
        try {
            if (isEditing) {
                await axios.put(`${API_URL}${editId}/`, formData);
                toast.success('Announcement updated', { id: toastId });
            } else {
                await axios.post(API_URL, formData);
                toast.success('Announcement created', { id: toastId });
            }
            fetchAnnouncements();
            resetForm();
        } catch (error) {
            console.error('Error saving announcement', error);
            toast.error('Failed to save announcement', { id: toastId });
        }
    };

    const handleEdit = (announcement) => {
        setFormData({
            text: announcement.text,
            is_active: announcement.is_active,
            order: announcement.order
        });
        setEditId(announcement.id);
        setIsEditing(true);
    };

    const handleDeleteClick = (id) => {
        setItemToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!itemToDelete) return;

        const toastId = toast.loading('Deleting...');
        try {
            await axios.delete(`${API_URL}${itemToDelete}/`);
            toast.success('Announcement deleted', { id: toastId });
            fetchAnnouncements();
            closeDeleteModal();
        } catch (error) {
            console.error('Error deleting announcement', error);
            toast.error('Failed to delete announcement', { id: toastId });
        }
    };

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setItemToDelete(null);
    };

    const resetForm = () => {
        setFormData({ text: '', is_active: true, order: 0 });
        setIsEditing(false);
        setEditId(null);
    };

    return (
        <div className="min-h-screen bg-white p-8">
            <div className="max-w-7xl mx-auto">
                <header className="flex justify-between items-center mb-10">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Announcements</h1>
                        <p className="text-gray-500 mt-1">Manage banner messages</p>
                    </div>
                    <div className="flex gap-4">
                        <button
                            onClick={() => navigate('/')}
                            className="text-gray-600 hover:text-black font-medium px-4 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                        >
                            Back to Dashboard
                        </button>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Form Section */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-6">{isEditing ? 'Edit Announcement' : 'New Announcement'}</h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                                    <input
                                        type="text"
                                        name="text"
                                        value={formData.text}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                                        placeholder="Enter announcement text"
                                    />
                                </div>
                                <div className="flex gap-4">
                                    <div className="flex-1">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
                                        <input
                                            type="number"
                                            name="order"
                                            value={formData.order}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">Lower numbers appear first.</p>
                                    </div>
                                    <div className="flex items-center pt-6">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                name="is_active"
                                                checked={formData.is_active}
                                                onChange={handleInputChange}
                                                className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black cursor-pointer"
                                            />
                                            <span className="text-sm font-medium text-gray-700">Active</span>
                                        </label>
                                    </div>
                                </div>
                                <div className="flex gap-2 pt-2">
                                    <button
                                        type="submit"
                                        className="flex-1 bg-black text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-800 transition-all shadow-md active:scale-95 cursor-pointer"
                                    >
                                        {isEditing ? 'Update' : 'Create'}
                                    </button>
                                    {isEditing && (
                                        <button
                                            type="button"
                                            onClick={resetForm}
                                            className="px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
                                        >
                                            Cancel
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* List Section */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-100">
                                        <th className="py-4 px-6 font-semibold text-gray-700 text-sm uppercase tracking-wider">Order</th>
                                        <th className="py-4 px-6 font-semibold text-gray-700 text-sm uppercase tracking-wider">Message</th>
                                        <th className="py-4 px-6 font-semibold text-gray-700 text-sm uppercase tracking-wider">Status</th>
                                        <th className="py-4 px-6 font-semibold text-gray-700 text-sm uppercase tracking-wider text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {announcements.map(item => (
                                        <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="py-4 px-6 text-gray-600">{item.order}</td>
                                            <td className="py-4 px-6 text-gray-900 font-medium">{item.text}</td>
                                            <td className="py-4 px-6">
                                                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${item.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                                    {item.is_active ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6 text-right">
                                                <button
                                                    onClick={() => handleEdit(item)}
                                                    className="text-gray-500 hover:text-black font-medium mr-4 transition-colors cursor-pointer"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteClick(item.id)}
                                                    className="text-gray-400 hover:text-red-600 font-medium transition-colors cursor-pointer"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {announcements.length === 0 && !isLoading && (
                                        <tr>
                                            <td colSpan="4" className="py-12 text-center text-gray-400">No announcements found.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <DeleteModal
                    isOpen={isDeleteModalOpen}
                    onClose={closeDeleteModal}
                    onConfirm={confirmDelete}
                    title="Delete Announcement"
                    message="Are you sure you want to delete this announcement?"
                />
            </div>
        </div>
    );
};

export default Announcements;
