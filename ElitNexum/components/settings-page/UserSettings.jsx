import axios from 'axios';
import cookie from 'js-cookie';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import { AiOutlineLoading } from 'react-icons/ai';
import { useQuery, useMutation } from 'react-query';
import baseURL from '../../utils/baseURL';

const UserSettings = ({ user }) => {
  const [name, setName] = useState(user.name);
  const [username, setUsername] = useState(user.username);
  const [profilePic, setProfilePic] = useState(null);

  const router = useRouter();

  const { isLoading, isSuccess } = useQuery(
    ['checkUsername', username],
    async () => {
      const CancelToken = axios.CancelToken;
      const source = CancelToken.source();

      const promise = await axios.get(`${baseURL}/api/signup/${username}`, {
        cancelToken: source.token,
      });

      promise.cancel = () => {
        source.cancel();
      };

      return promise.data;
    },
    {
      retry: false,
    }
  );

  const mutation = useMutation(async (formdata) => {
    await axios.put(`${baseURL}/api/auth`, formdata, {
      headers: {
        Authorization: cookie.get('token'),
        'Content-Type': 'multipart/form-data',
      },
    });
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formdata = new FormData();
    formdata.append('name', name);
    formdata.append('username', username);
    formdata.append('profilePic', profilePic);

    try {
      await mutation.mutateAsync(formdata);
      toast.success('As configurações do usuário foram atualizadas');
      router.push('/home');
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
          <h2 className="text-lg leading-6 font-bold font-inconsolata text-blackelit">
            Configurações do Usuário
          </h2>
          <p className="mt-1 text-sm text-deepgrayelit font-inconsolata">
            Essas informações serão exibidas publicamente, então tenha cuidado com o que você compartilha.
          </p>
        </div>
        <div className="mt-6 flex flex-col lg:flex-row">
          <div className="mt-6 flex-grow lg:mt-0 lg:mr-6 lg:flex-grow-0 lg:flex-shrink-0">
            <p className="text-sm font-bold font-inconsolata text-blackelit" aria-hidden="true">
              Foto
            </p>
            <div className="mt-1 lg:hidden">
              <div className="flex items-center">
                <div
                  className="flex-shrink-0 inline-block rounded-full overflow-hidden h-12 w-12"
                  aria-hidden="true"
                >
                  <img
                    className="rounded-full h-full w-full object-cover"
                    src={
                      profilePic
                        ? URL.createObjectURL(profilePic)
                        : user.profilePicUrl
                    }
                    alt={user.name}
                  />
                </div>
                <div className="ml-5 rounded shadow-sm">
                  <div className="group relative border border-grayelit rounded py-2 px-3 flex items-center justify-center hover:bg-gray-50 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-violet">
                    <label
                      htmlFor="user-photo"
                      className="relative font-inconsolata text-sm leading-4 font-bold text-blackelit pointer-events-none"
                    >
                      <span>Trocar</span>
                      <span className="sr-only font-inconsolata"> Foto do usuário</span>
                    </label>
                    <input
                      id="user-photo"
                      name="user-photo"
                      type="file"
                      className="absolute w-full h-full opacity-0 cursor-pointer border-grayelit rounded"
                      onChange={(e) => setProfilePic(e.target.files[0])}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="hidden relative rounded-full overflow-hidden lg:block">
              <img
                className="relative rounded-full w-32 h-32 object-cover"
                src={
                  profilePic
                    ? URL.createObjectURL(profilePic)
                    : user.profilePicUrl
                }
                alt={user.name}
              />
              <label
                htmlFor="user-photo"
                className="absolute font-inconsolata inset-0 w-full h-full bg-black bg-opacity-75 flex items-center justify-center text-sm font-bold text-white opacity-0 hover:opacity-100"
              >
                <span className='font-inconsolata'>Trocar</span>
                <span className="sr-only font-inconsolata"> Foto do usuário</span>
                <input
                  type="file"
                  id="user-photo"
                  name="user-photo"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer border-grayelit rounded"
                  onChange={(e) => setProfilePic(e.target.files[0])}
                />
              </label>
            </div>
          </div>
          <div className="flex-grow space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-bold text-blackelit font-inconsolata"
              >
                Seu Nome
              </label>
              <div className="mt-1 rounded shadow-sm flex">
                <input
                  type="text"
                  name="name"
                  id="name"
                  autoComplete="name"
                  className="focus:ring-0 border font-inconsolata focus:border-violet flex-grow block w-full min-w-0 rounded sm:text-sm border-grayelit"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-bold font-inconsolata text-blackelit"
              >
                Nome de Usuário
              </label>
              <div className="mt-1 rounded shadow-sm flex">
                <span className="bg-gray-50 border border-r-0 border-grayelit rounded-l-md px-3 inline-flex items-center text-gray-500 sm:text-sm">
                  elitnexum.com/
                </span>
                <input
                  type="text"
                  name="username"
                  id="username"
                  autoComplete="username"
                  className="focus:ring-0 font-inconsolata focus:border-violet flex-grow block w-full min-w-0 rounded-none rounded-r-md sm:text-sm border-grayelit"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              {username.length === 0 ? (
                <small className="text-red-600 font-inconsolata">O nome de usuário não pode estar vazio</small>
              ) : isLoading ? (
                <small className='font-inconsolata'>Carregando...</small>
              ) : isSuccess ? (
                <small className="text-green-600 font-inconsolata">Nome de usuário disponível</small>
              ) : username !== user.username ? (
                <small className="text-red-600 font-inconsolata">Nome de usuário indisponível</small>
              ) : null}
            </div>
          </div>
          
        </div>
      </div>
      <div className="mt-4 py-4 px-4 flex justify-end sm:px-6">
        <button
          type="submit"
          className="ml-5 relative font-inconsolata bg-deepviolet border border-transparent rounded shadow-sm py-2 px-4 inline-flex justify-center text-sm font-bold text-white hover:bg-darkestviolet focus:outline-none focus:ring-1 focus:ring-offset-2 focus:ring-violet disabled:opacity-50 disabled:pointer-events-none"
          disabled={!username || mutation.isLoading}
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

export default UserSettings;
