import { useTranslations } from "next-intl"
import { locales } from "../config"
import { useState } from "react"
import { LocaleType } from "../types"

interface LanguageSwitcherProps {
  setLocale: (locale: LocaleType) => void
  currentLocale: LocaleType
}

const flagEmojis: Record<LocaleType, string> = {
  en: "🇺🇸",
  "pt-BR": "🇧🇷",
}

export function LanguageSwitcher({
  setLocale,
  currentLocale,
}: LanguageSwitcherProps) {
  const t = useTranslations("common")
  const [isOpen, setIsOpen] = useState(false)

  const handleLanguageChange = (locale: LocaleType) => {
    setLocale(locale)
    setIsOpen(false)
  }

  return (
    <div className="relative float-left max-h-[100%]">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 bg-zinc-700 text-zinc-300 px-3 py-1 rounded-md hover:bg-zinc-600 transition-colors"
      >
        <span className="text-xl">{flagEmojis[currentLocale]}</span>
        <span>{t(`language.${currentLocale}`)}</span>
      </button>
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-zinc-700 rounded-md shadow-lg">
          {locales.map((locale) => (
            <button
              key={locale}
              onClick={() => handleLanguageChange(locale as LocaleType)}
              className={`flex items-center space-x-2 w-full px-3 py-1 text-left hover:bg-zinc-600 transition-colors ${
                locale === currentLocale ? "bg-zinc-600" : ""
              }`}
            >
              <span className="text-xl">
                {flagEmojis[locale as LocaleType]}
              </span>
              <span>{t(`language.${locale}`)}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
