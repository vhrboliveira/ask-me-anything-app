import { clearUser } from "./user"

interface CreateMessageRequest {
  roomId: string
  message: string
}

export async function createMessage({ roomId, message }: CreateMessageRequest) {
  const response = await fetch(
    `${import.meta.env.VITE_APP_URL}/api/rooms/${roomId}/messages`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message,
      }),
      credentials: "include",
    }
  )

  if (response.status === 401) {
    clearUser()
    return null
  }

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  const data: { id: string } = await response.json()

  return { messageId: data.id }
}
