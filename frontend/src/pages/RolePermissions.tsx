import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

interface Permission {
  _id: string;
  name: string;
}

const RolePermissions: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [role, setRole] = useState<any>(null);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const [roleRes, permsRes] = await Promise.all([
        axios.get(`${API_URL}/roles/${id}`, { headers }),
        axios.get(`${API_URL}/permissions?limit=1000`, { headers })
      ]);
      setRole(roleRes.data);
      setPermissions(permsRes.data.permissions || permsRes.data || []);
      setSelected(roleRes.data.permissions.map((p: any) => p._id));
      setLoading(false);
    }
    fetchData();
  }, [id]);

  const handleToggle = (permId: string) => {
    setSelected(sel => sel.includes(permId) ? sel.filter(id => id !== permId) : [...sel, permId]);
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      const token = localStorage.getItem('accessToken');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      await axios.put(`${API_URL}/roles/${id}`, { permissions: selected }, { headers });
      navigate('/roles');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Erreur lors de la mise à jour');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-gray-500 text-lg">Chargement...</div>
    </div>
  );
  
  if (!role) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-red-600 text-lg">Rôle introuvable</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Permissions du rôle</h2>
            <p className="text-gray-600">
              Rôle : <span className="font-semibold text-gray-800">{role.name}</span>
            </p>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            {(Array.isArray(permissions) ? permissions : []).map(perm => (
              <label 
                key={perm._id} 
                className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition"
              >
                <input
                  type="checkbox"
                  checked={selected.includes(perm._id)}
                  onChange={() => handleToggle(perm._id)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-gray-700 font-medium">{perm.name}</span>
              </label>
            ))}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button 
              onClick={() => navigate('/roles')} 
              className="px-5 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition duration-200 font-medium"
            >
              Annuler
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 disabled:bg-blue-300 disabled:cursor-not-allowed font-medium"
            >
              {saving ? 'Sauvegarde...' : 'Sauvegarder'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RolePermissions;