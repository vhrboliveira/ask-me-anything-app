import { Room } from "./room"

export function Rooms() {

  return (
    <ul className="px-0 pb-4 space-y-2.5 list-none">
      {data.rooms.map((room) => (
        <Room key={room.id} id={room.id} name={room.name} />
      ))}
    </ul>
  )
}
