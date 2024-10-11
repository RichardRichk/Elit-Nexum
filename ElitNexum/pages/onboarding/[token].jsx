import { useState } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { GoBrowser } from 'react-icons/go';
import {
  AiFillGithub,
  AiOutlineLoading,
  CodeIcon,
} from 'react-icons/ai';
import { onboardUser } from '../../utils/auth';
import { TerminalIcon } from '@heroicons/react/outline';
import PostSelect from '../../components/new-post/PostSelect'
import AnimatedBackground from '../../components/Background';

const Onboarding = () => {
  const router = useRouter();
  const { token } = router.query;
  const [bio, setBio] = useState('');
  const [image, setImage] = useState(null);
  const [techStack, setTechStack] = useState('');
  const [social, setSocial] = useState({
    github: '',
    website: '',
    linkedin: '',
    twitter: '',
    instagram: '',
    youtube: '',
  });

  const techOptions = [
    { value: 'Next.js', label: 'Next.js' },
    { value: 'TailwindCSS', label: 'TailwindCSS' },
    { value: 'MongoDB', label: 'MongoDB' },
    { value: 'Socket.io', label: 'Socket.io' },
  ];

  const [loading, setLoading] = useState(false);

  const { github, website } = social;

  const handleSocialChange = (e) => {
    setSocial((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    const formdata = new FormData();
    formdata.append('profilePic', image);
    formdata.append('bio', bio);
    formdata.append(
      'techStack',
      JSON.stringify(techStack.split(',').map((item) => item.trim()))
    );
    formdata.append('social', JSON.stringify(social));

    await onboardUser(token, formdata, setLoading, toast);
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
                  <h1 className="text-3xl/tight mb-4 font-poppins">Vamos construir seu perfil!</h1>
                  <p className="text-whiteelit font-normal leading-relaxed font-poppins mb-8">Essas informações serão exibidas publicamente, então tenha cuidado com o que compartilhar.</p>

                </div>
              </div>
            </div>

            <div className="xl:col-span-3 lg:col-span-2 lg:m-10 m-5">

              <div className="flex justify-center items-center space-x-2">
                <h1 className="text-3xl flex items-center font-inconsolata font-bold text-blackelit">
                  Elit<TerminalIcon className="h-10 w-10 text-deepviolet mx-2" />Nexum
                </h1>
              </div>

              <div className="space-y-5 mt-10">
                <form onSubmit={onSubmit}>
                  <div className="sm:rounded sm:overflow-hidden">

                    <div>
                      <div className="mt-1 flex items-center flex-col">
                        <span
                          className="inline-block h-24 w-24 rounded-full overflow-hidden bg-gray-100 border-2 border-purple-600"
                          style={{
                            boxShadow: "rgba(99, 99, 99, 0.2) 2px 2px 2px 0px"
                          }}
                        >
                          {image ? (
                            <img
                              className="object-cover object-center overflow-hidden"
                              src={URL.createObjectURL(image)}
                            />
                          ) : (
                            <svg
                              className="h-full w-full text-grayelit"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                          )}
                        </span>
                        <label className="mt-3 hover:text-violet bg-white hover:ring-violet hover:border-violet flex-1 text-center py-2 w-full rounded border sm:text-sm border-grayelit font-inconsolata font-bold">
                          <input
                            type="file"
                            onChange={(e) => setImage(e.target.files[0])}
                            accept="image/*"
                            hidden
                          />
                          Escolher Imagem de Perfil
                        </label>
                      </div>
                    </div>

                    <div className="col-span-3 sm:col-span-2">
                      <label
                        htmlFor="bio"
                        className="block text-sm font-bold text-blackelit font-inconsolata mt-3"
                      >
                        Bio<span className="text-red-400">*</span>
                      </label>
                      <div className="mt-3 mt-1">
                        <input
                          type="text"
                          id="bio"
                          className="focus:ring-0 border focus:border-violet flex-1 block w-full rounded sm:text-sm border-grayelit"
                          placeholder="Sou um desenvolvedor full stack!"
                          value={bio}
                          onChange={(e) => setBio(e.target.value)}
                          required
                        />
                      </div>
                    </div>


                    <div className="col-span-3 sm:col-span-2">
                      <label
                        htmlFor="tech-stack"
                        className="mt-3 block text-sm font-bold text-blackelit font-inconsolata"
                      >
                        Tecnologias<span className="text-red-400">*</span>
                      </label>
                      <div className="mt-3">
                        <PostSelect
                          Icon={CodeIcon}
                          options={techOptions}
                          value={techStack}
                          setValue={setTechStack}
                          required

                          showRequiredAsterisk={false}
                        />

                      </div>
                    </div>

                    <div>
                      <label className="mt-3 block mb-3 text-sm font-bold text-blackelit font-inconsolata">
                        Perfis Sociais
                      </label>

                      <div className="mt-1 relative rounded shadow-sm col-span-6 sm:col-span-3">
                        <div className="flex rounded shadow-sm">
                          <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-grayelit bg-gray-50 text-deepgrayelit sm:text-sm">
                            <AiFillGithub
                              className="h-5 w-5 mr-2 text-gray-400"
                              aria-hidden="true"
                            />
                            github.com/
                          </span>
                          <input
                            type="text"
                            name="github"
                            className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md focus:ring-0 border focus:border-violet sm:text-sm border-grayelit"
                            placeholder="GitHub username"
                            value={github}
                            onChange={handleSocialChange}
                          />
                        </div>
                      </div>
                      <div className="mt-3 relative rounded shadow-sm col-span-6 sm:col-span-3">
                        <div className="flex rounded shadow-sm">
                          <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-grayelit bg-gray-50 text-deepgrayelit sm:text-sm">
                            <GoBrowser
                              className="h-5 w-5 mr-2 text-gray-400"
                              aria-hidden="true"
                            />
                          </span>
                          <input
                            type="text"
                            name="website"
                            className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md focus:ring-0 border focus:border-violet sm:text-sm border-grayelit"
                            placeholder="Seu site"
                            value={website}
                            onChange={handleSocialChange}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="p-2"> 
                      <button
                        type="submit"
                        className="mt-5 group relative w-full flex justify-center py-2 px-4 border border-transparent text-md font-medium rounded text-whiteelit bg-deepviolet hover:bg-darkestviolet focus:outline-none focus:ring-1 focus:ring-offset-2 focus:ring-violet disabled:opacity-50 disabled:cursor-not-allowed font-inconsolata"
                      >
                        {loading ? (
                          <AiOutlineLoading className="animate-spin h-5 w-5 mr-2" />
                        ) : (
                          'Salvar Perfil'
                        )}
                      </button>
                    </div>
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

export default Onboarding;
