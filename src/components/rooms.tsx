import { useSuspenseQuery } from "@tanstack/react-query"
import { useRoomsWebSockets } from "../hooks/use-rooms-websockets"
import { getRooms } from "../http/get-rooms"
import { Room } from "./room"
import { useTranslations } from "next-intl"

export function Rooms() {
  const t = useTranslations("room")
  const { data } = useSuspenseQuery({
    queryFn: () => getRooms(),
    queryKey: ["rooms"],
    staleTime: 0,
  })

  useRoomsWebSockets()

  return (
    <ul className="space-y-4 list-none p-0">
      {data.rooms.length === 0 ? (
        <li className="text-lg text-gray-500 text-center font-bold">
          {t("noRoomsAvailable")}
        </li>
      ) : (
        data.rooms.map((room) => (
          <Room
            key={room.id}
            id={room.id}
            name={room.name}
            createdAt={room.createdAt}
            user={room.user}
            description={room.description}
          />
        ))
      )}
    </ul>
  )
}
