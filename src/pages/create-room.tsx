import { ArrowRight } from "lucide-react"
import { useNavigate } from "react-router-dom"
import logoImg from "../assets/icon.svg"

export function CreateRoom() {
  const navigate = useNavigate()

  function handleCreateRoom(data: FormData) {
    const name = data.get("name")?.toString()

    navigate(`/room/${name}`)
  }

  return (
    <main className="h-screen flex items-center justify-center px-4">
      <div className="max-w-[450px] flex flex-col gap-6">
        <img src={logoImg} alt="AMA" className="h-10" />
        <p className="leading-relaxed text-zinc-300 text-center">
          Create a public AMA (Ask Me Anything) class, write the questions that you want and be happy!
        </p>

        <form 
          action={handleCreateRoom}
          className="flex items-center gap-2 bg-zinc-900 p-2 rounded-xl border border-zinc-800 ring-orange-400 ring-offset-zinc-950 ring-offset-2 focus-within:ring-1"
        >
          <input
            type="text"
            name="name"
            placeholder="Room name" 
            autoComplete="off"
            className="flex-1 text-sm bg-transparent mx-2 outline-none text-zinc-100 placeholder:text-zinc-500"
            />

          <button type="submit" className="bg-orange-400 text-orange-950 px-3 py-1.5 gap-1.5 flex items-center rounded-lg font-medium text-sm transition-colors hover:bg-orange-500">
            Create Room
            <ArrowRight className="size-4" />
          </button>
        </form>
      </div>
    </main>
  )
}