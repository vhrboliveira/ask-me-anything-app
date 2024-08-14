import { useSuspenseQuery } from "@tanstack/react-query"
import { useParams } from "react-router-dom"
import { getRoomMessages } from "../http/get-room-messages"
import { Message } from "./message"
import { useMessagesWebSockets } from "../hooks/use-messages-websockets"

export function Messages() {
  const { roomId } = useParams()

  if (!roomId) {
    throw new Error("Messages components must be used within room page")
  }

  const { data } = useSuspenseQuery({
    queryFn: () => getRoomMessages({ roomId }),
    queryKey: ["messages", roomId],
  })

  useMessagesWebSockets({ roomId })

  const sortedMessages = data.messages.sort((a, b) => {
    return b.reactionCount - a.reactionCount
  })

  return (
    <ol className="list-decimal list-outside px-3 space-y-8">
      {sortedMessages.map((message) => {
        return (
          <Message
            key={message.id}
            id={message.id}
            text={message.text}
            reactionCount={message.reactionCount}
            answered={message.answered}
          />
        )
      })}
    </ol>
  )
}
