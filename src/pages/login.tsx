import { useTranslations } from "next-intl"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import {
  getLoggedInUser,
  loginWithFacebook,
  loginWithGoogle,
} from "../http/user"
import Logo from "../components/logo"

export function Login() {
  const t = useTranslations("login")
  const navigate = useNavigate()
  const setProfileError = localStorage.getItem("setProfileError") === "true"

  if (setProfileError) {
    toast.error(t("profileError"))
    localStorage.removeItem("setProfileError")
  }

  useEffect(() => {
    const checkUser = () => {
      try {
        const user = getLoggedInUser()
        if (user) {
          navigate("/")
        }
      } catch (error) {
        console.error("Error checking user:", error)
        toast.error(t("notLoggedIn"))
      }
    }

    checkUser()
  }, [navigate, t])

  async function handleGoogleLogin() {
    try {
      loginWithGoogle()
    } catch (error) {
      console.error("Error logging in with Google:", error)
      toast.error(t("googleLoginFailed"))
    }
  }

  async function handleFacebookLogin() {
    try {
      loginWithFacebook()
    } catch (error) {
      console.error("Error logging in with Facebook:", error)
      toast.error(t("facebookLoginFailed"))
    }
  }

  return (
    <div className="max-w-lg mx-auto mt-10">
      <div className="flex justify-between items-center w-full h-16 mb-4">
        <a href="/#" className="flex-shrink-0 mx-auto">
          <Logo />
        </a>
      </div>
      <h2 className="text-2xl text-center font-bold my-8 text-zinc-100">
        {t("loginTitle")}
      </h2>

      <div className="mt-4 flex flex-col">
        <button
          onClick={handleGoogleLogin}
          className="mb-4 bg-zinc-100 text-zinc-600 py-2 px-4 rounded hover:bg-zinc-300 flex items-center justify-center"
        >
          <img src="/google.svg" alt="Google Icon" className="w-6 h-6" />
          <span className="pl-2 font-semibold text-left">
            {t("loginWithGoogle")}
          </span>
        </button>
        <button
          onClick={handleFacebookLogin}
          className="mb-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-800 flex items-center justify-center"
        >
          <img src="/facebook.svg" alt="Facebook Icon" className="w-6 h-6" />
          <span className="pl-2 font-semibold">{t("loginWithFacebook")}</span>
        </button>
      </div>
    </div>
  )
}
