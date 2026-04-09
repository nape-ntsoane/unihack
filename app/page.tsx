import { redirect } from "next/navigation";

// Root redirects now directly to /games for a feed-first experience
export default function Home() {
  redirect("/games");
}
