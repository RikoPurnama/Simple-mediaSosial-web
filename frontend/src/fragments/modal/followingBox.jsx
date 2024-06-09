import { useQuery } from "@tanstack/react-query";
import React from "react";
import useFollow from "../../hooks/useFollow";
import { Link } from "react-router-dom";

const FollowingBox = ({ user }) => {
  const { data: users, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/posts/all");
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



  return (
    <dialog id="my_modal_3" className="modal">
      <div className="modal-box">
        <form method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        <h3 className="font-bold text-lg">FOLLOWING</h3>
        
      </div>
    </dialog>
  );
};

export default FollowingBox;
