import axios from 'axios'
import { useState } from 'react'
import useCookies from './useCookies'

const GET = 'get'
const POST = 'post'
const PUT = 'put'
const DELETE = 'delete'

const useApi = () => {
  const BASE_URL = process.env.NEXT_PUBLIC_API_SERVER
  const [isLoading, setIsLoading] = useState(false)
  const { getAuthCookie } = useCookies()

  const auth = async (userName, password) => {
    const url = 'auth/login'
    const payload = { userName, password }
    return makeRequest(url, POST, payload)
  }

  const getUsers = async () => {
    const url = 'users'
    return makeRequest(url, GET)
  }

  const getUser = async (userId) => {
    const url = `users/${userId}`
    return makeRequest(url, GET)
  }

  const createMatch = async (match) => {
    const url = 'matches'
    return makeRequest(url, POST, match)
  }

  const updateMatch = async (matchId, match) => {
    const url = `matches/${matchId}`
    return makeRequest(url, PUT, match)
  }

  const getRequestLogs = async () => {
    const url = 'request-logs'
    return makeRequest(url, GET)
  }

  const deleteUserById = async (userId) => {
    const url = `users/${userId}`
    return makeRequest(url, DELETE)
  }

  const getInstitutions = async () => {
    const url = 'institutions'
    return makeRequest(url, GET)
  }

  const getUnfinishedEvents = async () => {
    const url = 'events/unfinished'
    return makeRequest(url, GET)
  }

  const getUnits = async (query) => {
    const url = 'units'
    return makeRequest(url, GET, query)
  }

  const createUser = async (userName, firstName, lastName, email, password) => {
    const url = 'users'
    const payload = { userName, firstName, lastName, email, password }
    return makeRequest(url, POST, payload)
  }

  const updateUser = async (id, userName, firstName, lastName, email, password) => {
    const url = `users/${id}`
    const payload = { userName, firstName, lastName, email, password }
    return makeRequest(url, PUT, payload)
  }

  const createUnit = async (name, institutionId) => {
    const url = 'units'
    const payload = { name, institutionId }
    return makeRequest(url, POST, payload)
  }

  const updateUnit = async (id, name, institutionId) => {
    const url = `units/${id}`
    const payload = { name, institutionId }
    return makeRequest(url, PUT, payload)
  }

  const getUnitsByInstitutionId = async (institutionId) => {
    const url = `institutions/${institutionId}/units`
    return makeRequest(url, GET)
  }

  const getTournamentById = async (tournamentId) => {
    const url = `tournaments/${tournamentId}`
    return makeRequest(url, GET)
  }

  const getMatchesByTournamentId = async (tournamentId) => {
    const url = `tournaments/${tournamentId}/matches`
    return makeRequest(url, GET)
  }

  const getTeamsByUnitId = async (unitId) => {
    const url = `units/${unitId}/teams`
    return makeRequest(url, GET)
  }

  const getAllTeams = async () => {
    const url = `teams`
    return makeRequest(url, GET)
  }

  const createTeam = async (name, unitId, sportId) => {
    const url = 'teams'
    const payload = { name, unitId, sportId }
    return makeRequest(url, POST, payload)
  }

  const updateTeam = async (id, name, unitId, sportId) => {
    const url = `teams/${id}`
    const payload = { name, unitId, sportId }
    return makeRequest(url, PUT, payload)
  }

  const getSports = async (query) => {
    const url = 'sports'
    return makeRequest(url, GET, query)
  }

  const getEvents = async (query) => {
    const url = 'events'
    return makeRequest(url, GET, query)
  }

  const getTournamentsByEventId = async (eventId) => {
    const url = `events/${eventId}/tournaments`
    return makeRequest(url, GET)
  }

  const createTournament = async (name, eventId, startDate, endDate, sportId) => {
    const url = 'tournaments'
    const payload = { name, eventId, startDate, endDate, sportId }
    return makeRequest(url, POST, payload)
  }

  const createInstitution = async (name) => {
    const url = 'institutions'
    const payload = { name }
    return makeRequest(url, POST, payload)
  }

  const updateInstitution = async (id, name) => {
    const url = `institutions/${id}`
    const payload = { name }
    return makeRequest(url, PUT, payload)
  }

  const updateTournament = async (id, name, eventId, startDate, endDate, sportId) => {
    const url = `tournaments/${id}`
    const payload = { name, eventId, startDate, endDate, sportId }
    return makeRequest(url, PUT, payload)
  }

  const deleteEventById = async (eventId) => {
    const url = `events/${eventId}`
    return makeRequest(url, DELETE)
  }

  const deleteTournamentById = async (tournamentId) => {
    const url = `tournaments/${tournamentId}`
    return makeRequest(url, DELETE)
  }

  const deleteSportById = async (sportId) => {
    const url = `sports/${sportId}`
    return makeRequest(url, DELETE)
  }

  const createSport = async (name) => {
    const url = 'sports'
    const payload = { name }
    return makeRequest(url, POST, payload)
  }

  const updateSport = async (id, name) => {
    const url = `sports/${id}`
    const payload = { name }
    return makeRequest(url, PUT, payload)
  }

  const getEventsByUnitId = async (unitId) => {
    const url = `units/${unitId}/events`
    return makeRequest(url, GET)
  }

  const deleteTeamById = async (teamId) => {
    const url = `teams/${teamId}`
    return makeRequest(url, DELETE)
  }

  const createEvent = async (name, unitId, startDate, endDate) => {
    const url = 'events'
    const payload = { name, unitId, startDate, endDate }
    return makeRequest(url, POST, payload)
  }

  const updateEvent = async (id, name, unitId, startDate, endDate) => {
    const url = `events/${id}`
    const payload = { name, unitId, startDate, endDate }
    return makeRequest(url, PUT, payload)
  }

  const getPlayersByUnitId = async (unitId) => {
    const url = `units/${unitId}/players`
    return makeRequest(url, GET)
  }

  const getAllPlayers = async () => {
    const url = `players`
    return makeRequest(url, GET)
  }

  const createPlayer = async (name, email, phone, unitId) => {
    const url = 'players'
    const payload = { name, email, phone, unitId }
    return makeRequest(url, POST, payload)
  }

  const updatePlayer = async (id, name, email, phone, unitId) => {
    const url = `players/${id}`
    const payload = { name, email, phone, unitId }
    return makeRequest(url, PUT, payload)
  }

  const deletePlayerById = async (playerId) => {
    const url = `players/${playerId}`
    return makeRequest(url, DELETE)
  }

  const addPlayersToTeam = async (teamId, players) => {
    const url = `teams/${teamId}/players/bulk`
    return makeRequest(url, POST, { players })
  }

  const getPlayersByTeamId = async (teamId) => {
    const url = `teams/${teamId}/players`
    return makeRequest(url, GET)
  }

  const addParticipant = async (participantType, teamId, playerId, matchId) => {
    const url = `matches/${matchId}/participants`
    const payload = { participantType, teamId, playerId }
    return makeRequest(url, POST, payload)
  }

  const getMatchParticipants = async (matchId) => {
    const url = `matches/${matchId}/participants`
    return makeRequest(url, GET)
  }

  const deleteMatchParticipant = async (matchId, participantId) => {
    const url = `matches/${matchId}/participants/${participantId}`
    return makeRequest(url, DELETE)
  }

  async function makeRequest(url, method, payload) {
    setIsLoading(true)

    let requestConfiguration = {
      method: method,
      url: `${BASE_URL}/${url}`,
      timeout: 30000 // Set timeout to 30 seconds
    }

    const configurationStrategy = {
      get: setRequestToGet,
      post: setRequestToPost,
      put: setRequestToPut,
      delete: setRequestToDelete
    }[method]

    requestConfiguration = configurationStrategy(requestConfiguration, payload)
    return sendRequest(requestConfiguration)
  }

  async function sendRequest(requestConfiguration) {
    return axios
      .request(requestConfiguration)
      .then((response) => {
        return { data: response.data, requestSuccessful: true }
      })
      .catch((error) => {
        const message =
          error?.response?.data?.message ||
          error?.message ||
          'Erro inesperado, tente novamente mais tarde.'
        return { error: message }
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  function addTokenToRequest(requestConfiguration) {
    const { token } = getAuthCookie() ?? {}

    if (token) {
      const headers = requestConfiguration['headers'] || {}

      requestConfiguration['headers'] = {
        ...headers,
        Authorization: `Bearer ${token}`
      }
    }
    return requestConfiguration
  }

  function setRequestToGet(requestConfiguration, payload) {
    if (payload) {
      requestConfiguration['params'] = payload
    }
    return addTokenToRequest(requestConfiguration)
  }

  function setRequestToDelete(requestConfiguration, payload) {
    if (payload) {
      requestConfiguration['params'] = payload
    }
    return addTokenToRequest(requestConfiguration)
  }

  function setRequestToPost(requestConfiguration, payload) {
    if (payload) {
      requestConfiguration['header'] = {
        'Content-Type': 'application/json'
      }
      requestConfiguration['data'] = payload
    }
    return addTokenToRequest(requestConfiguration)
  }

  function setRequestToPut(requestConfiguration, payload) {
    if (payload) {
      requestConfiguration['header'] = {
        'Content-Type': 'application/json'
      }
      requestConfiguration['data'] = payload
    }
    return addTokenToRequest(requestConfiguration)
  }

  return {
    getEvents,
    getUnfinishedEvents,
    getTournamentsByEventId,
    getUnitsByInstitutionId,
    deleteTournamentById,
    getInstitutions,
    getSports,
    createTournament,
    updateTournament,
    deleteSportById,
    createSport,
    updateSport,
    getUnits,
    createInstitution,
    updateInstitution,
    createUnit,
    updateUnit,
    getEventsByUnitId,
    deleteEventById,
    createEvent,
    updateEvent,
    auth,
    deleteTeamById,
    getTeamsByUnitId,
    createTeam,
    updateTeam,
    getPlayersByUnitId,
    createPlayer,
    updatePlayer,
    deletePlayerById,
    getUsers,
    addPlayersToTeam,
    getPlayersByTeamId,
    createUser,
    updateUser,
    deleteUserById,
    getTournamentById,
    getMatchesByTournamentId,
    getRequestLogs,
    createMatch,
    updateMatch,
    addParticipant,
    getMatchParticipants,
    deleteMatchParticipant,
    getAllTeams,
    getAllPlayers,
    isLoading
  }
}

export default useApi
