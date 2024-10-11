import { clearUser } from "./user"

interface GetRoomMessagesReactionsRequest {
  roomId: string
  userId: string
}

export interface GetRoomMessagesReactionsResponse {
  ids: Array<string>
}

export async function getRoomMessagesReactions({
  roomId,
  userId,
}: GetRoomMessagesReactionsRequest): Promise<GetRoomMessagesReactionsResponse | null> {
  try {
    const response = await fetch(
      `${
        import.meta.env.VITE_APP_URL
      }/api/rooms/${roomId}/reactions?user_id=${userId}`,
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

    const data: {
      ids: Array<string>
    } = await response.json()

    return data
  } catch (error) {
    console.error("Error fetching room messages reactions:", error)
    throw error
  }
}
