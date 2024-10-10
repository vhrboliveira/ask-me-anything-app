import { ArrowDown, ArrowRight, ArrowUp } from "lucide-react"
import { useTranslations } from "next-intl"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { toast } from "sonner"
import { createMessageAnswer } from "../http/create-message-answer"
import { createMessageReaction } from "../http/create-message-reaction"
import { removeMessageReaction } from "../http/remove-message-reaction"
import { getCurrentUser, UserInfo } from "../http/user"

interface MessageProps {
  id: string
  text: string
  reactionCount: number
  createdAt: string
  userId: string
  answer: string
  answered?: boolean
}

export function Message({
  id: messageId,
  text,
  reactionCount,
  createdAt,
  userId,
  answer = "",
  answered = false,
}: MessageProps) {
  const t = useTranslations("room")
  const [hasReacted, setHasReacted] = useState(false)
  const { roomId } = useParams()
  const [isCreator, setCreator] = useState(false)
  const [currentAnswer, setCurrentAnswer] = useState(answer)
  const [showAnswer, setShowAnswer] = useState(false)
  const [user, setUser] = useState<UserInfo | null>(null)

  useEffect(() => {
    getCurrentUser().then((user) => {
      if (user?.id === userId) {
        setCreator(true)
      }
      setUser(user)
    })
  }, [userId])

  if (!roomId) {
    throw new Error("Messages components must be used within room page")
  }

  async function createMessageReactionAction() {
    if (!roomId || !user) {
      return
    }

    try {
      await createMessageReaction({ messageId, roomId, userId: user.id })
      setHasReacted(true)
    } catch (err) {
      const error = err as Error
      const msg = t("errorReacting") + ": " + error.message
      toast.error(msg)
    }
  }

  async function removeMessageReactionAction() {
    if (!roomId || !user) {
      return
    }

    try {
      await removeMessageReaction({ messageId, roomId, userId: user.id })
      setHasReacted(false)
    } catch (err) {
      const error = err as Error
      const msg = t("errorRemovingReact") + ": " + error.message
      toast.error(msg)
    }
  }

  function handleClickAnswer() {
    setShowAnswer((prevState) => !prevState)
  }

  async function handleAnswer(data: FormData) {
    const answer = data.get("answer")?.toString()

    if (!answer || !roomId) {
      return
    }

    try {
      await createMessageAnswer({
        messageId,
        roomId,
        answer,
        userId,
      })
      setCurrentAnswer(answer)
      toast.info(t("successfullyAnswered"))
    } catch (err) {
      const error = err as Error
      toast.error(t("errorAnsweringMessage") + ": " + error.message)
    }
  }

  return (
    <li
      data-answered={answered}
      className="pb-6 leading-relaxed text-zinc-100 border-b border-b-0.5 border-zinc-700 last:border-none data-[answered=true]:text-amber-300"
    >
      {text}
      <span className="text-xs mt-0.5 flex py-0 font-normal">
        {t("created")}: {new Date(createdAt).toLocaleString()}
      </span>
      {isCreator ? (
        <form
          action={handleAnswer}
          data-answered={answered}
          className="flex items-center gap-2 my-3 bg-zinc-900 p-2 rounded border border-zinc-800 ring-green-400 ring-offset-zinc-950 ring-offset-2 focus-within:ring-1 data-[answered=true]:text-amber-300"
        >
          <textarea
            name="answer"
            placeholder={t("answer")}
            data-answered={answered}
            autoComplete="off"
            className="flex-1 text-sm bg-transparent mx-2 outline-none text-zinc-100 placeholder:text-zinc-500  data-[answered=true]:text-amber-300"
            required
            disabled={answered}
            value={currentAnswer}
            onChange={(e) => {
              setCurrentAnswer(e.target.value)
            }}
            rows={Math.max(1, Math.ceil(currentAnswer.length / 100))}
          />
          <button
            type="submit"
            data-answered={answered}
            className="bg-green-400 data-[answered=true]:hidden text-green-950 px-3 py-1.5 gap-1.5 flex items-center rounded-lg font-medium text-sm transition-colors hover:bg-green-500"
          >
            {t("submit")}
            <ArrowRight className="size-4" />
          </button>
        </form>
      ) : (
        <div
          data-answered={answered}
          className={`my-3 ${!answered ? "hidden" : ""}`}
        >
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              handleClickAnswer()
            }}
            className="mb-2 flex items-center px-3 py-1.5 font-semibold text-sm gap-2 bg-green-400 text-zinc-700 rounded-lg hover:bg-green-500 transition-colors"
          >
            {showAnswer ? t("hideAnswer") : t("clickToSeeAnswer")}
            {showAnswer ? (
              <ArrowUp className="size-4" />
            ) : (
              <ArrowDown className="size-4" />
            )}
          </button>
          {showAnswer && (
            <div className="flex items-center gap-2 my-3 bg-zinc-900 p-2 rounded border border-zinc-800 ring-green-400 ring-offset-zinc-950 ring-offset-2 focus-within:ring-1 data-[answered=true]:text-amber-300">
              <textarea
                name="answer"
                data-answered={answered}
                className="flex-1 text-sm bg-transparent mx-2 outline-none text-zinc-100 placeholder:text-zinc-500  data-[answered=true]:text-amber-300"
                disabled
                value={answer}
                rows={Math.max(1, Math.ceil(answer.length / 50))}
              />
            </div>
          )}
        </div>
      )}
      {hasReacted ? (
        <button
          type="button"
          data-answered={answered}
          onClick={removeMessageReactionAction}
          className="mt-2 flex items-center gap-2 text-green-400 text-sm font-medium hover:text-green-500 data-[answered=true]:text-amber-300 data-[answered=true]:pointer-events-none"
        >
          {answered ? null : <ArrowUp className="size-4" />}
          {t("like")} ({reactionCount})
        </button>
      ) : (
        <button
          type="button"
          data-answered={answered}
          onClick={createMessageReactionAction}
          className="mt-2 flex items-center gap-2 text-zinc-400 text-sm font-medium hover:text-zinc-300 data-[answered=true]:text-amber-300 data-[answered=true]:pointer-events-none"
        >
          {answered ? null : <ArrowUp className="size-4" />}
          {t("like")} ({reactionCount})
        </button>
      )}
    </li>
  )
}
