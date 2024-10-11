import axios from 'axios';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { useMutation } from 'react-query';
import { AiOutlineLoading } from 'react-icons/ai';
import { MailIcon } from '@heroicons/react/outline';
import baseURL from '../utils/baseURL';
import AnimatedBackground from '../components/Background';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');

  const mutation = useMutation(async () => {
    const { data } = await axios.post(`${baseURL}/api/auth/forgot-password`, {
      email,
    });
    return data;
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await mutation.mutateAsync();
      toast.success('Por favor, verifique seu e-mail para redefinir sua senha');
      setEmail('');
    } catch (err) {
      toast.error(
        err.response?.data?.msg || 'Ocorreu um erro. Tente novamente mais tarde'
      );
    }
  };


  return (
    <AnimatedBackground>
      <div className="container 2xl:px-80 xl:px-52 relative z-10">
        <div className="bg-white rounded overflow-hidden" style={{
          boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px"
        }}>
          <div className="grid xl:grid-cols-5 lg:grid-cols-3 md:grid-cols-2 gap-6">

            <div className="xl:col-span-2 lg:col-span-1">
              <div className="bg-violet text-whiteelit gap-10 h-full w-full p-7 space-y-6 lg:space-y-0">
                <span className="font-semibold tracking-widest uppercase font-inconsolata">Elit Nexum</span>
                <div className="flex flex-col justify-center text-center h-full">
                  <h1 className="text-3xl/tight mb-4 font-poppins">Esqueceu a Senha?</h1>
                  <p className="text-whiteelit font-normal leading-relaxed font-poppins">Digite seu e-mail para receber o link de redefinição de senha.</p>
                </div>
              </div>
            </div>

            <div className="xl:col-span-3 lg:col-span-2 lg:m-10 m-5">

              <div className="flex justify-center items-center space-x-2 py-4">
                <h1 className="text-3xl flex items-center font-inconsolata font-bold text-violet">
                  Recuperar Senha
                </h1>
              </div>

              <div className="space-y-5 mt-10">
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                  <div className="rounded shadow-sm space-y-4">
                    {/* Email */}
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-bold text-blackelit font-inconsolata"
                      >
                        Email
                      </label>
                      <div className="mt-1 relative rounded shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <MailIcon
                            className="h-5 w-5 text-grayelit"
                            aria-hidden="true"
                          />
                        </div>
                        <input
                          type="email"
                          name="email"
                          id="email"
                          className="focus:ring-0 border font-inconsolata focus:border-violet block w-full pl-10 sm:text-sm border-grayelit rounded"
                          placeholder="email@exemplo.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    {/* Password */}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm">
                      <Link href="/signup">
                        <a className="font-normal font-poppins text-deepviolet hover:text-violet">
                          Não tem uma conta?
                        </a>
                      </Link>
                    </div>
                    <div className="text-sm">
                      <Link href="/">
                        <a className="font-normal font-poppins text-deepviolet hover:text-violet">
                          Faça login em vez disso
                        </a>
                      </Link>
                    </div>
                  </div>

                  <div>
                    <button
                      type="submit"
                      className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-md font-medium rounded text-whiteelit bg-deepviolet hover:bg-darkestviolet focus:outline-none focus:ring-1 focus:ring-offset-2 focus:ring-violet disabled:opacity-50 disabled:cursor-not-allowed font-inconsolata"
                    >
                      {mutation.isLoading && (
                        <span className="absolute right-0 inset-y-0 flex items-center pr-3">
                          <AiOutlineLoading
                            className="h-5 w-5 text-whiteelit animate-spin"
                            aria-hidden="true"
                          />
                        </span>
                      )}
                      Enviar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AnimatedBackground>
  );
};

export function getServerSideProps() {
  return { props: { title: 'Esqueceu a Senha - Elit Nexum' } };
}

export default ForgotPassword;
