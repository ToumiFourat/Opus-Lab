import React, { useState } from 'react';
import { requestPasswordReset } from '../api/auth';
import ResetPasswordInline from './ResetPasswordInline';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await requestPasswordReset(email);
      setSuccess(true);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Erreur lors de la demande');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">Mot de passe oublié</h2>
        <p className="text-gray-600 text-center mb-8">
          {!success ? 'Entrez votre email pour réinitialiser' : ''}
        </p>

        {!success ? (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="votre@email.com"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-200 disabled:bg-blue-300 disabled:cursor-not-allowed font-medium"
            >
              {loading ? 'Envoi...' : 'Envoyer le lien'}
            </button>

            <div className="mt-6 text-center">
              <p className="text-gray-600 text-sm">
                Vous vous souvenez ?{' '}
                <a href="/login" className="text-blue-600 hover:text-blue-800 font-medium">
                  Se connecter
                </a>
              </p>
            </div>
          </form>
        ) : (
          <ResetPasswordInline email={email} />
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;