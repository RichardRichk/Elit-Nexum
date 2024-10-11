import axios from 'axios';
import cookie from 'js-cookie';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { useMutation, useQueryClient } from 'react-query';
import { GoBrowser } from 'react-icons/go';
import {
  AiFillGithub,
  AiFillLinkedin,
  AiFillInstagram,
  AiFillTwitterCircle,
  AiFillYoutube,
  AiOutlineLoading,
  CodeIcon,
} from 'react-icons/ai';

import baseURL from '../../utils/baseURL';
import PostSelect from '../../components/new-post/PostSelect'

const techOptions = [
  { value: 'Next.js', label: 'Next.js' },
  { value: 'TailwindCSS', label: 'TailwindCSS' },
  { value: 'MongoDB', label: 'MongoDB' },
  { value: 'Socket.io', label: 'Socket.io' },
];

const UserSettings = ({ profile }) => {
  const [bio, setBio] = useState(profile.bio);
  const [techStack, setTechStack] = useState(() =>
    profile.techStack.join(', ')
  );
  const [social, setSocial] = useState({
    github: profile.social?.github || '',
    website: profile.social?.website || '',
    linkedin: profile.social?.linkedin || '',
    twitter: profile.social?.twitter || '',
    instagram: profile.social?.twitter || '',
    youtube: profile.social?.youtube || '',
  });

  const { github, website, linkedin, twitter, instagram, youtube } = social;

  const queryClient = useQueryClient();

  const handleSocialChange = (e) => {
    setSocial((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const mutation = useMutation(
    async () => {
      const { data } = await axios.put(
        `${baseURL}/api/profile`,
        {
          bio,
          techStack: techStack.split(',').map((item) => item.trim()),
          social,
        },
        {
          headers: {
            Authorization: cookie.get('token'),
          },
        }
      );
      return data;
    },
    {
      onSuccess: (data) => {
        toast.success('Perfil atualizado com sucesso');
        queryClient.setQueryData(['profile'], data);
      },
      onError: () => {
        toast.error(err.response?.data?.msg || 'Por favor, verifique suas entradas novamente');
      },
    }
  );

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        mutation.mutate();
      }}
      className="divide-y divide-gray-200 lg:col-span-9"
    >
      <div className="py-6 px-4 sm:p-6 lg:pb-8">
        <div>
          <h2 className="text-lg leading-6 font-bold text-blackelit font-inconsolata">
            Configurações do Perfil
          </h2>
          <p className="mt-1 text-sm text-deepgrayelit font-inconsolata">
            Essas informações serão exibidas publicamente, portanto, tenha cuidado com o que compartilha.
          </p>
        </div>
        <div className="mt-6 flex flex-col lg:flex-row">
          <div className="flex-grow space-y-4">
            <div>
              <label
                htmlFor="bio"
                className="block text-sm font-bold text-blackelit font-inconsolata"
              >
                Biografia
              </label>
              <div className="mt-1 rounded shadow-sm flex">
                <textarea
                  name="bio"
                  id="bio"
                  className="focus:ring-0 border focus:border-violet font-inconsolata flex-grow block w-full min-w-0 rounded sm:text-sm border-grayelit"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  required
                ></textarea>
              </div>
            </div>
            <div>
              <label
                htmlFor="techStack"
                className="block text-sm font-bold text-blackelit font-inconsolata"
              >
                Tecnologias
              </label>
                <PostSelect
                  Icon={CodeIcon}
                  options={techOptions}
                  value={techStack}
                  setValue={setTechStack}
                  required
                  showRequiredAsterisk={false}
                />
              
            </div>
            <div>
              <label className="block text-sm font-bold text-blackelit font-inconsolata">
                Perfis Sociais              </label>
              <div className="grid lg:grid-cols-6 gap-x-6 gap-y-3">
                <div className="mt-1 relative rounded shadow-sm col-span-6 sm:col-span-3">
                  <div className="flex rounded shadow-sm">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-grayelit bg-gray-50 text-deepgrayelit sm:text-sm">
                      <AiFillGithub
                        className="h-5 w-5 mr-2 text-grayelit"
                        aria-hidden="true"
                      />
                      github.com/
                    </span>
                    <input
                      type="text"
                      name="github"
                      className="flex-1 min-w-0 block w-full border font-inconsolata px-3 py-2 rounded-none rounded-r-md focus:ring-0 focus:border-violet sm:text-sm border-grayelit"
                      placeholder="GitHub username"
                      value={github}
                      onChange={handleSocialChange}
                    />
                  </div>
                </div>
                <div className="mt-1 relative rounded shadow-sm col-span-6 sm:col-span-3">
                  <div className="flex rounded shadow-sm">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-grayelit bg-gray-50 text-deepgrayelit sm:text-sm">
                      <GoBrowser
                        className="h-5 w-5 mr-2 text-grayelit"
                        aria-hidden="true"
                      />
                      https://
                    </span>
                    <input
                      type="text"
                      name="website"
                      className="flex-1 min-w-0 font-inconsolata block w-full px-3 py-2 rounded-none rounded-r-md focus:ring-0 border focus:border-violet sm:text-sm border-grayelit"
                      placeholder="Website URL"
                      value={website}
                      onChange={handleSocialChange}
                    />
                  </div>
                </div>
              
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-4 py-4 px-4 flex justify-end sm:px-6">
        <button
          type="submit"
          className="ml-5 relative font-inconsolata bg-deepviolet border border-transparent rounded shadow-sm py-2 px-4 inline-flex justify-center text-sm font-bold text-white hover:bg-darkestviolet focus:outline-none focus:ring-1 focus:ring-offset-2 focus:ring-violet disabled:opacity-50 disabled:pointer-events-none"
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

export default UserSettings;
