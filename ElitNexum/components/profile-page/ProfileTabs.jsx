import {
  UserIcon,
  ViewGridIcon,
  BookmarkIcon,
  PresentationChartLineIcon,
} from '@heroicons/react/solid';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const tabs = [
  { name: 'Posts', icon: ViewGridIcon, label: "Postagens" },
  { name: 'About', icon: UserIcon, label: "Sobre" },
];

const authTabs = [
  { name: 'Saved', icon: BookmarkIcon, label: "Salvos" },
  { name: 'Statistics', icon: PresentationChartLineIcon, label: "Estatísticas" },
];

const ProfileTabs = ({ currentTab, setCurrentTab, user, profile }) => {
  return (
    <div className="block mb-8">
      <div className="border-b border-whiteelit">
        <nav
          className="-mb-px flex space-x-8 overflow-x-auto"
          aria-label="Tabs"
        >
          {tabs.map((tab) => (
            <a
              key={tab.name}
              onClick={() => setCurrentTab(tab.name)}
              className={classNames(
                currentTab === tab.name
                  ? 'border-deepviolet text-deepviolet text-[16px] font-inconsolata font-semibold'
                  : 'border-transparent text-deepgrayelit font-inconsolata text-[14px] font-semibold hover:text-blackelit hover:border-grayelit',
                'group inline-flex cursor-pointer items-center py-4 px-1 border-b-2 font-medium text-sm'
              )}
              aria-current={currentTab === tab.name ? 'page' : undefined}
            >
              <tab.icon
                className={classNames(
                  currentTab === tab.name
                    ? 'text-deepviolet'
                    : 'text-grayelit group-hover:text-deepgrayelit',
                  '-ml-0.5 mr-2 h-7 w-7'
                )}
                aria-hidden="true"
              />
              <span>{tab.label}</span>
            </a>
          ))}
          {user &&
            profile === user &&
            authTabs.map((tab) => (
              <a
                key={tab.name}
                onClick={() => setCurrentTab(tab.name)}
                className={classNames(
                  currentTab === tab.name
                    ? 'border-deepviolet text-deepviolet text-[16px] font-inconsolata font-semibold'
                    : 'border-transparent text-deepgrayelit text-[14px] font-inconsolata font-semibold hover:text-blackelit hover:border-grayelit',
                  'group inline-flex cursor-pointer items-center py-4 px-1 border-b-2 font-medium text-sm'
                )}
                aria-current={currentTab === tab.name ? 'page' : undefined}
              >
                <tab.icon
                  className={classNames(
                    currentTab === tab.name
                      ? 'text-deepviolet'
                      : 'text-grayelit group-hover:text-deepgrayelit',
                    '-ml-0.5 mr-2 h-7 w-7'
                  )}
                  aria-hidden="true"
                />
                <span>{tab.label}</span>
              </a>
            ))}
        </nav>
      </div>
    </div>
  );
};

export default ProfileTabs;