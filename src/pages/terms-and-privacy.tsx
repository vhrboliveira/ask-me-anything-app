import { Link } from "react-router-dom"
import { useTranslations } from "next-intl"

export function TermsAndPrivacy() {
  const t = useTranslations("termsAndPrivacy")
  return (
    <div className="max-w-3xl mx-auto py-12 px-4 bg-zinc-900">
      <h1 className="text-3xl font-bold mb-8 text-zinc-100">
        {t("termsOfService")} & {t("privacyPolicy")}
      </h1>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4 text-zinc-200">
          {t("termsOfService")}
        </h2>
        <p className="text-zinc-300 mb-4">{t("termsOfServiceDescription")}</p>
        <ul className="list-disc list-inside text-zinc-300 mb-4">
          {(t.raw("termsOfServiceList") as string[]).map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4 text-zinc-200">
          {t("privacyPolicy")}
        </h2>
        {(t.raw("privacyPolicyDescription") as string[]).map((item, index) => (
          <p key={index} className="text-zinc-300 mb-4">
            {item}
          </p>
        ))}
        <ul className="list-disc list-inside text-zinc-300 mb-4">
          {(t.raw("privacyPolicyList") as string[]).map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
        {(t.raw("privacyPolicyAdditional") as string[]).map((item, index) => (
          <p key={index} className="text-zinc-300 mb-4">
            {item}
          </p>
        ))}
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4 text-zinc-200">
          {t("dataDeletion")}
        </h2>
        <p className="text-zinc-300 mb-4">{t("dataDeletionDescription")}</p>
      </section>

      <Link to="/" className="text-green-400 hover:underline">
        {t("backToHome")}
      </Link>
    </div>
  )
}
