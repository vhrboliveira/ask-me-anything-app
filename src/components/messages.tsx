import { useSuspenseQuery } from "@tanstack/react-query"
import { useParams } from "react-router-dom"
import { useMessagesWebSockets } from "../hooks/use-messages-websockets"
import { getRoomMessages } from "../http/get-room-messages"
import { Message } from "./message"
import { useTranslations } from "next-intl"

interface MessageProps {
  userId: string
}

export function Messages({ userId }: MessageProps) {
  const t = useTranslations("room")
  const { roomId } = useParams()

  if (!userId) {
    throw new Error("Missing creator user ID")
  }

  if (!roomId) {
    throw new Error("Messages components must be used within room page")
  }

  const { data } = useSuspenseQuery({
    queryFn: () => getRoomMessages({ roomId }),
    queryKey: ["messages", roomId],
    retry: false,
  })

  useMessagesWebSockets({ roomId })

  if (!data || !Array.isArray(data.messages)) {
    return <div>{t("noMessages")}</div>
  }

  const sortedMessages = data.messages.sort((a, b) => {
    return b.reactionCount - a.reactionCount
  })

  return (
    <>
      {sortedMessages.length === 0 ? (
        <div className="text-lg text-gray-500 text-center font-bold">
          {t("noMessages")}
        </div>
      ) : (
        <ol className="list-decimal list-outside px-1 space-y-4">
          {sortedMessages.map((message) => (
            <Message
              key={message.id}
              id={message.id}
              text={message.text}
              reactionCount={message.reactionCount}
              answer={message.answer}
              answered={message.answered}
              createdAt={message.createdAt}
              userId={userId}
            />
          ))}
        </ol>
      )}
    </>
  )
}
