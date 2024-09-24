import { clearUser } from "./user"

interface GetRoomRequest {
  roomId: string
}

export interface Room {
  id: string
  name: string
  createdAt: string
  creatorName: string
  description: string
  creatorPhoto: string
}

export async function getRoom({
  roomId,
}: GetRoomRequest): Promise<Room | null> {
  const response = await fetch(
    `${import.meta.env.VITE_APP_URL}/api/rooms/${roomId}`,
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
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  const data = await response.json()

  if (!data || typeof data !== "object") {
    throw new Error("Invalid response from server")
  }

  let creatorPhoto = ""
  if (data?.enable_picture) {
    creatorPhoto = data.avatar_url
  }

  return {
    id: data.id,
    name: data.name,
    createdAt: data.created_at,
    creatorName: data.creator_name,
    description: data.description,
    creatorPhoto,
  }
}
