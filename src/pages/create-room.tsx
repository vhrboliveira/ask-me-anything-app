import { ArrowRight } from "lucide-react"
import { Suspense } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import logoImg from "../assets/icon.svg"
import { Rooms } from "../components/rooms"
import { createRoom } from "../http/create-room"

export function CreateRoom() {
  const navigate = useNavigate()

  async function handleCreateRoom(data: FormData) {
    const name = data.get("name")?.toString()

    if (!name) {
      return
    }

    try {
      const { roomId } = await createRoom({ name })

      navigate(`/room/${roomId}`)
    } catch (error) {
      console.log("Error: ", error)
      toast.error("Error while creating room")
    }
  }

  return (
    <main className="h-screen flex flex-col items-center justify-start px-4 pt-8">
      <div className="max-w-[512px] flex flex-col gap-5">
        <a href="/#" className="h-10 m-auto">
          <img src={logoImg} alt="AMA" className="h-10" />
        </a>
        <p className="leading-relaxed text-zinc-300 text-center">
          Create a public AMA (Ask Me Anything) class, write the questions that
          you want and be happy!
        </p>

        <form
          action={handleCreateRoom}
          className="flex items-center gap-2 bg-zinc-900 p-2 rounded-xl border border-zinc-800 ring-green-400 ring-offset-zinc-950 ring-offset-2 focus-within:ring-1"
        >
          <input
            type="text"
            name="name"
            placeholder="Room name"
            autoComplete="off"
            className="flex-1 text-sm bg-transparent mx-2 outline-none text-zinc-100 placeholder:text-zinc-500"
            required
          />

          <button
            type="submit"
            className="bg-green-400 text-green-950 px-3 py-1.5 gap-1.5 flex items-center rounded-lg font-medium text-sm transition-colors hover:bg-green-500"
          >
            Create Room
            <ArrowRight className="size-4" />
          </button>
        </form>

        <div className="h-px w-full bg-zinc-900" />
        <p className="text-md text-zinc-200 m-auto p-0 font-bold">
          Available Rooms:
        </p>
        <Suspense fallback={<p>Loading...</p>}>
          <Rooms />
        </Suspense>
      </div>
    </main>
  )
}