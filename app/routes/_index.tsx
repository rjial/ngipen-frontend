import { Button } from "@/components/ui/button";
import { json, type LoaderFunctionArgs, type MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { LoginRequest } from "~/data/dto/auth/LoginRequest";
import { Response } from "~/data/entity/Response";
import { LoginResponse } from "~/data/entity/auth/LoginResponse";
import { AuthService } from "~/service/auth/LoginService";

export const meta: MetaFunction = () => {
  return [
    { title: "Ngipen" },
    { name: "description", content: "Welcome to Ngipen!" },
  ];
};

export default function Index() {
  return (
    <div className="px-24">
      <div className="flex flex-row w-full justify-between">
        <div>
          <p>Ngipen</p>
        </div>
        <div>
          <Button >Daftar</Button>
        </div>
      </div>
    </div>
  );
}
