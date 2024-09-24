import { LocaleType } from "../types"

export function getInitialLocale(): LocaleType {
  const savedLocale = localStorage.getItem("locale") as LocaleType | null

  if (savedLocale) {
    return savedLocale
  }

  const browserLang = navigator.language.toLowerCase()

  if (browserLang.startsWith("pt")) {
    return "pt-BR"
  }

  return "en"
}

export function saveLocale(locale: LocaleType): void {
  localStorage.setItem("locale", locale)
}
