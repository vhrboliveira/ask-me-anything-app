import { setUser } from "../store/userSlice"
import { store } from "../store"

interface UpdateProfileRequest {
  id: string
  name: string
  enablePicture: boolean
}

export interface UserInfo {
  id: string
  email: string
  name: string
  created_at: string
  updated_at: string
  avatar_url: string
  enable_picture: boolean
  new_user: boolean
}

const API_BASE_URL = import.meta.env.VITE_APP_URL

export async function updateProfile({
  id,
  name,
  enablePicture,
}: UpdateProfileRequest): Promise<UserInfo | null> {
  const response = await fetch(`${API_BASE_URL}/api/profile`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_id: id, name, enable_picture: enablePicture }),
    credentials: "include",
  })

  if (response.status === 401) {
    clearUser()
    return null
  }

  if (!response.ok) {
    throw new Error("Failed to update profile")
  }

  const data = await response.json()
  const currentUser = getLoggedInUser()

  if (!currentUser) {
    throw new Error("Failed to get current user")
  }

  currentUser.name = data.name
  currentUser.new_user = data.new_user
  currentUser.enable_picture = data.enable_picture
  currentUser.updated_at = data.updated_at

  localStorage.setItem("user", JSON.stringify(currentUser))
  store.dispatch(setUser(data))
  return data
}

export function loginWithGoogle() {
  window.location.href = `${API_BASE_URL}/auth/google`
}

export function loginWithFacebook() {
  window.location.href = `${API_BASE_URL}/auth/facebook`
}

export function getLoggedInUser(): UserInfo | null {
  const user = localStorage.getItem("user")
  if (user) {
    return JSON.parse(user)
  }
  return null
}

export async function getCurrentUser(): Promise<UserInfo | null> {
  const user = getLoggedInUser()
  if (user) {
    return user
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/user`, {
      credentials: "include",
    })

    if (response.status === 401) {
      clearUser()
      return null
    }

    if (!response.ok) {
      console.error("Failed to fetch current user:", response.statusText)
      return null
    }

    const data = await response.json()
    localStorage.setItem("user", JSON.stringify(data))
    store.dispatch(setUser(data))
    return data
  } catch (error) {
    console.error("Error fetching current user:", error)
    return null
  }
}

export function clearUser() {
  localStorage.removeItem("user")
}

export function logout() {
  clearUser()

  window.location.href = `${API_BASE_URL}/logout`

  return null
}
