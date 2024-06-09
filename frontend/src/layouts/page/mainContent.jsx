import React from "react";
import CreatePost from "../../fragments/createPost/createPost";
import Posts from "../../fragments/cardPost/posts";
// import Story from "../getStory";

const MainContent = () => {

  return (
    <section className="w-full min-h-[97vh] lg:min-h-screen lg:max-h-[882px] py-5 px-4 border border-white-gray rounded-[25px] lg:overflow-y-scroll scrollbar-thin">
      {/* <Story /> */}
      <CreatePost />
      <Posts />
    </section>
  );
};

export default MainContent;
