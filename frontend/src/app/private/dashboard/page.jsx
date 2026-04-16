'use client'
import OverlaySpinner from '@/components/common/OverlaySpinner'
import EventCard from '@/components/EventsComponents/EventCard'
import useApi from '@/services/useApi'
import useCookies from '@/services/useCookies'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

function Page() {
  const navigate = useNavigate()
  const { getUnfinishedEvents, isLoading } = useApi()
  const { getAuthCookie } = useCookies()
  const [unfinishedEvents, setUnfinishedEvents] = useState([])

  useEffect(() => {
    const { token } = getAuthCookie()

    if (!token) {
      navigate('/', { replace: true })
    } else {
      fetchUnfinishedEvents()
    }
  }, [])

  const fetchUnfinishedEvents = async () => {
    const response = await getUnfinishedEvents()
    if (response.requestSuccessful) {
      setUnfinishedEvents(response.data)
    } else {
      toast.error(response.error)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6">
      {isLoading && <OverlaySpinner />}
      {unfinishedEvents.length > 0 && (
        <>
          <h1 className="text-2xl font-bold self-start pb-4">Eventos em andamento</h1>
          <div className="flex flex-row flex-wrap justify-center gap-4">
            {unfinishedEvents.map((event, index) => {
              return (
                <div key={index} className="max-w-[500px]">
                  <EventCard key={event.id} event={event} />
                </div>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}

export default Page
