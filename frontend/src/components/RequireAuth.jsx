import useCookies from '@/services/useCookies'
import { Navigate, useLocation } from 'react-router-dom'

export default function RequireAuth({ children }) {
  const { getAuthCookie } = useCookies()
  const location = useLocation()
  const token = getAuthCookie()?.token

  if (!token) {
    return <Navigate to="/" replace state={{ from: location }} />
  }

  return children
}
