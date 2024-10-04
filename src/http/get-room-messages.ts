import { clearUser } from "./user"

interface GetRoomMessagesRequest {
  roomId: string
}

export interface GetRoomMessagesResponse {
  messages: {
    id: string
    text: string
    reactionCount: number
    answered: boolean
    answer: string
    createdAt: string
  }[]
}

export async function getRoomMessages({
  roomId,
}: GetRoomMessagesRequest): Promise<GetRoomMessagesResponse | null> {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_APP_URL}/api/rooms/${roomId}/messages`,
      {
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      }
    )

    if (response.status === 401) {
      clearUser()
      return null
    }

    if (!response.ok) {
      if (response.status === 400) {
        throw new Error(`Bad Request: ${await response.text()}`)
      }
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data: Array<{
      id: string
      room_id: string
      message: string
      reaction_count: number
      answered: boolean
      answer: string
      created_at: string
    }> = await response.json()

    return {
      messages: data.map((item) => {
        return {
          id: item.id,
          text: item.message,
          reactionCount: item.reaction_count,
          answered: item.answered,
          answer: item.answer,
          createdAt: item.created_at,
        }
      }),
    }
  } catch (error) {
    console.error("Error fetching room messages:", error)
    throw error
  }
}
