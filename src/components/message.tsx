import { ArrowUp } from "lucide-react"
import { useState } from "react"
import { useParams } from "react-router-dom"
import { createMessageReaction } from "../http/create-message-reaction"
import { toast } from "sonner"
import { removeMessageReaction } from "../http/remove-message-reaction"
import { useTranslations } from "next-intl"

interface MessageProps {
  id: string
  text: string
  reactionCount: number
  createdAt: string
  answered?: boolean
}

export function Message({
  id: messageId,
  text,
  reactionCount,
  createdAt,
  answered = false,
}: MessageProps) {
  const t = useTranslations("room")
  const [hasReacted, setHasReacted] = useState(false)
  const { roomId } = useParams()

  if (!roomId) {
    throw new Error("Messages components must be used within room page")
  }

  async function createMessageReactionAction() {
    if (!roomId) {
      return
    }

    try {
      await createMessageReaction({ messageId, roomId })
    } catch (error) {
      console.error("Error creating message reaction: ", error)
      toast.error(t("errorReacting"))
    }

    setHasReacted(true)
  }

  async function removeMessageReactionAction() {
    if (!roomId) {
      return
    }

    try {
      await removeMessageReaction({ messageId, roomId })
    } catch (error) {
      console.error("Error removing message reaction: ", error)
      toast.error(t("errorRemovingReact"))
    }

    setHasReacted(false)
  }

  return (
    <li
      data-answered={answered}
      className="ml-4 leading-relaxed text-zinc-100 data-[answered=true]:opacity-50 data-[answered=true]:pointer-events-none"
    >
      {text}
      <span className="text-xs mt-0.5 flex py-0 font-normal">
        {t("created")}: ({new Date(createdAt).toLocaleString()})
      </span>
      {hasReacted ? (
        <button
          type="button"
          onClick={removeMessageReactionAction}
          className="mt-2 flex items-center gap-2 text-green-400 text-sm font-medium hover:text-green-500"
        >
          <ArrowUp className="size-4" />
          {t("like")} ({reactionCount})
        </button>
      ) : (
        <button
          type="button"
          onClick={createMessageReactionAction}
          className="mt-2 flex items-center gap-2 text-zinc-400 text-sm font-medium hover:text-zinc-300"
        >
          <ArrowUp className="size-4" />
          {t("like")} ({reactionCount})
        </button>
      )}
    </li>
  )
}
