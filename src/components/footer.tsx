import { Link } from "react-router-dom"
import { Github, Linkedin } from "lucide-react"
import InstagramIcon from "@mui/icons-material/Instagram"
import { useTranslations } from "next-intl"

export function Footer() {
  const t = useTranslations("footer")
  return (
    <footer className="bg-zinc-800 text-zinc-300 py-4 mt-auto">
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
        <p>
          &copy;{" "}
          <Link className="hover:text-green-400" to="/">
            2024 Ask Me Anything
          </Link>
          . {t("allRightsReserved")}
        </p>
        <div className="flex items-center space-x-4">
          <Link to="/terms-and-privacy" className="hover:text-green-400">
            {t("termsOfService")} & {t("privacyPolicy")}
          </Link>
          <a
            href="https://github.com/vhrboliveira"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-green-400"
          >
            <Github size={20} />
          </a>
          <a
            href="https://www.linkedin.com/in/vhrb-oliveira"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-green-400"
          >
            <Linkedin size={20} />
          </a>
          <a
            href="https://instagram.com/vhrb.oliveira"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-green-400"
          >
            <InstagramIcon fontSize="small" />
          </a>
        </div>
      </div>
    </footer>
  )
}
