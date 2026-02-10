
import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { type User, userService } from '../services/user.service';
import { GlassCard } from '../components/common/GlassCard';
import { Shield, Trash2, Edit2, Plus, Save } from 'lucide-react';
import { useNotificationStore } from '../store/useNotificationStore';

export default function ProfilePage() {
    const { user: currentUser, updateUser: updateAuthUser } = useAuthStore();
    const [profile, setProfile] = useState<Partial<User>>({});
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingUser, setEditingUser] = useState<Partial<User> | null>(null);
    const [showUserModal, setShowUserModal] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const addNotification = useNotificationStore(state => state.addNotification);

    useEffect(() => {
        fetchProfile();
        if (currentUser?.role === 'Admin') {
            fetchAllUsers();
        }
    }, []); // Run only once on mount, logic for currentUser changes handled differently if needed

    const fetchProfile = async () => {
        try {
            const data = await userService.getProfile();
            setProfile(data);
        } catch (error) {
            console.error('Error fetching profile', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchAllUsers = async () => {
        try {
            const data = await userService.getAllUsers();
            setUsers(data);
        } catch (error) {
            console.error('Error fetching users', error);
        }
    };

    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        const newErrors: Record<string, string> = {};
        if (!profile.firstName?.trim()) newErrors.firstName = 'El nombre es obligatorio';
        if (!profile.lastName?.trim()) newErrors.lastName = 'El apellido es obligatorio';
        if (!profile.username?.trim()) newErrors.username = 'El nombre de usuario es obligatorio';
        if (!profile.email?.trim()) {
            newErrors.email = 'El email es obligatorio';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email)) {
            newErrors.email = 'El email no es válido';
        }

        if (profile.password && profile.password.length < 6) {
            newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            addNotification('Por favor corrige los errores en el formulario', 'error');
            return;
        }

        try {
            // Ensure role is present for backend validation
            const updatedProfile = {
                ...profile,
                role: profile.role || currentUser?.role || 'Employee'
            };
            await userService.updateProfile(updatedProfile);

            // Immediate UI update
            setProfile(updatedProfile);

            // Update the users list if it exists (for Admin table)
            if (users.length > 0 && updatedProfile.id) {
                setUsers(prevUsers => prevUsers.map(u =>
                    u.id === updatedProfile.id ? { ...u, ...updatedProfile } as User : u
                ));
            }

            if (updatedProfile.username) {
                updateAuthUser({ username: updatedProfile.username });
            }

            addNotification('¡Guardado Exitosamente!', 'success');
            setErrors({});
            // No fetchProfile() needed if we trust the input, but we can keep it if needed for server-generated fields
        } catch (error) {
            console.error(error);
            addNotification('Error al actualizar perfil', 'error');
        }
    };

    const handleUserSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingUser) return;

        try {
            if (editingUser.id) {
                await userService.updateUser(editingUser.id, editingUser);
                addNotification('Usuario actualizado correctamente', 'success');
            } else {
                await userService.createUser(editingUser);
                addNotification('Usuario creado correctamente', 'success');
            }
            setShowUserModal(false);
            setEditingUser(null);
            fetchAllUsers();
        } catch (error) {
            addNotification('Error al guardar usuario', 'error');
        }
    };

    const handleDeleteUser = async (id: number) => {
        if (!window.confirm('¿Seguro que deseas eliminar este usuario?')) return;
        try {
            await userService.deleteUser(id);
            addNotification('Usuario eliminado correctamente', 'success');
            fetchAllUsers();
        } catch (error) {
            addNotification('Error al eliminar usuario', 'error');
        }
    };

    if (loading) return <div>Cargando...</div>;

    return (
        <div className="space-y-8 animate-fade-in">
            <header>
                <h1 className="text-3xl font-black text-slate-800 tracking-tight">Mi Perfil</h1>
                <p className="text-slate-500 mt-2">Gestiona tu información personal y seguridad.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profile Card */}
                <div className="lg:col-span-1">
                    <GlassCard className="p-6 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
                        <div className="relative mt-12 flex flex-col items-center">
                            <div className="w-24 h-24 rounded-full bg-white p-1 shadow-xl">
                                <div className="w-full h-full rounded-full bg-slate-100 flex items-center justify-center text-3xl font-bold text-indigo-600">
                                    {profile.firstName?.charAt(0) || profile.username?.charAt(0) || 'U'}
                                </div>
                            </div>
                            <h2 className="mt-4 text-xl font-bold text-slate-800">
                                {profile.firstName} {profile.lastName}
                            </h2>
                            <span className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-600 text-xs font-bold mt-2 uppercase tracking-wide">
                                {profile.role || currentUser?.role}
                            </span>
                        </div>

                        <form onSubmit={handleProfileUpdate} className="mt-8 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Usuario</label>
                                <input
                                    type="text"
                                    value={profile.username || ''}
                                    onChange={(e) => {
                                        setProfile({ ...profile, username: e.target.value });
                                        if (errors.username) setErrors({ ...errors, username: '' });
                                    }}
                                    className={`w-full px-4 py-2 rounded-xl border ${errors.username ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-200'} focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all`}
                                />
                                {errors.username && <p className="text-rose-500 text-xs mt-1 font-medium">{errors.username}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Nombre</label>
                                <input
                                    type="text"
                                    value={profile.firstName || ''}
                                    onChange={(e) => {
                                        setProfile({ ...profile, firstName: e.target.value });
                                        if (errors.firstName) setErrors({ ...errors, firstName: '' });
                                    }}
                                    className={`w-full px-4 py-2 rounded-xl border ${errors.firstName ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-200'} focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all`}
                                />
                                {errors.firstName && <p className="text-rose-500 text-xs mt-1 font-medium">{errors.firstName}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Apellido</label>
                                <input
                                    type="text"
                                    value={profile.lastName || ''}
                                    onChange={(e) => {
                                        setProfile({ ...profile, lastName: e.target.value });
                                        if (errors.lastName) setErrors({ ...errors, lastName: '' });
                                    }}
                                    className={`w-full px-4 py-2 rounded-xl border ${errors.lastName ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-200'} focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all`}
                                />
                                {errors.lastName && <p className="text-rose-500 text-xs mt-1 font-medium">{errors.lastName}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    value={profile.email || ''}
                                    onChange={(e) => {
                                        setProfile({ ...profile, email: e.target.value });
                                        if (errors.email) setErrors({ ...errors, email: '' });
                                    }}
                                    className={`w-full px-4 py-2 rounded-xl border ${errors.email ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-200'} focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all`}
                                />
                                {errors.email && <p className="text-rose-500 text-xs mt-1 font-medium">{errors.email}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Cambiar Contraseña (Opcional)</label>
                                <input
                                    type="password"
                                    placeholder="Nueva contraseña"
                                    onChange={(e) => {
                                        setProfile({ ...profile, password: e.target.value });
                                        if (errors.password) setErrors({ ...errors, password: '' });
                                    }}
                                    className={`w-full px-4 py-2 rounded-xl border ${errors.password ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-200'} focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all`}
                                />
                                {errors.password && <p className="text-rose-500 text-xs mt-1 font-medium">{errors.password}</p>}
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-indigo-500/30 active:scale-95 flex items-center justify-center gap-2"
                            >
                                <Save size={18} />
                                Guardar Cambios
                            </button>
                        </form>
                    </GlassCard>
                </div>

                {/* Admin User Management */}
                {currentUser?.role === 'Admin' && (
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                                <Shield className="text-indigo-600" />
                                Gestión de Usuarios
                            </h2>
                            <button
                                onClick={() => {
                                    setEditingUser({ role: 'Employee' }); // Default role
                                    setShowUserModal(true);
                                }}
                                className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-xl font-bold shadow-lg shadow-emerald-500/20 flex items-center gap-2 transition-all active:scale-95"
                            >
                                <Plus size={18} />
                                Nuevo Usuario
                            </button>
                        </div>

                        <GlassCard className="overflow-hidden p-0 border-0">
                            <table className="w-full">
                                <thead className="bg-slate-50 border-b border-slate-100">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Usuario</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Nombre</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Rol</th>
                                        <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {users.map((u) => (
                                        <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs">
                                                        {u.username.substring(0, 2).toUpperCase()}
                                                    </div>
                                                    <span className="font-medium text-slate-700">{u.username}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-slate-600">{u.firstName} {u.lastName}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded-lg text-xs font-bold uppercase tracking-wide ${u.role === 'Admin' ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600'
                                                    }`}>
                                                    {u.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right space-x-2">
                                                <button
                                                    onClick={() => {
                                                        setEditingUser(u);
                                                        setShowUserModal(true);
                                                    }}
                                                    className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteUser(u.id)}
                                                    className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </GlassCard>
                    </div>
                )}
            </div>

            {/* Edit/Create User Modal */}
            {showUserModal && editingUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
                    <GlassCard className="w-full max-w-md p-6 animate-scale-in">
                        <h3 className="text-xl font-bold text-slate-800 mb-6">
                            {editingUser.id ? 'Editar Usuario' : 'Crear Usuario'}
                        </h3>
                        <form onSubmit={handleUserSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Usuario</label>
                                <input
                                    type="text"
                                    required
                                    value={editingUser.username || ''}
                                    onChange={(e) => setEditingUser({ ...editingUser, username: e.target.value })}
                                    className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Nombre</label>
                                    <input
                                        type="text"
                                        value={editingUser.firstName || ''}
                                        onChange={(e) => setEditingUser({ ...editingUser, firstName: e.target.value })}
                                        className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Apellido</label>
                                    <input
                                        type="text"
                                        value={editingUser.lastName || ''}
                                        onChange={(e) => setEditingUser({ ...editingUser, lastName: e.target.value })}
                                        className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    value={editingUser.email || ''}
                                    onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                                    className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Rol</label>
                                <select
                                    value={editingUser.role || 'Employee'}
                                    onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                                    className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                                >
                                    <option value="Admin">Administrador</option>
                                    <option value="Employee">Empleado</option>
                                    <option value="Customer">Cliente</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    {editingUser.id ? 'Nueva Contraseña (Opcional)' : 'Contraseña'}
                                </label>
                                <input
                                    type="password"
                                    required={!editingUser.id}
                                    placeholder={editingUser.id ? "Dejar en blanco para mantener" : "Contraseña segura"}
                                    onChange={(e) => setEditingUser({ ...editingUser, password: e.target.value })}
                                    className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                                />
                            </div>

                            <div className="flex gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setShowUserModal(false)}
                                    className="flex-1 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 font-medium"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-lg shadow-indigo-500/30"
                                >
                                    Guardar
                                </button>
                            </div>
                        </form>
                    </GlassCard>
                </div>
            )}
        </div>
    );
}
