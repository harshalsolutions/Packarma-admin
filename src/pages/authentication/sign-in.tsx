/* eslint-disable jsx-a11y/anchor-is-valid */
import { Button, Card, Label } from "flowbite-react";
import type { FC } from "react";

const SignInPage: FC = function () {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center mb-8">
          {/* <img
            alt="Flowbite logo"
            src="https://flowbite.com/docs/images/logo.svg"
            className="h-10 mr-3"
          /> */}
          <span className="text-2xl font-semibold dark:text-white">
            Packarma Admin
          </span>
        </div>
        <Card className="w-full">
          <form className="space-y-6">
            <div className="mb-4 flex flex-col gap-y-3">
              <Label htmlFor="email">Email</Label>
              <input
                className="block w-full border disabled:cursor-not-allowed disabled:opacity-50 bg-gray-50 border-gray-300 text-gray-900 focus:border-lime-500 focus:ring-lime-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-lime-500 dark:focus:ring-lime-500 rounded-lg p-2.5 text-sm"
                id="email"
                name="email"
                placeholder="name@xyz.com"
                type="email"
              />
            </div>
            <div className="mb-6 flex flex-col gap-y-3">
              <Label htmlFor="password">Password</Label>
              <input
                className="block w-full border disabled:cursor-not-allowed disabled:opacity-50 bg-gray-50 border-gray-300 text-gray-900 focus:border-lime-500 focus:ring-lime-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-lime-500 dark:focus:ring-lime-500 rounded-lg p-2.5 text-sm"
                id="password"
                name="password"
                placeholder="••••••••"
                type="password"
              />
            </div>
            <div className="mb-6 w-full flex justify-center items-center">
              <Button
                type="submit"
                className="w-full lg:w-auto bg-lime-500 hover:bg-lime-600 text-black font-semibold"
              >
                Login to your account
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default SignInPage;
