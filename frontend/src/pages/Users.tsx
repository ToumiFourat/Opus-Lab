import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import AddUserModal from './AddUserModal';
import EditUserModal from './EditUserModal';
import Toast from '../components/Toast';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const Users: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [editUser, setEditUser] = useState<any | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    async function fetchUsers() {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await axios.get(`${API_URL}/users?search=${search}&page=${page}`, { headers });
      setUsers(res.data.users || res.data.data || []);
      setTotalPages(res.data.totalPages || 1);
      setLoading(false);
    }
    fetchUsers();
  }, [search, page]);

  const { user } = useAuth();
  const isViewer = user?.roles?.includes('viewer');
  
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Gestion des utilisateurs</h2>
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <input
              type="text"
              placeholder="Rechercher par email..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full sm:w-80 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {!isViewer && (
              <button 
                className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 font-medium whitespace-nowrap" 
                onClick={() => setModalOpen(true)}
              >
                Ajouter un utilisateur
              </button>
            )}
          </div>

          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="w-full">
              <thead className="bg-gray-100 border-b border-gray-200">
                <tr>
                  <th className="p-4 text-left text-sm font-semibold text-gray-700">Email</th>
                  <th className="p-4 text-center text-sm font-semibold text-gray-700">Vérifié</th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-700">Rôles</th>
                  {!isViewer && <th className="p-4 text-center text-sm font-semibold text-gray-700">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={isViewer ? 3 : 4} className="text-center p-8 text-gray-500">Chargement...</td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan={isViewer ? 3 : 4} className="text-center p-8 text-gray-500">Aucun utilisateur trouvé.</td>
                  </tr>
                ) : (
                  users.map(u => (
                    <tr key={u._id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4 text-gray-800">{u.email}</td>
                   <td className="p-4 text-center">
                        {u.isVerified ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Vérifié
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            Non vérifié
                          </span>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="flex flex-wrap gap-2">
                          {u.roles?.map((r: any) => (
                            <span key={r.name} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                              {r.name}
                            </span>
                          ))}
                        </div>
                      </td>
                      {!isViewer && (
                        <td className="p-4 text-center">
                          <button 
                            className="text-blue-600 hover:text-blue-800 font-medium mr-4 transition" 
                            onClick={() => setEditUser(u)}
                          >
                            Modifier
                          </button>
                          <button 
                            className="text-red-600 hover:text-red-800 font-medium transition" 
                            onClick={async () => {
                              if (window.confirm('Supprimer cet utilisateur ?')) {
                                const token = localStorage.getItem('accessToken');
                                const headers = token ? { Authorization: `Bearer ${token}` } : {};
                                await axios.delete(`${API_URL}/users/${u._id}`, { headers });
                                setSearch('');
                                setToast('Utilisateur supprimé avec succès !');
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
        <>
          <AddUserModal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            onUserAdded={() => {
              setSearch('');
              setToast('Utilisateur ajouté avec succès !');
            }}
          />
        </>
      )}
      
      {editUser && !isViewer && (
        <EditUserModal
          open={!!editUser}
          user={editUser}
          onClose={() => setEditUser(null)}
          onUserUpdated={() => {
            setSearch('');
            setToast('Utilisateur modifié avec succès !');
          }}
        />
      )}
      
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
};

export default Users;