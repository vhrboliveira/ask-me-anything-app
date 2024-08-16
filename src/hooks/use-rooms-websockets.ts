import { useQueryClient } from "@tanstack/react-query"
import { useEffect } from "react"
import { GetRoomResponse } from "../http/get-rooms"
import { toast } from "sonner"

enum MessageKind {
  MessageKindRoomCreated = "room_created",
}

type WebhookMessage = {
  kind: MessageKind.MessageKindRoomCreated
  value: { id: string; name: string }
}

export function useRoomsWebSockets() {
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
                },
              ],
            }
          })

          toast.info("New room was created!")

          break
        default:
          break
      }
    }

    return () => {
      ws.close()
    }
  }, [queryClient])
}
