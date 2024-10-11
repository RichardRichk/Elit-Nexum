import Link from 'next/link';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { AiOutlineLoading } from 'react-icons/ai';
import {
  LockClosedIcon,
  MailIcon,
  EyeIcon,
  EyeOffIcon,
  TerminalIcon,
} from '@heroicons/react/outline';
import { loginUser } from '../utils/auth';
import AnimatedBackground from '../components/Background';

const Login = () => {
  const [user, setUser] = useState({
    email: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [submitDisabled, setSubmitDisabled] = useState(true);

  const { email, password } = user;

  const handleChange = (e) => {
    setUser((prevState) => ({ ...prevState, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    loginUser({ email, password }, setError, setFormLoading, toast);
  };

  useEffect(() => {
    const isUser = Object.values({ email, password }).every((item) =>
      Boolean(item)
    );
    isUser ? setSubmitDisabled(false) : setSubmitDisabled(true);
  }, [user]);

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
                  <h1 className="text-3xl/tight mb-4 font-poppins">Bem-vindo à nossa comunidade!</h1>
                  <p className="text-whiteelit font-normal leading-relaxed font-poppins">Explore as postagens dos nossos incríveis usuários e junte-se a nós para compartilhar suas próprias histórias.</p>

                  <div className="my-8">
                    <a href="/home" className="font-poppins border text-whiteelit font-medium text-sm rounded transition-all duration-300 hover:bg-whiteelit hover:text-blackelit focus:bg-whiteelit focus:text-blackelit px-14 py-2.5">Ver Postagens</a>
                  </div>
                </div>
              </div>
            </div>

            <div className="xl:col-span-3 lg:col-span-2 lg:m-10 m-5">

              <div className="flex justify-center items-center space-x-2 py-4">
                <h1 className="text-3xl flex items-center font-inconsolata font-bold text-blackelit">
                  Elit<TerminalIcon className="h-10 w-10 text-deepviolet mx-2" />Nexum
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
                          className="focus:ring-0 border focus:border-violet block w-full pl-10 sm:text-sm border-grayelit rounded font-inconsolata"
                          placeholder="email@exemplo.com"
                          value={email}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    {/* Password */}
                    <div>
                      <label
                        htmlFor="password"
                        className="block text-sm font-bold text-blackelit font-inconsolata"
                      >
                        Senha
                      </label>
                      <div className="mt-1 relative rounded shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <LockClosedIcon
                            className="h-5 w-5 text-grayelit"
                            aria-hidden="true"
                          />
                        </div>
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
                          className="focus:ring-0 border focus:border-violet block w-full pl-10 sm:text-sm border-grayelit rounded font-inconsolata"
                          value={password}
                          onChange={handleChange}
                          placeholder="Digite sua senha"
                          required
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm">
                      <Link href="/forgot-password">
                        <a className="font-normal text-deepviolet hover:text-violet font-poppins">
                          Esqueceu sua senha?
                        </a>
                      </Link>
                    </div>
                    <div className="text-sm">
                      <Link href="/signup">
                        <a className="font-normal text-deepviolet hover:text-violet font-poppins">
                          Não tem uma conta?
                        </a>
                      </Link>
                    </div>
                  </div>

                  <div>
                    <button
                      type="submit"
                      className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-md font-medium rounded text-whiteelit bg-deepviolet hover:bg-darkestviolet focus:outline-none focus:ring-1 focus:ring-offset-2 focus:ring-violet disabled:opacity-50 disabled:cursor-not-allowed font-inconsolata"
                      disabled={submitDisabled}
                    >
                      {formLoading && (
                        <span className="absolute right-0 inset-y-0 flex items-center pr-3">
                          <AiOutlineLoading
                            className="h-5 w-5 text-whiteelit animate-spin"
                            aria-hidden="true"
                          />
                        </span>
                      )}
                      Login
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
  return { props: { title: 'Login - Elit Nexum' } };
}

export default Login;