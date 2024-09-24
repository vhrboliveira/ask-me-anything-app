import { ArrowRight } from "lucide-react"
import { useParams } from "react-router-dom"
import { toast } from "sonner"
import { createMessage } from "../http/create-message"
import { useTranslations } from "next-intl"

export function CreateMessageForm() {
  const t = useTranslations("room")
  const { roomId } = useParams()

  if (!roomId) {
    throw new Error("Messages components must be used within room page")
  }

  async function createMessageAction(data: FormData) {
    const message = data.get("message")?.toString()

    if (!message || !roomId) {
      return
    }

    try {
      await createMessage({ message, roomId })
    } catch (error) {
      console.error("Error creating message: ", error)
      toast.error(t("errorCreatingMessage"))
    }
  }

  return (
    <form
      action={createMessageAction}
      className="flex items-center gap-2 bg-zinc-900 p-2 rounded-xl border border-zinc-800 ring-green-400 ring-offset-zinc-950 ring-offset-2 focus-within:ring-1"
    >
      <input
        type="text"
        name="message"
        placeholder={t("questionPlaceholder")}
        autoComplete="off"
        className="flex-1 text-sm bg-transparent mx-2 outline-none text-zinc-100 placeholder:text-zinc-500"
        required
      />

      <button
        type="submit"
        className="bg-green-400 text-green-950 px-3 py-1.5 gap-1.5 flex items-center rounded-lg font-medium text-sm transition-colors hover:bg-green-500"
      >
        {t("createQuestion")}
        <ArrowRight className="size-4" />
      </button>
    </form>
  )
}
