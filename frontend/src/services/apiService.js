import axios from 'axios'
import { getCookie, setCookie } from 'cookies-next'

const baseURL = process.env.NEXT_PUBLIC_API_SERVER

const encodeString = async (string) => {
  const encoder = new TextEncoder()
  const data = encoder.encode(string)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))

  return hashArray.map((byte) => byte.toString(16).padStart(2, '0')).join('')
}

export const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('pt-BR')
}

const exctratErrorMessage = (error) => {
  return (
    error?.response?.data?.message ||
    error?.message ||
    'Erro inesperado, tente novamente mais tarde.'
  )
}

export const auth = async (userName, password) => {
  try {
    const encodedPassword = await encodeString(password)

    const resp = await axios.post(`${baseURL}/auth/login`, {
      userName: userName,
      password: encodedPassword
    })

    if (resp.status === 200) {
      const token = resp.data.token
      setCookie('token', token, { maxAge: 60 * 60 * 24, path: '/', secure: true, httpOnly: false })
      return resp
    } else {
      throw new Error(resp.data.message)
    }


  } catch (e) {
    const message = exctratErrorMessage(e)
    console.error(`Erro ao realizar login: ${e}`)
    return { error: message }
  }
}

export const getInstitutions = async () => {
  try {
    const resp = await axios.get(`${baseURL}/institutions`, {
      headers: {
        Authorization: `Bearer ${getCookie('token')}`
      }
    })

    if (resp.status === 200) {
      return resp.data
    } else {
      throw new Error(resp.data.message)
    }
  } catch (e) {
    const message = exctratErrorMessage(e)
    console.error(`Erro ao obter instituições: ${e}`)
    return { error: message }
  }
}

export const createInstitution = async (name) => {
  try {
    const resp = await axios.post(
      `${baseURL}/institutions`,
      { name },
      {
        headers: { Authorization: `Bearer ${getCookie('token')}` }
      }
    )

    if (resp.status === 201) {
      return resp.data
    } else {
      throw new Error(resp.data.message)
    }
  } catch (e) {
    const message = exctratErrorMessage(e)
    console.error(`Erro ao criar instituição: ${message}`);
    return { error: message }
  }
}

export const updateInstitution = async (id, name) => {
  try {
    const resp = await axios.put(
      `${baseURL}/institutions/${id}`,
      {
        name: name
      },
      {
        headers: {
          Authorization: `Bearer ${getCookie('token')}`
        }
      }
    )

    if (resp.status === 200) {
      return resp.data
    } else {
      throw new Error(resp.data.message)
    }
  } catch (e) {
    const message = exctratErrorMessage(e)
    console.error(`Erro ao criar instituição: ${message}`);
    return { error: message }
  }
}

export const getUnits = async () => {
  try {
    const resp = await axios.get(`${baseURL}/units`, {
      headers: {
        Authorization: `Bearer ${getCookie('token')}`
      }
    })

    if (resp.status === 200) {
      return resp.data
    } else {
      throw new Error(resp.data.message)
    }
  } catch (e) {
    const message = exctratErrorMessage(e)
    console.error(`Erro ao criar instituição: ${message}`);
    return { error: message }
  }
}

export const getUnitsByInstitutionId = async (institutionId) => {
  try {
    const resp = await axios.get(`${baseURL}/institutions/${institutionId}/units`, {
      headers: {
        Authorization: `Bearer ${getCookie('token')}`
      }
    })

    if (resp.status === 200) {
      return resp.data
    } else {
      throw new Error(resp.data.message)
    }
  } catch (e) {
    const message = exctratErrorMessage(e)
    console.error(`Erro ao criar instituição: ${message}`);
    return { error: message }
  }
}

export const createUnit = async (name, institutionId) => {
  try {
    const resp = await axios.post(
      `${baseURL}/units`,
      {
        name,
        institutionId
      },
      {
        headers: { Authorization: `Bearer ${getCookie('token')}` }
      }
    )

    if (resp.status === 201) {
      return resp.data
    } else {
      throw new Error(resp.data.message)
    }
  } catch (e) {
    const message = exctratErrorMessage(e)
    console.error(`Erro ao criar instituição: ${message}`);
    return { error: message }
  }
}

export const updateUnit = async (id, name) => {
  try {
    const resp = await axios.put(
      `${baseURL}/units/${id}`,
      {
        name: name
      },
      {
        headers: {
          Authorization: `Bearer ${getCookie('token')}`
        }
      }
    )

    if (resp.status === 200) {
      return resp.data
    } else {
      throw new Error(resp.data.message)
    }
  } catch (e) {
    const message = exctratErrorMessage(e)
    console.error(`Erro ao criar instituição: ${message}`);
    return { error: message }
  }
}

