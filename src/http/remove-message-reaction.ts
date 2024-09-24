import { clearUser } from "./user"

interface RemoveMessageReactionRequest {
  messageId: string
  roomId: string
}

export async function removeMessageReaction({
  messageId,
  roomId,
}: RemoveMessageReactionRequest) {
  const response = await fetch(
    `${
      import.meta.env.VITE_APP_URL
    }/api/rooms/${roomId}/messages/${messageId}/react`,
    {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    }
  )

  if (response.status === 401) {
    clearUser()
    return
  }
}
