import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Textbox from "../components/Textbox";
import Button from "../components/Button";
import { useSelector } from "react-redux";

const Register = () => {
  const { user } = useSelector((state) => state.auth);
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const navigate = useNavigate();

  const submitHandler = async (data) => {
    try {
      const response = await fetch("https://team-task-manager-production-f811.up.railway.app/api/user/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
          title: data.title,
          role: data.role,
          isAdmin: false,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        alert(result.message || "Registration failed!");
        return;
      }

      alert("Account created successfully! Please login.");
      navigate("/log-in");
    } catch (error) {
      alert("Server error! Make sure backend is running.");
      console.log(error);
    }
  };

  useEffect(() => {
    user && navigate("/dashboard");
  }, [user]);

  return (
    <div className='w-full min-h-screen flex items-center justify-center flex-col lg:flex-row bg-[#f3f4f6]'>
      <div className='w-full md:w-auto flex gap-0 md:gap-40 flex-col md:flex-row items-center justify-center'>

        {/* Left side */}
        <div className='h-full w-full lg:w-2/3 flex flex-col items-center justify-center'>
          <div className='w-full md:max-w-lg 2xl:max-w-3xl flex flex-col items-center justify-center gap-5 md:gap-y-10 2xl:-mt-20'>
            <span className='flex gap-1 py-1 px-3 border rounded-full text-sm md:text-base border-gray-300 text-gray-600'>
              Manage all your task in one place!
            </span>
            <p className='flex flex-col gap-0 md:gap-4 text-4xl md:text-6xl 2xl:text-7xl font-black text-center text-blue-700'>
              <span>TeamFlow</span>
              <span>Task Manager</span>
            </p>
            <div className='cell'>
              <div className='circle rotate-in-up-left'></div>
            </div>
          </div>
        </div>

        {/* Right side */}
        <div className='w-full md:w-1/3 p-4 md:p-1 flex flex-col justify-center items-center'>
          <form
            onSubmit={handleSubmit(submitHandler)}
            className='form-container w-full md:w-[400px] flex flex-col gap-y-5 bg-white px-10 pt-10 pb-10'
          >
            <div className=''>
              <p className='text-blue-600 text-3xl font-bold text-center'>
                Create Account
              </p>
              <p className='text-center text-base text-gray-700'>
                Join TeamFlow today!
              </p>
            </div>

            <div className='flex flex-col gap-y-4'>
              <Textbox
                placeholder='Full Name'
                type='text'
                name='name'
                label='Full Name'
                className='w-full rounded-full'
                register={register("name", {
                  required: "Full name is required!",
                })}
                error={errors.name ? errors.name.message : ""}
              />

              <Textbox
                placeholder='email@example.com'
                type='email'
                name='email'
                label='Email Address'
                className='w-full rounded-full'
                register={register("email", {
                  required: "Email is required!",
                })}
                error={errors.email ? errors.email.message : ""}
              />

              <Textbox
                placeholder='Your Title (e.g. Developer)'
                type='text'
                name='title'
                label='Title'
                className='w-full rounded-full'
                register={register("title", {
                  required: "Title is required!",
                })}
                error={errors.title ? errors.title.message : ""}
              />

              <Textbox
                placeholder='Your Role (e.g. Manager)'
                type='text'
                name='role'
                label='Role'
                className='w-full rounded-full'
                register={register("role", {
                  required: "Role is required!",
                })}
                error={errors.role ? errors.role.message : ""}
              />

              <Textbox
                placeholder='Password'
                type='password'
                name='password'
                label='Password'
                className='w-full rounded-full'
                register={register("password", {
                  required: "Password is required!",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
                error={errors.password ? errors.password.message : ""}
              />

              <Button
                type='submit'
                label='Create Account'
                className='w-full h-10 bg-blue-700 text-white rounded-full'
              />

              <p className='text-center text-sm text-gray-600'>
                Already have an account?{" "}
                <span
                  onClick={() => navigate("/log-in")}
                  className='text-blue-600 hover:underline cursor-pointer font-semibold'
                >
                  Login here
                </span>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;