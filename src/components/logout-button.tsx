import { useNavigate } from "react-router-dom"
import { logout } from "../http/user"
import { toast } from "sonner"
import { useTranslations } from "next-intl"

export function LogoutButton() {
  const t = useTranslations("common")
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    toast.success(t("logoutSuccess"))
    navigate("/login")
  }

  return (
    <button
      onClick={handleLogout}
      className="p-2 rounded-md bg-zinc-600 text-white font-semibold hover:bg-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-opacity-50 transition-colors"
      aria-label={t("logout")}
    >
      <span className="flex items-center">
        <svg
          className="w-5 h-5 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
          />
        </svg>
        {t("logout")}
      </span>
    </button>
  )
}
