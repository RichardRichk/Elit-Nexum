import axios from 'axios';
import cookie from 'js-cookie';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { useMutation } from 'react-query';
import { AiOutlineLoading } from 'react-icons/ai';
import { EyeIcon, EyeOffIcon } from '@heroicons/react/outline';

import baseURL from '../../utils/baseURL';

const PasswordSettings = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  const mutation = useMutation(async () => {
    await axios.put(
      `${baseURL}/api/auth/password`,
      { currentPassword, newPassword },
      {
        headers: {
          Authorization: cookie.get('token'),
        },
      }
    );
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      return toast.error('As senhas não correspondem');
    }
    try {
      await mutation.mutateAsync();
      toast.success('Sua senha foi atualizada');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Por favor, verifique suas entradas novamente');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="divide-y divide-gray-200 lg:col-span-9"
    >
      <div className="py-6 px-4 sm:p-6 lg:pb-8">
        <div>
          <h2 className="text-lg leading-6 font-bold text-blackelit font-inconsolata">
            Configurações de Senha
          </h2>
          <p className="mt-1 text-sm text-deepgrayelit font-inconsolata">
            Você precisará inserir sua senha atual antes de poder atualizar sua senha.
          </p>
        </div>
        <div className="mt-6 flex flex-col lg:flex-row">
          <div className="flex-grow space-y-4">
            <div>
              <label
                htmlFor="current-password"
                className="block text-sm font-bold font-inconsolata text-blackelit"
              >
                Senha Atual
              </label>
              <div className="relative mt-1 rounded shadow-sm flex">
                <div
                  className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  {showCurrentPassword ? (
                    <EyeOffIcon
                      className="h-5 w-5 text-grayelit"
                      aria-hidden="true"
                    />
                  ) : (
                    <EyeIcon
                      className="h-5 w-5 text-grayelit"
                      aria-hidden="true"
                    />
                  )}
                </div>
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  name="currentPassword"
                  id="current-password"
                  className="focus:ring-0 border font-inconsolata focus:border-violet flex-grow block w-full min-w-0 rounded sm:text-sm border-grayelit"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="new-password"
                className="block text-sm font-bold text-blackelit font-inconsolata"
              >
                Nova Senha
              </label>
              <div className="relative mt-1 rounded shadow-sm flex">
                <div
                  className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? (
                    <EyeOffIcon
                      className="h-5 w-5 text-grayelit"
                      aria-hidden="true"
                    />
                  ) : (
                    <EyeIcon
                      className="h-5 w-5 text-grayelit"
                      aria-hidden="true"
                    />
                  )}
                </div>
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  name="newPassword"
                  id="new-password"
                  className="focus:ring-0 font-inconsolata border focus:border-violet flex-grow block w-full min-w-0 rounded sm:text-sm border-grayelit"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="confirm-new-password"
                className="block text-sm font-bold text-blackelit font-inconsolata"
              >
                Confirmar Nova Senha
              </label>
              <div className="relative mt-1 rounded shadow-sm flex">
                <div
                  className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                  onClick={() =>
                    setShowConfirmNewPassword(!showConfirmNewPassword)
                  }
                >
                  {showConfirmNewPassword ? (
                    <EyeOffIcon
                      className="h-5 w-5 text-grayelit"
                      aria-hidden="true"
                    />
                  ) : (
                    <EyeIcon
                      className="h-5 w-5 text-grayelit"
                      aria-hidden="true"
                    />
                  )}
                </div>
                <input
                  type={showConfirmNewPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  id="confirm-new-password"
                  className="focus:ring-0 focus:border-violet flex-grow block w-full min-w-0 rounded sm:text-sm border-grayelit"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-4 py-4 px-4 flex justify-end sm:px-6">
        <button
          type="submit"
          className="ml-5 relative bg-deepviolet border border-transparent rounded shadow-sm py-2 px-4 inline-flex justify-center text-sm font-bold text-white hover:bg-darkestviolet font-inconsolata focus:outline-none focus:ring-1 focus:ring-offset-2 focus:ring-violet disabled:opacity-50 disabled:pointer-events-none"
          disabled={mutation.isLoading}
        >
          Salvar
          {mutation.isLoading && (
            <AiOutlineLoading className="h-5 w-5 ml-2 animate-spin" />
          )}
        </button>
      </div>
    </form>
  );
};

export default PasswordSettings;
