import { useQueryClient } from "@tanstack/react-query"
import { useEffect } from "react"
import { GetRoomMessagesResponse } from "../http/get-room-messages"

enum MessageKind {
  MessageCreated = "message_created",
  MessageReactionAdded = "message_reaction_added",
  MessageReactionRemoved = "message_reaction_removed",
  MessageAnswered = "message_answered",
}

type WebhookMessage =
  | {
      kind: MessageKind.MessageCreated
      value: { id: string; message: string; created_at: string }
    }
  | { kind: MessageKind.MessageAnswered; value: { id: string; answer: string } }
  | {
      kind: MessageKind.MessageReactionAdded
      value: { id: string; count: number }
    }
  | {
      kind: MessageKind.MessageReactionRemoved
      value: { id: string; count: number }
    }

interface UseMessagesWebSocketsParams {
  roomId: string
}

export function useMessagesWebSockets({ roomId }: UseMessagesWebSocketsParams) {
  const queryClient = useQueryClient()

  useEffect(() => {
    const ws = new WebSocket(
      `${import.meta.env.VITE_APP_WS_URL}/room/${roomId}`
    )

    ws.onopen = () => {
      console.log("Websocket connected!!!")
    }

    ws.onclose = () => {
      console.log("Websocket disconnected!!!")
    }

    ws.onmessage = (event) => {
      try {
        const data: WebhookMessage = JSON.parse(event.data)

        switch (data.kind) {
          case MessageKind.MessageCreated:
            queryClient.setQueryData<GetRoomMessagesResponse>(
              ["messages", roomId],
              (state) => {
                return {
                  messages: [
                    ...(state?.messages ?? []),
                    {
                      id: data.value.id,
                      text: data.value.message,
                      reactionCount: 0,
                      answered: false,
                      answer: "",
                      createdAt: new Date(data.value.created_at).toISOString(),
                    },
                  ],
                }
              }
            )

            break

          case MessageKind.MessageReactionAdded:
          case MessageKind.MessageReactionRemoved:
            queryClient.setQueryData<GetRoomMessagesResponse>(
              ["messages", roomId],
              (state) => {
                if (!state) {
                  return undefined
                }

                return {
                  messages: state.messages.map((item) => {
                    if (item.id === data.value.id) {
                      return {
                        ...item,
                        createdAt: item.createdAt,
                        reactionCount: data.value.count,
                      }
                    }

                    return item
                  }),
                }
              }
            )

            break
          case MessageKind.MessageAnswered:
            queryClient.setQueryData<GetRoomMessagesResponse>(
              ["messages", roomId],
              (state) => {
                if (!state) {
                  return undefined
                }

                return {
                  messages: state.messages.map((item) => {
                    if (item.id === data.value.id) {
                      return {
                        ...item,
                        answered: true,
                        answer: data.value.answer,
                      }
                    }

                    return item
                  }),
                }
              }
            )

            break
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error)
        console.log("Raw message data:", event.data)
      }
    }

    return () => {
      ws.close()
    }
  }, [roomId, queryClient])
}
