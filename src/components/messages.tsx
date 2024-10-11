import { useSuspenseQuery } from "@tanstack/react-query"
import { useParams } from "react-router-dom"
import { useMessagesWebSockets } from "../hooks/use-messages-websockets"
import { getRoomMessages } from "../http/get-room-messages"
import { Message } from "./message"
import { useTranslations } from "next-intl"
import { useState, useEffect } from "react"
import { UserInfo, getCurrentUser } from "../http/user"
import { getRoomMessagesReactions } from "../http/get-room-messages-reactions"

interface MessageProps {
  userId: string
}

export function Messages({ userId }: MessageProps) {
  const t = useTranslations("room")
  const { roomId } = useParams()
  const [user, setUser] = useState<UserInfo | null>(null)

  useEffect(() => {
    getCurrentUser().then((user) => {
      setUser(user)
    })
  }, [])

  if (!userId) {
    throw new Error("Missing creator user ID")
  }

  if (!roomId) {
    throw new Error("Messages components must be used within room page")
  }

  const { data: messagesData } = useSuspenseQuery({
    queryFn: () => getRoomMessages({ roomId }),
    queryKey: ["messages", roomId],
    retry: false,
  })

  const { data: reactionsData } = useSuspenseQuery({
    queryFn: () => {
      if (!user) {
        return { ids: [] }
      }
      return getRoomMessagesReactions({ roomId, userId: user.id! })
    },
    queryKey: ["messages_reactions", roomId, user?.id],
    retry: false,
  })

  useMessagesWebSockets({ roomId })

  if (!messagesData || !Array.isArray(messagesData.messages)) {
    return <div>{t("noMessages")}</div>
  }

  const sortedMessages = messagesData.messages
    .sort((a, b) => {
      return b.reactionCount - a.reactionCount
    })
    .map((message) => {
      return {
        ...message,
        userHasReacted: reactionsData?.ids.includes(message.id) || false,
      }
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
              creatorUserId={userId}
              userHasReacted={message.userHasReacted}
              userId={user?.id ?? ""}
            />
          ))}
        </ol>
      )}
    </>
  )
}
