'use client'
import { useSession, signIn, signOut } from "next-auth/react"
import Loader from "../../Loader"

export default function AuthComponent() {
  const { data: session, status } = useSession()

  if (status === "loading") {
    return <Loader /> 
  }

  if (session) {
    return (
      <>
        <p>Signed in as {session.user.email}</p>
        <button 
          className="bg-red-500 text-white p-3 rounded-md px-4 mt-2"
          onClick={() => signOut()}
        >
          Sign out
        </button>
      </>
    )
  }

  return (
    <>
      <p>Not signed in</p>
      <button 
        className="bg-green-500 text-white p-3 rounded-md px-4 mt-2"
        onClick={() => signIn()}
      >
        Sign in
      </button>
    </>
  )
}