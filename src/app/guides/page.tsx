// app/blogs/page.tsx
import { redirect } from "next/navigation";

export default function GuidesRedirectPage() {
    redirect("/guides/page/1");
}