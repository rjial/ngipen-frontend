import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Link, useOutletContext } from "@remix-run/react";
import { Search, ShoppingCart } from "lucide-react";
import { UserClaim } from "~/data/entity/auth/UserClaim";
import { Separator } from "@/components/ui/separator";

export const NavbarUser: React.FC<{
  user: UserClaim | undefined;
  side?: "top" | "right" | "bottom" | "left" | undefined
}> = ({ user, side = "bottom" }) => (<DropdownMenu>
  <DropdownMenuTrigger><Button variant="link">{user?.data.name}</Button></DropdownMenuTrigger>
  <DropdownMenuContent side={side}>
    <DropdownMenuLabel>My Account</DropdownMenuLabel>
    <DropdownMenuSeparator />
    <Link to="/"><DropdownMenuItem>Profile</DropdownMenuItem></Link>
    <Link to="/payment-transaction"><DropdownMenuItem>Payment Transaction</DropdownMenuItem></Link>
    <Link to="/tiket"><DropdownMenuItem>Ticket</DropdownMenuItem></Link>
    {user && (user.data.level == "ADMIN" || user.data.level == "PEMEGANG_ACARA") ? <Link to="/dashboard"><DropdownMenuItem>Dashboard</DropdownMenuItem></Link> : ""}
    <Link to="/logout"><DropdownMenuItem>Logout</DropdownMenuItem></Link>
  </DropdownMenuContent>
</DropdownMenu>);

export const NavBar: React.FC = () => {
  const {user, checkoutCount} = useOutletContext<{user: UserClaim | undefined, checkoutCount: number}>()
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
          <div className="flex space-x-2 items-center">
            <div className="relative">
              {checkoutCount > 0 ? <div className="absolute top-0 right-0 text-xs leading-none rounded-full py-1 px-1.5 bg-black text-white translate-x-1 -translate-y-1">{checkoutCount}</div> : <></>}
              <Link to="/checkout"><ShoppingCart size={28}/></Link>
            </div>
            <NavbarUser user={user} />
          </div>
        )
      }

    </div>
  </nav>);

}