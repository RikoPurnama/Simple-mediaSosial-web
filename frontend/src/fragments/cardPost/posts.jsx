import { useQuery } from "@tanstack/react-query";
import React, { useEffect } from "react";
import PostSkeleton from "../../components/skeletons/PostSkeleton";
import Post from "./post";
import { useLocation, useParams } from "react-router-dom";

const Posts = ({ feedType, username, userId }) => {
  const { pathname } = useLocation();
  const url = useParams();

  const getPostEndpoint = () => {
    switch (feedType) {
      case "forYou":
        return "/api/posts/all";
      case "following":
        return "/api/posts/following";
      case "posts":
        return `/api/posts/user/${username}`;
      case "likes":
        return `/api/posts/likes/${userId}`;
      case "bookmarks":
        return `/api/posts/saved/${url.id}`;
      case "shared":
        return `/api/posts/${url.id}`;
      default:
        return "/api/posts/all";
    }
  };

  const POST_ENDPOINT = getPostEndpoint();

  const {
    data: posts,
    isLoading,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      try {
        const res = await fetch(POST_ENDPOINT);
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }
        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
  });

  useEffect(() => {
    refetch();
  }, [feedType, refetch, username]);


  return (
    <div className="flex flex-col gap-5 lg:pb-0">
      {(isLoading || isRefetching) && (
        <div className="flex flex-col justify-center">
          <PostSkeleton />
          <PostSkeleton />
          <PostSkeleton />
        </div>
      )}

      {!isLoading && !isRefetching && posts?.length === 0 && (
        <p className="text-center my-5">No posts in this tab. Switch tab</p>
      )}

      {!isLoading && !isRefetching && posts && (
        <>
          {pathname === `/${url.username}/${url.id}` && <Post post={posts} />}
          {pathname != `/${url.username}/${url.id}` && (
            <>
              {posts?.map((post) => (
                <Post key={post._id} post={post} />
              ))}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Posts;
