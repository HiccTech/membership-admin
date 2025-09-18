"use client";

import React, { useState } from "react";
import { Button, Card, Input, message } from "antd";
import Password from "antd/es/input/Password";
import { useRouter } from "next/navigation";
import { login } from "@/auth";

const Login = () => {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const [messageApi, contextHolder] = message.useMessage();

  return (
    <>
      {contextHolder}
      <div className="flex flex-col justify-center items-center h-full">
        <h1 className="text-2xl mb-7 font-bold bg-gradient-to-r from-[#6a51b7] to-pink-400 bg-clip-text text-transparent">
          Hiccpet Membership Admin
        </h1>
        <Card className="w-[500px]">
          <Input
            placeholder="Username"
            size="large"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <Password
            placeholder="Password"
            size="large"
            className="mt-3!"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="primary"
            className="mt-4 w-full"
            size="large"
            loading={isLoading}
            onClick={async () => {
              try {
                setIsLoading(true);
                const res = await login(username, password);
                if (res.data.code === 0) {
                  console.log(res, "res");
                  localStorage.setItem("token", res.data.data.token);
                  messageApi.open({
                    type: "success",
                    content: "Login successful",
                  });
                  setTimeout(() => {
                    router.replace("/pet");
                  }, 500);
                } else {
                  setIsLoading(false);
                  console.log("登录失败:", res.data.message);
                  messageApi.open({
                    type: "error",
                    content: "Invalid username or password",
                  });
                }
              } catch (error) {
                console.log(error);
                setIsLoading(false);
              }
            }}
          >
            Login
          </Button>
        </Card>
      </div>
    </>
  );
};

export default Login;
