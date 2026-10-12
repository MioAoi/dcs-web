import { redirect } from "next/dist/client/components/navigation";

export default async function RedirectPage({ searchParams }: { searchParams: Promise<{ url: string }>}) {
    const { url } = await searchParams;
    if (url) {
        redirect(url);
    }
    return null;
}
