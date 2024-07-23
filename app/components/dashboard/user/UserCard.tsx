import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserItem } from "~/data/entity/auth/User";
import { ArrowLeft, CalendarDaysIcon, Pencil, PencilIcon, SearchIcon, Trash, UserPlusIcon } from "lucide-react";
import { levelName } from "~/utils/levelUtil";


export const UserDetailCard: React.FC<{
    dataRes: UserItem | undefined;
}> = ({ dataRes }) => (<div className="border rounded-lg shadow-sm">
    <div className="flex items-center gap-4 p-4 border-b">
        <img
            alt="Avatar"
            className="rounded-full"
            height="48"
            src="https://source.unsplash.com/U7HLzMO4SIY"
            style={{
                aspectRatio: "48/48",
                objectFit: "cover",
            }}
            width="48"
        />
        <div>
            <div className="font-medium">{dataRes?.name}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">{dataRes?.email}</div>
        </div>
    </div>
    <div className="p-4 grid gap-4">
        <div className="grid gap-1">
            <div className="text-sm text-gray-500 dark:text-gray-400">Email</div>
            <div className="font-medium">{dataRes?.email}</div>
        </div>
        <div className="grid gap-1">
            <div className="text-sm text-gray-500 dark:text-gray-400">Role</div>
            <div className="font-medium">{levelName(dataRes?.level || "")}</div>
        </div>
        <div className="grid gap-1">
            <div className="text-sm text-gray-500 dark:text-gray-400">Status</div>
            <div>
                <Badge>Active</Badge>
            </div>
        </div>
        <div className="grid gap-1">
            <div className="text-sm text-gray-500 dark:text-gray-400">Last Login</div>
            <div className="font-medium">2023-04-25 10:30 AM</div>
        </div>
        <div className="grid gap-1">
            <div className="text-sm text-gray-500 dark:text-gray-400">Created At</div>
            <div className="font-medium">2022-06-15 03:45 PM</div>
        </div>
    </div>
</div>);

export const UserSideCard: React.FC = () => (<div className="grid gap-4">
    <Card>
        <CardHeader>
            <CardTitle>Activity</CardTitle>
        </CardHeader>
        <CardContent>
            <div className="grid gap-4">
                <div className="flex items-center gap-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                        <CalendarDaysIcon className="h-5 w-5" />
                    </div>
                    <div>
                        <div className="font-medium">Logged in</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">2023-04-25 10:30 AM</div>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400">
                        <UserPlusIcon className="h-5 w-5" />
                    </div>
                    <div>
                        <div className="font-medium">Account created</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">2022-06-15 03:45 PM</div>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400">
                        <PencilIcon className="h-5 w-5" />
                    </div>
                    <div>
                        <div className="font-medium">Profile updated</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">2023-03-10 04:20 PM</div>
                    </div>
                </div>
            </div>
        </CardContent>
    </Card>
    <Card>
        <CardHeader>
            <CardTitle>Permissions</CardTitle>
        </CardHeader>
        <CardContent>
            <div className="grid gap-4">
                <div className="flex items-center justify-between">
                    <div className="font-medium">Admin</div>
                    <Badge>Full Access</Badge>
                </div>
                <div className="flex items-center justify-between">
                    <div className="font-medium">User</div>
                    <Badge variant="outline">Read-Only</Badge>
                </div>
            </div>
        </CardContent>
    </Card>
</div>);

export const UserCard: React.FC<{
    dataRes: UserItem | undefined;
}> = ({ dataRes }) => (<div className="grid gap-6">
            <UserDetailCard dataRes={dataRes} />
            {/* <UserSideCard /> */}
</div>);