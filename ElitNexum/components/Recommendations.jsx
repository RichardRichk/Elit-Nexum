import axios from 'axios';
import Link from 'next/link';
import Image from 'next/image';
import cookie from 'js-cookie';
import { useQuery } from 'react-query';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import PostCard from './PostCard';
import baseURL from '../utils/baseURL';
import NewPost from './Button';

const Recommendations = ({ user }) => {
  const { data, isLoading, isError } = useQuery(
    'recommendations',
    async () => {
      const { data } = await axios.get(`${baseURL}/api/recommendations`, {
        headers: {
          Authorization: cookie.get('token'),
        },
      });
      return data;
    },
    { staleTime: Infinity }
  );

  return (
    <>
      {isLoading ? (
        <div className="min-h-screen flex justify-center items-center -my-8">
          <AiOutlineLoading3Quarters className="text-4xl text-deepviolet animate-spin text-center" />
        </div>
      ) : isError ? (
        <p className="text-red-600 text-center">
          Ocorreu um erro :( Por favor, nos avise se você ver isso.
        </p>
      ) : (
        <>
          {/* Feed construido com tecnologias similares */}
          <div className={"flex flex-col mb-[100px]"}>
            <h1 className="text-violet text-[24px] font-semibold mb-4 font-inconsolata">
              Construído com Tecnologias Similares
            </h1>
            <div className="container mx-auto grid gap-x-5 gap-y-7 place-items-center grid-cols-auto-fill">
              {data.posts.map((post) => (
                <PostCard key={post._id} post={post} user={user} />
              ))}
            </div>
          </div>

          {/* Section 'Desenvolvedores populares' e 'Desenvolvedores com tecnologias similares' */}
          <div className="grid md:grid-cols-2 gap-x-8 gap-y-4 mb-6">
            {/* Desenvolvedores populares */}
            <div>
              <h1 className="text-violet text-[24px] font-semibold mb-2 font-inconsolata">
                Desenvolvedores Populares
              </h1>
              <ul className="divide-y divide-grayelit md:pr-8 w-[92%]">
                {data.popular.map((developer) => (
                  <li key={developer.user._id} className="py-1.5">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <Image
                          height={50}
                          width={50}
                          className="object-cover rounded-full"
                          src={developer.user.profilePicUrl}
                          alt={developer.user.name}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[16px] font-bold text-blackelit truncate font-poppins">
                          {developer.user.name}
                        </p>
                        <p className="text-[14px] font-inconsolata text-deepgrayelit truncate">
                          {'@' + developer.user.username}
                        </p>
                      </div>
                      <Link href={`/${developer.user.username}`}>
                        <a className=" flex justify-center items-center border leading-5  border-violet font-semibold rounded text-whiteelit bg-violet hover:bg-whiteelit hover:text-violet transition font-poppins w-[75px] h-[32px] text-[16px]">
                          Ver
                        </a>
                      </Link>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Desenvolvedores com tecnologias similares */}
            <div>
              <h1 className="text-violet text-[24px] font-semibold mb-2 font-inconsolata">
                Desenvolvedores com Tecnologias Similares
              </h1>
              <ul className="divide-y divide-grayelit md:pr-8 w-[92%]">
                {data.similar.map((developer) => (
                  <li key={developer.user._id} className="py-1.5">
                    <div className="flex items-center space-x-4 ">
                      <div className="flex-shrink-0">
                        <Image
                          height={50}
                          width={50}
                          className="object-cover rounded-full"
                          src={developer.user.profilePicUrl}
                          alt={developer.user.name}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[16px] font-bold text-blackelit truncate font-poppins">
                          {developer.user.name}
                        </p>
                        <p className="text-[14px] font-inconsolata text-deepgrayelit truncate">
                          {'@' + developer.user.username}
                        </p>
                      </div>
                      <Link href={`/${developer.user.username}`}>
                        <a className="flex justify-center items-center border leading-5  border-violet font-semibold rounded text-whiteelit bg-violet hover:bg-whiteelit hover:text-violet transition font-poppins w-[75px] h-[32px] text-[16px]">
                          Ver
                        </a>
                      </Link>
                    </div>
                    <NewPost user={user} />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Recommendations;