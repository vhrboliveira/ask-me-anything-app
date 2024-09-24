import { useQueryClient } from "@tanstack/react-query"
import { useTranslations } from "next-intl"
import { useEffect } from "react"
import { toast } from "sonner"
import { GetRoomResponse } from "../http/get-rooms"

enum MessageKind {
  MessageKindRoomCreated = "room_created",
}

type WebhookMessage = {
  kind: MessageKind.MessageKindRoomCreated
  value: {
    id: string
    name: string
    created_at: string
    creator_name: string
    description: string
  }
}

export function useRoomsWebSockets() {
  const t = useTranslations("createRoom")
  const queryClient = useQueryClient()

  useEffect(() => {
    const ws = new WebSocket(`${import.meta.env.VITE_APP_WS_URL}`)

    ws.onopen = () => {
      console.log("Rooms Websocket connected!!!")
    }

    ws.onclose = () => {
      console.log("Rooms Websocket disconnected!!!")
    }

    ws.onmessage = (event) => {
      const data: WebhookMessage = JSON.parse(event.data)

      switch (data.kind) {
        case MessageKind.MessageKindRoomCreated:
          queryClient.setQueryData<GetRoomResponse>(["rooms"], (state) => {
            return {
              rooms: [
                ...(state?.rooms ?? []),
                {
                  id: data.value.id,
                  name: data.value.name,
                  createdAt: data.value.created_at,
                  user: data.value.creator_name,
                  description: data.value.description,
                },
              ],
            }
          })

          toast.info(t("createRoomSuccess"))

          break
        default:
          break
      }
    }

    return () => {
      ws.close()
    }
  }, [queryClient, t])
}
