import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  BookmarkIcon,
  TrashIcon,
  PencilAltIcon,
  StarIcon,
} from '@heroicons/react/solid';
import DeleteModal from '../../components/post-page/DeleteModal';

const PostHeader = ({ post, user, deletePost, likePost, savePost }) => {
  const [open, setOpen] = useState(false);

  const isLiked =
    user && post.likes.filter((like) => like.user === user._id).length > 0;

  const isSaved =
    user && post.saves.filter((save) => save.user === user._id).length > 0;

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        <Image
          src={post.user.profilePicUrl}
          className="rounded-full object-cover"
          height={62}
          width={62}
        />
        <div className="ml-4">
          <h1 className="text-lg font-inconsolata break-all w-[100%] overflow-hidden md:text-xl font-semibold">{post.title.slice(0, 100)}</h1>
          <Link href={`/${post.user.username}`}>
            <a className="md:text-md hover:text-deepviolet font-inconsolata text-blackelit">
              @{post.user.username}
            </a>
          </Link>
        </div>
      </div>
      <div className="flex flex-col gap-2 md:gap-4 md:flex-row">
        {user && (
          <>
            {post.user._id !== user._id && (
              <button
                onClick={savePost}
                className={`${isSaved
                  ? 'bg-gray-100 text-blackelit'
                  : 'bg-gray-100 text-blackelit'
                  }  py-2 px-3 flex items-center rounded font-medium`}
              >

                {isSaved ? (
                  <>
                    <BookmarkIcon className="h-5 w-5 mr-1 text-deepviolet" />{' '}
                    <p className="hidden md:block text-deepviolet font-inconsolata">{isSaved ? 'Salvo' : 'Salvar'}</p>
                  </>
                ) : (
                  <>
                    <BookmarkIcon className="h-5 w-5 mr-1" />{' '}
                    <p className="hidden md:block font-inconsolata">{isSaved ? 'Salvo' : 'Salvar'}</p>
                  </>
                )}
              </button>
            )}
            <button
              onClick={likePost}
              className={`${isLiked
                ? 'bg-gray-100 text-yellow-600'
                : 'bg-gray-100'
                } py-2 px-3 flex items-center rounded font-inconsolata font-medium`}
            >
              {isLiked ? (
                <>
                  <StarIcon className="h-5 w-5 mr-1 text-yellow-600" />{' '}
                  <p>{post.likes.length}</p>
                </>
              ) : (
                <>
                  <StarIcon className="h-5 w-5 mr-1" />{' '}
                  <p className="hidden md:block font-inconsolata">Curtir</p>
                </>
              )}
            </button>
            {post.user._id === user._id && (
              <Link href={`/posts/edit/${post._id}`}>
                <a className="bg-gray-100 text-blue-500 py-2 px-3 flex items-center rounded font-medium font-inconsolata">
                  <PencilAltIcon className="h-5 w-5" />{' '}
                  <p className="hidden md:block ml-1">Editar</p>
                </a>
              </Link>
            )}
            {(post.user._id === user._id || user.role === 'root') && (
              <button
                onClick={() => setOpen(true)}
                className="bg-gray-100 text-red-500 py-2 px-3 flex items-center rounded font-medium font-inconsolata"
              >
                <TrashIcon className="h-5 w-5" />{' '}
                <p className="hidden md:block ml-1 font-inconsolata">Deletar</p>
                <DeleteModal
                  open={open}
                  setOpen={setOpen}
                  deletePost={deletePost}
                />
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default PostHeader;
