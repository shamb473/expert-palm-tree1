import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { Lock, User as UserIcon, ArrowRight, Eye, EyeOff, ShieldCheck, KeyRound, ArrowLeft, Save, UserCog } from 'lucide-react';

interface LoginProps {
  onLogin: (user: User) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [mode, setMode] = useState<'login' | 'change-password' | 'change-id'>('login');
  
  // Login Fields
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  
  // Change Password Fields
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Change ID Fields
  const [currentIdVerify, setCurrentIdVerify] = useState('');
  const [passwordVerify, setPasswordVerify] = useState('');
  const [newId, setNewId] = useState('');
  const [confirmId, setConfirmId] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Initialize default credentials in localStorage if not present
  useEffect(() => {
    const storedPassword = localStorage.getItem('kastkar_owner_password');
    if (!storedPassword) {
      localStorage.setItem('kastkar_owner_password', 'Shamb2278@');
    }
    const storedId = localStorage.getItem('kastkar_owner_id');
    if (!storedId) {
      localStorage.setItem('kastkar_owner_id', 'Shamb2278');
    }
  }, []);

  const resetForm = () => {
    setUserId('');
    setPassword('');
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setCurrentIdVerify('');
    setPasswordVerify('');
    setNewId('');
    setConfirmId('');
    setError('');
    setSuccess('');
    setShowPassword(false);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!userId.trim() || !password.trim()) {
      setError('Please enter Owner ID and Password');
      return;
    }

    setIsLoading(true);
    
