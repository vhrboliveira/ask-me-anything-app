export interface GetRoomResponse {
  rooms: {
    id: string
    name: string
  }[]
}

export async function getRooms(): Promise<GetRoomResponse> {
  const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/rooms/`)

  const data: Array<{ id: string; name: string }> = await response.json()

  return {
    rooms: data.map((item) => {
      return { id: item.id, name: item.name }
    }),
  }
}
