import React, { useState } from 'react';
import { X } from 'lucide-react';
import ProfileForm from './ProfileForm';
import toast from 'react-hot-toast';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (userData: { name?: string; email?: string; phone?: string }) => Promise<void>;
}

export default function EditProfileModal({ isOpen, onClose, onSave }: EditProfileModalProps) {
  if (!isOpen) return null;
  const [saving, setSaving] = useState(false);

  const handleSave = async (formData: { name?: string; email?: string; phone?: string }) => {
    setSaving(true);
    try {
      await onSave(formData);
      toast.success('Perfil actualizado correctamente.');
      onClose();
    } catch (error) {
      toast.error('Error al actualizar el perfil.');
      console.error("Error saving profile:", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-purple-700">Editar Perfil</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>
        <ProfileForm onSave={handleSave} onCancel={onClose} isSaving={saving} />
      </div>
    </div>
  );
}
