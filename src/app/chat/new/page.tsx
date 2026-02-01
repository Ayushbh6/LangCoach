import { randomUUID } from "crypto";
import { redirect } from "next/navigation";

export default function NewChatPage() {
  redirect(`/chat/${randomUUID()}`);
}
