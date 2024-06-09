import React, { useState } from "react";

import v from "/V.svg";
import Form from "../form";
import { FiMail, FiUser } from "react-icons/fi";
import { LuPencilLine } from "react-icons/lu";
import { MdOutlinePassword } from "react-icons/md";
import Input from "../../components/input";
import { Link } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const SignUp = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const queryClient = useQueryClient()

  const {mutate: loginMutation, isError, isPending, error} = useMutation({
    mutationFn: async ({username, password}) => {
      try {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({username, password}),
        })
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Someting went wrong");
        }
        return data;
      } catch (error) {
        toast.error(error.message)
        throw new Error(error)
      }
    },
    onSuccess: () => {
      toast.success("Login successfully");
      queryClient.invalidateQueries({queryKey: ["authUser"]})
    }
  })


  const handleSubmit = (e) => {
    e.preventDefault();
    loginMutation(formData);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
            <Form onSubmit={handleSubmit} formName="Login">
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
                value={formData.username}
              />
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
                value={formData.password}
              />
            </div>
            <button
              type="submit"
              className="py-3 px-4 rounded-xl text-center bg-dark text-white"
            >
              {isPending ? "Loading..." : "Login"}
            </button>
            {isError && <p className='text-red'>{error.message}</p>}
          </Form>
          <div className="w-full flex flex-col gap-2 mt-4">
            <p>Don't have an account?</p>
            <Link to={'/signup'} className="py-3 px-4 rounded-xl text-center bg-white text-dark border border-white-gray hover:bg-dark hover:text-white">Sign up</Link>
          </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SignUp;
