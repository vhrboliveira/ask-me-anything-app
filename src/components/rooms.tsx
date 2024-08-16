import { useSuspenseQuery } from "@tanstack/react-query"
import { useRoomsWebSockets } from "../hooks/use-rooms-websockets"
import { getRooms } from "../http/get-rooms"
import { Room } from "./room"

export function Rooms() {
  const { data } = useSuspenseQuery({
    queryFn: () => getRooms(),
    queryKey: ["rooms"],
    staleTime: 0,
  })

  useRoomsWebSockets()

  return (
    <ul className="px-0 pb-4 space-y-2.5 list-none">
      {data.rooms.map((room) => (
        <Room key={room.id} id={room.id} name={room.name} />
      ))}
    </ul>
  )
}
