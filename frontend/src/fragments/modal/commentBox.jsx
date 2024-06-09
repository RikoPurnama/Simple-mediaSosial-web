import React from "react";
import { Link } from "react-router-dom";

const CommentBox = ({post, handlePostComment, isCommenting, comment, setComment}) => {
  return (
    <dialog
      id={`my_modal_5${post?._id}`}
      className="modal modal-bottom sm:modal-middle"
    >
      <div className="modal-box rounded-t-[25px] md:rounded-3xl border border-white-gray bg-white text-dark">
        <h3 className="font-bold text-lg mb-4">COMMENTS</h3>
        <div className="flex flex-col gap-3 max-h-60 overflow-auto">
          {post?.comments?.length === 0 && (
            <p className="text-sm text-gray">
              Tidak ada komentar, Jadilah yang pertama dipostingan ini
            </p>
          )}
          {post?.comments?.map((comment) => (
            <div key={comment._id} className="flex gap-2 items-start">
              <div className="avatar">
                <div className="w-8 rounded-full">
                  <img src={comment.user.profileImg || "/profile.png"} />
                </div>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1">
                  <span className="font-bold">{comment.user.fullName}</span>
                  <Link to={'/profile/' + comment.user.username } className="text-gray text-[15px]">
                    @{comment.user.username}
                  </Link>
                </div>
                <div className="text-base ml-1">{comment.text}</div>
              </div>
            </div>
          ))}
        </div>
        <form
          className="flex flex-col md:flex-row gap-2 items-center mt-4 border-t border-gray-600 pt-2"
          onSubmit={handlePostComment}
        >
          <textarea
            className="textarea w-full p-1 rounded-lg text-md resize-none border focus:outline-none  border-white-gray"
            placeholder="Tambah komentar..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button className="w-full md:w-auto py-1 bg-dark rounded-lg btn-sm text-white px-4">
            {isCommenting ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : (
              "Kirim"
            )}
          </button>
        </form>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button className="outline-none text-dark">close</button>
      </form>
    </dialog>
  );
};

export default CommentBox;
