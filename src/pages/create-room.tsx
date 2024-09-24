import { ArrowRight } from "lucide-react"
import { Suspense } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { LogoutButton } from "../components/logout-button"
import { Rooms } from "../components/rooms"
import { createRoom } from "../http/create-room"
import Logo from "../components/logo"
import { useTranslations } from "next-intl"

export function CreateRoom() {
  const t = useTranslations("createRoom")
  const navigate = useNavigate()

  async function handleCreateRoom(data: FormData) {
    const name = data.get("name")?.toString()
    const description = data.get("description")?.toString()

    if (!name || !description) {
      return
    }

    try {
      const result = await createRoom({ name, description })

      if (!result?.roomId) {
        throw new Error(t("roomNotCreated"))
      }

      navigate(`/room/${result.roomId}`)
    } catch (error) {
      console.error("Error: ", error)
      toast.error(t("createRoomError"))
    }
  }

  return (
    <main className="flex-grow flex flex-col items-center justify-start px-2 pb-16">
      <div className="max-w-[90%] flex flex-col gap-5">
        <div className="flex justify-between items-center w-full h-16 mb-4">
          <a href="/#" className="flex-shrink-0">
            <Logo />
          </a>
          <LogoutButton />
        </div>
        <p className="leading-relaxed text-zinc-300 text-center font-semibold text-base">
          {t("description")}
        </p>

        <form
          action={handleCreateRoom}
          className="flex flex-col gap-2 bg-zinc-900 p-2 rounded-xl border border-zinc-800"
        >
          <input
            type="text"
            name="name"
            placeholder={t("roomNamePlaceholder")}
            autoComplete="off"
            className="flex-1 text-sm bg-transparent m-2 outline-none text-zinc-100 placeholder:text-zinc-500 p-2 pl-3 rounded focus:ring-1 focus:ring-green-400 focus:ring-offset-zinc-950"
            required
          />
          <textarea
            name="description"
            placeholder={t("roomDescriptionPlaceholder")}
            maxLength={255}
            rows={3}
            autoComplete="off"
            className="flex-1 text-sm bg-transparent mx-2 outline-none text-zinc-100 placeholder:text-zinc-500 p-2 pl-3 rounded focus:ring-1 focus:ring-green-400 focus:ring-offset-zinc-950"
            required
          />

          <button
            type="submit"
            className="mx-2 my-2 bg-green-400 text-green-950 px-4 py-2 gap-1.5 flex items-center rounded-lg font-medium text-sm transition-colors hover:bg-green-500"
          >
            {t("createRoomButton")}
            <ArrowRight className="size-4" />
          </button>
        </form>

        <div className="h-px w-full bg-zinc-900" />
        <p className="text-md text-zinc-200 m-auto p-0 font-bold">
          {t("availableRooms")}
        </p>
        <Suspense fallback={<p>{t("loading")}</p>}>
          <Rooms />
        </Suspense>
      </div>
    </main>
  )
}
