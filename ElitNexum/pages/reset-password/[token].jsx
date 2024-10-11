import axios from 'axios';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import { useMutation } from 'react-query';
import { AiOutlineLoading } from 'react-icons/ai';
import { EyeIcon, EyeOffIcon, TerminalIcon } from '@heroicons/react/outline';
import baseURL from '../../utils/baseURL';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();
  const { token } = router.query;

  const mutation = useMutation(async () => {
    const { data } = await axios.put(
      `${baseURL}/api/auth/reset-password/${token}`,
      {
        password,
      }
    );
    return data;
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return toast.error('As senhas não correspondem');
    }

    try {
      await mutation.mutateAsync();
      toast.success('Sua senha foi atualizada');
      router.push('/');
    } catch (err) {
      toast.error(
        err.response?.data?.msg || 'Ocorreu um erro. Tente novamente mais tarde.'
      );
    }
  };

  return (
    <section className="h-screen flex items-center justify-center bg-no-repeat inset-0 bg-cover bg-deepgrayelit">
      <div className="container 2xl:px-80 xl:px-52">
        <div className="bg-whiteelit rounded overflow-hidden" style={{
          boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px"
        }}>
          <div className="grid xl:grid-cols-5 lg:grid-cols-3 md:grid-cols-2 gap-6">

            <div className="xl:col-span-2 lg:col-span-1">
              <div className="bg-violet text-whiteelit gap-10 h-full w-full p-7 space-y-6 lg:space-y-0">
                <span className="font-semibold tracking-widest uppercase font-inconsolata">Elit Nexum</span>
                <div className="flex flex-col justify-center text-center h-full">
                  <h1 className="text-3xl/tight mb-4 font-poppins">Redefinir Senha</h1>
                  <p className="text-whiteelit font-normal leading-relaxed font-poppins">Defina sua nova senha.</p>

                </div>
              </div>
            </div>

            <div className="xl:col-span-3 lg:col-span-2 lg:m-10 m-5">

              <div className="flex justify-center items-center space-x-2 py-4">
                <h1 className="text-3xl flex items-center font-inconsolata font-bold text-blackelit">
                  Recuperar senha
                </h1>
              </div>

              <div className="space-y-5 mt-10">
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                  <div className="rounded shadow-sm space-y-4">
                    <div>
                      <label
                        htmlFor="password"
                        className="block text-sm font-bold font-inconsolata text-blackelit"
                      >
                        Senha
                      </label>
                      <div className="mt-1 relative rounded shadow-sm">
                        <div
                          className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
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
                          type={showPassword ? 'text' : 'password'}
                          name="password"
                          id="password"
                          className="focus:ring-0 border font-inconsolata focus:border-violet block w-full sm:text-sm border-grayelit rounded"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor="confirm-password"
                        className="block text-sm font-bold font-inconsolata text-blackelit"
                      >
                        Confirmar Senha
                      </label>
                      <div className="mt-1 relative rounded shadow-sm">
                        <div
                          className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? (
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
                          type={showConfirmPassword ? 'text' : 'password'}
                          name="confirmPassword"
                          id="confirm-password"
                          className="focus:ring-0 border font-inconsolata focus:border-violet block w-full sm:text-sm border-grayelit rounded"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <button
                      type="submit"
                      className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-md font-medium rounded text-whiteelit bg-deepviolet hover:bg-darkestviolet focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet disabled:opacity-50 disabled:cursor-not-allowed font-inconsolata"
                    >
                      {mutation.isLoading && (
                        <span className="absolute right-0 inset-y-0 flex items-center pr-3">
                          <AiOutlineLoading
                            className="h-5 w-5 text-whiteelit animate-spin"
                            aria-hidden="true"
                          />
                        </span>
                      )}
                      Atualizar Senha
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section >
  );
};

export function getServerSideProps() {
  return { props: { title: 'Resetar Senha - Elit Nexum' } };
}

export default ResetPassword;