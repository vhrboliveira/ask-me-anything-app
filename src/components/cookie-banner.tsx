import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { useTranslations } from "next-intl"

export function CookieBanner() {
  const t = useTranslations("cookieBanner")
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const hasSeenBanner = localStorage.getItem("hasSeenCookieBanner")
    if (!hasSeenBanner) {
      setIsVisible(true)
    }
  }, [])

  const handleClose = () => {
    setIsVisible(false)
    localStorage.setItem("hasSeenCookieBanner", "true")
  }

  if (!isVisible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-zinc-800 p-4 shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <p className="text-sm text-zinc-300">
          {t("description")}
          <a
            href="/terms-and-privacy"
            className="text-green-400 hover:underline"
          >
            {t("termsOfServiceAndPrivacyPolicy")}
          </a>
        </p>
        <button
          onClick={handleClose}
          className="text-zinc-400 hover:text-zinc-200"
        >
          <X size={24} />
        </button>
      </div>
    </div>
  )
}
