import axios from 'axios';
import Link from 'next/link';
import cookie from 'js-cookie';
import Image from 'next/image';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { useMutation } from 'react-query';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  TrashIcon,
  XIcon,
  StarIcon as StarOutlineIcon
} from '@heroicons/react/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/solid';
import { AiOutlineSend } from 'react-icons/ai';
import Reply from './Reply';
import baseURL from '../../utils/baseURL';

const Comment = ({ comment, user, postId, queryClient }) => {
  const isLiked =
    user && comment.likes.filter((like) => like.user === user._id).length > 0;

  const [isReadMore, setIsReadMore] = useState(true);
  const toggleReadMore = () => setIsReadMore(!isReadMore);

  const mutation = useMutation(
    async () => {
      const { data } = await axios.delete(
        `${baseURL}/api/comments/${postId}/${comment._id}`,
        {
          headers: { Authorization: cookie.get('token') },
        }
      );
      return data;
    },
    {
      onSuccess: (data) => {
        queryClient.setQueryData(['comments', postId], data);
        toast.success('Seu comentário foi deletado.');
      },
    }
  );

  const addReplyMutation = useMutation(
    async () => {
      const { data } = await axios.post(
        `${baseURL}/api/comments/${postId}/${comment._id}/`,
        { text: replyText },
        {
          headers: { Authorization: cookie.get('token') },
        }
      );
      return data;
    },
    {
      onSuccess: (data) => {
        queryClient.setQueryData(['comments', postId], data);
        toast.success('Sua resposta foi postada.');
      },
    }
  );

  const likeMutation = useMutation(
    async () => {
      const { data } = await axios.put(
        `${baseURL}/api/comments/like/${postId}/${comment._id}`,
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

  const [replyOpen, setReplyOpen] = useState(false);
  const [replyText, setReplyText] = useState('');

  const postReply = (e) => {
    e.preventDefault();
    addReplyMutation.mutate();
    setReplyOpen(false);
    setReplyText('');
  };

  const commentPreview = comment.text.slice(0, 50);
  const shouldShowReadMore = comment.text.length > 50;

  return (
    <>
      <div className="flex w-full items-start mb-4 md:w-5/6">
        <Link href={`/${comment.user.username}`}>
          <div className="w-100 mr-2 cursor-pointer">
            <Image
              src={comment.user.profilePicUrl}
              height={42}
              width={42}
              className="rounded-full object-cover"
            />
          </div>
        </Link>
        <div className="ml-2 flex flex-col flex-1">
          <h4 className="font-semibold">
            <Link href={`/${comment.user.username}`}>
              <a className="hover:text-deepviolet transition font-poppins">
                @{comment.user.username}
              </a>
            </Link>{' '}
            <span className="text-deepgrayelit text-xs font-normal font-inconsolata">
              {formatDistanceToNow(new Date(comment.date), {
                addSuffix: true,
                locale: ptBR,
              })}
            </span>
          </h4>
          <p className="text-sm whitespace-pre-wrap break-all overflow-hidden font-poppins w-[90%]">
            {isReadMore ? commentPreview : comment.text}
          </p>
          {shouldShowReadMore && (
            <span
              className="text-deepviolet cursor-pointer font-inconsolata"
              onClick={toggleReadMore}
            >
              {isReadMore ? '... Leia Mais' : ' Mostrar Menos'}
            </span>
          )}
          <div className="flex justify-between items-center mt-1 w-[90%] text-deepgrayelit ">
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
              <span className="text-sm font-inconsolata">{comment.likes.length}</span>
            </div>
            <a
              onClick={() => setReplyOpen(true)}
              className="text-sm text-deepviolet cursor-pointer hover:underline font-inconsolata"
            >
              Responder
            </a>
            {user && user._id === comment.user._id && (
              <TrashIcon
                onClick={() => mutation.mutate()}
                className="h-4 w-4 cursor-pointer text-deepviolet"
              />
            )}
          </div>
          {replyOpen && (
            <form onSubmit={postReply} className="relative mt-3 flex">
              <input
                className="border rounded p-1.5 text-sm border-deepviolet font-inconsolata w-full focus:outline-none"
                placeholder="Digite sua resposta..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                required
              />
              <XIcon
                onClick={() => setReplyOpen(false)}
                className="absolute right-10 top-2 cursor-pointer h-5 w-5 text-gray-400"
              />
              <button className="bg-deepviolet font-inconsolata rounded px-2 py-1  h-100">
                <AiOutlineSend className="text-white h-4 w-4" />
              </button>
            </form>
          )}
          {comment.replies.map((reply) => (
            <Reply
              key={reply._id}
              reply={reply}
              user={user}
              queryClient={queryClient}
              comment={comment}
              postId={postId}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default Comment;
