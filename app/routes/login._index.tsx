import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { ActionFunctionArgs, json, redirect } from "@remix-run/node";
import { Form, Link, useActionData } from "@remix-run/react";
import { useEffect } from "react";
import { IAuthService } from "~/service/auth/IAuthService.server";
import { getSession } from "~/sessions";

export async function action({request}: ActionFunctionArgs) {
    const formData = await request.formData()
    const authService = new IAuthService()
    const session = await getSession(request.headers.get("Cookie"))
    const res = await authService.login(formData.get("email")?.toString() as string, formData.get("password")?.toString() as string)
    // console.log(res)
    if(session.has("jwtToken")) {
        return redirect("/")
    }

    
    return json(res);
}

export default function LoginPage() {
    const res = useActionData<typeof action>()
    const {toast} = useToast()
    useEffect(() => {
        if(res != undefined) {
            if (res.statusCode == 200) {
                toast({title: res?.message})
            } else {
                toast({title: res?.message, variant: "destructive"})
            }
        }
    }, [res])
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 w-screen h-screen">
            <div className="hidden md:block background-event h-screen w-full"></div>
            <div className="flex flex-row items-center">
                <div className="w-full flex flex-col justify-center">
                    <div className="px-10 md:px-36 space-y-6">
                        <div className="flex flex-col space-y-2 text-center">
                            <h1 className="text-2xl font-semibold tracking-tight">Login an account</h1>
                            <p className="text-sm text-muted-foreground">Enter your email below to login your account</p>
                        </div>
                        <Form method="post" className="grid gap-4">
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
                                    <Link
                                        to="/forgot-password"
                                        className="ml-auto inline-block text-sm underline"
                                    >
                                        Forgot your password?
                                    </Link>
                                </div>
                                <Input id="password" type="password" name="password" required />
                            </div>
                            <Button type="submit" className="w-full">
                                Login
                            </Button>
                        </Form>
                    </div>
                </div>
            </div>
        </div>
    )
}