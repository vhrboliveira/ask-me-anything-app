import { useSuspenseQuery } from "@tanstack/react-query"
import { Share2, User } from "lucide-react"
import { Suspense } from "react"
import { useParams } from "react-router-dom"
import { toast } from "sonner"
import { CreateMessageForm } from "../components/create-message-form"
import Logo from "../components/logo"
import { LogoutButton } from "../components/logout-button"
import { Messages } from "../components/messages"
import { getRoom } from "../http/get-room"
import { useTranslations } from "next-intl"

export function Room() {
  const t = useTranslations("room")
  const { roomId } = useParams<{ roomId: string }>()

  const { data: room } = useSuspenseQuery({
    queryFn: () => getRoom({ roomId: roomId as string }),
    queryKey: ["room", roomId],
    retry: false,
  })

  function handleShareRoom() {
    const url = window.location.href.toString()

    if (navigator.share !== undefined && navigator.canShare()) {
      navigator.share({ url })
    } else {
      navigator.clipboard.writeText(url)
      toast.info(t("successfullySharedRoom"))
    }
  }

  return (
    <div className="mx-auto max-w-[95%] flex flex-col gap-6 pb-10 px-2">
      <div className="flex flex-col gap-4 bg-zinc-800 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <a href="/#" className="flex-shrink-0">
            <Logo />
          </a>
          <div className="text-md text-zinc-300 truncate flex-1 mx-4">
            <div className="text-xl font-semibold pb-1">{room?.name}</div>
            <div>
              {t("code")}: <span className="font-semibold">{roomId}</span>
            </div>
            <div className="text-zinc-400">
              {t("created")}: {new Date(room?.createdAt ?? "").toLocaleString()}
            </div>
          </div>
          <div>
            <button
              type="button"
              onClick={handleShareRoom}
              className="bg-zinc-700 text-zinc-300 mb-5 px-3 py-1.5 gap-1.5 flex items-center rounded-lg font-medium text-sm transition-colors hover:bg-zinc-600"
            >
              {t("share")}
              <Share2 className="size-4" />
            </button>
            <LogoutButton />
          </div>
        </div>
        <div className="flex items-center gap-4 bg-zinc-700/50 p-4 rounded-lg">
          <div className="flex-shrink-0">
            {room?.creatorPhoto ? (
              <img
                src={`data:image/jpeg;base64,${room?.creatorPhoto}`}
                alt={room?.creatorName}
                className="size-16 rounded-full"
              />
            ) : (
              <User className="size-16 text-zinc-300" />
            )}
          </div>
          <div className="flex-1 flex flex-col gap-2">
            <h2 className="text-xl font-semibold text-zinc-100">
              {room?.creatorName}
            </h2>
            <p className="text-sm text-zinc-300">
              <b>{t("description")}</b>: {room?.description}
            </p>
          </div>
        </div>
      </div>

      <div className="h-px w-full bg-zinc-700" />

      <CreateMessageForm />

      <Suspense fallback={<p>{t("loadingMessages")}</p>}>
        <Messages />
      </Suspense>
    </div>
  )
}
