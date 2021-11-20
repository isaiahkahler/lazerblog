import { useRouter } from 'next/router'
import { useEffect } from 'react'

export default function useRedirect() {
  const router = useRouter()

  const redirect = (fallback: () => void) => {
    // code review: throw error? or log? show in UI?
    if (!router.query) return
    if (router.query.redirect) {
      router.push(`/${router.query.redirect}`)
    } else {
      fallback()
    }
  }

  return redirect
}
