import { ArrowUpIcon, PencilAltIcon } from "@heroicons/react/solid";
import Link from "next/link";

const NewPost = ({ user }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="fixed bottom-8 right-8 flex flex-col gap-3">
      <button
        onClick={scrollToTop}
        className="w-12 h-12 flex items-center justify-center text-lg font-semibold bg-deepviolet text-white rounded-full shadow z-60"
      >
        <ArrowUpIcon className="h-6 w-6" />
      </button>
      {user && (
        <Link href="/posts/new">
          <a className="w-12 h-12 flex items-center justify-center text-lg font-semibold bg-deepviolet text-white rounded-full shadow lg:hidden">
            <PencilAltIcon className="h-6 w-6" />
          </a>
        </Link>
      )}
    </div>
  );
};

export default NewPost;
