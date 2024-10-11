import axios from 'axios';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { QueryClient, useQuery } from 'react-query';
import { dehydrate } from 'react-query/hydration';
import PostCard from '../components/PostCard';
import ProfileHeader from '../components/profile-page/ProfileHeader';
import SavedPosts from '../components/profile-page/SavedPosts';
import ProfileTabs from '../components/profile-page/ProfileTabs';
import Statistics from '../components/profile-page/Statistics';
import SocialContainer from '../components/profile-page/SocialContainer';
import NotFound from '../components/404';
import baseURL from '../utils/baseURL';

const getProfile = async (username) => {
  const { data } = await axios.get(`${baseURL}/api/profile/${username}`);
  return data;
};

const ProfilePage = ({ user }) => {
  const [currentTab, setCurrentTab] = useState('Posts');

  const router = useRouter();
  const { username } = router.query;

  const { data } = useQuery(['profiles', username], () => getProfile(username));

  if (!data) return <NotFound />;

  return (
    <>
      <ProfileHeader
        profile={data.profile}
        followers={data.followers}
        following={data.following}
        user={user}
      />
      <div className="container mx-auto px-6 md:px-12 pb-8">
        <ProfileTabs
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          user={user && user._id}
          profile={data.profile.user._id}
        />
        <div className="grid gap-x-5 gap-y-7 place-items-start grid-cols-auto-fill">
          {currentTab === 'Posts' &&
            (data.posts.length === 0 ? (
              <p className="text-lg mt-2 text-deepviolet">
                O usuário ainda não tem nenhuma postagem
              </p>
            ) : (
              data.posts.map((post) => (
                <PostCard key={post._id} post={post} user={user} />
              ))
            ))}
        </div>

        {currentTab === 'About' && (
          <div className="w-full flex flex-wrap">
            <div className="w-full md:w-2/3">
              <div className="mb-6">
                <h1 className="text-blackelit mb-2 font-inconsolata font-semibold text-lg">
                  Biografia
                </h1>
                <p className="text-deepgrayelit font-poppins text-md">{data.profile.bio}</p>
              </div>
              <div className="mb-6">
                <h1 className="text-blackelit mb-2 font-inconsolata font-semibold text-lg">
                  Tecnologias
                </h1>
                <div className="flex flex-wrap gap-3">
                  {data.profile.techStack.map((techStack, index) => (
                    <Link key={index} href={`/posts/tag/${techStack}`}>
                      <a className="bg-whiteelit rounded hover:bg-deepviolet hover:text-white transition text-blackelit text-sm font-poppins font-semibold blackelit px-2 py-1">
                        {techStack}
                      </a>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            {data.profile?.social && (
              <div className="w-full md:w-1/3">
                <h1 className="text-blackelit mb-2 font-inconsolata font-semibold text-lg">
                  Perfis Sociais
                </h1>
                <SocialContainer social={data.profile?.social} />
              </div>
            )}
          </div>
        )}
        {currentTab === 'Saved' && <SavedPosts user={user} />}
        {currentTab === 'Statistics' && <Statistics posts={data.posts} />}
      </div>
    </>
  );
};

export async function getServerSideProps(ctx) {
  const { username } = ctx.params;
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(['profiles', username], () =>
    getProfile(username)
  );
  return { props: { dehydratedState: dehydrate(queryClient) } };
}

export default ProfilePage;