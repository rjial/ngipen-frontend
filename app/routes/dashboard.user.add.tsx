import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { ActionFunctionArgs, LoaderFunctionArgs, json, redirect } from "@remix-run/node";
import { Form, Link, NavLink, useActionData, useFetcher, useLoaderData, useLocation } from "@remix-run/react";
import { ArrowLeft, Plus, SearchIcon } from "lucide-react";
import { useEffect } from "react";
import Select from 'react-select';
import { UserCreatedRequest, UserCreatedRequestValidation } from "~/data/dto/user/UserCreatedRequest";
import { UserCreatedResponse } from "~/data/dto/user/UserCreatedResponse";
import { IUserService } from "~/service/user/IUserService";
import { destroySession } from "~/sessions";
import { getAuthSession } from "~/utils/authUtil";

export const loader = async ({ request }: LoaderFunctionArgs) => {
    // try {
    //     const url = new URL(request.url)
    //     const page = Number(url.searchParams.get("page")) || 0
    //     // const size = Number(url.searchParams.get("size")) || 10
    //     const size = 10
    //     const userService = new IUserService()
    //     const res = await userService.getUsers({ page: page, size: size, request: request })
    //     if (res.status_code == 200) {
    //         return json({ error: false, message: res.message, data: res.data })
    //     } else if(res.status_code == 401) {
    //         const session = await getAuthSession(request)
    //         return redirect("/login", {
    //             headers: {
    //                 "Set-Cookie": await destroySession(session)
    //             }
    //         })
    //     } else {
    //         return json({ error: true, message: res.message, data: undefined })
    //     }
    // } catch (err) {
    //     //@ts-ignore
    //     return json({ error: true, message: err.message, data: undefined })
    // }
    return {}
}

export const action = async ({request}: ActionFunctionArgs) => {
    const formData = await request.formData()
    const data = Object.fromEntries(formData)
    try {
        const validation = UserCreatedRequestValidation.safeParse(data)
        if (!validation.success) {
            console.log(validation.error.format())
            return json({error: true, message: "Submit Failed", data: validation.error.format()})
        }
        const userService = new IUserService()
        const payload: UserCreatedRequest = {
            email: validation.data.email,
            name: validation.data.name,
            hp: validation.data.nohp,
            address: validation.data.address,
            level: validation.data.level,
            password: validation.data.password,
        }
        console.log(payload)
        const res = await userService.addUser(payload, request)
        if (res.status_code == 200) {
            return redirect("/dashboard/user")
        } else if (res.status_code == 401) {
            const session = await getAuthSession(request)
            return redirect("/login", {
                headers: {
                    "Set-Cookie": await destroySession(session)
                }
            })
        } else {
            return json({error: true, message: res.message, data: undefined})
        }
    } catch(err) {
        if (err instanceof Error) {
            return json({error: true, message: err.message, data: undefined})
        }
    }

    console.log(data)
    return data
}

const levelSelect: {value: string, label: string}[] = [
    {value: "ADMIN", label: "Administrator"},
    {value: "PEMEGANG_ACARA", label: "Pemegang Acara"},
    {value: "USER", label: "User Biasa"},
]

export default function DashboardAddUserPage() {
    // const data = useLoaderData<typeof loader>()
    const actionData = useActionData<typeof action>()
    const { toast } = useToast()
    useEffect(() => {
        if (actionData != undefined && actionData.error && typeof actionData.message == "string") {
            toast({title: actionData.message, variant: "destructive"})
        }
    }, [actionData])
    return (
        <div className="flex flex-col w-full gap-4">
            <div className="flex items-center justify-between gap-4">
                <div className="flex justify-center items-center space-x-3">
                    <Button asChild size="icon" variant="outline">
                        <Link to={`/dashboard/user/`}>
                            <ArrowLeft size={16} />
                            <span className="sr-only">Back</span>
                        </Link>
                    </Button>
                    <h1 className="text-2xl font-bold">Add User</h1>
                </div>
            </div>
            <div className="border rounded-lg shadow-sm">
                <Form className="p-4 grid gap-4" method="POST">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" name="name" placeholder="Enter name" />
                        {/* {actionData && actionData.error && actionData.data.name && <span className="text-[0.8rem] text-red-400">{actionData.data.name._errors[0]}</span>} */}
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" name="email" placeholder="Enter email" type="email" />
                        {/* {actionData && actionData.error && actionData.data && actionData.data.harga && <span className="text-[0.8rem] text-red-400">{actionData.data.harga._errors[0]}</span>} */}
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="password">Password</Label>
                        <Input id="password" name="password" placeholder="Enter password" type="password" />
                        {/* {actionData && actionData.error && actionData.data && actionData.data.harga && <span className="text-[0.8rem] text-red-400">{actionData.data.harga._errors[0]}</span>} */}
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="nohp">No Hp</Label>
                        <Input id="nohp" name="nohp" placeholder="Enter nohp" type="text" />
                        {/* {actionData && actionData.error && actionData.data && actionData.data.harga && <span className="text-[0.8rem] text-red-400">{actionData.data.harga._errors[0]}</span>} */}
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="address">Address</Label>
                        <Input id="address" name="address" placeholder="Enter address" type="text" />
                        {/* {actionData && actionData.error && actionData.data && actionData.data.harga && <span className="text-[0.8rem] text-red-400">{actionData.data.harga._errors[0]}</span>} */}
                    </div>
                    <div className="grid gap-2">
                        <Label>Level</Label>
                        <select name="level" id="level" className="px-3 py-3 rounded-md border border-input bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1">
                            {levelSelect.map((item, i) => <option value={item.value} key={i}>{item.label}</option>)}
                        </select>
                        {/* <Select name="level" options={levelSelect} /> */}
                            
                        {/* <Select name="level">
                            <SelectTrigger>
                                <SelectValue placeholder="Enter Level"/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value="ADMIN">Administrator</SelectItem>
                                    <SelectItem value="PEMEGANG_ACARA">Pemegang Event</SelectItem>
                                    <SelectItem value="USER">User Biasa</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select> */}
                        {/* {actionData && actionData.error && actionData.data && actionData.data.harga && <span className="text-[0.8rem] text-red-400">{actionData.data.harga._errors[0]}</span>} */}
                    </div>
                    <div className="flex justify-end gap-2">
                        <Button variant="outline">Cancel</Button>
                        <Button type="submit">Save</Button>
                    </div>
                </Form>
            </div>
        </div>
    )
}