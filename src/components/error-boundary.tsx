import {
  useRouteError,
  isRouteErrorResponse,
  useNavigate,
} from "react-router-dom"
import { useEffect } from "react"
import { toast } from "sonner"
import { useTranslations } from "next-intl"

export function ErrorBoundary() {
  const t = useTranslations("errorBoundary")
  const error = useRouteError()
  const navigate = useNavigate()

  useEffect(() => {
    if (isRouteErrorResponse(error)) {
      toast.error(t("notFoundOrDenied"))
    } else if (error instanceof Error) {
      toast.error(`${t("errorOccurred")} ${error.message}`)
    } else {
      toast.error(t("unexpectedError"))
    }
    console.log("Error boundary: ", error)
    navigate("/")
  }, [error, navigate, t])

  return null
}
