import Link from 'next/link';
import Image from 'next/image';
import { formatDistanceToNowStrict } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ChatAltIcon, HeartIcon, UserAddIcon } from '@heroicons/react/solid';
import { BiAward } from 'react-icons/bi';

const NotificationItem = ({ notification, index, length }) => {
  return (
    <li>
      <div className="relative pb-8">
        {index !== length - 1 ? (
          <span
            className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-gray-200"
            aria-hidden="true"
          />
        ) : null}
        <div className="relative flex items-start space-x-3">
          {notification.type === 'comment' ? (
            <>
              <Link href={`/${notification.user.username}`}>
                <div className="relative cursor-pointer">
                  <Image
                    className="rounded-full flex items-center justify-center ring-8 ring-white object-cover"
                    src={notification.user.profilePicUrl}
                    width={40}
                    height={40}
                  />
                  <span className="absolute -bottom-0.5 rounded-full -right-1 bg-deepviolet p-0.5">
                    <ChatAltIcon
                      className="h-3 w-3 text-white"
                      aria-hidden="true"
                    />
                  </span>
                </div>
              </Link>
              <div className="min-w-0 flex justify-between w-full">
                <div className="md:ml-2 ml-0 md:w-[80%]">
                  <div className="text-md text-deepgrayelit">
                    <Link href={`/${notification.user.username}`}>
                      <a className="font-medium text-blackelit hover:text-deepviolet">
                        {notification.user.username}
                      </a>
                    </Link>{' '}
                    deixou um comentário em{' '}
                    <Link href={`/posts/${notification.post._id}`}>
                      <a className="hover:text-deepviolet cursor-pointer break-all overflow-hidden">
                        {notification.post.title}
                      </a>
                    </Link>
                  </div>
                  <p className="mt-1 text-blackelit break-all overflow-hidden w-[90%]">{notification.text}</p>
                </div>
                <p className="text-deepgrayelit ml-2 text-sm flex ">
                  {formatDistanceToNowStrict(new Date(notification.date), {
                    addSuffix: true,
                    locale: ptBR
                  })}
                </p>
              </div>
            </>
          ) : notification.type === 'reply' ? (
            <>
              <Link href={`/${notification.user.username}`}>
                <div className="relative cursor-pointer">
                  <Image
                    className="rounded-full flex items-center justify-center ring-8 ring-white object-cover"
                    src={notification.user.profilePicUrl}
                    width={40}
                    height={40}
                  />
                  <span className="absolute -bottom-0.5 rounded-full -right-1 bg-deepviolet p-0.5">
                    <ChatAltIcon
                      className="h-3 w-3 text-white"
                      aria-hidden="true"
                    />
                  </span>
                </div>
              </Link>
              <div className="min-w-0 flex justify-between w-full">
                <div className="md:ml-2 ml-0">
                  <div className="text-md text-deepgrayelit">
                    <Link href={`/${notification.user.username}`}>
                      <a className="font-medium text-blackelit hover:text-deepviolet">
                        {notification.user.username}
                      </a>
                    </Link>{' '}
                    respondeu ao seu comentário em{' '}
                    <Link href={`/posts/${notification.post._id}`}>
                      <a className="hover:text-deepviolet cursor-pointer">
                        {notification.post.title}
                      </a>
                    </Link>
                  </div>
                  <p className="mt-1 text-blackelit">{notification.text}</p>
                </div>
                <p className="text-deepgrayelit ml-2 text-sm">
                  {formatDistanceToNowStrict(new Date(notification.date), {
                    addSuffix: true,
                    locale: ptBR,
                  })}
                </p>
              </div>
            </>
          ) : notification.type === 'follow' ? (
            <>
              <Link href={`/${notification.user.username}`}>
                <div className="relative cursor-pointer">
                  <Image
                    className="rounded-full flex items-center justify-center ring-8 ring-white object-cover"
                    src={notification.user.profilePicUrl}
                    width={40}
                    height={40}
                  />
                  <span className="absolute -bottom-0.5 rounded-full -right-1 bg-deepviolet p-0.5">
                    <UserAddIcon
                      className="h-3 w-3 text-white"
                      aria-hidden="true"
                    />
                  </span>
                </div>
              </Link>
              <div className="min-w-0 w-full flex justify-between py-1.5">
                <div className="text-md text-deepgrayelit md:ml-2 ml-0">
                  <Link href={`/${notification.user.username}`}>
                    <a className="font-medium text-blackelit hover:text-deepviolet">
                      {notification.user.username}
                    </a>
                  </Link>{' '}
                  começou a te seguir
                </div>
                <p className="text-blackelit ml-2 text-sm break-all overflow-hidden w-[90%]">
                  {formatDistanceToNowStrict(new Date(notification.date), {
                    addSuffix: true,
                    locale: ptBR,
                  })}
                </p>
              </div>
            </>
          ) : notification.type === 'like' ? (
            <>
              <Link href={`/${notification.user.username}`}>
                <div className="relative cursor-pointer">
                  <Image
                    className="rounded-full flex items-center justify-center ring-8 ring-white object-cover"
                    src={notification.user.profilePicUrl}
                    width={40}
                    height={40}
                  />
                  <span className="absolute -bottom-0.5 rounded-full -right-1 bg-deepviolet p-0.5">
                    <HeartIcon
                      className="h-3 w-3 text-white"
                      aria-hidden="true"
                    />
                  </span>
                </div>
              </Link>
              <div className="min-w-0 w-full flex justify-between py-1.5">
                <div className="text-md text-deepgrayelit md:ml-2 ml-0">
                  <Link href={`/${notification.user.username}`}>
                    <a className="font-medium text-blackelit hover:text-deepviolet">
                      {notification.user.username}
                    </a>
                  </Link>{' '}
                  curtiu sua postagem em{' '}
                  <Link href={`/posts/${notification.post._id}`}>
                    <a className="hover:text-deepviolet cursor-pointer break-all w-[90%] overflow-hidden">
                      {notification.post.title}
                    </a>
                  </Link>
                </div>
                <p className="text-blackelit ml-2 text-sm">
                  {formatDistanceToNowStrict(new Date(notification.date), {
                    addSuffix: true,
                    locale: ptBR,
                  })}
                </p>
              </div>
            </>
          ) : notification.type === 'badge' ? (
            <>
              <Link href="/elitnexum">
                <div className="relative cursor-pointer">
                  <Image
                    className="rounded-full flex items-center justify-center ring-8 ring-white object-cover"
                    src="https://res.cloudinary.com/dgepjhmuc/image/upload/v1727039628/Group_48096211_bsiyfo.png"
                    width={40}
                    height={40}
                  />
                  <span className="absolute -bottom-0.5 rounded-full -right-1 bg-deepviolet p-0.5">
                    <BiAward
                      className="h-3 w-3 text-white"
                      aria-hidden="true"
                    />
                  </span>
                </div>
              </Link>
              <div className="min-w-0 w-full flex justify-between py-1.5">
                <div className="text-md text-deepgrayelit md:ml-2 ml-0">
                  Você recebeu o{' '}
                  <span className="font-medium text-blackelit">
                    {notification.text} emblema
                  </span>
                  .
                </div>
                <p className="text-blackelit ml-2 text-sm">
                  {formatDistanceToNowStrict(new Date(notification.date), {
                    addSuffix: true,
                    locale: ptBR,
                  })}
                </p>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </li>
  );
};

export default NotificationItem;
