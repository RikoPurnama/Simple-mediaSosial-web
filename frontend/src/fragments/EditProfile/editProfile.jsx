import React, { useEffect, useRef, useState } from "react";
import { GoArrowLeft } from "react-icons/go";

import Input from "../../components/input";
import useUpdateUserProfile from "../../hooks/useUpdateUserProfile";

const EditProfile = ({ data }) => {
  const [profileImg, setProfileImg] = useState("");
  const [formData, setFormData] = useState({
    fullname: "",
    username: "",
    bio: "",
    link: "",
  });

  const profileImgRef = useRef(null);

  const handleChangeImg = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
       setProfileImg(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: [e.target.value] });
  };

  const { updateProfile, isUpdatingProfile } = useUpdateUserProfile();
  useEffect(
    () => {
      if (data) {
        setFormData({
          fullname: data.fullname,
          username: data.username,
          bio: data.bio,
          link: data.link,
        });
      }
    },
    [data]
  );
  return (
    <dialog id={`my_modal_5${data._id}`} className="modal modal-bottom sm:modal-middle">
      <div className="w-full max-w-[400px] bg-white p-4 mx-auto border border-white-gray rounded-[25px] relative">
        <form
          method=""
          onSubmit={(e) => {
            e.preventDefault();
            updateProfile(formData);
          }}
          className=""
        >
          {/* if there is a button in form, it will close the modal */}
          <div className="flex flex-col justify-center items-center my-2 mb-4">
            <div className="w-20 h-20 flex justify-center items-center border border-white-gray rounded-full relative overflow-hidden">
              <img
                src={profileImg || data.profileImg || "/profile.png"}
                alt={data.fullname}
                className="absolute bg-center bg-cover"
              />
            </div>
            <input
              type="file"
              accept="image/*"
              hidden
              ref={profileImgRef}
              name="file"
              id="file"
              onChange={(e) => handleChangeImg(e)}
            />
            <span
              className="text-sky-600 cursor-pointer"
              onClick={() => profileImgRef.current.click()}
            >
              Edit foto
            </span>
          </div>
          <div className="flex flex-col gap-2">
            <div className="py-3 px-4 flex gap-4 bg-input border border-white-gray rounded-[20px]">
              <Input
                name="fullname"
                type="text"
                placeholder="Name"
                onChange={handleChange}
                value={formData.fullname}
              />
            </div>
            <div className="py-3 px-4 flex gap-4 bg-input border border-white-gray rounded-[20px]">
              <Input
                name="username"
                type="text"
                placeholder="Username"
                onChange={handleChange}
                value={formData.username}
              />
            </div>
            <div className="py-3 px-4 flex gap-4 bg-input border border-white-gray rounded-[20px]">
              <Input
                name="bio"
                type="bio"
                placeholder="Bio"
                onChange={handleChange}
                value={formData.bio}
              />
            </div>
            <div className="py-3 px-4 flex gap-4 bg-input border border-white-gray rounded-[20px]">
              <Input
                name="link"
                type="link"
                placeholder="Tautan"
                onChange={handleChange}
                value={formData.link}
              />
            </div>
            <button
              type="submit"
              className="py-2 px-3 bg-dark text-white rounded-xl"
              onClick={async () => {
                updateProfile({ profileImg});
                setProfileImg(null)
              }}
            >
              {isUpdatingProfile ? "Updating..." : "Update"}
            </button>
          </div>
        </form>
        <form action="" method="dialog">
          <div className="flex my-2 mb-4">
            <button className="flex gap-2 items-center absolute left-4 top-4">
              <GoArrowLeft className="text-2xl" />
              Edit Profile
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
};

export default EditProfile;
