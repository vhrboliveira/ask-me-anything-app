import { clearUser } from "./user"

interface CreateMessageReactionRequest {
  messageId: string
  roomId: string
  userId: string
}

export async function createMessageReaction({
  messageId,
  roomId,
  userId,
}: CreateMessageReactionRequest) {
  const response = await fetch(
    `${
      import.meta.env.VITE_APP_URL
    }/api/rooms/${roomId}/messages/${messageId}/react`,
    {
      method: "PATCH",
      body: JSON.stringify({
        user_id: userId,
      }),
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    }
  )

  if (response.status === 401) {
    clearUser()
    return
  }

  if (!response.ok) {
    const error = await response.text()
    if (error) {
      throw new Error(error)
    }
    throw new Error(`HTTP error! status: ${response.status}`)
  }
}
