import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { ActionFunctionArgs, LoaderFunctionArgs, json, redirect } from "@remix-run/node";
import { Form, Link, useActionData, useLoaderData } from "@remix-run/react";
import { useEffect } from "react";
import { RegisterRequest } from "~/data/dto/auth/RegisterRequest";
import { RegisterResponse } from "~/data/dto/auth/RegisterResponse";
import { Response } from "~/data/entity/Response";
import { IAuthService } from "~/service/auth/IAuthService.server";
import { commitSession, getSession } from "~/sessions";
import { getAuthToken } from "~/utils/authUtil";

export async function action({ request }: ActionFunctionArgs) {
    const formData = await request.formData()
    const authService = new IAuthService()
    const session = await getSession(request.headers.get("Cookie"))
    const data: RegisterRequest = {
        name: formData.get("name")?.toString() as string,
        email: formData.get("email")?.toString() as string,
        password: formData.get("password")?.toString() as string,
        hp: formData.get("hp")?.toString() as string,
        address: formData.get("address")?.toString() as string
    }
    try {
        const res = await authService.register(data)
        console.log(res as Response<RegisterResponse>)
        if (res.status_code == 200) {
            return redirect("/login")
            // return json(res)
        } else {
            return json(res)
        }
    } catch (err) {
        // @ts-ignore
        return json({message: err.message})
    }
}

export async function loader({request}: LoaderFunctionArgs) {
    const session = await getAuthToken(request)
    if (session !== undefined) {
        return redirect("/");
    }
    return json({})
}

export default function RegisterPage() {
    const { toast } = useToast()
    const res = useActionData<typeof action>()
    useEffect(() => {
        if (res !== undefined) {
            toast({ title: res.message })
        }
    }, [res])
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 w-screen h-screen">
            <div className="hidden md:block background-event h-screen w-full"></div>
            <div className="flex flex-row items-center">
                <div className="w-full flex flex-col justify-center">
                    <div className="px-10 md:px-36 space-y-6">
                        <div className="flex flex-col space-y-2 text-center">
                            <h1 className="text-2xl font-semibold tracking-tight">Create an account</h1>
                            <p className="text-sm text-muted-foreground">Enter your email below to create your account</p>
                        </div>
                        <Form method="post" className="grid gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    name="name"
                                    placeholder="John Doe"
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    placeholder="m@example.com"
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="password">Password</Label>
                                </div>
                                <Input id="password" type="password" name="password" required />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="nohp">No Handphone</Label>
                                <Input
                                    id="nohp"
                                    type="text"
                                    name="hp"
                                    placeholder="08188888888"
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="address">Alamat</Label>
                                <Input
                                    id="address"
                                    type="text"
                                    name="address"
                                    placeholder="Jl. Kenangan No. 666"
                                    required
                                />
                            </div>
                            <Button type="submit" className="w-full">
                                Register
                            </Button>
                            <Button asChild variant="outline">
                                <Link to="/login">Login</Link>
                            </Button>
                        </Form>
                    </div>
                </div>
            </div>
        </div>
    )
}