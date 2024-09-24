import { useSuspenseQuery } from "@tanstack/react-query"
import { useParams } from "react-router-dom"
import { useMessagesWebSockets } from "../hooks/use-messages-websockets"
import { getRoomMessages } from "../http/get-room-messages"
import { Message } from "./message"
import { useTranslations } from "next-intl"

export function Messages() {
  const t = useTranslations("room")
  const { roomId } = useParams()

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
        <ol className="list-decimal list-outside px-1 space-y-6">
          {sortedMessages.map((message) => (
            <Message
              key={message.id}
              id={message.id}
              text={message.text}
              reactionCount={message.reactionCount}
              answered={message.answered}
              createdAt={message.createdAt}
            />
          ))}
        </ol>
      )}
    </>
  )
}
