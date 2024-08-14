import { ArrowUp } from "lucide-react"
import { useState } from "react"
import { useParams } from "react-router-dom"
import { createMessageReaction } from "../http/create-message-reaction"
import { toast } from "sonner"
import { removeMessageReaction } from "../http/remove-message-reaction"

interface MessageProps {
  id: string
  text: string
  reactionCount: number
  answered?: boolean
}

export function Message({
  id: messageId,
  text,
  reactionCount,
  answered = false,
}: MessageProps) {
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
      toast.error("Unable to like the message")
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
      toast.error("Unable to remove the like from message.")
    }

    setHasReacted(false)
  }

  return (
    <li
      data-answered={answered}
      className="ml-4 leading-relaxed text-zinc-100 data-[answered=true]:opacity-50 data-[answered=true]:pointer-events-none"
    >
      {text}
      {hasReacted ? (
        <button
          type="button"
          onClick={removeMessageReactionAction}
          className="mt-3 flex items-center gap-2 text-green-400 text-sm font-medium hover:text-green-500"
        >
          <ArrowUp className="size-4" />
          Like ({reactionCount})
        </button>
      ) : (
        <button
          type="button"
          onClick={createMessageReactionAction}
          className="mt-3 flex items-center gap-2 text-zinc-400 text-sm font-medium hover:text-zinc-300"
        >
          <ArrowUp className="size-4" />
          Like ({reactionCount})
        </button>
      )}
    </li>
  )
}
