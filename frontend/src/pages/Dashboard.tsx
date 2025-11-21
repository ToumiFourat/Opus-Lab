import React from 'react';
import { useAuth } from '../context/AuthContext';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  console.log(user)
  
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard</h1>
              <div className="flex items-center gap-3">
                <span className="text-gray-600">Bienvenue !</span>
                {user?.roles && (
                  <span className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-full font-medium">
                    {user.roles.join(', ')}
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={() => {
                localStorage.removeItem('accessToken');
                window.location.href = '/login';
              }}
              className="px-5 py-2.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-200 font-medium"
            >
              Se déconnecter
            </button>
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {user?.roles?.includes('viewer') ? (
            <>
              {user?.permissions?.includes('user.read') && (
                <a 
                  href="/users" 
                  className="block p-6 bg-white border border-gray-200 rounded-lg hover:shadow-lg hover:border-blue-400 transition-all duration-200 transform hover:scale-105"
                >
                  <div className="text-xl font-semibold text-gray-800 mb-2">Utilisateurs</div>
                  <div className="text-sm text-gray-500">Visualiser la liste des utilisateurs</div>
                </a>
              )}
              {user?.permissions?.includes('role.read') && (
                <a 
                  href="/roles" 
                  className="block p-6 bg-white border border-gray-200 rounded-lg hover:shadow-lg hover:border-blue-400 transition-all duration-200 transform hover:scale-105"
                >
                  <div className="text-xl font-semibold text-gray-800 mb-2">Rôles</div>
                  <div className="text-sm text-gray-500">Visualiser la liste des rôles</div>
                </a>
              )}
              {user?.permissions?.includes('permission.read') && (
                <a 
                  href="/permissions" 
                  className="block p-6 bg-white border border-gray-200 rounded-lg hover:shadow-lg hover:border-blue-400 transition-all duration-200 transform hover:scale-105"
                >
                  <div className="text-xl font-semibold text-gray-800 mb-2">Permissions</div>
                  <div className="text-sm text-gray-500">Visualiser la liste des permissions</div>
                </a>
              )}
            </>
          ) : (
            <>
              {user?.permissions?.includes('user.read') && (
                <a
                  href="/users"
                  className="block p-6 bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg hover:border-blue-400 transition-all duration-200 transform hover:scale-105"
                >
                  <div className="text-xl font-semibold text-gray-800 mb-2">Utilisateurs</div>
                  <div className="text-sm text-gray-500">Gérer les comptes utilisateurs</div>
                </a>
              )}
              {user?.permissions?.includes('role.read') && (
                <a
                  href="/roles"
                  className="block p-6 bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg hover:border-blue-400 transition-all duration-200 transform hover:scale-105"
                >
                  <div className="text-xl font-semibold text-gray-800 mb-2">Gestion des rôles</div>
                  <div className="text-sm text-gray-500">Accéder à la gestion des rôles et permissions</div>
                </a>
              )}
              {user?.permissions?.includes('permission.read') && (
                <a
                  href="/permissions"
                  className="block p-6 bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg hover:border-blue-400 transition-all duration-200 transform hover:scale-105"
                >
                  <div className="text-xl font-semibold text-gray-800 mb-2">Gestion des permissions</div>
                  <div className="text-sm text-gray-500">Accéder à la gestion des permissions</div>
                </a>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;