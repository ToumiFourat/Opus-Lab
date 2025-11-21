import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AddPermissionModal from './AddPermissionModal';
import { useAuth } from '../context/AuthContext';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const Permissions: React.FC = () => {
  const [permissions, setPermissions] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { user } = useAuth();
  const isViewer = user?.roles?.includes('viewer');

  useEffect(() => {
    async function fetchPermissions() {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await axios.get(`${API_URL}/permissions?search=${search}&page=${page}`, { headers });
      setPermissions(res.data.permissions || res.data.data || []);
      setTotalPages(res.data.totalPages || 1);
      setLoading(false);
    }
    fetchPermissions();
  }, [search, page]);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Gestion des permissions</h2>
          
          <div className="flex justify-end mb-6">
            {!isViewer && (
              <button 
                className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 font-medium whitespace-nowrap" 
                onClick={() => setModalOpen(true)}
              >
                Ajouter une permission
              </button>
            )}
          </div>

          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="w-full">
              <thead className="bg-gray-100 border-b border-gray-200">
                <tr>
                  <th className="p-4 text-left text-sm font-semibold text-gray-700">Nom</th>
                  {!isViewer && <th className="p-4 text-center text-sm font-semibold text-gray-700">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={isViewer ? 1 : 2} className="text-center p-8 text-gray-500">Chargement...</td>
                  </tr>
                ) : permissions.length === 0 ? (
                  <tr>
                    <td colSpan={isViewer ? 1 : 2} className="text-center p-8 text-gray-500">Aucune permission trouvée.</td>
                  </tr>
                ) : (
                  permissions.map(p => (
                    <tr key={p._id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4 text-gray-800 font-medium">{p.name}</td>
                      {!isViewer && (
                        <td className="p-4 text-center">
                          <button
                            className="text-red-600 hover:text-red-800 font-medium transition"
                            onClick={async () => {
                              if (window.confirm('Supprimer cette permission ?')) {
                                const token = localStorage.getItem('accessToken');
                                const headers = token ? { Authorization: `Bearer ${token}` } : {};
                                await axios.delete(`${API_URL}/permissions/${p._id}`, { headers });
                                setSearch('');
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
        <AddPermissionModal 
          open={modalOpen} 
          onClose={() => setModalOpen(false)} 
          onPermissionAdded={() => setSearch('')} 
        />
      )}
    </div>
  );
};

export default Permissions;