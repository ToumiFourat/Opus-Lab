import React, { useState } from 'react';
import { confirmPasswordReset } from '../api/auth';

const ResetPasswordInline: React.FC<{ email: string }> = ({ email }) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (newPassword !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }
    setLoading(true);
    try {
    
      await confirmPasswordReset(email, newPassword);
      setSuccess(true);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Erreur lors de la réinitialisation');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return <div className="text-green-600 text-center mb-4">Mot de passe modifié avec succès.</div>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label htmlFor="newPassword" className="block font-medium mb-1">Nouveau mot de passe</label>
        <input
          id="newPassword"
          type="password"
          value={newPassword}
          onChange={e => setNewPassword(e.target.value)}
          required
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="confirmPassword" className="block font-medium mb-1">Confirmer le nouveau mot de passe</label>
        <input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          required
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
        />
      </div>
      {error && <div className="text-red-600 mb-3 text-sm">{error}</div>}
      <button
        type="submit"
        disabled={loading}
        className="w-full p-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:bg-blue-300"
      >
        {loading ? 'Changement...' : 'Changer le mot de passe'}
      </button>
    </form>
  );
};

export default ResetPasswordInline;
