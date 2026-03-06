import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { apiFetch } from "../utils/api";

export default function EmployeeProfile() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isNew = id === 'new';

    const [employee, setEmployee] = useState<any>({
        firstName: '',
        lastName: '',
        email: '',
        role: 'employee',
        status: 'active'
    });

    const [loading, setLoading] = useState(!isNew);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [salesClicks, setSalesClicks] = useState(0);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const userData = localStorage.getItem('user');
            if (userData) {
                const currentUser = JSON.parse(userData);
                setIsAdmin(currentUser.role === 'admin');
            }
        }

        if (!isNew) {
            fetchEmployee();
        }
    }, [id, isNew]);

    const fetchEmployee = async () => {
        try {
            const data = await apiFetch(`/employees/${id}`);
            setEmployee(data);
        } catch (err: any) {
            setError(err.message || "Failed to load employee details");
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError("");
        setSuccess("");

        try {
            if (isNew) {
                await apiFetch('/employees', {
                    method: 'POST',
                    body: JSON.stringify(employee)
                });
                navigate('/dashboard');
            } else {
                const data = await apiFetch(`/employees/${id}`, {
                    method: 'PUT',
                    body: JSON.stringify(employee)
                });
                setEmployee(data);
                setSuccess("Employee updated successfully");
            }
        } catch (err: any) {
            setError(err.message || "Failed to save employee");
        } finally {
            setSaving(false);
        }
    };

    const handleIncrementSales = async () => {
        if (isNew) return;
        try {
            await apiFetch(`/employees/${id}/increment`, { method: 'POST' });
            setSalesClicks(prev => prev + 1);
            setSuccess("Sale activity logged successfully!");
            setTimeout(() => setSuccess(""), 3000);
        } catch (err: any) {
            setError(err.message || "Failed to log activity");
        }
    };

    if (loading) return <div className="p-8 text-center text-slate-500">Loading...</div>;

    return (
        <div className="min-h-screen bg-slate-50">
            <nav className="bg-white shadow-sm border-b border-primary-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center">
                        <Link to="/dashboard" className="text-sm font-medium text-slate-500 hover:text-slate-900 flex items-center gap-2">
                            &larr; Back to Dashboard
                        </Link>
                    </div>
                </div>
            </nav>

            <main className="max-w-3xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
                <div className="bg-white shadow rounded-xl p-8 border border-slate-200">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-2xl font-bold text-slate-900">
                            {isNew ? 'Create Employee' : 'Employee Profile'}
                        </h2>

                        {!isNew && (
                            <button
                                onClick={handleIncrementSales}
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-primary-700 bg-primary-100 hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
                            >
                                Log Sale ({salesClicks})
                            </button>
                        )}
                    </div>

                    {error && <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 text-sm">{error}</div>}
                    {success && <div className="bg-green-50 text-green-700 p-4 rounded-lg mb-6 text-sm">{success}</div>}

                    <form onSubmit={handleSave} className="space-y-6">
                        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                            <div>
                                <label className="block text-sm font-medium text-slate-700">First Name</label>
                                <input
                                    type="text"
                                    required
                                    disabled={!isAdmin && !isNew}
                                    className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm px-3 py-2 border disabled:bg-slate-50 disabled:text-slate-500"
                                    value={employee.firstName}
                                    onChange={e => setEmployee({ ...employee, firstName: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700">Last Name</label>
                                <input
                                    type="text"
                                    required
                                    disabled={!isAdmin && !isNew}
                                    className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm px-3 py-2 border disabled:bg-slate-50 disabled:text-slate-500"
                                    value={employee.lastName}
                                    onChange={e => setEmployee({ ...employee, lastName: e.target.value })}
                                />
                            </div>

                            <div className="sm:col-span-2">
                                <label className="block text-sm font-medium text-slate-700">Email</label>
                                <input
                                    type="email"
                                    required
                                    disabled={!isAdmin && !isNew}
                                    className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm px-3 py-2 border disabled:bg-slate-50 disabled:text-slate-500"
                                    value={employee.email}
                                    onChange={e => setEmployee({ ...employee, email: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700">Role</label>
                                <select
                                    disabled={!isAdmin && !isNew}
                                    className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm px-3 py-2 border disabled:bg-slate-50 disabled:text-slate-500"
                                    value={employee.role}
                                    onChange={e => setEmployee({ ...employee, role: e.target.value })}
                                >
                                    <option value="employee">Employee</option>
                                    <option value="manager">Manager</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700">Status</label>
                                <select
                                    disabled={!isAdmin && !isNew}
                                    className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm px-3 py-2 border disabled:bg-slate-50 disabled:text-slate-500"
                                    value={employee.status}
                                    onChange={e => setEmployee({ ...employee, status: e.target.value })}
                                >
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </div>
                        </div>

                        {isAdmin && (
                            <div className="pt-5 border-t border-slate-200 mt-8 flex justify-end">
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="bg-primary-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                                >
                                    {saving ? 'Saving...' : 'Save Employee'}
                                </button>
                            </div>
                        )}
                    </form>
                </div>
            </main>
        </div>
    );
}
