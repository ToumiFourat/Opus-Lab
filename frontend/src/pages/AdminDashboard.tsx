import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<{ users: number; roles: number; permissions: number }>({ users: 0, roles: 0, permissions: 0 });

  useEffect(() => {
    async function fetchStats() {
      const token = localStorage.getItem('accessToken');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const [usersRes, rolesRes, permsRes] = await Promise.all([
        axios.get(`${API_URL}/users`, { headers }),
        axios.get(`${API_URL}/roles`, { headers }),
        axios.get(`${API_URL}/permissions`, { headers })
      ]);
      setStats({
        users: usersRes.data.total || usersRes.data.length || 0,
        roles: rolesRes.data.length || 0,
        permissions: permsRes.data.length || 0
      });
    }
    fetchStats();
  }, []);

  return (
    <div className="max-w-6xl mx-auto mt-10 p-8 bg-white border border-gray-100 rounded-xl shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard Administrateur</h1>
        <button
          onClick={() => {
            localStorage.removeItem('accessToken');
            window.location.href = '/login';
          }}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Se déconnecter
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="p-6 bg-blue-50 border border-blue-200 rounded-xl text-center">
          <div className="text-4xl font-bold text-blue-700 mb-2">{stats.users}</div>
          <div className="uppercase text-xs text-blue-800 tracking-wider">Utilisateurs</div>
        </div>
        <div className="p-6 bg-green-50 border border-green-200 rounded-xl text-center">
          <div className="text-4xl font-bold text-green-700 mb-2">{stats.roles}</div>
          <div className="uppercase text-xs text-green-800 tracking-wider">Rôles</div>
        </div>
        <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-xl text-center">
          <div className="text-4xl font-bold text-yellow-700 mb-2">{stats.permissions}</div>
          <div className="uppercase text-xs text-yellow-800 tracking-wider">Permissions</div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <a href="/users" className="block p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md hover:border-blue-300 transition-all text-center">
          <div className="text-lg font-semibold text-gray-800 mb-2">Gérer les Utilisateurs</div>
          <div className="text-sm text-gray-500">Créer, modifier, activer/désactiver, assigner des rôles</div>
        </a>
        <a href="/roles" className="block p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md hover:border-green-300 transition-all text-center">
          <div className="text-lg font-semibold text-gray-800 mb-2">Gérer les Rôles</div>
          <div className="text-sm text-gray-500">Créer, modifier, attacher/détacher des permissions</div>
        </a>
        <a href="/permissions" className="block p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md hover:border-yellow-300 transition-all text-center">
          <div className="text-lg font-semibold text-gray-800 mb-2">Lister les Permissions</div>
          <div className="text-sm text-gray-500">Voir toutes les permissions du système</div>
        </a>
      </div>
      {/* Audit log, actions rapides, etc. peuvent être ajoutés ici */}
      {user?.roles?.includes('admin') && (
        <div className="mt-8">
          <a href="/audit" className="inline-block px-6 py-3 bg-gray-800 text-white rounded hover:bg-gray-900 transition">Voir l'audit log</a>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
