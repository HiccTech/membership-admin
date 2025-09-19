"use client";
import { api } from "@/auth";
import { useEffect } from "react";

export default function Pet() {
  useEffect(() => {
    api.post("/pets/list", { page: 1 }).then((res) => {
      console.log(res, "create pet res");
    });
  }, []);

  return <div>Pet</div>;
}
