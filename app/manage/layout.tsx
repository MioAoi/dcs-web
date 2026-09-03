import { requireStaffOrRedirect } from "@/lib/auth";

export default async function ManageLayout({ children } : { children: React.ReactNode }) {
    await requireStaffOrRedirect();
    return (
        <>
            {children}
        </>
    );
}
