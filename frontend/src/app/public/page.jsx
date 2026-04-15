'use client'

import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { formatDate, removeTime } from '@/services/dateUtil'
import useApi from '@/services/useApi'
import { ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function PublicEventsListPage() {
  const { getPublicEvents } = useApi()
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)
      const res = await getPublicEvents()
      if (cancelled) return
      setLoading(false)
      if (res.requestSuccessful) {
        setEvents(Array.isArray(res.data) ? res.data : [])
      } else {
        setEvents([])
        setError(res.error)
      }
    }

    void load()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="from-muted/30 via-background to-muted/20 min-h-screen bg-gradient-to-b">
      <main className="mx-auto max-w-3xl px-4 py-10 md:px-8 md:py-14">
        <header className="mb-10">
          <p className="text-muted-foreground mb-2 text-xs font-medium uppercase tracking-[0.14em]">
            Eventos
          </p>
          <h1 className="text-foreground text-2xl font-semibold tracking-tight md:text-3xl">
            Todos os eventos
          </h1>
          <p className="text-muted-foreground mt-2 max-w-xl text-sm leading-relaxed">
            Selecione um evento para acompanhar torneios, partidas e resultados publicados.
          </p>
        </header>

        {loading && (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-muted/40 h-[88px] animate-pulse rounded-2xl border border-transparent"
              />
            ))}
          </div>
        )}

        {error && (
          <div className="border-destructive/25 bg-destructive/5 text-destructive rounded-xl border px-4 py-3 text-sm">
            {error}
          </div>
        )}

        {!loading && !error && events.length === 0 && (
          <p className="text-muted-foreground text-center text-sm">
            Nenhum evento cadastrado no momento.
          </p>
        )}

        {!loading && !error && events.length > 0 && (
          <ul className="flex flex-col gap-3">
            {events.map((ev) => {
              const locationLine = [ev.institutionName, ev.unitName].filter(Boolean).join(' · ')
              const start = formatDate(removeTime(ev.startDate))
              const end = formatDate(removeTime(ev.endDate))
              return (
                <li key={ev.id}>
                  <Link href={`/public/event/${ev.id}`} className="block">
                    <Card className="border-border/50 hover:border-border group transition-colors duration-200 hover:shadow-md">
                      <CardHeader className="flex flex-row items-center gap-4 space-y-0 py-5">
                        <div className="min-w-0 flex-1 space-y-1">
                          <CardTitle className="text-lg font-semibold tracking-tight transition-colors group-hover:text-emerald-700 dark:group-hover:text-emerald-400">
                            {ev.name}
                          </CardTitle>
                          <CardDescription className="text-[13px] leading-relaxed">
                            {locationLine ? (
                              <span className="text-muted-foreground">{locationLine}</span>
                            ) : null}
                            {locationLine ? (
                              <span className="text-muted-foreground/60"> · </span>
                            ) : null}
                            <span>
                              {start} — {end}
                            </span>
                          </CardDescription>
                        </div>
                        <ChevronRight
                          className="text-muted-foreground group-hover:text-foreground size-5 shrink-0 transition-transform group-hover:translate-x-0.5"
                          aria-hidden
                        />
                      </CardHeader>
                    </Card>
                  </Link>
                </li>
              )
            })}
          </ul>
        )}
      </main>
    </div>
  )
}
