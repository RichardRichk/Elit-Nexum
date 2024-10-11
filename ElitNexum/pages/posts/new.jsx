import axios from 'axios';
import cookie from 'js-cookie';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { useMutation } from 'react-query';
import { AiOutlineLoading } from 'react-icons/ai';
import {
  PencilIcon,
  TerminalIcon,
  LinkIcon,
  CodeIcon,
  PlusIcon
} from '@heroicons/react/outline';
import PostSelect from '../../components/new-post/PostSelect';
import PostInput from '../../components/new-post/PostInput';
import RichTextEditor from '../../components/new-post/RichTextEditor';
import ImageDropzone from '../../components/new-post/ImageDropzone';
import ThumbnailsDND from '../../components/new-post/ThumbnailsDND';
import baseURL from '../../utils/baseURL';

const NewPost = ({ user }) => {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [techStack, setTechStack] = useState('');
  const [liveDemo, setLiveDemo] = useState('');
  const [sourceCode, setSourceCode] = useState('');
  const [images, setImages] = useState([]);

  const techOptions = [
    { value: 'Next.js', label: 'Next.js' },
    { value: 'TailwindCSS', label: 'TailwindCSS' },
    { value: 'MongoDB', label: 'MongoDB' },
    { value: 'Socket.io', label: 'Socket.io' },
  ];

  const mutation = useMutation(
    async (formdata) =>
      await axios.post(`${baseURL}/api/posts`, formdata, {
        headers: {
          Authorization: cookie.get('token'),
          'Content-Type': 'multipart/form-data',
        },
      })
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formdata = new FormData();

    if (description.trim() === '') {
      return toast.error('Por favor, adicione uma descrição');
    }

    formdata.append('title', title);
    formdata.append('description', description);
    formdata.append(
      'techStack',
      JSON.stringify(techStack.split(',').map((item) => item.trim()))
    );
    formdata.append('liveDemo', liveDemo);
    formdata.append('sourceCode', sourceCode);
    for (const key of Object.keys(images)) {
      formdata.append('images', images[key]);
    }

    try {
      await mutation.mutateAsync(formdata);
      toast.success('Sua postagem foi carregada com sucesso');
      router.push('/home');
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Por favor, verifique suas entradas novamente');
    }
  };

  return (
    <div className="bg-gray-100 px-6 md:px-12 py-10">
      <div className="container mx-auto flex flex-col items-center">
        <h1 className="text-3xl mb-8 text-deepgrayelit font- font-inconsolata font-bold mr-auto">
          Pronto para postar,{' '}
          <span className="text-deepviolet font-inconsolata">{user.name.split(' ')[0]}</span>?
        </h1>
        <form onSubmit={handleSubmit} className="w-full">
          <div className="mb-5 mr-auto block w-full">
            <PostInput
              Icon={PencilIcon}
              label="Dê um título à sua postagem"
              id="title"
              placeholder="Meu novo site"
              value={title}
              setValue={setTitle}
              required
            />
          </div>
          <div className="mb-5 mr-auto block w-full">
            <PostSelect
              Icon={CodeIcon}
              label="Quais tecnologias você utilizou?"
              options={techOptions}
              value={techStack}
              setValue={setTechStack}
              required
            />
          </div>
          <div className="mb-5 mr-auto grid md:grid-cols-2 gap-4 w-full">
            <PostInput
              Icon={LinkIcon}
              label="URL do deploy"
              id="live-demo"
              placeholder="https://teamfour.me"
              value={liveDemo}
              setValue={setLiveDemo}
            />
            <PostInput
              Icon={TerminalIcon}
              label="Repositório do código-fonte"
              id="source-code"
              placeholder="https://github.com/teamfour/elitnexum"
              value={sourceCode}
              setValue={setSourceCode}
            />
          </div>
          <label
            htmlFor="description"
            className="block mr-auto text-md font-medium text-deepviolet mb-2"
          >
            Adicione uma descrição <span className="text-red-400">*</span>
          </label>
          <RichTextEditor value={description} setValue={setDescription} />
          <ImageDropzone setImages={setImages} />
          {images.length > 0 && (
            <ThumbnailsDND images={images} setImages={setImages} />
          )}
          <button
            type="submit"
            className="mt-8 flex items-center font-inconsolata shadow w-full justify-center md:w-max ml-auto bg-deepviolet px-4 py-2 text-white font-semibold rounded disabled:pointer-events-none disabled:opacity-50"
            disabled={mutation.isLoading}
          >
            {mutation.isLoading ? (
              <AiOutlineLoading className="h-5 w-5 mr-2 animate-spin" />
            ) : (
              <PlusIcon className="h-5 w-5 mr-2" />
            )}
            Adicionar Postagem
          </button>
        </form>
      </div>
    </div>
  );
};

export function getServerSideProps() {
  return { props: { title: 'Nova Postagem - Elit Nexum' } };
}

export default NewPost;