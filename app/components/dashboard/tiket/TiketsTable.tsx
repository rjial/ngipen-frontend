import { TableHeader, TableRow, TableHead, TableBody, TableCell, Table } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Page } from "~/data/entity/common/Page";
import { Tiket } from "~/data/entity/ticket/Tiket";
import { Event } from "~/data/entity/events/Event";
import { Link } from "@remix-run/react";
import { Ellipsis } from "lucide-react";

const TiketsTable: React.FC<{
    eventRes: Event;
    tiketRes: Page<Tiket>;
    to?: (uuidEvent: string, uuidTiket: string) => string
}> = ({ eventRes, tiketRes, to = (uuidEvent, uuidTiket) => `/dashboard/event/${uuidEvent}/tiket/${uuidTiket}` }) => (<Table className="table-auto">
    <TableHeader>
        <TableRow>
            <TableHead className="">Nama Pemilik</TableHead>
            <TableHead className="">Event</TableHead>
            <TableHead className="">Jenis Tiket</TableHead>
            <TableHead className="">Status</TableHead>
            <TableHead className="">Aksi</TableHead>
        </TableRow>
    </TableHeader>
    <TableBody>
        {tiketRes && tiketRes.content.length > 0 ? tiketRes.content.map((tiketItem) => {
            return (
                <TableRow>
                    <TableCell>
                        <div className="flex items-center">
                            <div className="ml-2 font-medium">{tiketItem.user}</div>
                        </div>
                    </TableCell>
                    <TableCell>{tiketItem.jenisTiket.event}</TableCell>
                    <TableCell>
                        {tiketItem.jenisTiket.nama}
                    </TableCell>
                    <TableCell>
                        {tiketItem.statusTiket ? "Terverifikasi" : "Belum Terverifikasi"}
                    </TableCell>
                    <TableCell>
                        <Button asChild size="icon" variant="outline">
                            <Link to={to(eventRes.uuid, tiketItem.uuid)}>
                                <Ellipsis size={16} />
                                <span className="sr-only">See More</span>
                            </Link>
                        </Button>
                    </TableCell>
                </TableRow>
            )
        }) : <>No Tiket Found</>}
    </TableBody>
</Table>);

export {TiketsTable};