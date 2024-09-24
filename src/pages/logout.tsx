import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { logout } from "../http/user"
import { useTranslations } from "next-intl"

export function Logout() {
  const t = useTranslations("logout")
  const navigate = useNavigate()

  useEffect(() => {
    logout()
    navigate("/login")
  }, [navigate])

  return <div>{t("loggingOut")}</div>
}
