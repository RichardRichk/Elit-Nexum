import axios from 'axios';
import cookie from 'js-cookie';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { useMutation } from 'react-query';
import { ChatAltIcon } from '@heroicons/react/outline';
import baseURL from '../../utils/baseURL';

const NewComment = ({ id, queryClient }) => {
  const [text, setText] = useState('');

  const mutation = useMutation(
    async () => {
      const { data } = await axios.post(
        `${baseURL}/api/comments/${id}`,
        { text },
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
        setText('');
        queryClient.setQueryData(['comments', id], data);
        toast.success('Seu comentário foi postado');
      },
    }
  );

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        mutation.mutate();
      }}
    >
      <textarea
        className="w-full md:w-5/6 focus:ring-0 flex-1 focus:border-deepviolet font-inconsolata rounded shadow resize-none"
        rows="2"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Deixe um comentário legal..."
        required
      />
      <button
        type="submit"
        className="text-sm bg-deepviolet text-white p-2 flex mt-1 items-center space-x-2 mb-8 rounded shadow"
      >
        <ChatAltIcon className="h-4 w-4 text-white" />
        <span className='font-inconsolata'>Publicar Comentário</span>
      </button>
    </form>
  );
};

export default NewComment;
