
import { useNavigate } from "react-router-dom";
import DeviceTable from "../components/devices/DeviceTable";

export default function DeviceListing() {
    const navigate = useNavigate();

    const handleEdit = (device) => {
        console.log("Edit device:", device);
    };

    const handleView = (device) => {
        console.log("View device:", device);
    };

    const handleLogs = (device) => {
        navigate(`/it-management/devices/${device.id}/logs`);
    };

    return (
        <div className="min-h-screen bg-page px-4 pb-8 pt-20 sm:px-6 lg:px-8 lg:pt-8">
            <header className="mb-6">
                <div className="mb-2 flex items-center gap-2 text-xs font-medium text-neutral-500">
                    <span>Trigvent</span>
                    <span>/</span>
                    <span>IT Management</span>
                    <span>/</span>
                    <span className="text-brand-teal">Devices</span>
                </div>

                <h1 className="text-2xl font-semibold tracking-tight text-brand-navy sm:text-3xl">
                    Device Management
                </h1>

                <p className="mt-2 text-sm text-neutral-500">
                    Manage and monitor your organization's IT inventory.
                </p>
            </header>

            <section className="rounded-2xl border border-border-default/80 bg-white p-5 shadow-sm sm:p-6">
                <DeviceTable
                    onEdit={handleEdit}
                    onView={handleView}
                    onLogs={handleLogs}
                />
            </section>
        </div>
    );
}
