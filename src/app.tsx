import { QueryClientProvider } from "@tanstack/react-query"
import { AbstractIntlMessages, NextIntlClientProvider } from "next-intl"
import { useEffect, useState } from "react"
import { Provider } from "react-redux"
import {
  createBrowserRouter,
  Navigate,
  Outlet,
  RouterProvider,
  useLocation,
} from "react-router-dom"
import { Toaster } from "sonner"
import { CookieBanner } from "./components/cookie-banner"
import { ErrorBoundary } from "./components/error-boundary"
import { Footer } from "./components/footer"
import { LanguageSwitcher } from "./components/language-switcher"
import { ProfileButton } from "./components/profile-button"
import { getCurrentUser } from "./http/user"
import { queryClient } from "./lib/react-query"
import enMessages from "./messages/en.json"
import ptBRMessages from "./messages/pt-BR.json"
import { CreateRoom } from "./pages/create-room"
import { Login } from "./pages/login"
import { Logout } from "./pages/logout"
import { NotFound } from "./pages/not-found"
import { Profile } from "./pages/profile"
import { Room } from "./pages/room"
import { TermsAndPrivacy } from "./pages/terms-and-privacy"
import { store } from "./store"
import { LocaleType } from "./types"
import { getInitialLocale, saveLocale } from "./utils/locale"

const messages: Record<LocaleType, unknown> = {
  en: enMessages,
  "pt-BR": ptBRMessages,
}

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)

  useEffect(() => {
    getCurrentUser().then((user) => {
      setIsAuthenticated(!!user)
    })
  }, [])

  if (isAuthenticated === null) {
    return <div>Loading...</div>
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />
}

const ProfileError = () => {
  localStorage.setItem("setProfileError", "true")

  return <Navigate to="/login" replace />
}

const Layout = ({
  setLocale,
  locale,
}: {
  setLocale: (locale: LocaleType) => void
  locale: LocaleType
}) => {
  const location = useLocation()
  const pagesWithoutProfile = ["/login", "/terms-and-privacy", "/profile"]

  return (
    <div className="flex flex-col min-h-screen bg-zinc-900">
      <div className="px-4 py-3 relative">
        <LanguageSwitcher setLocale={setLocale} currentLocale={locale} />
        {!pagesWithoutProfile.includes(location.pathname) && <ProfileButton />}
      </div>
      <Outlet />
      <Footer />
    </div>
  )
}

const createAppRouter = (
  setLocale: (locale: LocaleType) => void,
  locale: LocaleType
) =>
  createBrowserRouter([
    {
      element: <Layout setLocale={setLocale} locale={locale} />,
      children: [
        {
          path: "/login",
          element: <Login />,
        },
        {
          path: "/logout",
          element: <Logout />,
        },
        {
          path: "/profile",
          element: (
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          ),
        },
        {
          path: "/profile/error",
          element: <ProfileError />,
        },
        {
          path: "/",
          element: (
            <ProtectedRoute>
              <CreateRoom />
            </ProtectedRoute>
          ),
        },
        {
          path: "/room",
          element: <Navigate to="/" />,
        },
        {
          path: "/room/:roomId",
          element: (
            <ProtectedRoute>
              <Room />
            </ProtectedRoute>
          ),
          errorElement: <ErrorBoundary />,
        },
        {
          path: "/terms-and-privacy",
          element: <TermsAndPrivacy />,
        },
        {
          path: "*",
          element: <NotFound />,
        },
      ],
    },
  ])

export function App() {
  const [locale, setLocale] = useState<LocaleType>(getInitialLocale())
  const router = createAppRouter(setLocale, locale)

  useEffect(() => {
    saveLocale(locale)
  }, [locale])

  return (
    <NextIntlClientProvider
      messages={messages[locale] as AbstractIntlMessages}
      locale={locale}
    >
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
          <Toaster invert richColors />
          <CookieBanner />
        </QueryClientProvider>
      </Provider>
    </NextIntlClientProvider>
  )
}
