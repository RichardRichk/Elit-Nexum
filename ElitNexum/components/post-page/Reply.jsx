import axios from 'axios';
import Link from 'next/link';
import Image from 'next/image';
import cookie from 'js-cookie';
import { toast } from 'react-toastify';
import { useMutation } from 'react-query';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  TrashIcon,
  StarIcon as StarOutlineIcon
} from '@heroicons/react/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/solid';
import baseURL from '../../utils/baseURL';
import { useState } from 'react';

const Reply = ({ reply, user, queryClient, comment, postId }) => {
  const isLiked =
    user && reply.likes.filter((like) => like.user === user._id).length > 0;

  const [isReadMore, setIsReadMore] = useState(true);
  const toggleReadMore = () => setIsReadMore(!isReadMore);


  const replyMutation = useMutation(
    async () => {
      const { data } = await axios.delete(
        `${baseURL}/api/comments/${postId}/${comment._id}/${reply._id}`,
        {
          headers: { Authorization: cookie.get('token') },
        }
      );
      return data;
    },
    {
      onSuccess: (data) => {
        queryClient.setQueryData(['comments', postId], data);
        toast.success('Sua resposta foi deletada.');
      },
    }
  );

  const likeMutation = useMutation(
    async () => {
      const { data } = await axios.put(
        `${baseURL}/api/comments/like/${postId}/${comment._id}/${reply._id}`,
        {},
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
        queryClient.setQueryData(['comments', postId], data);
      },
    }
  );

  return (
    <div className="flex mt-4 w-full items-start mb-1 md:w-5/6">
      <Link href={`/${reply.user.username}`}>
        <div className="w-100 mr-2 cursor-pointer">
          <Image
            src={reply.user.profilePicUrl}
            height={42}
            width={42}
            className="rounded-full object-cover"
          />
        </div>
      </Link>
      <div className="ml-2 flex flex-col flex-1">
        <h4 className="font-semibold">
          <Link href={`/${reply.user.username}`}>
            <a className="hover:text-deepviolet transition font-poppins">
              @{reply.user.username}
            </a>
          </Link>{' '}
          <span className="text-deepgrayelit text-xs font-normal font-inconsolata">
            {formatDistanceToNow(new Date(comment.date), { addSuffix: true, locale: ptBR })}
          </span>
        </h4>
        <p className="text-sm break-all font-poppins overflow-hidden w-[90%]">{isReadMore ? reply.text.slice(0, 50) : reply.text} <span className='text-deepviolet cursor-pointer font-inconsolata' onClick={toggleReadMore}> {isReadMore ? "... Leia Mais" : " Mostrar Menos"}</span></p>
        <div className="flex items-center space-x-2 text-blackelit mt-1">
          <div className="flex items-center space-x-1">
            {isLiked ? (
              <StarSolidIcon
                onClick={() => likeMutation.mutate()}
                className="h-4 w-4 text-yellow-600 cursor-pointer"
              />
            ) : (
              <StarOutlineIcon
                onClick={() => likeMutation.mutate()}
                className="h-4 w-4 text-yellow-600 cursor-pointer"
              />
            )}
            <span className="text-sm whitespace-pre-wrap">
              {reply.likes.length}
            </span>
          </div>
          {user && user._id === reply.user._id && (
            <TrashIcon
              onClick={() => replyMutation.mutate(reply._id)}
              className="h-4 w-4 cursor-pointer text-deepviolet"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Reply;