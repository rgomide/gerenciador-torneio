import Cookies from 'js-cookie'

const AUTH_KEY = 'auth'

const useCookies = () => {
  const getAuthCookie = () => {
    const authCookie = Cookies.get(AUTH_KEY)

    if (authCookie) {
      try {
        return JSON.parse(authCookie)
      } catch {
        return null
      }
    }

    return null
  }

  // TODO: cipher the cookie!!!
  const setAuthCookie = (auth) => {
    Cookies.set(AUTH_KEY, JSON.stringify(auth), {
      expires: 1,
      path: '/',
      secure: import.meta.env.PROD,
      sameSite: 'lax'
    })
  }

  const deleteAuthCookie = () => {
    Cookies.remove(AUTH_KEY, { path: '/' })
  }

  return {
    getAuthCookie,
    setAuthCookie,
    deleteAuthCookie
  }
}

export default useCookies
