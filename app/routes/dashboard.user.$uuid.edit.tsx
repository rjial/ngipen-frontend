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
import { UserUpdatedRequest, UserUpdatedRequestValidation } from "~/data/dto/user/UserUpdatedRequest";
import { UserItem } from "~/data/entity/auth/User";
import { IUserService } from "~/service/user/IUserService";
import { destroySession } from "~/sessions";
import { getAuthSession } from "~/utils/authUtil";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
    try {
        const uuidUser = params.uuid || ""
        const userService = new IUserService()
        const res = await userService.getUser({ uuid: uuidUser, request: request })
        if (res.status_code == 200) {
            return json({ error: false, message: res.message, data: res.data })
        } else if(res.status_code == 401) {
            const session = await getAuthSession(request)
            return redirect("/login", {
                headers: {
                    "Set-Cookie": await destroySession(session)
                }
            })
        } else {
            return json({ error: true, message: res.message, data: undefined })
        }
    } catch (err) {
        //@ts-ignore
        return json({ error: true, message: err.message, data: undefined })
    }
}

export const action = async ({request, params}: ActionFunctionArgs) => {
    const formData = await request.formData()
    const data = Object.fromEntries(formData)
    try {
        const uuidUser = params.uuid || ""
        const validation = UserUpdatedRequestValidation.safeParse(data)
        if (!validation.success) {
            console.log(validation.error.format())
            return json({error: true, message: "Submit Failed", data: validation.error.format()})
        }
        const userService = new IUserService()
        const payload: UserUpdatedRequest = {
            email: validation.data.email,
            name: validation.data.name,
            hp: validation.data.nohp,
            address: validation.data.address,
            level: validation.data.level,
            password: data.password.toString(),
        }
        console.log(payload)
        // return json({error: true, message: payload.name, data: payload})
        const res = await userService.editUser({data: payload, uuid: uuidUser}, request)
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
    const {data, error, message} = useLoaderData<typeof loader>()
    const actionData = useActionData<typeof action>()
    const { toast } = useToast()
    const userData: UserItem | undefined = data as UserItem || undefined
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
                        <Link to={`/dashboard/user/${userData.uuid}`}>
                            <ArrowLeft size={16} />
                            <span className="sr-only">Back</span>
                        </Link>
                    </Button>
                    <h1 className="text-2xl font-bold">Edit User</h1>
                </div>
            </div>
            <div className="border rounded-lg shadow-sm">
                <Form className="p-4 grid gap-4" method="POST">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" name="name" placeholder="Enter name" value={userData.name} />
                        {/* {actionData && actionData.error && actionData.data.name && <span className="text-[0.8rem] text-red-400">{actionData.data.name._errors[0]}</span>} */}
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" name="email" placeholder="Enter email" type="email" value={userData.email}/>
                        {/* {actionData && actionData.error && actionData.data && actionData.data.harga && <span className="text-[0.8rem] text-red-400">{actionData.data.harga._errors[0]}</span>} */}
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="password">Password</Label>
                        <Input id="password" name="password" placeholder="Enter password" type="password" />
                        {/* {actionData && actionData.error && actionData.data && actionData.data.harga && <span className="text-[0.8rem] text-red-400">{actionData.data.harga._errors[0]}</span>} */}
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="nohp">No Hp</Label>
                        <Input id="nohp" name="nohp" placeholder="Enter nohp" type="text" value={userData.hp} />
                        {/* {actionData && actionData.error && actionData.data && actionData.data.harga && <span className="text-[0.8rem] text-red-400">{actionData.data.harga._errors[0]}</span>} */}
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="address">Address</Label>
                        <Input id="address" name="address" placeholder="Enter address" type="text" value={userData.address} />
                        {/* {actionData && actionData.error && actionData.data && actionData.data.harga && <span className="text-[0.8rem] text-red-400">{actionData.data.harga._errors[0]}</span>} */}
                    </div>
                    <div className="grid gap-2">
                        <Label>Level</Label>
                        <select name="level" id="level" className="px-3 py-3 rounded-md border border-input bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1">
                            {levelSelect.map((item, i) => <option value={item.value} selected={item.value == userData.level} key={i}>{item.label}</option>)}
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