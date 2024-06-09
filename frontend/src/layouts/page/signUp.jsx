import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { FiMail, FiUser } from "react-icons/fi";
import { LuPencilLine } from "react-icons/lu";
import { MdOutlinePassword } from "react-icons/md";
import { Link } from "react-router-dom";

import Input from "../../components/input";
import v from "/V.svg";
import Form from "../form";

const SignUp = () => {
  const [fromData, setFormData] = useState({
    email: "",
    username: "",
    fullname: "",
    password: "",
  });

  const queryClient = useQueryClient()

  const { mutate, isError, isPending, error } = useMutation({
    mutationFn: async ({email, username, fullname, password}) => {
      try {
        const res = await fetch("/api/auth/signup", {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            email,
            username,
            fullname,
            password,
          }),
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Failed to create account");
        }

        return data;

      } catch (error) {
        toast.error(error.message);
        throw new Error(error);
      }
    },
    onSuccess: () => {
      toast.success("Account created successfully");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutate(fromData);
  };

  const handleChange = (e) => {
    setFormData({ ...fromData, [e.target.name]: e.target.value });
  };

  return (
    <section className="w-full h-screen px-4 lg:px-[120px] py-10 flex items-center">
      <div className="w-full flex items-center justify-center">
        <div className="w-full md:w-1/2 hidden md:block">
          <div
            style={{ backgroundImage: `url(${v})` }}
            className="w-[100%] h-[400px] bg-cover bg-center"
          ></div>
        </div>
        <div className="w-full md:w-1/2 flex justify-center">
          <div className="w-full min-w-[370px] max-w-[400px] py-10 px-5 border border-white-gray rounded-[25px]">
            <Form onSubmit={handleSubmit} formName="Sign Up">
              <div className="py-3 px-4 flex gap-4 bg-input border border-white-gray rounded-[20px]">
                <label
                  htmlFor="email"
                  className="text-gray flex justify-center items-center"
                >
                  <FiMail />
                </label>
                <Input
                  name="email"
                  type="email"
                  placeholder="Email"
                  onChange={handleChange}
                  value={fromData.email}
                />
              </div>
              <div className="flex gap-4 md:flex-col">
                <div className="py-3 px-4 flex gap-4 bg-input border border-white-gray rounded-[20px]">
                  <label
                    htmlFor="username"
                    className="text-gray flex justify-center items-center"
                  >
                    <FiUser />
                  </label>
                  <Input
                    name="username"
                    type="text"
                    placeholder="Username"
                    onChange={handleChange}
                    value={fromData.username}
                  />
                </div>
                <div className="py-3 px-4 flex gap-4 bg-input border border-white-gray rounded-[20px]">
                  <label
                    htmlFor="fullname"
                    className="text-gray flex justify-center items-center"
                  >
                    <LuPencilLine />
                  </label>
                  <Input
                    name="fullname"
                    type="text"
                    placeholder="Fullname"
                    onChange={handleChange}
                    value={fromData.fullname}
                  />
                </div>
              </div>

              <div className="py-3 px-4 flex gap-4 bg-input border border-white-gray rounded-[20px]">
                <label
                  htmlFor="password"
                  className="text-gray flex justify-center items-center"
                >
                  <MdOutlinePassword />
                </label>
                <Input
                  name="password"
                  type="password"
                  placeholder="Password"
                  onChange={handleChange}
                  value={fromData.password}
                />
              </div>
              <button
                type="submit"
                className="py-3 px-4 rounded-xl text-center bg-dark text-white"
              >
               {isPending ? "Loading..." : "Sign Up"}
              </button>
              {isError && <p className="text-red">{error.message}</p>}
            </Form>
            <div className="w-full flex flex-col gap-2 mt-4">
              <p>Already have an account?</p>
              <Link
                to={"/login"}
                className="py-3 px-4 rounded-xl text-center bg-white text-dark border border-white-gray hover:bg-dark hover:text-white"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SignUp;
