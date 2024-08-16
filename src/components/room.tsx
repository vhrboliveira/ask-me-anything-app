import { useNavigate } from "react-router-dom"

interface RoomProps {
  id: string
  name: string
}

export function Room({ name, id }: RoomProps) {
  const navigate = useNavigate()

  async function navigateToRoom(roomId: string) {
    navigate(`/room/${roomId}`)
  }

  return (
    <li onClick={() => navigateToRoom(id)} className="truncate bg-zinc-800 text-zinc-200 border-l-8 pl-3 border-green-600 rounded-md w-full hover:cursor-pointer leading-relaxed hover:bg-zinc-700 transition-colors">
      <b>Name:</b> {name}
      <br />
      <span className="float-right py-2 px-4 text-xs text-gray-300 font-thin">
        Room ID: ({id})
      </span>
    </li>
  )
}
