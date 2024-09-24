import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { updateProfile, getCurrentUser, UserInfo } from "../http/user"
import { useTranslations } from "next-intl"
import { useEffect, useState } from "react"
import Logo from "../components/logo"
import { LogoutButton } from "../components/logout-button"

export function Profile() {
  const t = useTranslations("profile")
  const navigate = useNavigate()
  const [user, setUser] = useState<UserInfo | undefined>(undefined)

  useEffect(() => {
    getCurrentUser().then((user) => {
      if (user) {
        setUser(user)
      }
    })
  }, [])

  async function handleSubmit(data: FormData) {
    const id = data.get("id")?.toString()
    const name = data.get("name")?.toString()
    const enablePicture = data.get("useAccountPhoto")?.toString() === "on"

    if (!id || !name) {
      toast.error(t("requiredFields"))
      return
    }

    try {
      await updateProfile({ id, name, enablePicture })

      toast.success(t("profileUpdated"))
      navigate("/")
    } catch (error) {
      console.error("Error updating profile:", error)
      toast.error(t("profileUpdateError"))
    }
  }

  return (
    <div className="max-w-4xl mb-10 mx-auto">
      <div className="flex mx-auto justify-between items-center w-full h-16 mb-10">
        <a href="/#" className="flex-shrink-0">
          <Logo />
        </a>
        <LogoutButton />
      </div>

      <h2 className="text-4xl text-center font-bold mb-2 text-zinc-100">
        {t("profile")}
      </h2>
      <form action={handleSubmit} className="space-y-4">
        <input type="hidden" name="id" value={user?.id} />
        <input
          type="email"
          name="email"
          placeholder={t("emailPlaceholder")}
          disabled
          className="w-full p-3 bg-zinc-800 text-zinc-500 rounded cursor-not-allowed"
          value={user?.email}
        />
        <input
          type="text"
          name="name"
          placeholder={t("namePlaceholder")}
          required
          className="w-full bg-zinc-800 outline-none text-zinc-100 placeholder:text-zinc-500 p-3 rounded focus:ring-1 focus:ring-green-400 focus:ring-offset-zinc-950"
          value={user?.name}
          onChange={(e) =>
            setUser((prev) => (prev ? { ...prev, name: e.target.value } : prev))
          }
        />
        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            name="useAccountPhoto"
            className="mr-2"
            defaultChecked={user?.enable_picture}
          />
          {t("useAccountPhoto")}
        </label>
        <button
          type="submit"
          className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600"
        >
          {t("saveButton")}
        </button>
      </form>
    </div>
  )
}
