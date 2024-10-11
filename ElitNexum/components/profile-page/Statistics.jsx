import CountUp from 'react-countup';
import { TemplateIcon, EyeIcon, HeartIcon } from '@heroicons/react/outline';

const Statistics = ({ posts }) => {
  const stats = [
    {
      id: 1,
      name: 'Postado por você',
      stat: posts.length,
      icon: TemplateIcon,
    },
    {
      id: 2,
      name: 'Visualizações Totais',
      stat: posts.reduce(
        (previousValue, post) => previousValue + post.views,
        0
      ),
      icon: EyeIcon,
    },
    {
      id: 3,
      name: 'Curtidas Totais',
      stat: posts.reduce(
        (previousValue, post) => previousValue + post.likes.length,
        0
      ),
      icon: HeartIcon,
    },
  ];

  return (
    <dl className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {stats.map((item) => (
        <div
          key={item.id}
          className="relative bg-white pt-5 px-4 sm:pt-6 sm:px-6 shadow rounded overflow-hidden"
        >
          <dt>
            <div className="absolute bg-violet rounded p-3">
              <item.icon className="h-6 w-6 text-white" aria-hidden="true" />
            </div>
            <p className="ml-16 text-sm font-inconsolata font-semibold text-deepgrayelit truncate">
              {item.name}
            </p>
          </dt>
          <dd className="ml-16 pb-6 flex items-baseline sm:pb-7">
            <p className="text-2xl font-semibold text-blackelit font-inconsolata">
              <CountUp end={item.stat} duration={2} />
            </p>
          </dd>
        </div>
      ))}
    </dl>
  );
};

export default Statistics;