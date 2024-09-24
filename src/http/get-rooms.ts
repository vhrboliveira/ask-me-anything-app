import { clearUser } from "./user"

export interface GetRoomResponse {
  rooms: {
    id: string
    name: string
    createdAt: string
    user: string
    description: string
  }[]
}

export async function getRooms(): Promise<GetRoomResponse> {
  const response = await fetch(`${import.meta.env.VITE_APP_URL}/api/rooms`, {
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  })

  if (response.status === 401) {
    clearUser()
    return { rooms: [] }
  }

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  let data: {
    id: string
    name: string
    created_at: string
    creator_name: string
    description: string
  }[]
  try {
    data = await response.json()
  } catch (e) {
    console.error("Failed to parse JSON:", response, e)
    throw new Error("Invalid JSON response from server")
  }

  if (!Array.isArray(data)) {
    console.error("Unexpected data structure:", data)
    throw new Error("Unexpected data structure from server")
  }

  return {
    rooms: data.map((item) => {
      return {
        id: item.id,
        name: item.name,
        createdAt: item.created_at,
        user: item.creator_name,
        description: item.description,
      }
    }),
  }
}
