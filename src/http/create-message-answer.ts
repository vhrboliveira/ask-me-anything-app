import { clearUser } from "./user"

interface CreateMessageAnswerRequest {
  messageId: string
  roomId: string
  answer: string
  userId: string
}

export async function createMessageAnswer({
  messageId,
  roomId,
  answer,
  userId,
}: CreateMessageAnswerRequest) {
  const response = await fetch(
    `${
      import.meta.env.VITE_APP_URL
    }/api/rooms/${roomId}/messages/${messageId}/answer`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId, answer: answer }),
      credentials: "include",
    }
  )

  if (response.status === 401) {
    clearUser()
    return
  }

  if (!response.ok || response.status === 500) {
    const error = await response.text()
    if (error) {
      throw new Error(error)
    }

    throw new Error(`HTTP error! status: ${response.status}`)
  }
}
