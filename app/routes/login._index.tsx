import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { ActionFunctionArgs, LoaderFunctionArgs, json, redirect } from "@remix-run/node";
import { Form, Link, useActionData, useRouteError } from "@remix-run/react";
import { ErrorBoundaryComponent } from "@remix-run/react/dist/routeModules";
import { ArrowLeft } from "lucide-react";
import { useEffect } from "react";
import { LoginRequest, LoginRequestValidation } from "~/data/dto/auth/LoginRequest";
import { RegisterRequestValidation } from "~/data/dto/auth/RegisterRequest";
import { IAuthService } from "~/service/auth/IAuthService.server";
import { createAuthSession, getAuthSession, getAuthToken } from "~/utils/authUtil";

export async function action({request}: ActionFunctionArgs) {
    const formData = await request.formData()
    const authService = new IAuthService()
    // const session = await getAuthSession(request.headers.get("Cookie"))
    const data: LoginRequest = {
        email: formData.get("email")?.toString() as string,
        password: formData.get("password")?.toString() as string
    }
    try {
        const token = await getAuthToken(request)
        console.log(token)
        if (token !== undefined) {
            return redirect("/");
        }
        // const validation = RegisterRequestValidation.parse(data)
        const validation = LoginRequestValidation.safeParse(Object.fromEntries(formData))
        if (!validation.success) return json({error: true, message: "Invalid request", validation: validation.error.format()})
        const res = await authService.login(validation.data)
        if (res.status_code == 200) {
            // @ts-ignore
            const login = await createAuthSession(request, res.data?.token)
            return login
        } else {
            return json({error: true, message: res.message, validation: undefined})
        }
        
    } catch(err) {
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

export default function LoginPage() {
    const res = useActionData<typeof action>()
    const error = useRouteError()
    const {toast} = useToast()
    useEffect(() => {
        if(res != undefined) {
            if (res.error) {
                toast({title: res?.message, variant: "destructive"})
            }
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
                                {res?.validation && res.validation.email && <span className="text-[0.8rem] text-red-400">{res.validation.email._errors[0]}</span>}
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
                                {res?.validation && res.validation.password && <span className="text-[0.8rem] text-red-400">{res.validation.password._errors[0]}</span>}
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