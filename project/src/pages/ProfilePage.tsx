import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import ProfileForm from '../components/ProfileForm';
import ChangePasswordModal from '../components/ChangePasswordModal';
import DeleteAccountModal from '../components/DeleteAccountModal';
import EditProfileModal from '../components/EditProfileModal'; // New import

export default function ProfilePage() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
  const [isDeleteAccountModalOpen, setIsDeleteAccountModalOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      // Redirect to login or home if not authenticated
      navigate('/login'); // Assuming a login route or modal
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null; // Or a loading spinner/message
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg text-gray-700">Cargando datos del usuario...</p>
      </div>
    );
  }

  const handleSave = async (userData: { name?: string; email?: string; phone?: string }) => {
    console.log('Saving user data:', userData);
    // In a real application, you would call an API here to update the user profile.
    // For now, we'll just simulate a delay and then navigate back or show a success message.
    await new Promise(resolve => setTimeout(resolve, 1000));
    alert('Perfil actualizado con éxito (simulado)!');
    // Optionally, refresh user data in AuthContext if it's not automatically updated by the backend response
    setIsEditProfileModalOpen(false); // Close modal after save
  };

  const handleCancel = () => {
    console.log('Profile edit cancelled.');
    setIsEditProfileModalOpen(false); // Close modal
  };

  const handleChangePassword = async (oldPassword: string, newPassword: string) => {
    console.log('Changing password:', { oldPassword, newPassword });
    // In a real application, you would call an API here to change the password.
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    if (oldPassword === 'wrong') { // Simulate an error
      throw new Error('Contraseña actual incorrecta.');
    }
    alert('Contraseña cambiada con éxito (simulado)!');
    // Optionally, re-authenticate user or show success message
  };

  const handleDeleteAccount = async (password: string) => {
    console.log('Deleting account with password:', password);
    // In a real application, you would call an API here to delete the account.
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    if (password === 'wrong') { // Simulate an error
      throw new Error('Contraseña incorrecta.');
    }
    alert('Cuenta eliminada con éxito (simulado)!');
    // After successful deletion, the user should be logged out and redirected.
    logout(); // Assuming logout is available from useAuth
    navigate('/');
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-purple-700 mb-6">Mis Datos</h1>
      <div className="bg-white shadow-md rounded-lg p-6">
        <p className="text-gray-800 text-lg mb-2">Nombre: {user.name}</p>
        <p className="text-gray-800 text-lg mb-2">Email: {user.email}</p>
        {user.phone && <p className="text-gray-800 text-lg mb-2">Teléfono: {user.phone}</p>}
        
        <div className="mt-8 flex space-x-4">
          <button
            onClick={() => setIsEditProfileModalOpen(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
          >
            Editar Perfil
          </button>
          <button
            onClick={() => setIsChangePasswordModalOpen(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
          >
            Cambiar Contraseña
          </button>
          <button
            onClick={() => setIsDeleteAccountModalOpen(true)}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
          >
            Eliminar Cuenta
          </button>
        </div>
      </div>

      <ChangePasswordModal
        isOpen={isChangePasswordModalOpen}
        onClose={() => setIsChangePasswordModalOpen(false)}
        onConfirm={handleChangePassword}
      />
      <DeleteAccountModal
        isOpen={isDeleteAccountModalOpen}
        onClose={() => setIsDeleteAccountModalOpen(false)}
        onConfirm={handleDeleteAccount}
      />
      <EditProfileModal
        isOpen={isEditProfileModalOpen}
        onClose={() => setIsEditProfileModalOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
}
