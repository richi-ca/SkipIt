import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import CustomDropdown from './CustomDropdown';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { format, parseISO, subYears } from 'date-fns';

interface ProfileFormInputs {
  name: string;
  email: string;
  phone: string;
  dob?: Date | null;
  gender?: string;
}

interface ProfileFormProps {
  onSave: (userData: any) => Promise<void>;
  onCancel: () => void;
  isSaving: boolean;
}

const genderOptions = [
  { value: 'M', label: 'Masculino' },
  { value: 'F', label: 'Femenino' },
  { value: 'Otro', label: 'Otro' },
];

export default function ProfileForm({ onSave, onCancel, isSaving }: ProfileFormProps) {
  const { user } = useAuth();
  const maxDate = subYears(new Date(), 18);

  const { register, handleSubmit, reset, control, formState: { errors, isDirty } } = useForm<ProfileFormInputs>({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      dob: user?.dob ? parseISO(user.dob) : null,
      gender: user?.gender || '',
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        dob: user.dob ? parseISO(user.dob) : null,
        gender: user.gender || '',
      });
    }
  }, [user, reset]);

  const onSubmit = async (data: ProfileFormInputs) => {
    if (!isDirty || isSaving) return;
    
    // Format data for API (convert Date to string)
    const formattedData = {
      ...data,
      dob: data.dob ? format(data.dob, 'yyyy-MM-dd') : undefined,
    };
    
    await onSave(formattedData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nombre</label>
        <input
          type="text"
          id="name"
          {...register('name', { required: 'El nombre es requerido' })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm p-2"
          disabled={isSaving}
        />
        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          id="email"
          {...register('email', {
            required: 'El email es requerido',
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
              message: 'Formato de email inválido',
            },
          })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm p-2"
          disabled={isSaving}
        />
        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
      </div>
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Teléfono</label>
        <input
          type="tel"
          id="phone"
          {...register('phone')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm p-2"
          disabled={isSaving}
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="dob" className="block text-sm font-medium text-gray-700 mb-2">Fecha de Nacimiento</label>
          <Controller
            name="dob"
            control={control}
            rules={{ required: 'La fecha es obligatoria.' }}
            render={({ field, fieldState: { error } }) => (
              <DatePicker
                {...field}
                disableFuture
                maxDate={maxDate}
                openTo="year"
                views={['year', 'month', 'day']}
                value={field.value || null}
                onChange={(newValue) => field.onChange(newValue)}
                disabled={isSaving}
                slotProps={{
                  textField: {
                    id: 'dob',
                    fullWidth: true,
                    error: !!error,
                    helperText: error?.message,
                    sx: {
                      '& .MuiInputBase-root': { borderRadius: '0.5rem', backgroundColor: 'white', height: '42px' },
                      '& .MuiOutlinedInput-notchedOutline': { borderColor: '#D1D5DB' },
                      '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#9CA3AF' },
                      '& .MuiInputBase-input': { padding: '10px 14px' } 
                    }
                  }
                }}
              />
            )}
          />
        </div>
        <div>
          <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-2">Sexo</label>
          <Controller
            name="gender"
            control={control}
            rules={{ required: 'El sexo es obligatorio.' }}
            render={({ field }) => (
              <CustomDropdown
                id="gender"
                value={field.value || ''}
                onChange={field.onChange}
                options={genderOptions}
              />
            )}
          />
          {errors.gender && <p role="alert" className="text-sm text-red-600 mt-2">{errors.gender.message}</p>}
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          disabled={isSaving}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isSaving || !isDirty}
        >
          {isSaving ? 'Guardando...' : 'Guardar Cambios'}
        </button>
      </div>
    </form>
  );
}
