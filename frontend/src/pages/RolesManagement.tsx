import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AddRoleModal from './AddRoleModal';
import { useAuth } from '../context/AuthContext';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

interface Role {
  _id: string;
  name: string;
  permissions: string[];
}

const RolesManagement: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    async function fetchRoles() {
      const token = localStorage.getItem('accessToken');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await axios.get(`${API_URL}/roles?page=${page}`, { headers });
      setRoles(res.data.roles || res.data.data || []);
      setTotalPages(res.data.totalPages || 1);
      setLoading(false);
    }
    fetchRoles();
  }, [page]);

  const { user } = useAuth();
  const isViewer = user?.roles?.includes('viewer');
  
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Gestion des rôles</h2>
            {!isViewer && (
              <button 
                className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 font-medium" 
                onClick={() => setModalOpen(true)}
              >
                Ajouter un rôle
              </button>
            )}
          </div>

          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="w-full">
              <thead className="bg-gray-100 border-b border-gray-200">
                <tr>
                  <th className="p-4 text-left text-sm font-semibold text-gray-700">Nom du rôle</th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-700">Permissions</th>
                  {!isViewer && <th className="p-4 text-center text-sm font-semibold text-gray-700">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={isViewer ? 2 : 3} className="text-center p-8 text-gray-500">Chargement...</td>
                  </tr>
                ) : roles.length === 0 ? (
                  <tr>
                    <td colSpan={isViewer ? 2 : 3} className="text-center p-8 text-gray-500">Aucun rôle trouvé.</td>
                  </tr>
                ) : (
                  roles.map(role => (
                    <tr key={role._id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4 font-medium text-gray-800">{role.name}</td>
                      <td className="p-4">
                        {Array.isArray(role.permissions) && role.permissions.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {role.permissions.map((p: any) => (
                              <span key={p.name} className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-medium">
                                {p.name}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-gray-400 text-sm">Aucune permission</span>
                        )}
                      </td>
                      {!isViewer && (
                        <td className="p-4 text-center">
                          <a 
                            href={`/roles/${role._id}/permissions`} 
                            className="text-blue-600 hover:text-blue-800 font-medium mr-4 transition"
                          >
                            Gérer permissions
                          </a>
                          <button
                            className="text-red-600 hover:text-red-800 font-medium transition"
                            onClick={async () => {
                              if (window.confirm('Supprimer ce rôle ?')) {
                                const token = localStorage.getItem('accessToken');
                                const headers = token ? { Authorization: `Bearer ${token}` } : {};
                                await axios.delete(`${API_URL}/roles/${role._id}`, { headers });
                                window.location.reload();
                              }
                            }}
                          >
                            Supprimer
                          </button>
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="flex justify-center items-center mt-6 gap-4">
            <button 
              disabled={page === 1} 
              onClick={() => setPage(page - 1)} 
              className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium"
            >
              Précédent
            </button>
            <span className="text-gray-700 font-medium">Page {page} / {totalPages}</span>
            <button 
              disabled={page === totalPages} 
              onClick={() => setPage(page + 1)} 
              className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium"
            >
              Suivant
            </button>
          </div>
        </div>
      </div>

      {!isViewer && (
        <AddRoleModal 
          open={modalOpen} 
          onClose={() => setModalOpen(false)} 
          onRoleAdded={() => window.location.reload()} 
        />
      )}
    </div>
  );
};

export default RolesManagement;