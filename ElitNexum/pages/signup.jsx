import axios from 'axios';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { AiOutlineLoading } from 'react-icons/ai';
import {
  LockClosedIcon,
  MailIcon,
  DotsCircleHorizontalIcon,
  UserCircleIcon,
  EyeIcon,
  EyeOffIcon,
  CheckIcon,
  XIcon,
} from '@heroicons/react/outline';
import EmailConfirmModal from '../components/EmailConfirmModal';
import baseURL from '../utils/baseURL';
import { registerUser } from '../utils/auth';
import AnimatedBackground from '../components/Background';
const usernameRegex = /^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/;
let cancel;

const Signup = () => {
  const [user, setUser] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [submitDisabled, setSubmitDisabled] = useState(true);
  const [username, setUsername] = useState('');
  const [usernameLoading, setUsernameLoading] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const { name, email, password } = user;

  const handleChange = (e) => {
    setUser((prevState) => ({ ...prevState, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await registerUser(user, setError, setFormLoading, toast, setModalOpen);
  };

  const checkUsername = async () => {
    setUsernameLoading(true);
    try {
      cancel && cancel();
      const CancelToken = axios.CancelToken;
      const res = await axios.get(`${baseURL}/api/signup/${username}`, {
        cancelToken: new CancelToken((canceler) => {
          cancel = canceler;
        }),
      });
      if (error !== null) setError(null);
      if (res.data.msg === 'Nome de usuário disponível') { //colocar exatamente igual na api
        setUsernameAvailable(true);
        setUser((prevState) => ({ ...prevState, username }));
      }
    } catch (err) {
      setUsernameAvailable(false);
      setError('Nome de usuário não disponível');
    }
    setUsernameLoading(false);
  };

  useEffect(() => {
    const isUser = Object.values({ name, email, password }).every((item) =>
      Boolean(item)
    );
    isUser ? setSubmitDisabled(false) : setSubmitDisabled(true);
  }, [user]);

  useEffect(() => {
    username === '' ? setUsernameAvailable(false) : checkUsername();
  }, [username]);

  return (
    <AnimatedBackground>
      <div className="container 2xl:px-80 xl:px-52 relative z-10">
        <div className="bg-white rounded " style={{
          boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px"
        }}>
          <div className="grid xl:grid-cols-5 lg:grid-cols-3 md:grid-cols-2 gap-6">

            <div className="xl:col-span-2 lg:col-span-1">
              <div className="bg-violet text-whiteelit gap-10 h-full w-full p-7 space-y-6 lg:space-y-0">
                <span className="font-semibold tracking-widest uppercase font-inconsolata">Elit Nexum</span>
                <div className="flex flex-col justify-center text-center h-full">
                  <h1 className="text-3xl/tight mb-4 font-poppins">Bem-vindo ao Elit Nexum!</h1>
                  <p className="text-whiteelit font-normal leading-relaxed font-poppins">Estamos muito empolgados em tê-lo a bordo e ansiosos para embarcar nesta jornada juntos, onde suas ideias e contribuições farão a diferença em nossa comunidade!</p>
                </div>
              </div>
            </div>

            <div className="xl:col-span-3 lg:col-span-2 lg:m-10 m-5">

              <div className="flex justify-center items-center space-x-2 py-4">
                <h1 className="text-3xl flex items-center font-inconsolata font-bold text-violet">
                  Cadastre-se
                </h1>
              </div>

              <div className="space-y-5 mt-10">
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                  <div className="rounded shadow-sm space-y-4">
                    {/* Name */}
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-bold text-blackelit font-inconsolata"
                      >
                        Nome
                      </label>
                      <div className="mt-1 relative rounded shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <UserCircleIcon
                            className="h-5 w-5 text-grayelit"
                            aria-hidden="true"
                          />
                        </div>
                        <input
                          type="text"
                          name="name"
                          id="name"
                          className="focus:ring-0 border focus:border-violet block w-full pl-10 sm:text-sm border-grayelit rounded font-inconsolata"
                          placeholder="Richard Passarelli"
                          value={name}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    {/* Username */}
                    <div>
                      <label
                        htmlFor="username"
                        className="block text-sm font-bold text-blackelit font-inconsolata"
                      >
                        Nome de usuário
                      </label>
                      <div className="mt-1 relative rounded shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          {usernameLoading || username === '' ? (
                            <DotsCircleHorizontalIcon
                              className={`h-5 w-5 text-grayelit ${usernameLoading && 'animate-spin'
                                }`}
                              aria-hidden="true"
                            />
                          ) : username !== '' && usernameAvailable ? (
                            <CheckIcon className="h-5 w-5 text-grayelit" />
                          ) : (
                            <XIcon className="h-5 w-5 text-grayelit" />
                          )}
                        </div>
                        <input
                          type="text"
                          name="username"
                          id="username"
                          className={`focus:ring-0 border font-inconsolata focus:border-violet block w-full pl-10 sm:text-sm border-grayelit rounded ${username !== '' && !usernameAvailable ? 'bg-red-100' : ''
                            }`}
                          placeholder="Rich"
                          value={username}
                          onChange={(e) => {
                            setUsername(e.target.value);
                            if (usernameRegex.test(e.target.value)) {
                              setUsernameAvailable(true);
                            } else {
                              setUsernameAvailable(false);
                            }
                          }}
                        />
                      </div>
                      {username !== '' && !usernameLoading && !usernameAvailable && (
                        <small className="text-xs text-red-600 font-inconsolata">
                          Este nome de usuário é inválido ou não está disponível
                        </small>
                      )}
                    </div>

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
                          className="focus:ring-0 border font-inconsolata focus:border-violet block w-full pl-10 sm:text-sm border-grayelit rounded"
                          value={password}
                          onChange={handleChange}
                          placeholder="Deve ter pelo menos 6 caracteres"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm">
                      <Link href="/">
                        <a className="font-normal text-deepviolet hover:text-violet font-poppins">
                          Já tem uma conta?
                        </a>
                      </Link>
                    </div>
                  </div>

                  <div>
                    <button
                      type="submit"
                      className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-md font-medium rounded text-whiteelit bg-deepviolet hover:bg-darkestviolet focus:outline-none focus:ring-1 focus:ring-offset-2 focus:ring-violet disabled:opacity-50 disabled:cursor-not-allowed font-inconsolata"
                      disabled={submitDisabled || !usernameAvailable}
                    >
                      {formLoading && (
                        <span className="absolute right-0 inset-y-0 flex items-center pr-3">
                          <AiOutlineLoading
                            className="h-5 w-5 text-whiteelit animate-spin"
                            aria-hidden="true"
                          />
                        </span>
                      )}
                      Inscrever-se
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <EmailConfirmModal open={modalOpen} setOpen={setModalOpen} />
    </AnimatedBackground>
  );
};

export function getServerSideProps() {
  return { props: { title: 'Inscrever-se - Elit Nexum' } };
}

export default Signup;