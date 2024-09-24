import { getCurrentUser, clearUser } from "./user"

interface CreateRoomRequest {
  name: string
  description: string
}

export async function createRoom({ name, description }: CreateRoomRequest) {
  const user = await getCurrentUser()

  if (!user) {
    throw new Error("User not found")
  }

  const response = await fetch(`${import.meta.env.VITE_APP_URL}/api/rooms`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name,
      description,
      user_id: user.id,
    }),
    credentials: "include",
  })

  if (response.status === 401) {
    clearUser()
    return
  }

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  const data: { id: string } = await response.json()

  return { roomId: data.id }
}
