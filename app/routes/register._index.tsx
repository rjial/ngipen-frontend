import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { ActionFunctionArgs, LoaderFunctionArgs, json, redirect } from "@remix-run/node";
import { Form, Link, useActionData, useLoaderData } from "@remix-run/react";
import { ArrowLeft } from "lucide-react";
import { useEffect } from "react";
import { RegisterRequest, RegisterRequestValidation } from "~/data/dto/auth/RegisterRequest";
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
        const validation = await RegisterRequestValidation.safeParse(Object.fromEntries(formData))
        if (!validation.success) return json({error: true, message: "Invalid request", validation: validation.error.format()})
        const res = await authService.register(validation.data)
        if (res.status_code == 200) {
            return redirect("/login")
            // return json(res)
        } else {
            return json({error: true, message: res.message, validation: undefined})
        }
    } catch (err) {
        // @ts-ignore
        return json({error: true, message: err.message, validation: undefined})
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
            if (res.error) toast({ title: res.message, variant: "destructive" })
        }
    }, [res])
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 w-screen h-screen">
            <div className="hidden md:block background-event h-screen w-full"></div>
            <div className="flex relative flex-row items-center">
                <div className="absolute top-8 left-8">
                    <Link to="/" className="flex flex-row space-x-4 hover:border-b hover:border-black py-2"><ArrowLeft /><span className="hidden md:block"> Back To Home</span></Link>
                </div>
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
                                {res?.validation && res.validation.name && <span className="text-[0.8rem] text-red-400">{res.validation.name._errors[0]}</span>}
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
                                {res?.validation && res.validation.email && <span className="text-[0.8rem] text-red-400">{res.validation.email._errors[0]}</span>}
                            </div>
                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="password">Password</Label>
                                </div>
                                <Input id="password" type="password" name="password" required />
                                {res?.validation && res.validation.password && <span className="text-[0.8rem] text-red-400">{res.validation.password._errors[0]}</span>}
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
                                {res?.validation && res.validation.hp && <span className="text-[0.8rem] text-red-400">{res.validation.hp._errors[0]}</span>}
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
                                {res?.validation && res.validation.address && <span className="text-[0.8rem] text-red-400">{res.validation.address._errors[0]}</span>}
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