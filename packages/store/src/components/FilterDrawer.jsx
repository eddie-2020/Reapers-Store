export default function FilterDrawer({
    open,
    onClose,
    filters,
    products
}) {
    const {
        category, setCategory,
        color, setColor,
        size, setSize,
        priceRange, setPriceRange
    } = filters;


    const categories = [...new Set(products.map(p => p.category).filter(Boolean))];
    const colors = [...new Set(products.flatMap(p => p.colors))];
    const sizes = [...new Set(products.flatMap(p => p.sizes))];

    return (
        <>
            <div className={`fixed top-0 right-0 h-full w-80 bg-white/95 backdrop-blur-xl shadow-2xl transition-transform duration-300 z-60 border-l border-gray-100 ${open ? "translate-x-0" : "translate-x-full"}`}>
                <div className="flex flex-col h-full">
                    <div className="p-6 border-b flex items-center justify-between bg-white/50">
                        <h3 className="font-bold text-xl">Filter</h3>
                        <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 transition-colors cursor-pointer">
                            ✕
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 space-y-8">


                        <div>
                            <h4 className="font-medium text-gray-900 mb-3">Category</h4>
                            <div className="space-y-2">
                                <button
                                    onClick={() => setCategory("")}
                                    className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors cursor-pointer ${category === "" ? "bg-gray-900 text-white" : "text-gray-600 hover:bg-gray-100"}`}
                                >
                                    All Categories
                                </button>
                                {categories.map(c => (
                                    <button
                                        key={c}
                                        onClick={() => setCategory(c)}
                                        className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors cursor-pointer ${category === c ? "bg-gray-900 text-white" : "text-gray-600 hover:bg-gray-100"}`}
                                    >
                                        {c}
                                    </button>
                                ))}
                            </div>
                        </div>


                        <div>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="font-medium text-gray-900">Max Price</span>
                                <span className="text-gray-500">₦{priceRange.toLocaleString()}</span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="500000"
                                step="1000"
                                value={priceRange}
                                onChange={(e) => setPriceRange(Number(e.target.value))}
                                className="w-full accent-gray-900 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                            />
                        </div>


                        <div>
                            <h4 className="font-medium text-gray-900 mb-3">Color</h4>
                            <div className="flex flex-wrap gap-2">
                                <button
                                    onClick={() => setColor("")}
                                    className={`px-3 py-1.5 rounded-full text-xs border transition-all cursor-pointer ${color === "" ? "bg-gray-900 text-white border-gray-900" : "border-gray-300 text-gray-600 hover:border-gray-400"}`}
                                >
                                    All
                                </button>
                                {colors.map(c => (
                                    <button
                                        key={c}
                                        onClick={() => setColor(c === color ? "" : c)}
                                        className={`px-3 py-1.5 rounded-full text-xs border transition-all cursor-pointer ${color === c ? "bg-gray-900 text-white border-gray-900" : "border-gray-300 text-gray-600 hover:border-gray-400"}`}
                                    >
                                        {c}
                                    </button>
                                ))}
                            </div>
                        </div>


                        <div>
                            <h4 className="font-medium text-gray-900 mb-3">Size</h4>
                            <div className="grid grid-cols-4 gap-2">
                                {sizes.map(s => (
                                    <button
                                        key={s}
                                        onClick={() => setSize(s === size ? "" : s)}
                                        className={`py-2 text-sm rounded-md border transition-all cursor-pointer ${size === s ? "bg-gray-900 text-white border-gray-900" : "border-gray-300 text-gray-600 hover:border-gray-400"}`}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>

                    </div>

                    <div className="p-6 border-t bg-gray-50">
                        <button
                            onClick={() => {
                                setCategory("");
                                setColor("");
                                setSize("");
                                setPriceRange(500000);
                            }}
                            className="w-full py-3 border border-gray-300 rounded-lg font-medium text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
                        >
                            Reset Filters
                        </button>
                        <button
                            onClick={onClose}
                            className="w-full mt-3 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors shadow-lg cursor-pointer"
                        >
                            View Results
                        </button>
                    </div>
                </div>
            </div>

            {open && <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 transition-opacity" onClick={onClose} />}
        </>
    );
}
