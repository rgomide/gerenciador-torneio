// import { useGetCookies, useSetCookie, useDeleteCookie } from 'cookies-next'
import { deleteCookie, getCookie, setCookie } from 'cookies-next'

const useCookies = () => {
  // const getCookie = useGetCookies()
  // const setCookie = useSetCookie()
  // const deleteCookie = useDeleteCookie()

  const getAuthCookie = () => {
    const authCookie = getCookie('auth')

    if (authCookie) {
      const auth = JSON.parse(authCookie)
      return auth
    }

    return null
  }

  // TODO: cipher the cookie!!!
  const setAuthCookie = (auth) => {
    setCookie('auth', JSON.stringify(auth), {
      maxAge: 60 * 60 * 24,
      path: '/',
      secure: true,
      httpOnly: false
    })
  }

  const deleteAuthCookie = () => {
    deleteCookie('auth', { path: '/' })
  }

  return {
    getAuthCookie,
    setAuthCookie,
    deleteAuthCookie
  }
}

export default useCookies
