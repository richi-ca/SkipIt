import React, { useState, useEffect } from 'react';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { X, User, Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';
import TermsModal from './TermsModal';
import logoSkipIT from '../assets/images/Logo1.png';
import { Link } from 'react-router-dom';
import CustomDropdown from './CustomDropdown';
import CustomCountrySelect from './CustomCountrySelect';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TextField } from '@mui/material';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { format, subYears } from 'date-fns';
import { authService } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

// --- Sub-componente para el medidor de fortaleza de contraseña ---
const PasswordStrengthMeter = ({ password }: { password?: string }) => {
  const getStrength = () => {
    if (!password) return 0;
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  };

  const strength = getStrength();
  const strengthLabels = ['Muy Débil', 'Débil', 'Normal', 'Fuerte', 'Muy Fuerte'];
  const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-lime-500', 'bg-green-500'];

  return (
    <div className="mt-2">
      <div className="flex w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div className={`transition-all duration-300 ${strengthColors[strength - 1] || ''}`} style={{ width: `${strength * 25}%` }}></div>
      </div>
      <p className="text-xs text-right mt-1 text-gray-500">{strength > 0 && strengthLabels[strength - 1]}</p>
    </div>
  );
};

// --- Componente personalizado para el input del teléfono ---
const CustomPhoneInput = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>((props, ref) => (
  <input {...props} ref={ref} className="w-full h-full focus:outline-none focus:ring-0 border-none bg-transparent py-3" />
));

// --- Tipos y componente principal ---
interface IFormInput {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  dob: Date | null;
  gender: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}

const genderOptions = [
  { value: 'M', label: 'Masculino' },
  { value: 'F', label: 'Femenino' },
  { value: 'Otro', label: 'Otro' },
];

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
}

