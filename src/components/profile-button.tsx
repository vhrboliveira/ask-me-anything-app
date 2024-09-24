import { useTranslations } from "next-intl"

export function ProfileButton() {
  const t = useTranslations("common")

  return (
    <div className="relative float-right">
      <a
        href="/profile"
        className="flex items-center space-x-2 font-medium bg-green-700 text-white px-3 py-1 rounded-md hover:bg-green-600 transition-colors text-lg cursor-pointer"
      >
        <span>{t("profile")}</span>
      </a>
    </div>
  )
}
