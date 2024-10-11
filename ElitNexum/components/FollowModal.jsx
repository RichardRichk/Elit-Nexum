import axios from 'axios';
import Link from 'next/link';
import Image from 'next/image';
import { useQuery } from 'react-query';
import { Fragment, useRef } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { UserGroupIcon } from '@heroicons/react/outline';
import baseURL from '../utils/baseURL';

const FollowModal = ({ open, setOpen, username, statsToShow }) => {
  const cancelButtonRef = useRef(null);

  const { data, isLoading } = useQuery(
    [statsToShow, username],
    async () => {
      const { data } = await axios.get(
        `${baseURL}/api/profile/${username}/${statsToShow}`
      );
      return data;
    },
    {
      enabled: open,
    }
  );

  return (
    open && (
      <Transition.Root show={open} as={Fragment}>
        <Dialog
          as="div"
          className="fixed z-10 inset-0 overflow-y-auto"
          initialFocus={cancelButtonRef}
          onClose={setOpen}
        >
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-deepgrayelit bg-opacity-75 transition-opacity" />
            </Transition.Child>
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <div className="inline-block align-bottom bg-white rounded text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-3/4">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-center border-b border-whiteelit pb-2">
                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full bg-purple-100 sm:mx-0 sm:h-10 sm:w-10">
                      <UserGroupIcon
                        className="h-5 w-5 sm:h-6 sm:w-6 text-deepviolet"
                        aria-hidden="true"
                      />
                    </div>
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                      <Dialog.Title
                        as="h3"
                        className="text-lg leading-6 font-medium text-blackelit font-inconsolata"
                      >
                        <p>{statsToShow === 'followers' ? 'SEGUIDORES' : 'SEGUINDO'}</p>
                      </Dialog.Title>
                    </div>
                  </div>
                  <div className="flex flex-col mt-4">
                    {isLoading ? (
                      <p>Carregando...</p>
                    ) : data.length === 0 ? (
                      <p>Nenhum {statsToShow === 'followers' ? 'seguidores' : 'seguindos'}</p>
                    ) : (
                      <div className="space-y-3">
                        {data.map((follower) => (
                          <Link
                            key={follower._id}
                            href={`/${follower.user.username}`}
                          >
                            <div
                              onClick={() => setOpen(false)}
                              className="flex items-center cursor-pointer hover:text-deepviolet"
                            >
                              <Image
                                src={follower.user.profilePicUrl}
                                width={30}
                                height={30}
                                className="rounded-full object-cover"
                              />
                              <h3 className="text-lg ml-2 font-poppins">
                                {follower.user.username}
                              </h3>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded border border-grayelit shadow-sm px-4 py-2 bg-white text-base font-medium text-blackelit hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-offset-2 focus:ring-deepviolet sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm font-inconsolata"
                    onClick={() => setOpen(false)}
                    ref={cancelButtonRef}
                  >
                    Fechar
                  </button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    )
  );
};

export default FollowModal;