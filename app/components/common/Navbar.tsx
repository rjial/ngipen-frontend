import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "@remix-run/react";
import { Search } from "lucide-react";

export const NavBar: React.FC = () => (<nav className="flex flex-row w-full justify-between py-4">
  <div className="flex flex-row items-center space-x-4">
    <p className="font-semibold px-6">Ngipen</p>
    <Input type="text" placeholder="Search Ticket...." className="w-96" startIcon={Search} />
  </div>
  <div className="flex flex-row items-center space-x-4">
    <Link to="/">Home</Link>
    <Link to="/">Events</Link>
    <Link to="/">FAQ</Link>
    <Button >Daftar</Button>
  </div>
</nav>);