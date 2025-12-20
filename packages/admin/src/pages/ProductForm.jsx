
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

const SIZES = ['S', 'M', 'L', 'XL', 'XXL'];
const COLORS = [
    { name: 'Black', hex: '#000000' },
    { name: 'White', hex: '#FFFFFF', border: true },
    { name: 'Gray', hex: '#6B7280' },
    { name: 'Red', hex: '#EF4444' },
    { name: 'Blue', hex: '#3B82F6' },
    { name: 'Navy', hex: '#1E3A8A' },
    { name: 'Green', hex: '#22C55E' },
    { name: 'Yellow', hex: '#EAB308' },
    { name: 'Orange', hex: '#F97316' },
    { name: 'Purple', hex: '#A855F7' },
    { name: 'Pink', hex: '#EC4899' },
    { name: 'Beige', hex: '#F5F5DC', border: true },
    { name: 'Brown', hex: '#78350F' },
];

const ProductForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = !!id;

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category: '',
    });

    const [selectedSizes, setSelectedSizes] = useState([]);
    const [selectedColors, setSelectedColors] = useState([]);
    const [loading, setLoading] = useState(false);

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [imageToDelete, setImageToDelete] = useState(null);

    const openDeleteModal = (imageId) => {
        setImageToDelete(imageId);
        setIsDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setImageToDelete(null);
    };

    const confirmDelete = async () => {
        if (!imageToDelete) return;

        try {
            await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/product-images/${imageToDelete}/`);
            // Find which slot had this image and remove it
            const colorKey = Object.keys(imageSlots).find(key => imageSlots[key].id === imageToDelete);
            if (colorKey) {
                const newSlots = { ...imageSlots };
                delete newSlots[colorKey];
                setImageSlots(newSlots);
            }
            toast.success("Image deleted");
            closeDeleteModal();
        } catch (error) {
            console.error("Delete image failed", error);
            toast.error("Failed to delete image");
        }
    };

    useEffect(() => {
        if (isEdit) {
            fetchProduct();
        }
    }, [id]);

    const fetchProduct = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/products/${id}/`);
            const p = response.data;
            setFormData({
                name: p.name,
                description: p.description,
                price: p.price,
                category: p.category,
            });

            let parsedColors = [];
            try {
                parsedColors = typeof p.color === 'string' ? JSON.parse(p.color) : p.color;
                if (Array.isArray(parsedColors)) setSelectedColors(parsedColors);
            } catch (e) {
                console.error("Failed to parse color", e);
            }

            if (p.images && Array.isArray(p.images) && parsedColors.length > 0) {
                const initialSlots = {};
                p.images.forEach((img, index) => {
                    const colorName = parsedColors[index];
                    if (colorName) {
                        initialSlots[colorName] = {
                            file: null,
                            preview: img.image,
                            id: img.id,
                            isNew: false
                        };
                    }
                });
                setImageSlots(initialSlots);
            }

            try {
                const sizes = typeof p.size === 'string' ? JSON.parse(p.size) : p.size;
                if (Array.isArray(sizes)) setSelectedSizes(sizes);
            } catch (e) {
                console.error("Failed to parse size", e);
            }

        } catch (error) {
            console.error('Error fetching product', error);
            toast.error("Failed to fetch product data");
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    const [imageSlots, setImageSlots] = useState({}); // { [colorName]: { file, preview, id, isNew: true/false } }

    const handleImageUpload = (e, colorName) => {
        const file = e.target.files[0];
        if (!file) return;

        const newSlot = {
            file,
            preview: URL.createObjectURL(file),
            id: Math.random().toString(36).substr(2, 9),
            isNew: true
        };

        setImageSlots(prev => ({ ...prev, [colorName]: newSlot }));
    };

    const removeImageSlot = (colorName) => {
        const slot = imageSlots[colorName];
        if (slot && !slot.isNew) {
            openDeleteModal(slot.id);
        } else {
            const newSlots = { ...imageSlots };
            delete newSlots[colorName];
            setImageSlots(newSlots);
        }
    };

    const toggleSize = (size) => {
        if (selectedSizes.includes(size)) {
            setSelectedSizes(selectedSizes.filter(s => s !== size));
        } else {
            setSelectedSizes([...selectedSizes, size]);
        }
    };

    const toggleColor = (colorName) => {
        if (selectedColors.includes(colorName)) {
            const newColors = selectedColors.filter(c => c !== colorName);
            setSelectedColors(newColors);
        } else {
            if (selectedColors.length >= 5) {
                toast.error("Maximum 5 colors allowed");
                return;
            }
            setSelectedColors([...selectedColors, colorName]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const toastId = toast.loading('Saving product...');

        const data = new FormData();
        data.append('name', formData.name);
        data.append('description', formData.description);
        data.append('price', formData.price);
        data.append('category', formData.category);
        data.append('color', JSON.stringify(selectedColors));
        data.append('size', JSON.stringify(selectedSizes));

        // Validate that all colors have images
        for (const color of selectedColors) {
            if (!imageSlots[color]) {
                toast.error(`Please upload an image for ${color}`, { id: toastId });
                setLoading(false);
                return;
            }
        }

        if (Object.keys(imageSlots).length > 0) {
            selectedColors.forEach(color => {
                const slot = imageSlots[color];
                if (slot && slot.isNew) {
                    data.append('uploaded_images', slot.file);
                }
            });
        }

        try {
            const config = { headers: { 'Content-Type': 'multipart/form-data' } };
            if (isEdit) {
                await axios.patch(`${import.meta.env.VITE_API_BASE_URL}/api/products/${id}/`, data, config);
                toast.success("Product updated!", { id: toastId });
            } else {
                await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/products/`, data, config);
                toast.success("Product created!", { id: toastId });
            }
            navigate('/');
        } catch (error) {
            console.error("Save failed", error);
            const errorMsg = error.response?.data?.detail || "Failed to save product.";
            toast.error(errorMsg, { id: toastId });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="mb-8 flex items-center justify-between">
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">{isEdit ? 'Edit Product' : 'New Product'}</h1>
                    <button onClick={() => navigate('/')} className="text-gray-500 hover:text-black font-medium cursor-pointer">Cancel</button>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <form onSubmit={handleSubmit} className="p-8 space-y-8">

                        {/* Basic Info */}
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Product Name</label>
                                <input
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-black focus:ring-1 focus:ring-black outline-none transition-all bg-gray-50 focus:bg-white"
                                    placeholder="e.g. Vintage T-Shirt"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    required
                                    rows="4"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-black focus:ring-1 focus:ring-black outline-none transition-all bg-gray-50 focus:bg-white"
                                    placeholder="Product details..."
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Price ($)</label>
                                    <input
                                        name="price"
                                        type="number"
                                        step="0.01"
                                        value={formData.price}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-black focus:ring-1 focus:ring-black outline-none transition-all bg-gray-50 focus:bg-white"
                                        placeholder="0.00"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                                    <input
                                        name="category"
                                        value={formData.category}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-black focus:ring-1 focus:ring-black outline-none transition-all bg-gray-50 focus:bg-white"
                                        placeholder="e.g. Clothing"
                                    />
                                </div>
                            </div>
                        </div>

                        <hr className="border-gray-100" />

                        {/* Attributes */}
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">Sizes (Select available)</label>
                                <div className="flex flex-wrap gap-3">
                                    {SIZES.map(size => (
                                        <button
                                            key={size}
                                            type="button"
                                            onClick={() => toggleSize(size)}
                                            className={`
                                        px-6 py-2 rounded-full font-medium text-sm transition-all border cursor-pointer
                                        ${selectedSizes.includes(size)
                                                    ? 'bg-black text-white border-black shadow-md transform scale-105'
                                                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                                }
                                    `}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">Colors (Select available)</label>
                                <div className="flex flex-wrap gap-4">
                                    {COLORS.map((color) => {
                                        const isSelected = selectedColors.includes(color.name);
                                        return (
                                            <button
                                                key={color.name}
                                                type="button"
                                                onClick={() => toggleColor(color.name)}
                                                className={`
                                            group relative h-10 w-10 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-sm
                                            ${color.border ? 'border border-gray-200' : ''}
                                            ${isSelected ? 'ring-2 ring-offset-2 ring-black scale-110' : 'hover:scale-105 hover:ring-2 hover:ring-offset-2 hover:ring-gray-200'}
                                        `}
                                                style={{ backgroundColor: color.hex }}
                                                title={color.name}
                                            >
                                                {isSelected && (
                                                    <svg className={`h-5 w-5 ${['White', 'Beige', 'Yellow'].includes(color.name) ? 'text-black' : 'text-white'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                )}
                                                <span className="sr-only">{color.name}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                                <p className="mt-2 text-xs text-gray-400">Selected: {selectedColors.length > 0 ? selectedColors.join(', ') : 'None'}</p>
                            </div>
                        </div>

                        <hr className="border-gray-100" />

                        {/* Media */}
                        <div>
                            <div className="space-y-4">
                                <label className="block text-sm font-semibold text-gray-700 mb-3">Product Images</label>

                                {selectedColors.length === 0 ? (
                                    <div className="text-center p-8 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50">
                                        <p className="text-gray-500 text-sm">Select colors above to enable image uploads.</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {selectedColors.map((colorName, index) => {
                                            const slot = imageSlots[colorName];
                                            const colorRef = COLORS.find(c => c.name === colorName);
                                            const bgHex = colorRef ? colorRef.hex : '#eee';
                                            const isLight = ['White', 'Beige', 'Yellow'].includes(colorName);

                                            return (
                                                <div key={colorName} className="border border-gray-200 rounded-xl overflow-hidden shadow-sm bg-white">
                                                    {/* Card Header for Color */}
                                                    <div className="px-4 py-2 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                                                        <div className="flex items-center gap-2">
                                                            <div
                                                                className={`w-4 h-4 rounded-full border ${isLight ? 'border-gray-300' : 'border-transparent'}`}
                                                                style={{ backgroundColor: bgHex }}
                                                            />
                                                            <span className="font-medium text-sm text-gray-900">{colorName}</span>
                                                        </div>
                                                        <span className="text-xs text-gray-400">{index + 1}</span>
                                                    </div>

                                                    {/* Card Content - Image Slot */}
                                                    <div className="p-4 aspect-square flex items-center justify-center bg-white relative group">
                                                        {slot ? (
                                                            <>
                                                                <img
                                                                    src={slot.preview}
                                                                    alt={`${colorName} product`}
                                                                    className="w-full h-full object-contain"
                                                                />
                                                                {/* Overlay */}
                                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => removeImageSlot(colorName)}
                                                                        className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors cursor-pointer"
                                                                        title="Remove Image"
                                                                    >
                                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                                    </button>
                                                                </div>
                                                            </>
                                                        ) : (
                                                            <div className="text-center w-full h-full border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center hover:bg-gray-50 transition-colors relative cursor-pointer">
                                                                <svg className="h-8 w-8 text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                                                                <span className="text-xs text-gray-500 font-medium">Upload {colorName}</span>
                                                                <input
                                                                    type="file"
                                                                    accept="image/*"
                                                                    onChange={(e) => handleImageUpload(e, colorName)}
                                                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                                                />
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>

                        </div>

                        <div className="pt-6">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-black text-white font-bold py-4 rounded-xl hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                            >
                                {loading ? 'Saving...' : 'Save Product'}
                            </button>
                        </div>

                    </form>
                </div>
            </div>

            {/* Custom Delete Confirmation Modal */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 transform transition-all scale-100">
                        <div className="text-center">
                            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                                <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Image?</h3>
                            <p className="text-sm text-gray-500 mb-6">
                                Are you sure you want to delete this image? This action cannot be undone.
                            </p>
                            <div className="flex space-x-3">
                                <button
                                    type="button"
                                    onClick={closeDeleteModal}
                                    className="flex-1 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={confirmDelete}
                                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors cursor-pointer shadow-lg shadow-red-200"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductForm;
