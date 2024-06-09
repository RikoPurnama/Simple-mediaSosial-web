import { Link } from "react-router-dom";
import { IoSettingsOutline } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { FaHeart } from "react-icons/fa6";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import LoadingSpinner from "../../components/skeletons/LoadingSpinner";
import useFollow from "../../hooks/useFollow";

const Notifications = () => {
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });

  const queryClient = useQueryClient();

  const { data: notifications, isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/notifications");
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }
        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["suggestedUsers"] });
    },
  });

  const { mutate: deleteNotifications } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch("/api/notifications", {
          method: "DELETE",
        });
        const data = await res.json();
        if (!res.ok) {
        }
        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
    onSuccess: () => {
      toast.success("All notifications deleted");
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const checkFollowing = (userId) => authUser?.following?.includes(userId);
  const { follow } = useFollow();

  return (
    <>
      <div className="w-full max-w-[500px] lg:max-w-full md:max-w-[550px] py-5 mx-auto my-5 px-4 border border-white-gray rounded-[25px] overflow-y-hidden overflow-x-hidden bg-white text-dark">
        <div className="flex justify-between items-center py-4">
          <p className="font-bold text-2xl">Notifications</p>
          <div className="dropdown ">
            <div tabIndex={0} role="button" className="m-1">
              <IoSettingsOutline className="w-4" />
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52 -translate-x-48"
            >
              <li>
                <a onClick={deleteNotifications}>Delete all notifications</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="w-full overflow-y-scroll overflow-x-hidden scrollbar-thin max-h-[95vh] lg:pb-[200px]">
          {isLoading && (
            <div className="flex justify-center h-full items-center">
              <LoadingSpinner size="lg" />
            </div>
          )}
          {notifications?.length === 0 && (
            <div className="text-center p-4 font-bold">No notifications </div>
          )}

          {notifications?.map((notification) => (
            <div
              className="border border-white-gray rounded-3xl my-2"
              key={notification._id}
            >
              <div className="w-full flex gap-2 py-5 px-4 justify-between items-center">
                <Link to={`/profile/${notification.from.username}`} className="w-full flex gap-2 justify-between items-center">
                  <div className="w-full flex gap-2 items-center">
                    <div className="w-8 h-8 rounded-full overflow-hidden">
                      <img
                        src={notification.from.profileImg || "/profile.png"}
                      />
                    </div>

                    <div className="">
                      <span className="font-bold block">
                        @{notification.from.username}
                      </span>{" "}
                      <span className="flex gap-2 items-center">
                        {notification.type === "follow" && (
                          <FaUser className="w-4 h-4 text-dark" />
                        )}
                        {notification.type === "like" && (
                          <FaHeart className="w-4 h-4 text-red" />
                        )}
                        {notification.type === "follow"
                          ? "Mengikuti anda"
                          : "Menyukai postingan anda"}
                      </span>
                    </div>
                  </div>
                  {authUser._id === notification.from._id ? "" : (<button
                      onClick={(e) => {
                        e.preventDefault();
                        follow(notification.from._id);
                      }}
                      className={`py-1 px-2 text-sm ${checkFollowing(notification.from._id) ? "bg-white-gray/20 text-dark" : "bg-dark text-white"}  rounded-lg`}
                    >
                      {checkFollowing(notification.from._id) ? "Following" : "Follow"}
                    </button>)}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
export default Notifications;
