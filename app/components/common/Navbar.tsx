import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Link, useOutletContext } from "@remix-run/react";
import { Search } from "lucide-react";
import { UserClaim } from "~/data/entity/auth/UserClaim";
import { Separator } from "@/components/ui/separator";

export const NavBar: React.FC = () => {
  const {user} = useOutletContext<{user: UserClaim | undefined}>()
  return (<nav className="flex flex-row w-full justify-between py-4">
    <div className="flex flex-row items-center space-x-4">
      <p className="font-semibold px-6">Ngipen</p>
      <Input type="text" placeholder="Search Ticket...." className="w-96" startIcon={Search} />
    </div>
    <div className="flex flex-row items-center space-x-4">
      <Link to="/">Home</Link>
      <Link to="/">Events</Link>
      <Link to="/">FAQ</Link>
      <Separator orientation="vertical" />
      {
        user === undefined ? (<>
          <Button asChild variant="outline">
            <Link to="/login">Masuk</Link>
          </Button>
          <Button asChild>
            <Link to="/register">Daftar</Link>
          </Button>
        </>) : (
          <DropdownMenu>
            <DropdownMenuTrigger>{user.data.name}</DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <Link to="/"><DropdownMenuItem>Profile</DropdownMenuItem></Link>
              <Link to="/logout"><DropdownMenuItem>Logout</DropdownMenuItem></Link>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      }

    </div>
  </nav>);

}