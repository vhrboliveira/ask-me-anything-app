import { clearUser } from "./user"

interface CreateMessageReactionRequest {
  messageId: string
  roomId: string
}

export async function createMessageReaction({
  messageId,
  roomId,
}: CreateMessageReactionRequest) {
  const response = await fetch(
    `${
      import.meta.env.VITE_APP_URL
    }/api/rooms/${roomId}/messages/${messageId}/react`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    }
  )

  if (response.status === 401) {
    clearUser()
    return
  }

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }
}
