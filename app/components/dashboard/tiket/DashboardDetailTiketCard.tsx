import { Link } from "@remix-run/react";
import { TiketItemListResponse } from "~/data/dto/ticket/TiketItemListResponse";
import { Event } from "~/data/entity/events/Event";
import { Tiket } from "~/data/entity/ticket/Tiket";
import { handleDate } from "~/utils/dateUtil";

const DashboardDetailTiketCard: React.FC<{
    tiket: TiketItemListResponse;
    event?: Event;
}> = ({ tiket, event }) => (<div className="border rounded-lg shadow-sm">
{event && <div className="flex items-center gap-4 p-4 border-b">
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
        <div className="font-medium">{event.name}</div>
        <div className="text-sm text-gray-500 dark:text-gray-400">{event.lokasi}</div>
    </div>
</div>}
<div className="p-4 grid md:grid-cols-3 gap-4">
    <div className="grid gap-1">
        <div className="text-sm text-gray-500 dark:text-gray-400">UUID</div>
        <div className="font-medium">{tiket.uuid}</div>
    </div>
    <div className="grid gap-1">
        <div className="text-sm text-gray-500 dark:text-gray-400">Nama Pemilik Tiket</div>
        <div className="font-medium"><Link to={`/dashboard/user/${tiket.user.uuid}`}>{tiket.user.namaUser}</Link></div>
    </div>
    <div className="grid gap-1">
        <div className="text-sm text-gray-500 dark:text-gray-400">Status Verifikasi</div>
        <div className="font-medium">
            {tiket.statusTiket ? "Terverifikasi" : "Belum Terverifikasi"}
        </div>
    </div>
    <div className="grid gap-1">
        <div className="text-sm text-gray-500 dark:text-gray-400">Jenis Tiket</div>
        <div className="font-medium">{tiket.jenisTiket}</div>
    </div>
    <div className="grid gap-1">
        <div className="text-sm text-gray-500 dark:text-gray-400">Waktu Event</div>
        <div className="font-medium">{handleDate(tiket.date)} ({tiket.waktu_awal} - {tiket.waktu_akhir})</div>
    </div>
    <div className="grid gap-1">
        <div className="text-sm text-gray-500 dark:text-gray-400">Harga Tiket</div>
        <div className="font-medium">Rp {tiket.price}</div>
    </div>
    {event && <div className="grid gap-1">
        <div className="text-sm text-gray-500 dark:text-gray-400">Payment Transaction</div>
        <div className="font-medium"><Link to={`/dashboard/event/${event.uuid}/paymenttransaction/${tiket.paymentTransaction}`}>{tiket.paymentTransaction}</Link></div>
    </div>}
    </div>
</div>);

export default DashboardDetailTiketCard