export default function RegisterModal({ isOpen, onClose, onSwitchToLogin }: RegisterModalProps) {
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [serverError, setServerError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const maxDate = subYears(new Date(), 18);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
    control,
  } = useForm<IFormInput>({ 
    mode: 'onBlur',
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      dob: null,
      gender: '',
      password: '',
      confirmPassword: '',
      acceptTerms: false,
    }
  });

  const passwordValue = watch('password');

  useEffect(() => {
    if (isOpen) {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    } else {
      setTimeout(() => {
        reset();
        setFormSuccess('');
        setServerError('');
        setShowPassword(false);
        setShowConfirmPassword(false);
      }, 200);
    }
  }, [isOpen, onClose, reset]);

  if (!isOpen) return null;

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    setFormSuccess('');
    setServerError('');
    
    try {
      const response = await authService.register({
        name: `${data.firstName} ${data.lastName}`,
        email: data.email,
        password: data.password,
        phone: data.phone,
        dob: data.dob ? format(data.dob, 'yyyy-MM-dd') : null,
        gender: data.gender,
      });

      setFormSuccess('¡Registro exitoso! Iniciando sesión...');
      
      setTimeout(() => {
        login(response.user, response.token);
        onClose();
        toast.success(`¡Bienvenido, ${response.user.name}!`);
      }, 1500);

    } catch (error: any) {
      setServerError(error.message || 'Error al crear la cuenta. Inténtalo de nuevo.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[100]" role="dialog" aria-modal="true">
      <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl">
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <Link to="/" className="flex items-center space-x-6">
                <img src={logoSkipIT} alt="Logo SkipIT" className="h-12" />
              </Link>
              <p className="text-purple-100 text-sm pl-1">¡Sáltate la fila, y dedícate a disfrutar!</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors" aria-label="Cerrar modal">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 max-h-[605px] overflow-y-auto scrollbar-width-none [&::-webkit-scrollbar]:hidden">
          <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">¡Únete a SkipIT!</h2>
          <p className="text-gray-600 text-center mb-6">Crea tu cuenta y empieza a disfrutar sin filas</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {formSuccess && (
              <div role="alert" className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg flex items-center space-x-2">
                <CheckCircle className="w-5 h-5" />
                <span className="text-sm">{formSuccess}</span>
              </div>
            )}

            {serverError && (
              <div role="alert" className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg flex items-center space-x-2">
                <AlertCircle className="w-5 h-5" />
                <span className="text-sm">{serverError}</span>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input id="firstName" type="text" autoComplete="given-name" {...register('firstName', { required: 'El nombre es obligatorio.' })} className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition-all ${errors.firstName ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-purple-500'}`} placeholder="Tu nombre" />
                </div>
                {errors.firstName && <p role="alert" className="text-sm text-red-600 mt-2">{errors.firstName.message}</p>}
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">Apellido</label>
                <input id="lastName" type="text" autoComplete="family-name" {...register('lastName', { required: 'El apellido es obligatorio.' })} className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition-all ${errors.lastName ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-purple-500'}`} placeholder="Tu apellido" />
                {errors.lastName && <p role="alert" className="text-sm text-red-600 mt-2">{errors.lastName.message}</p>}
              </div>
            </div>

            <div>
              <label htmlFor="email-register" className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input id="email-register" type="email" autoComplete="email" {...register('email', { required: 'El email es obligatorio.', pattern: { value: /\S+@\S+\.\S+/, message: 'El formato del email no es válido.' } })} className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition-all ${errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-purple-500'}`} placeholder="tu@email.com" />
              </div>
              {errors.email && <p role="alert" className="text-sm text-red-600 mt-2">{errors.email.message}</p>}
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">Teléfono Celular</label>
              <Controller
                name="phone"
                control={control}
                rules={{ required: 'El teléfono es obligatorio.' }}
                render={({ field, fieldState: { error } }) => (
                  <PhoneInput
                    {...field}
                    id="phone"
                    international
                    defaultCountry="CL"
                    countryCallingCodeEditable={false}
                    countrySelectComponent={CustomCountrySelect}
                    inputComponent={CustomPhoneInput}
                    className={`flex items-center w-full bg-white border rounded-lg shadow-sm transition-all duration-200 ${error ? 'border-red-500' : 'border-gray-300 hover:border-gray-400'} focus-within:ring-2 focus-within:ring-purple-500 focus-within:border-transparent`}
                    placeholder="Ingresa tu número"
                  />
                )}
              />
              {errors.phone && <p role="alert" className="text-sm text-red-600 mt-2">{errors.phone.message}</p>}
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
                      slotProps={{
                        textField: {
                          id: 'dob',
                          fullWidth: true,
                          error: !!error,
                          helperText: error?.message,
                          sx: {
                            '& .MuiInputBase-root': { borderRadius: '0.5rem', backgroundColor: 'white' },
                            '& .MuiOutlinedInput-notchedOutline': { borderColor: '#D1D5DB' },
                            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#9CA3AF' },
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
                      value={field.value}
                      onChange={field.onChange}
                      options={genderOptions}
                    />
                  )}
                />
                {errors.gender && <p role="alert" className="text-sm text-red-600 mt-2">{errors.gender.message}</p>}
              </div>
            </div>

            <div>
              <label htmlFor="password-register" className="block text-sm font-medium text-gray-700 mb-2">Contraseña</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input id="password-register" type={showPassword ? 'text' : 'password'} autoComplete="new-password" {...register('password', { required: 'La contraseña es obligatoria.', minLength: { value: 8, message: 'Debe tener al menos 8 caracteres.' } })} className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition-all ${errors.password ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-purple-500'}`} placeholder="Mínimo 8 caracteres" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600" aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}>
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <p role="alert" className="text-sm text-red-600 mt-2">{errors.password.message}</p>}
              <PasswordStrengthMeter password={passwordValue} />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">Confirmar Contraseña</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input id="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} autoComplete="new-password" {...register('confirmPassword', { required: 'Confirma tu contraseña.', validate: (value) => value === passwordValue || 'Las contraseñas no coinciden.' })} className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition-all ${errors.confirmPassword ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-purple-500'}`} placeholder="Repite tu contraseña" />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600" aria-label={showConfirmPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}>
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.confirmPassword && <p role="alert" className="text-sm text-red-600 mt-2">{errors.confirmPassword.message}</p>}
            </div>

            <div className="flex items-start space-x-3">
              <input id="acceptTerms" type="checkbox" {...register('acceptTerms', { required: 'Debes aceptar los términos.' })} className="mt-1 w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500" />
              <div className="text-sm">
                <label htmlFor="acceptTerms" className="text-gray-600">Acepto los {' '}</label>
                <button type="button" onClick={() => setShowTerms(true)} className="text-purple-600 hover:text-purple-700 font-medium underline">términos y condiciones</button>
              </div>
            </div>
            {errors.acceptTerms && <p role="alert" className="text-sm text-red-600">{errors.acceptTerms.message}</p>}

            <button type="submit" disabled={isSubmitting} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-4 px-6 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed disabled:scale-100">
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creando cuenta...
                </>
              ) : (
                'Crear Cuenta'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">¿Ya tienes cuenta? {' '}<button onClick={onSwitchToLogin} className="text-purple-600 hover:text-purple-700 font-medium">Inicia sesión aquí</button></p>
          </div>
        </div>

        <TermsModal isOpen={showTerms} onClose={() => setShowTerms(false)} />
      </div>
    </div>
  );
}
