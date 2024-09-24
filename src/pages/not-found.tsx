import { useNavigate } from "react-router-dom"

export function NotFound() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-900 text-zinc-100">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="text-2xl mb-8">Oops! Page not found</p>
      <button
        onClick={() => navigate("/")}
        className="bg-green-700 text-white px-4 py-3 rounded-lg font-medium text-lg transition-colors hover:bg-green-600"
      >
        Go to Home
      </button>
    </div>
  )
}
