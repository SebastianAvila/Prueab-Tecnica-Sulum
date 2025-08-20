// pages/index.js
import React, { useState } from "react";
import { useRouter } from "next/router";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault(); // Evita que el form haga submit y recargue

    try {
      const response = await fetch("http://localhost:4000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token); // Guardar token
        router.push("/products"); // Redirigir al CRUD
      } else {
        setError(data.message || "Error en login");
      }
    } catch (err) {
      console.error("Error al conectar al backend:", err);
      setError("Error de conexión");
    }
  };

  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      {" "}
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        {" "}
        <img
          alt="Your Company"
          src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
          className="mx-auto h-10 w-auto dark:hidden"
        />{" "}
        <img
          alt="Your Company"
          src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
          className="mx-auto h-10 w-auto not-dark:hidden"
        />{" "}
        <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900 dark:text-white">
          {" "}
          Sign in to your account{" "}
        </h2>{" "}
      </div>{" "}
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        {" "}
        <form action="#" method="POST" className="space-y-6">
          {" "}
          <div>
            {" "}
            <label
              htmlFor="username"
              className="block text-sm/6 font-medium text-gray-900 dark:text-gray-100"
            >
              {" "}
              username address{" "}
            </label>{" "}
            <div className="mt-2">
              {" "}
              <input
                id="username"
                name="username"
                type="username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:placeholder:text-gray-500 dark:focus:outline-indigo-500"
              />{" "}
            </div>{" "}
          </div>{" "}
          <div>
            {" "}
            <div className="flex items-center justify-between">
              {" "}
              <label
                htmlFor="password"
                className="block text-sm/6 font-medium text-gray-900 dark:text-gray-100"
              >
                {" "}
                Password{" "}
              </label>{" "}
              <div className="text-sm">
                {" "}
                <a
                  href="#"
                  className="font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
                >
                  {" "}
                  Forgot password?{" "}
                </a>{" "}
              </div>{" "}
            </div>{" "}
            <div className="mt-2">
              {" "}
              <input
                id="password"
                name="password"
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                required
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:placeholder:text-gray-500 dark:focus:outline-indigo-500"
              />{" "}
            </div>{" "}
          </div>{" "}
          <div>
            {" "}
            <button
              onClick={handleLogin}
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:bg-indigo-500 dark:shadow-none dark:hover:bg-indigo-400 dark:focus-visible:outline-indigo-500"
            >
              {" "}
              Sign in{" "}
            </button>{" "}
          </div>{" "}
        </form>{" "}
        <p className="mt-10 text-center text-sm/6 text-gray-500 dark:text-gray-400">
          {" "}
          Not a member?{" "}
          <a
            href="#"
            className="font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
          >
            {" "}
            Start a 14 day free trial{" "}
          </a>{" "}
        </p>{" "}
      </div>{" "}
    </div>
  );
}
