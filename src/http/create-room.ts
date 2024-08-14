interface CreateRoomRequest {
  name: string
}

export async function createRoom({ name }: CreateRoomRequest) {
  const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/rooms`, {
    method: "POST",
    body: JSON.stringify({
      name,
    }),
  })

  const data: { id: string } = await response.json()

  return { roomId: data.id }
}
