import axios from 'axios';
import cookie from 'js-cookie';
import { useQuery } from 'react-query';
import PostCard from '../PostCard';
import baseURL from '../../utils/baseURL';

const SavedPosts = ({ user }) => {
  const { data, isLoading } = useQuery(['saves', user._id], async () => {
    const { data } = await axios.get(`${baseURL}/api/posts/saves`, {
      headers: {
        Authorization: cookie.get('token'),
      },
    });
    return data;
  });

  if (isLoading) {
    return <p>Carregando...</p>;
  }

  if (data.length === 0) {
    return (
      <p className="text-lg mt-2 text-deepviolet">
        Você ainda não salvou nenhuma postagem</p>
    );
  }

  return (
    <div className="grid gap-x-5 gap-y-7 place-items-start grid-cols-auto-fill">
      {data.map((post) => (
        <PostCard key={post._id} post={post} user={user} />
      ))}
    </div>
  );
};

export default SavedPosts;