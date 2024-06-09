import React, { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { BiLogOut } from "react-icons/bi";
import toast from "react-hot-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import Aside from "./aside";
import MobileNav from "./mobileNav";
import { useMediaQuery } from "react-responsive";

const Header = () => {
  const [scrollDirection, setScrollDirection] = useState(null);
  const [lastScrollY, setLastScrollY] = useState("");
  const [openSidebarMob, setOpenSidebarMob] = useState(false);

  const isLg = useMediaQuery({ query: "(min-width: 1024px)" });
  const { pathname } = useLocation();

  const queryClient = useQueryClient();

  const { data: user } = useQuery({
    queryKey: ["userProfile"],
    queryFn: async () => {
      try {
        const res = await fetch(`/api/users/profile/${username}`);
        const data = await res.json();
        if (data.error) return null;
        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
  });

  const { mutate: logout } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch("/api/auth/logout", {
          method: "POST",
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Someting went wrong");
        }
      } catch (error) {
        throw new Error(error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: () => {
      toast.error("Logout failed");
    },
  });
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });

  const handleScroll = () => {
    if (window.scrollY > lastScrollY) {
      setScrollDirection("down");
    } else {
      setScrollDirection("up");
    }
    setLastScrollY(window.scrollY);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);
  return (
    <>
      <header
        className={`w-full lg:h-full py-1 md:py-5 fixed top-0 left-0 lg:static lg:w-[30%] lg:flex flex-col gap-5 transition-all duration-300 ${
          scrollDirection === "down"
            ? "opacity-25 -translate-y-[57.6px] delay-300"
            : "opacity-100 text-dark delay-700"
        } z-30 lg:z-0`}
      >
        <div className="hidden lg:block">
        <Aside authUser={authUser} logout={logout} />
        </div>
        {authUser && (
          <div
            className={` w-full lg:min-w-[255.6px] lg:max-w-[296.6px] bg-white/60 fixed top-0 lg:static left-0 backdrop-blur-sm lg:bg-white lg:backdrop-blur-none px-4 py-2 border border-white-gray lg:rounded-[25px] z-50 ${
              pathname === "/notifications" || pathname === `/profile`
                ? "hidden"
                : "block"
            }`}
          >
            <div className="w-full max-w-[500px] flex gap-2 items-center justify-between mx-auto">
              <div className="flex items-center gap-2">
                {isLg ? (
                  <Link
                    to={`/profile/${authUser.username}`}
                    style={{
                      backgroundImage: `url(${
                        authUser.profileImg || "/profile.png"
                      })`,
                    }}
                    className="w-[40px] h-[40px] lg:w-[50px] lg:h-[50px] bg-cover bg-center rounded-full"
                  ></Link>
                ) : (
                  <div
                    onClick={(e) => setOpenSidebarMob(!openSidebarMob)}
                    style={{
                      backgroundImage: `url(${
                        authUser.profileImg || "/profile.png"
                      })`,
                    }}
                    className="w-[40px] h-[40px] lg:w-[50px] lg:h-[50px] bg-cover bg-center rounded-full cursor-pointer z-50"
                  ></div>
                )}

                {isLg && (
                  <div className="flex flex-col">
                    <Link
                      to={`/profile/${authUser.username}`}
                      className="text-base font-medium leading-5"
                    >
                      {authUser?.fullname?.length >= 14
                        ? authUser.fullname.slice(0, 16) + "..."
                        : authUser.fullname}
                    </Link>
                    <Link
                      to={`/profile/${authUser.username}`}
                      className="text-sm text-gray hover:underline"
                    >
                      @{authUser.username}
                    </Link>
                  </div>
                )}
              </div>

              {!isLg && (
                <div className="w-[40px] h-[40px] bg-center">
                  <div
                    onClick={(e) => setOpenSidebarMob(!openSidebarMob)}
                    style={{ backgroundImage: `url(/V.svg)` }}
                    className="w-[50px] h-[50px] bg-cover bg-center object-cover"
                  ></div>
                </div>
              )}

              <button
                onClick={(e) => {
                  e.preventDefault();
                  logout();
                }}
                className="text-xl cursor-pointer"
              >
                <BiLogOut />
              </button>
            </div>
          </div>
        )}
      </header>
      <MobileNav authUser={authUser} scrollDirection={scrollDirection} />
      {openSidebarMob && !isLg && (
        <div
          onClick={() => setOpenSidebarMob(false)}
          className="fixed top-0 left-0 w-full h-full bg-dark/60 z-30"
        >
          <div className="fixed top-0 left-0 w-2/3 h-full bg-white z-50">
            {/* Head sidebar */}
            {/* <div className="w-full flex flex-col">
              <Link
                to={`/profile/${authUser.username}`}
                style={{
                  backgroundImage: `url(${
                    authUser?.profileImg || "/profile.png"
                  })`,
                }}
                className="w-[40px] h-[40px] bg-center bg-cover rounded-full block"
              ></Link>
              <Link
                to={`/profile/${authUser.username}`}
                className="hover:underline font-bold"
              >
                {authUser?.fullname}
              </Link>
              <Link
                to={`/profile/${authUser.username}`}
                className="text-gray leading-3"
              >
                @{authUser?.username}
              </Link>
              <div className="flex gap-5 my-2">
                <Link
                  to={`/profile/${authUser.username}`}
                  className="font-semibold"
                >
                  {authUser?.followers.length}{" "}
                  <span className="text-gray font-normal">Pengikut</span>
                </Link>
                <Link
                  to={`/profile/${authUser.username}`}
                  className="font-semibold"
                >
                  {authUser?.following.length}{" "}
                  <span className="text-gray font-normal">Mengikuti</span>
                </Link>
              </div>
            </div> */}

            {/* Menu sidebar */}
            <Aside authUser={authUser} logout={logout} />
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
