import { ArrowRight } from "lucide-react"
import { useNavigate } from "react-router-dom"
import logoImg from "../assets/icon.svg"
import { createRoom } from "../http/create-room"
import { toast } from "sonner"

export function CreateRoom() {
  const navigate = useNavigate()

  async function handleCreateRoom(data: FormData) {
    const name = data.get("name")?.toString()

    if (!name) {
      return
    }

    try {
      const { roomId } = await createRoom({name})
      
      navigate(`/room/${roomId}`)
    } catch (error) {
      console.log("Error: ", error)
      toast.error("Error while creating room")
    }

  }

  return (
    <main className="h-screen flex items-center justify-center px-4">
      <div className="max-w-[450px] flex flex-col gap-6">
        <a href="/#" className="h-10 m-auto">
          <img src={logoImg} alt="AMA" className="h-10" />
        </a>
        <p className="leading-relaxed text-zinc-300 text-center">
          Create a public AMA (Ask Me Anything) class, write the questions that you want and be happy!
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

          <button type="submit" className="bg-green-400 text-green-950 px-3 py-1.5 gap-1.5 flex items-center rounded-lg font-medium text-sm transition-colors hover:bg-green-500">
            Create Room
            <ArrowRight className="size-4" />
          </button>
        </form>
      </div>
    </main>
  )
}