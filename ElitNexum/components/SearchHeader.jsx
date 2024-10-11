import { Disclosure } from '@headlessui/react';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const SettingsHeader = () => {
  return (
    <Disclosure as="div" className="relative bg-deepviolet pb-24 overflow-hidden">
      {({ open }) => (
        <>
          <div
            className={classNames(
              open ? 'bottom-0' : 'inset-y-0',
              'absolute flex justify-center inset-x-0 left-1/2 transform -translate-x-1/2 w-full overflow-hidden lg:inset-y-0'
            )}
            aria-hidden="true"
          >
            <div className="flex-grow bg-darkestviolet bg-opacity-75" />
            <svg
              className="flex-shrink-0"
              width={1750}
              height={308}
              viewBox="0 0 1750 308"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                opacity=".75"
                d="M1465.84 308L16.816 0H1750v308h-284.16z"
                fill="#6D33A6"
              />
              <path
                opacity=".75"
                d="M1733.19 0L284.161 308H0V0h1733.19z"
                fill="#6D33A6"
              />
            </svg>
            <div className="flex-grow bg-darkestviolet bg-opacity-75" />
          </div>
          <header className="relative pt-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white text-center">
              <h1 className="text-3xl font-bold mb-2 font-inconsolata">Busca Avançada</h1>
              <p className="text-lg font-poppins">Buscar por postagens, usuários e tags</p>
            </div>
          </header>
        </>
      )}
    </Disclosure>
  );
};

export default SettingsHeader;
