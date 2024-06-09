import { Navigate, Route, Routes } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import SignUpPage from "./pages/auth/signup/signUpPage";
import LoginPage from "./pages/auth/login/loginPage";
import HomePage from "./pages/home/HomePage";
import Notifications from "./pages/notifications/notifications";
import ProfilePage from "./pages/profile/profilePage";
import RightPanel from "./layouts/page/rightPanel";
import SharedContent from "./layouts/page/sharedContent";
import Header from "./components/header";
import BookmarksPage from "./pages/bookmarks/bookmarksPage";
import LoadingSpinner from "./components/skeletons/LoadingSpinner";
import RoomPage from "./pages/rooms/roomPage";
import DetailPost from "./layouts/page/detailPost";
// import StoryPage from "./pages/createStory/storyPage";



function App() {
  const { pathname } = useLocation()

  const { data: authUser, isLoading } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if (data.error) return null;
        if (!res) {
          throw new Error(data.error || "Someting went wrong");
        }
        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <>
      <div className={`lg:max-h-screen lg:overflow-y-hidden flex px-1 md:px-4 max-w-6xl pb-[60px] ${pathname === "/notifications" ? "pt-0" : "pt-[55px]"} lg:py-0 mx-auto gap-5`}>
        {authUser && <Header />}
        <div className="w-full flex gap-5 lg:overflow-y-scroll scrollbar-thin">
          <Routes>
            <Route
              path="/"
              element={authUser ? <HomePage /> : <Navigate to="/login" />}
            />
            <Route
              path="/login"
              element={!authUser ? <LoginPage /> : <Navigate to="/" />}
            />
            <Route
              path="/signup"
              element={!authUser ? <SignUpPage /> : <Navigate to="/" />}
            />
            <Route
              path="/notifications"
              element={authUser ? <Notifications /> : <Navigate to="/login" />}
            />
            <Route
              path="/bookmarks/:id"
              element={authUser ? <BookmarksPage /> : <Navigate to="/login" />}
            />
            <Route
              path="/profile/:username"
              element={authUser ? <ProfilePage /> : <Navigate to="/login" />}
            />
            <Route
              path="/:username/:id"
              element={authUser ? <SharedContent /> : <Navigate to="/login" />}
            />
            <Route
              path="/room"
              element={authUser ? <RoomPage /> : <Navigate to="/login" />}
            />
            <Route
              path={`/:username/status/:id/photo/1`}
              element={authUser ? <DetailPost /> : <Navigate to="/login" />}
            />
            <Route
              path={`/:username/status/:id`}
              element={authUser ? <DetailPost /> : <Navigate to="/login" />}
            />
          </Routes>
          {authUser && <RightPanel />}
        </div>
        <Toaster />
      </div>
    </>
  );
}

export default App;