export const getEvents = async () => {
  try {
    const resp = await axios.get(`${baseURL}/events`, {
      headers: {
        Authorization: `Bearer ${getCookie('token')}`
      }
    })

    if (resp.status === 200) {
      return resp.data
    } else {
      throw new Error(resp.data.message)
    }
  } catch (e) {
    const message = exctratErrorMessage(e)
    console.error(`Erro ao criar instituição: ${message}`);
    return { error: message }
  }
}

export const getEventsByUnitId = async (unitId) => {
  try {
    const resp = await axios.get(`${baseURL}/units/${unitId}/events`, {
      headers: {
        Authorization: `Bearer ${getCookie('token')}`
      }
    })

    if (resp.status === 200) {
      return resp.data
    } else {
      throw new Error(resp.data.message)
    }
  } catch (e) {
    const message = exctratErrorMessage(e)
    console.error(`Erro ao criar instituição: ${message}`);
    return { error: message }
  }
}

export const createEvent = async (name, unitId, startDate, endDate) => {
  try {
    const resp = await axios.post(
      `${baseURL}/events`,
      {
        name,
        unitId,
        startDate,
        endDate
      },
      {
        headers: { Authorization: `Bearer ${getCookie('token')}` }
      }
    )

    if (resp.status === 201) {
      return resp.data
    } else {
      throw new Error(resp.data.message)
    }
  } catch (e) {
    const message = e?.response?.data?.message || e?.message || e
    console.error(message)
    return { error: message }
  }
}

export const updateEvent = async (id, name, unitId, startDate, endDate) => {
  try {
    const resp = await axios.put(
      `${baseURL}/events/${id}`,
      {
        name: name,
        unitId: unitId,
        startDate: startDate,
        endDate: endDate
      },
      {
        headers: {
          Authorization: `Bearer ${getCookie('token')}`
        }
      }
    )

    if (resp.status === 200) {
      return resp.data
    } else {
      throw new Error(resp.data.message)
    }
  } catch (e) {
    const message = exctratErrorMessage(e)
    console.error(`Erro ao criar instituição: ${message}`);
    return { error: message }
  }
}

export const deleteEventById = async (eventId) => {
  try {
    const resp = await axios.delete(`${baseURL}/events/${eventId}`, {
      headers: {
        Authorization: `Bearer ${getCookie('token')}`
      }
    })

    if (resp.status === 204) {
      return { success: true }
    } else {
      throw new Error(resp.data.message)
    }
  } catch (e) {
    const message = e?.response?.data?.message || e?.message || e
    console.error(message)
    return { error: message }
  }
}

export const getTournamentsByEventId = async (eventId) => {
  try {
    const resp = await axios.get(`${baseURL}/events/${eventId}/tournaments`, {
      headers: {
        Authorization: `Bearer ${getCookie('token')}`
      }
    })

    if (resp.status === 200) {
      return resp.data
    }
  } catch (e) {
    const message = exctratErrorMessage(e)
    console.error(`Erro ao criar instituição: ${message}`);
    return { error: message }
  }
}

export const createTournament = async (name, eventId, startDate, endDate) => {
  try {
    const resp = await axios.post(
      `${baseURL}/tournaments`,
      {
        name,
        eventId,
        startDate,
        endDate
      },
      {
        headers: { Authorization: `Bearer ${getCookie('token')}` }
      }
    )

    if (resp.status === 201) {
      return resp.data
    } else {
      throw new Error(resp.data.message)
    }
  } catch (e) {
    const message = exctratErrorMessage(e)
    console.error(`Erro ao criar instituição: ${message}`);
    return { error: message }
  }
}

export const updateTournament = async (id, name, eventId, startDate, endDate) => {
  try {
    const resp = await axios.put(
      `${baseURL}/tournaments/${id}`,
      {
        name: name,
        eventId: eventId,
        startDate: startDate,
        endDate: endDate
      },
      {
        headers: {
          Authorization: `Bearer ${getCookie('token')}`
        }
      }
    )

    if (resp.status === 200) {
      return resp.data
    } else {
      throw new Error(resp.data.message)
    }
  } catch (e) {
    const message = exctratErrorMessage(e)
    console.error(`Erro ao criar instituição: ${message}`);
    return { error: message }
  }
}

export const deleteTournamentById = async (tournamentId) => {
  try {
    const resp = await axios.delete(`${baseURL}/tournaments/${tournamentId}`, {
      headers: {
        Authorization: `Bearer ${getCookie('token')}`
      }
    })

    if (resp.status === 204) {
      return { success: true }
    } else {
      throw new Error(resp.data.message)
    }
  } catch (e) {
    const message = e?.response?.data?.message || e?.message || e
    console.error(message)
    return { error: message }
  }
}
