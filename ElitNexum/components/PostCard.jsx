import axios from "axios";
import Link from "next/link";
import Image from "next/image";
import cookie from "js-cookie";
import { useState } from "react";
import { motion } from "framer-motion";
import { useMutation } from "react-query";
import {
  EyeIcon,
  BookmarkIcon,
  StarIcon,
} from "@heroicons/react/solid";
import baseURL from "../utils/baseURL";

const PostCard = ({ post, user }) => {
  const [isLiked, setIsLiked] = useState(
    () => user && post.likes.filter((like) => like.user === user._id).length > 0
  );

  const [isSaved, setIsSaved] = useState(
    () => user && post.saves.filter((save) => save.user === user._id).length > 0
  );

  const likeMutation = useMutation(
    async () => {
      const { data } = await axios.put(
        `${baseURL}/api/posts/like/${post._id}`,
        {},
        {
          headers: {
            Authorization: cookie.get("token"),
          },
        }
      );
      return data;
    },
    {
      onMutate: () => setIsLiked((prevState) => !prevState),
      onError: () => setIsLiked((prevState) => !prevState),
    }
  );

  const saveMutation = useMutation(
    async () => {
      const { data } = await axios.put(
        `${baseURL}/api/posts/save/${post._id}`,
        {},
        {
          headers: {
            Authorization: cookie.get("token"),
          },
        }
      );
      return data;
    },
    {
      onMutate: () => setIsSaved((prevState) => !prevState),
      onError: () => setIsSaved((prevState) => !prevState),
    }
  );

  return (
    <Link href={`/posts/${post._id}`} className="z-40">
      <motion.div
        layout
        className="bg-gray-100 rounded shadow transition-transform transform hover:shadow-2xl hover:-translate-y-1"
        style={{
          boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px"
        }}
      >
        <div className="w-[300px] h-[220px] rounded group relative">
          <header className="flex w-full gap-[5px] align-center justify-between flex-row pb-1">
            <Link href={`/${post.user.username}`}>
              <div className="flex hover:text-deepviolet cursor-pointer pt-2 pl-3">
                <Image
                  src={post.user.profilePicUrl}
                  alt={post.user.name}
                  className="rounded-full object-cover"
                  width={42}
                  height={42}
                />
                <p className="ml-2 font-inconsolata flex items-center">@{post.user.username}</p>
              </div>
            </Link>

            <div className="flex items-center text-sm pt-[10px]">
              <div className="flex items-center">
                <StarIcon className="h-5 w-5 mr-1 text-grayelit hover:text-deepviolet transition" />{" "}
                <p className="font-inconsolata">{post.likes.length}</p>
              </div>
              <div className="flex items-center ml-3 pr-[15px]">
                <EyeIcon className="h-4 w-4 mr-1 text-grayelit hover:text-deepviolet transition" />{" "}
                <p className="font-inconsolata">{post.views}</p>
              </div>
            </div>
          </header>

          <Image
            src={post.images[0]}
            alt={post.name}
            width={300}
            height={169}
            className="rounded-b-lg group-hover:brightness-50 transition cursor-pointer object-cover object-top"
          />
          <p className="absolute opacity-0 group-hover:opacity-100 transition text-white bottom-6 left-4 font-medium font-inconsolata cursor-pointer">
            {post.title.length > 20
              ? post.title.substring(0, 20) + "..."
              : post.title}
          </p>
          {user && (
            <div className="flex absolute bottom-6 right-4 z-49">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  saveMutation.mutate();
                }}
                className={`${isSaved
                  ? "bg-white text-deepviolet"
                  : "bg-white text-deepgrayelit"
                  } opacity-0 rounded group-hover:opacity-100 transition p-1 font-medium cursor-pointer`}
              >
                <BookmarkIcon className="h-5 w-5" />
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  likeMutation.mutate();
                }}
                className={`${isLiked
                  ? "bg-white text-yellow-600"
                  : "bg-white text-deepgrayelit"
                  } opacity-0 rounded group-hover:opacity-100 ml-2 transition p-1 font-medium cursor-pointer`}
              >
                <StarIcon className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </Link>
  );
};

export default PostCard;