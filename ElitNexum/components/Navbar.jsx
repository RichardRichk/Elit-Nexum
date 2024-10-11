import Link from "next/link";
import Image from "next/image";
import { Fragment } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import {
  BellIcon,
  MenuIcon,
  XIcon,
  PlusIcon,
  ChatAlt2Icon,
  TerminalIcon
} from "@heroicons/react/outline";
import Search from "./Search";
import { logoutUser } from "../utils/auth";

const navigation = [
  { name: "Home", href: "/home" },
  { name: "Feed", href: "/feed" },
  { name: "Pesquisar", href: "/search" },
];

const Navbar = ({ user, currentPath }) => {
  return (
    <Disclosure as="nav" className="bg-white shadow">
      {({ open }) => (
        <>
          <div className="container mx-auto px-2 md:px-10 lg:px-12">
            <div className="flex justify-between h-16">
              <div className="flex px-2 md:px-0">
                <div className="flex-shrink-0 flex items-center">
                  <Link href="/home">
                    <div className="flex flex-col items-center">
                      <TerminalIcon className="block lg:hidden h-10 w-auto cursor-pointer text-deepviolet" />
                      <p className="text-sm lg:hidden font-inconsolata text-blackelit font-bold">Elit Nexum</p>
                    </div>
                  </Link>
                  <Link href="/home">
                    <div className="hidden h-14 w-auto cursor-pointer lg:flex lg:flex-row">
                      <h1 className="text-2xl flex items-center font-inconsolata font-bold text-blackelit">
                        Elit<TerminalIcon className="h-10 w-10 text-deepviolet mx-2" />Nexum
                      </h1>
                    </div>
                  </Link>
                </div>
                <div className="hidden lg:ml-6 lg:flex lg:space-x-4">
                  {navigation.map((link) => (
                    <Link key={link.name} href={link.href}>
                      <a
                        className={`${currentPath === link.href
                          ? "border-violet text-blackelit font-bold font-inconsolata"
                          : "border-transparent hover:text-violet text-deepgrayelit font-semibold font-inconsolata"
                          } inline-flex items-center px-2 pt-1 border-b-2 text-sm`}
                      >
                        {link.name}
                      </a>
                    </Link>
                  ))}
                </div>
              </div>
              <Search />
              <div className="flex items-center lg:hidden">
                <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded text-grayelit hover:text-deepgrayelit hover:bg-whiteelit focus:outline-none focus:ring-2 focus:ring-inset focus:ring-violet">
                  <span className="sr-only">Abrir menu principal</span>
                  {open ? (
                    <XIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <MenuIcon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              {user ? (
                <>
                  <div className="hidden lg:ml-4 lg:flex lg:items-center">
                    <Link href="/messages">
                      <button className="flex-shrink-0 relative bg-white p-1 mr-2 text-grayelit rounded-full hover:text-deepgrayelit focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet font-inconsolata">
                        <span className="sr-only">Ver mensagens</span>
                        <ChatAlt2Icon className="h-7 w-7" aria-hidden="true" />
                        {user.unreadMessage && (
                          <div className="absolute top-1 right-2 bg-deepviolet h-2 w-2 rounded-full"></div>
                        )}
                      </button>
                    </Link>
                    <Link href="/notifications">
                      <button className="flex-shrink-0 relative bg-white p-1 text-grayelit rounded-full hover:text-deepgrayelit focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet font-inconsolata">
                        <span className="sr-only">Ver notificações</span>
                        <BellIcon className="h-7 w-7" aria-hidden="true" />
                        {user.unreadNotification && (
                          <div className="absolute top-1 right-2 bg-deepviolet h-2 w-2 rounded-full"></div>
                        )}
                      </button>
                    </Link>
                    <Menu as="div" className="ml-4 relative flex-shrink-0">
                      {({ open }) => (
                        <>
                          <div>
                            <Menu.Button className="bg-white rounded-full flex text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet">
                              <span className="sr-only">
                                Abrir menu do usuário
                              </span>
                              <Image
                                className="object-cover object-center overflow-hidden rounded-full"
                                src={user.profilePicUrl}
                                alt={user.name}
                                height={46}
                                width={46}
                                quality={1}
                              />
                            </Menu.Button>
                          </div>
                          <Transition
                            show={open}
                            as={Fragment}
                            enter="transition ease-out duration-100"
                            enterFrom="transform opacity-0 scale-95"
                            enterTo="transform opacity-100 scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="transform opacity-100 scale-100"
                            leaveTo="transform opacity-0 scale-95"
                          >
                            <Menu.Items
                              static
                              className="origin-top-right absolute right-0 mt-2 w-48 rounded shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
                            >
                              <Menu.Item>
                                <Link href={`/${user.username}`}>
                                  <a className="block hover:bg-gray-100 px-4 py-2 text-sm text-deepgrayelit font-inconsolata">
                                    Perfil
                                  </a>
                                </Link>
                              </Menu.Item>
                              <Menu.Item>
                                <Link href="/settings">
                                  <a className="block hover:bg-gray-100 px-4 py-2 text-sm text-deepgrayelit font-inconsolata">
                                    Configurações
                                  </a>
                                </Link>
                              </Menu.Item>
                              <Menu.Item>
                                <a
                                  onClick={logoutUser}
                                  className="block hover:bg-gray-100 px-4 cursor-pointer py-2 text-sm text-deepgrayelit font-inconsolata"
                                >
                                  Sair
                                </a>
                              </Menu.Item>
                            </Menu.Items>
                          </Transition>
                        </>
                      )}
                    </Menu>
                    <Link href="/posts/new">
                      <a className="bg-violet hover:bg-deepviolet transition rounded text-white px-3 h-9 ml-5 flex items-center font-inconsolata">
                        <PlusIcon className="h-4 w-4 mr-1" />
                        <p className="text-sm">Nova Postagem</p>
                      </a>
                    </Link>
                  </div>
                </>
              ) : (
                <div className="space-x-4 flex items-center ml-4">
                  <Link href="/">
                    <a className="hidden sm:flex font-semibold text-deepgrayelit text-sm font-inconsolata">
                      Logar
                    </a>
                  </Link>
                  <Link href="/signup">
                    <a className="hidden sm:flex bg-violet hover:bg-deepviolet transition text-white font-semibold text-sm px-3 py-2 rounded font-inconsolata">
                      Inscreva-se
                    </a>
                  </Link>
                </div>
              )}
            </div>
          </div>
          <Disclosure.Panel className="lg:hidden">
            <div className="pt-2 pb-3 space-y-1">
              {navigation.map((link) => (
                <Link key={link.name} href={link.href}>
                  <a
                    className={
                      currentPath === link.href
                        ? "bg-purple-50 border-violet text-darkestviolet block pl-3 pr-4 py-2 border-l-4 text-base font-medium font-inconsolata"
                        : "border-transparent text-deepgrayelit hover:bg-gray-50 hover:border-grayelit hover:text-blackelit block pl-3 pr-4 py-2 border-l-4 text-base font-medium font-inconsolata"
                    }
                  >
                    {link.name}
                  </a>
                </Link>
              ))}
            </div>
            {user ? (
              <div className="pt-4 pb-3 border-t border-whiteelit">
                <div className="flex items-center px-4">
                  <div className="flex-shrink-0">
                    <Image
                      className="object-cover object-center overflow-hidden rounded-full"
                      src={user.profilePicUrl}
                      alt={user.name}
                      height={46}
                      width={46}
                      quality={1}
                    />
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-blackelit font-poppins">
                      {user.name}
                    </div>
                    <div className="text-sm font-medium text-deepgrayelit font-poppins">
                      {user.email}
                    </div>
                  </div>
                  <div className="ml-auto">
                    <Link href="/messages">
                      <button className="relative flex-shrink-0 mr-1 bg-white p-1 text-grayelit rounded-full hover:text-deepgrayelit focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet font-inconsolata">
                        <span className="sr-only">Ver mensagens</span>
                        <ChatAlt2Icon className="h-6 w-6" aria-hidden="true" />
                        {user.unreadMessage && (
                          <div className="absolute top-1 right-2 bg-deepviolet h-2 w-2 rounded-full"></div>
                        )}
                      </button>
                    </Link>
                    <Link href="/notifications">
                      <button className="relative flex-shrink-0 bg-white p-1 text-grayelit rounded-full hover:text-deepgrayelit focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet font-inconsolata">
                        <span className="sr-only">Ver notificações</span>
                        <BellIcon className="h-6 w-6" aria-hidden="true" />
                        {user.unreadNotification && (
                          <div className="absolute top-1 right-2 bg-deepviolet h-2 w-2 rounded-full"></div>
                        )}
                      </button>
                    </Link>
                  </div>
                </div>
                <div className="mt-3 space-y-1">
                  <Link href={`/${user.username}`}>
                    <a className="block px-4 py-2 text-base font-medium text-deepgrayelit hover:text-blackelit hover:bg-gray-100 font-inconsolata">
                      Perfil
                    </a>
                  </Link>
                  <Link href="/settings">
                    <a className="block px-4 py-2 text-base font-medium text-deepgrayelit hover:text-blackelit hover:bg-gray-100 font-inconsolata">
                      Configurações
                    </a>
                  </Link>
                  <a
                    onClick={logoutUser}
                    className="block cursor-pointer px-4 py-2 text-base font-medium text-deepgrayelit hover:text-blackelit hover:bg-gray-100 font-inconsolata"
                  >
                    Sair
                  </a>
                  <Link href="/posts/new">
                    <a className="bg-violet hover:bg-deepviolet transition rounded text-white mx-4 py-2 font-semibold flex items-center justify-center font-inconsolata">
                      <PlusIcon className="h-4 w-4 mr-1" />
                      <p className="text-sm">Nova Postagem</p>
                    </a>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="pt-4 pb-3 border-t border-whiteelit flex flex-col space-2 items-center px-4">
                <Link href="/">
                  <a className="font-semibold text-deepviolet text-center w-full py-2">
                    Logar
                  </a>
                </Link>
                <Link href="/signup">
                  <a className="bg-violet rounded font-semibold text-white text-center w-full py-2">
                    Inscreva-se
                  </a>
                </Link>
              </div>
            )}
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};

export default Navbar;