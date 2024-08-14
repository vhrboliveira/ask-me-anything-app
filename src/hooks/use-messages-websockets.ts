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
      value: { id: string; message: string }
    }
  | {
      kind: MessageKind.MessageAnswered
      value: { id: string }
    }
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
    const ws = new WebSocket(`${import.meta.env.VITE_APP_WS_URL}/${roomId}`)

    ws.onopen = () => {
      console.log("Websocket connected!!!")
    }

    ws.onclose = () => {
      console.log("Websocket disconnected!!!")
    }

    ws.onmessage = (event) => {
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
                    return { ...item, reactionCount: data.value.count }
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
                    return { ...item, answered: true }
                  }

                  return item
                }),
              }
            }
          )

          break
        default:
          break
      }
    }

    return () => {
      ws.close()
    }
  }, [roomId, queryClient])
}