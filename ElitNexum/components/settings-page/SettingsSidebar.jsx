import {
  UserCircleIcon,
  IdentificationIcon,
  KeyIcon,
} from '@heroicons/react/outline';

const subNavigation = [
  { name: 'User', icon: UserCircleIcon, id: 'user', label: "Usuário" },
  { name: 'Profile', icon: IdentificationIcon, id: 'profile', label: "Perfil" },
  { name: 'Password', icon: KeyIcon, id: 'password', label: "Senha" },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const SettingsSidebar = ({ tab, setTab }) => {
  return (
    <aside className="py-6 lg:col-span-3">
      <nav className="space-y-1">
        {subNavigation.map((item) => (
          <a
            key={item.name}
            className={classNames(
              tab === item.id
                ? 'bg-purple-50 border-purple-500 text-purple-700 hover:bg-purple-50 hover:text-purple-700'
                : 'border-transparent text-blackelit hover:bg-purple-50 hover:text-blackelit',
              'group border-l-4 px-3 py-2 flex items-center font-inconsolata text-sm font-bold'
            )}
            onClick={() => setTab(item.id)}
          >
            <item.icon
              className={classNames(
                tab === item.id
                  ? 'text-violet group-hover:text-violet'
                  : 'text-grayelit group-hover:text-deepgrayelit',
                'flex-shrink-0 -ml-1 mr-3 h-6 w-6'
              )}
              aria-hidden="true"
            />
            <span className="truncate font-inconsolata">{item.label}</span>
          </a>
        ))}
      </nav>
    </aside>
  );
};

export default SettingsSidebar;