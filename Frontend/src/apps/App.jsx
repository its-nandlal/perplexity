import { RouterProvider } from "react-router";
import { router } from "./app.routes";
import { useEffect } from "react";
import { useAuth } from "../features/auth/hooks/useAuth";
import { Toaster } from 'react-hot-toast'

export default function App() {

  const auth = useAuth()

  useEffect(() => {
    auth.handleGetMe()
  }, [])

  return (
    <main>
      <RouterProvider router={router} />
      <Toaster />
    </main>
  )
}
