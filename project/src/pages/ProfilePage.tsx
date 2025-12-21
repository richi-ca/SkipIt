import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import ProfileForm from '../components/ProfileForm';
import ChangePasswordModal from '../components/ChangePasswordModal';
import DeleteAccountModal from '../components/DeleteAccountModal';
import EditProfileModal from '../components/EditProfileModal'; // New import
import { authService } from '../services/authService'; // Import authService
import toast from 'react-hot-toast'; // Import toast for better feedback

export default function ProfilePage() {
  const { user, isAuthenticated, logout, login } = useAuth(); // Destructure login to update user context
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

  const handleSave = async (userData: { name?: string; email?: string; phone?: string; dob?: string; gender?: string }) => {
    try {
      const updatedUser = await authService.updateProfile(userData);
      // Update the user in the context to reflect changes immediately
      login(updatedUser, localStorage.getItem('token') || undefined);
      toast.success('Perfil actualizado con éxito');
      setIsEditProfileModalOpen(false); // Close modal after save
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Error al actualizar el perfil.');
      throw error; // Re-throw to be caught by the modal's error handler if needed
    }
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
        <p className="text-gray-800 text-lg mb-2"><span className="font-semibold">Nombre:</span> {user.name}</p>
        <p className="text-gray-800 text-lg mb-2"><span className="font-semibold">Email:</span> {user.email}</p>
        {user.phone && <p className="text-gray-800 text-lg mb-2"><span className="font-semibold">Teléfono:</span> {user.phone}</p>}
        {user.dob && <p className="text-gray-800 text-lg mb-2"><span className="font-semibold">Fecha de Nacimiento:</span> {user.dob}</p>}
        {user.gender && <p className="text-gray-800 text-lg mb-2"><span className="font-semibold">Género:</span> {user.gender}</p>}
        
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
