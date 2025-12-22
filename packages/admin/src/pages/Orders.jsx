import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function Orders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/orders/list/`);
            setOrders(response.data);
        } catch (error) {
            console.error("Error fetching orders:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 animate-fadeIn">
            <div className="flex flex-col gap-4 mb-8">
                <Link to="/" className="self-start px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors">
                    ← Back to Dashboard
                </Link>
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold font-heading text-gray-900">Orders</h1>
                    <div className="text-sm text-gray-500">Total Orders: {orders.length}</div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center text-gray-500">Loading orders...</div>
                ) : orders.length === 0 ? (
                    <div className="p-12 text-center text-gray-500">No orders found.</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-4 font-semibold text-gray-600">Reference</th>
                                    <th className="px-6 py-4 font-semibold text-gray-600">Customer</th>
                                    <th className="px-6 py-4 font-semibold text-gray-600">Items</th>
                                    <th className="px-6 py-4 font-semibold text-gray-600">Amount</th>
                                    <th className="px-6 py-4 font-semibold text-gray-600">Date</th>
                                    <th className="px-6 py-4 font-semibold text-gray-600">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {orders.map((order) => (
                                    <tr key={order.reference} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-gray-900">
                                            {order.reference}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-900">{order.fullName}</div>
                                            <div className="text-sm text-gray-500">{order.email}</div>
                                            <div className="text-xs text-gray-400">{order.phone}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-600 max-w-xs">
                                                {order.items.map((item, idx) => (
                                                    <div key={idx} className="truncate">
                                                        {item.quantity}x {item.product_name}
                                                        {item.size && <span className="text-xs text-gray-400"> ({item.size})</span>}
                                                    </div>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-medium text-gray-900">
                                            ₦{Number(order.amount).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                                            {new Date(order.created_at || Date.now()).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                {order.status || 'Paid'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
