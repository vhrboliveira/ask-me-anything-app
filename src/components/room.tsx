import { useTranslations } from "next-intl"
import { useNavigate } from "react-router-dom"

interface RoomProps {
  id: string
  name: string
  createdAt: string
  user: string
  description: string
}

export function Room({ id, name, user, description }: RoomProps) {
  const navigate = useNavigate()
  const t = useTranslations("room")

  function navigateToRoom() {
    navigate(`/room/${id}`)
  }

  return (
    <li
      onClick={navigateToRoom}
      className="bg-zinc-800  text-zinc-200 border-l-8 border-r-8 pl-3 border-green-600 rounded-md w-full hover:cursor-pointer hover:bg-zinc-700 transition-colors p-2"
    >
      <h3 className="text-lg font-semibold mb-1">{name}</h3>
      <div className=" text-gray-300 mb-1">
        <span>{t("creator")}:</span> {user}
      </div>
      <p className="text-gray-400 truncate mb-1">
        {t("description")}: {description}
      </p>
      <span className="text-sm text-gray-500 block">
        {t("id")}: {id}
      </span>
    </li>
  )
}
