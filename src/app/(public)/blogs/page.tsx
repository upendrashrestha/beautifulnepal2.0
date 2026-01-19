import { redirect } from "next/navigation";

export default function BlogsRedirectPage() {
    redirect("/blogs/page/1");
}