    // Simulate network delay
    setTimeout(() => {
      const storedPassword = localStorage.getItem('kastkar_owner_password') || 'Shamb2278@';
      const storedId = localStorage.getItem('kastkar_owner_id') || 'Shamb2278';
      
      if (userId === storedId && password === storedPassword) {
        onLogin({ 
          name: 'Shamb (Owner)', 
          phone: '+91 89996 78500' 
        });
      } else {
        setError('Invalid Owner ID or Password. Access Denied.');
        setIsLoading(false);
      }
    }, 800);
  };

  const handleChangePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!userId.trim() || !oldPassword.trim() || !newPassword.trim() || !confirmPassword.trim()) {
      setError('All fields are required.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match.');
      return;
    }

    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters long.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const storedPassword = localStorage.getItem('kastkar_owner_password') || 'Shamb2278@';
      const storedId = localStorage.getItem('kastkar_owner_id') || 'Shamb2278';

      if (userId !== storedId) {
         setError('Invalid Owner ID.');
         setIsLoading(false);
         return;
      }

      if (oldPassword !== storedPassword) {
        setError('Incorrect Old Password.');
        setIsLoading(false);
        return;
      }

      // Update password
      localStorage.setItem('kastkar_owner_password', newPassword);
      setSuccess('Password changed successfully! Please login with new password.');
      setIsLoading(false);
      
      // Switch back to login after delay
      setTimeout(() => {
        setMode('login');
        resetForm();
        setSuccess('Password updated. Please login.'); // Set again to show on login screen
      }, 1500);
    }, 800);
  };

  const handleChangeIdSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!currentIdVerify.trim() || !passwordVerify.trim() || !newId.trim() || !confirmId.trim()) {
      setError('All fields are required.');
      return;
    }

    if (newId !== confirmId) {
      setError('New Owner IDs do not match.');
      return;
    }

    if (newId.length < 4) {
      setError('New Owner ID must be at least 4 characters long.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const storedPassword = localStorage.getItem('kastkar_owner_password') || 'Shamb2278@';
      const storedId = localStorage.getItem('kastkar_owner_id') || 'Shamb2278';

      if (currentIdVerify !== storedId) {
         setError('Invalid Current Owner ID.');
         setIsLoading(false);
         return;
      }

      if (passwordVerify !== storedPassword) {
        setError('Incorrect Password.');
        setIsLoading(false);
        return;
      }

      // Update ID
      localStorage.setItem('kastkar_owner_id', newId);
      setSuccess('Owner ID changed successfully! Please login with new ID.');
      setIsLoading(false);
      
      // Switch back to login after delay
      setTimeout(() => {
        setMode('login');
        resetForm();
        setSuccess('Owner ID updated. Please login.');
      }, 1500);
    }, 800);
  };

  const getHeaderIcon = () => {
    switch(mode) {
      case 'login': return <ShieldCheck size={40} className="text-green-700" />;
      case 'change-password': return <KeyRound size={40} className="text-blue-700" />;
      case 'change-id': return <UserCog size={40} className="text-purple-700" />;
    }
  };

  const getHeaderColor = () => {
    switch(mode) {
      case 'login': return 'bg-green-50';
      case 'change-password': return 'bg-blue-50';
      case 'change-id': return 'bg-purple-50';
    }
  };

  const getGradient = () => {
    switch(mode) {
      case 'login': return 'from-green-600 to-yellow-400';
      case 'change-password': return 'from-blue-600 to-indigo-400';
      case 'change-id': return 'from-purple-600 to-pink-400';
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="bg-white p-8 md:p-10 rounded-3xl shadow-2xl w-full max-w-md border border-slate-100 relative overflow-hidden transition-all duration-300">
        {/* Decorative Background Element */}
        <div className={`absolute top-0 left-0 w-full h-2 bg-gradient-to-r transition-all duration-500 ${getGradient()}`}></div>
        
        {/* Header */}
        <div className="text-center mb-10">
          <div className={`inline-flex p-4 rounded-full mb-4 shadow-inner transition-colors duration-300 ${getHeaderColor()}`}>
            {getHeaderIcon()}
          </div>
          <h2 className="text-3xl font-bold text-slate-800">
            {mode === 'login' && 'Owner Login'}
            {mode === 'change-password' && 'Change Password'}
            {mode === 'change-id' && 'Change Owner ID'}
          </h2>
          <p className="text-slate-500 mt-2 font-medium">Kastkar Krushi Seva Kendra</p>
          <p className="text-xs text-slate-400 mt-1">Authorized Access Only</p>
        </div>

        {mode === 'login' ? (
          /* LOGIN FORM */
          <form onSubmit={handleLoginSubmit} className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Owner ID</label>
              <div className="relative group">
                <UserIcon className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-green-600 transition-colors" size={20} />
                <input
                  type="text"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:bg-white focus:border-transparent outline-none transition-all font-medium text-slate-700 placeholder:text-slate-400"
                  placeholder="Enter Owner ID"
                  autoComplete="username"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-green-600 transition-colors" size={20} />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:bg-white focus:border-transparent outline-none transition-all font-medium text-slate-700 placeholder:text-slate-400"
                  placeholder="Enter Password"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3.5 text-slate-400 hover:text-slate-600 focus:outline-none"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-red-600 text-sm text-center font-medium animate-pulse">
                {error}
              </div>
            )}
            
            {success && (
              <div className="p-3 bg-green-50 border border-green-100 rounded-lg text-green-600 text-sm text-center font-medium">
                {success}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-green-700 text-white py-4 rounded-xl font-bold text-lg hover:bg-green-800 transition-all flex items-center justify-center space-x-2 shadow-lg shadow-green-200 ${isLoading ? 'opacity-80 cursor-wait' : 'hover:scale-[1.02]'}`}
            >
              <span>{isLoading ? 'Verifying...' : 'Login'}</span>
              {!isLoading && <ArrowRight size={20} />}
            </button>
            
            <div className="flex justify-between pt-2 px-1">
                <button 
                    type="button"
                    onClick={() => {
                        setMode('change-id');
                        resetForm();
                    }}
                    className="text-xs text-slate-500 hover:text-green-700 font-medium transition-colors"
                >
                    Change ID?
                </button>
                <button 
                    type="button"
                    onClick={() => {
                        setMode('change-password');
                        resetForm();
                    }}
                    className="text-xs text-slate-500 hover:text-green-700 font-medium transition-colors"
                >
                    Change Password?
                </button>
            </div>
          </form>
        ) : mode === 'change-password' ? (
          /* CHANGE PASSWORD FORM */
          <form onSubmit={handleChangePasswordSubmit} className="space-y-4 animate-in fade-in slide-in-from-left-4 duration-300">
             <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Owner ID (Verify)</label>
              <div className="relative group">
                <UserIcon className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={20} />
                <input
                  type="text"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all font-medium text-slate-700"
                  placeholder="Confirm Owner ID"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Old Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={20} />
                <input
                  type={showPassword ? "text" : "password"}
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all font-medium text-slate-700"
                  placeholder="Current Password"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">New Password</label>
              <div className="relative group">
                <KeyRound className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={20} />
                <input
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all font-medium text-slate-700"
                  placeholder="New Password"
                />
                 <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3.5 text-slate-400 hover:text-slate-600 focus:outline-none"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Confirm New Password</label>
              <div className="relative group">
                <KeyRound className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={20} />
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all font-medium text-slate-700"
                  placeholder="Re-enter New Password"
                />
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-red-600 text-sm text-center font-medium animate-pulse">
                {error}
              </div>
            )}

            {success && (
              <div className="p-3 bg-green-50 border border-green-100 rounded-lg text-green-600 text-sm text-center font-medium">
                {success}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-all flex items-center justify-center space-x-2 shadow-lg shadow-blue-200 ${isLoading ? 'opacity-80 cursor-wait' : 'hover:scale-[1.02]'}`}
            >
              <span>{isLoading ? 'Updating...' : 'Update Password'}</span>
              {!isLoading && <Save size={20} />}
            </button>

            <div className="text-center pt-2">
                <button 
                    type="button"
                    onClick={() => {
                        setMode('login');
                        resetForm();
                    }}
                    className="flex items-center justify-center w-full text-sm text-slate-500 hover:text-slate-700 font-medium transition-colors"
                >
                    <ArrowLeft size={16} className="mr-1" />
                    Back to Login
                </button>
            </div>
          </form>
        ) : (
          /* CHANGE ID FORM */
          <form onSubmit={handleChangeIdSubmit} className="space-y-4 animate-in fade-in slide-in-from-left-4 duration-300">
             <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Current ID</label>
              <div className="relative group">
                <UserIcon className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-purple-600 transition-colors" size={20} />
                <input
                  type="text"
                  value={currentIdVerify}
                  onChange={(e) => setCurrentIdVerify(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:bg-white outline-none transition-all font-medium text-slate-700"
                  placeholder="Enter Current ID"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Password (Verify)</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-purple-600 transition-colors" size={20} />
                <input
                  type={showPassword ? "text" : "password"}
                  value={passwordVerify}
                  onChange={(e) => setPasswordVerify(e.target.value)}
                  className="w-full pl-12 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:bg-white outline-none transition-all font-medium text-slate-700"
                  placeholder="Enter Password"
                />
                 <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3.5 text-slate-400 hover:text-slate-600 focus:outline-none"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">New Owner ID</label>
              <div className="relative group">
                <UserCog className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-purple-600 transition-colors" size={20} />
                <input
                  type="text"
                  value={newId}
                  onChange={(e) => setNewId(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:bg-white outline-none transition-all font-medium text-slate-700"
                  placeholder="Enter New ID"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Confirm New ID</label>
              <div className="relative group">
                <UserCog className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-purple-600 transition-colors" size={20} />
                <input
                  type="text"
                  value={confirmId}
                  onChange={(e) => setConfirmId(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:bg-white outline-none transition-all font-medium text-slate-700"
                  placeholder="Re-enter New ID"
                />
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-red-600 text-sm text-center font-medium animate-pulse">
                {error}
              </div>
            )}

            {success && (
              <div className="p-3 bg-green-50 border border-green-100 rounded-lg text-green-600 text-sm text-center font-medium">
                {success}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-purple-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-purple-700 transition-all flex items-center justify-center space-x-2 shadow-lg shadow-purple-200 ${isLoading ? 'opacity-80 cursor-wait' : 'hover:scale-[1.02]'}`}
            >
              <span>{isLoading ? 'Updating...' : 'Update ID'}</span>
              {!isLoading && <Save size={20} />}
            </button>

            <div className="text-center pt-2">
                <button 
                    type="button"
                    onClick={() => {
                        setMode('login');
                        resetForm();
                    }}
                    className="flex items-center justify-center w-full text-sm text-slate-500 hover:text-slate-700 font-medium transition-colors"
                >
                    <ArrowLeft size={16} className="mr-1" />
                    Back to Login
                </button>
            </div>
          </form>
        )}

        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-400">
            Secure Login System <br/>Keliweli, Akot.
          </p>
        </div>
      </div>
    </div>
  );
};
