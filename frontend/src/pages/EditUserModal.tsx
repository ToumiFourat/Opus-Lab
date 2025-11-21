import React, { useState, useEffect } from 'react';

interface EditUserModalProps {
  open: boolean;
  onClose: () => void;
  user: any;
  onUserUpdated: () => void;
}

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const EditUserModal: React.FC<EditUserModalProps> = ({ open, onClose, user, onUserUpdated }) => {
  const [email, setEmail] = useState(user?.email || '');
  const [isVerified, setIsVerified] = useState(user?.isVerified || false);
  const [role, setRole] = useState(user?.roles?.[0]?._id || '');
  const [roles, setRoles] = useState<{ _id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setEmail(user?.email || '');
    setIsVerified(user?.isVerified || false);
    setRole(user?.roles?.[0]?._id || '');
    fetchRoles();
  }, [user]);

  async function fetchRoles() {
    const token = localStorage.getItem('accessToken');
    const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};
    const res = await fetch(`${API_URL}/roles`, { headers });
    const data = await res.json();
    setRoles(data.roles || data || []);
  }

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      const res = await fetch(`${API_URL}/users/${user._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ email, isVerified, roles: role ? [role] : [] })
      });
      if (!res.ok) throw new Error((await res.json()).message || 'Erreur modification utilisateur');
      onUserUpdated();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Erreur modification utilisateur');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
        <h3 className="text-xl font-semibold mb-4">Modifier l'utilisateur</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="block mb-1 font-medium">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full p-2 border rounded" />
          </div>
          <div className="mb-3 flex items-center gap-2">
            <input type="checkbox" id="isVerified" checked={isVerified} onChange={e => setIsVerified(e.target.checked)} />
            <label htmlFor="isVerified" className="font-medium">Vérifié</label>
          </div>
          <div className="mb-3">
            <label className="block mb-1 font-medium">Rôle</label>
            <select value={role} onChange={e => setRole(e.target.value)} required className="w-full p-2 border rounded">
              <option value="">Sélectionner un rôle</option>
              {(Array.isArray(roles) ? roles : []).map(r => (
                <option key={r._id} value={r._id}>{r.name}</option>
              ))}
            </select>
          </div>
          {error && <div className="text-red-600 mb-2 text-sm">{error}</div>}
          <div className="flex justify-end gap-2 mt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">Annuler</button>
            <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              {loading ? 'Sauvegarde...' : 'Sauvegarder'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserModal;
