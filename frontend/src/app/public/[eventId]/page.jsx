'use client'

import { PublicEventInsights } from '@/components/public/PublicEventInsights'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { cn } from '@/lib/utils'
import { formatDate, removeTime } from '@/services/dateUtil'
import useApi from '@/services/useApi'
import { ChevronDown } from 'lucide-react'
import { useParams } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'

function formatSnapshotDate(value) {
  if (value == null) return ''
  const d = typeof value === 'string' ? value : new Date(value).toISOString()
  return formatDate(d, true)
}

function groupMatchesByTournament(matches) {
  const map = new Map()
  for (const m of matches) {
    const tid = String(m.tournamentId)
    if (!map.has(tid)) {
      map.set(tid, {
        tournamentId: m.tournamentId,
        tournamentName: m.tournamentName ?? `Torneio ${tid}`,
        matches: []
      })
    }
    map.get(tid).matches.push(m)
  }
  return Array.from(map.values()).sort((a, b) =>
    String(a.tournamentName).localeCompare(String(b.tournamentName), 'pt-BR')
  )
}

function SectionLabel({ children }) {
  return (
    <h4 className="text-muted-foreground mb-2 text-[11px] font-semibold uppercase tracking-[0.12em]">
      {children}
    </h4>
  )
}

function DataTableShell({ children, className }) {
  return (
    <div
      className={cn(
        'overflow-hidden rounded-lg border border-border/60 bg-background/80 shadow-[0_1px_2px_0_rgb(0_0_0_/0.03)]',
        className
      )}
    >
      {children}
    </div>
  )
}

function MatchExpandedContent({ match }) {
  const snap = match.snapshot

  if (snap) {
    return (
      <div className="space-y-5 text-sm leading-relaxed">
        <div className="bg-muted/50 text-muted-foreground rounded-lg border border-border/40 px-3 py-2.5 text-xs leading-relaxed">
          {[snap.institutionName, snap.unitName, snap.sportName].filter(Boolean).join(' · ')}
        </div>
        {snap.matchParticipants && snap.matchParticipants.length > 0 && (
          <div>
            <SectionLabel>Participantes</SectionLabel>
            <ul className="space-y-2">
              {snap.matchParticipants.map((p, i) => (
                <li
                  key={`${p.id}-${i}`}
                  className="border-border/50 flex items-baseline justify-between gap-3 border-b border-dashed pb-2 last:border-0 last:pb-0"
                >
                  <span className="text-foreground font-medium">{p.name}</span>
                  <span className="text-muted-foreground shrink-0 text-xs">
                    {p.participantType === 'team' ? 'Equipe' : 'Jogador'}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
        {snap.totalScores && snap.totalScores.length > 0 && (
          <div>
            <SectionLabel>Totais</SectionLabel>
            <DataTableShell>
              <Table>
                <TableHeader>
                  <TableRow className="border-border/50 hover:bg-transparent">
                    <TableHead className="bg-muted/40 text-muted-foreground h-9 text-xs font-medium">
                      Participante
                    </TableHead>
                    <TableHead className="bg-muted/40 text-muted-foreground h-9 text-right text-xs font-medium">
                      Pontos
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {snap.totalScores.map((row, i) => (
                    <TableRow key={`${row.id}-${i}`} className="border-border/40">
                      <TableCell className="py-2.5 font-medium">{row.name}</TableCell>
                      <TableCell className="text-foreground py-2.5 text-right text-base font-semibold tabular-nums tracking-tight">
                        {row.totalScore}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </DataTableShell>
          </div>
        )}
        {snap.matchScores && snap.matchScores.length > 0 && (
          <div>
            <SectionLabel>Lançamentos</SectionLabel>
            <DataTableShell>
              <Table>
                <TableHeader>
                  <TableRow className="border-border/50 hover:bg-transparent">
                    <TableHead className="bg-muted/40 text-muted-foreground h-9 text-xs font-medium">
                      Participante
                    </TableHead>
                    <TableHead className="bg-muted/40 text-muted-foreground h-9 text-right text-xs font-medium">
                      Pts
                    </TableHead>
                    <TableHead className="bg-muted/40 text-muted-foreground h-9 text-xs font-medium">
                      Detalhes
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {snap.matchScores.map((row, i) => (
                    <TableRow key={`${row.id}-${i}`} className="border-border/40">
                      <TableCell className="py-2.5">{row.name}</TableCell>
                      <TableCell className="py-2.5 text-right font-medium tabular-nums">
                        {row.score}
                      </TableCell>
                      <TableCell className="text-muted-foreground py-2.5 text-xs">
                        {row.details || '—'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </DataTableShell>
          </div>
        )}
        {snap.snapshotTakenAt && (
          <p className="text-muted-foreground border-border/40 border-t pt-3 text-[11px]">
            Registro finalizado em {formatSnapshotDate(snap.snapshotTakenAt)}
          </p>
        )}
      </div>
    )
  }

  const participants = match.participants
  const totals = match.totalScores

  return (
    <div className="space-y-5 text-sm leading-relaxed">
      {participants && participants.length > 0 && (
        <div>
          <SectionLabel>Participantes</SectionLabel>
          <ul className="space-y-2">
            {participants.map((p, i) => (
              <li
                key={i}
                className="border-border/50 flex items-baseline justify-between gap-3 border-b border-dashed pb-2 last:border-0 last:pb-0"
              >
                <span className="font-medium">{p.name}</span>
                <span className="text-muted-foreground text-xs">
                  {p.participantType === 'team' ? 'Equipe' : 'Jogador'}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
      {totals && totals.length > 0 && (
        <div>
          <SectionLabel>Parciais / totais</SectionLabel>
          <DataTableShell>
            <Table>
              <TableHeader>
                <TableRow className="border-border/50 hover:bg-transparent">
                  <TableHead className="bg-muted/40 text-muted-foreground h-9 text-xs font-medium">
                    Participante
                  </TableHead>
                  <TableHead className="bg-muted/40 text-muted-foreground h-9 text-right text-xs font-medium">
                    Pontos
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {totals.map((row, i) => (
                  <TableRow key={`${row.id}-${i}`} className="border-border/40">
                    <TableCell className="py-2.5 font-medium">{row.name}</TableCell>
                    <TableCell className="py-2.5 text-right text-base font-semibold tabular-nums">
                      {row.totalScore}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </DataTableShell>
        </div>
      )}
      {!participants?.length && !totals?.length && (
        <p className="text-muted-foreground text-sm italic">
          Sem participantes ou pontuação registrada ainda.
        </p>
      )}
    </div>
  )
}

function matchSummaryLine(match) {
  const snap = match.snapshot
  if (snap) {
    return [
      formatSnapshotDate(snap.matchDate),
      snap.matchLocation,
      snap.matchRoundNumber != null ? `Rodada ${snap.matchRoundNumber}` : null,
      snap.matchOccurrences
    ]
      .filter(Boolean)
      .join(' · ')
  }
  return [
    formatDate(match.date, true),
    match.description,
    match.location,
    match.roundNumber != null ? `Rodada ${match.roundNumber}` : null
  ]
    .filter(Boolean)
    .join(' · ')
}

function StatusBadge({ match }) {
  const snap = match.snapshot
  if (snap) {
    return (
      <span className="bg-emerald-500/12 text-emerald-800 ring-emerald-500/25 dark:bg-emerald-500/15 dark:text-emerald-100 dark:ring-emerald-400/20 inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ring-1 ring-inset">
        Consolidado
      </span>
    )
  }
  if (match.finished) {
    return (
      <span className="bg-foreground/6 text-muted-foreground ring-border inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ring-1 ring-inset">
        Encerrada
      </span>
    )
  }
  return (
    <span className="bg-sky-500/10 text-sky-800 ring-sky-500/20 dark:bg-sky-400/15 dark:text-sky-100 dark:ring-sky-400/25 inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ring-1 ring-inset">
      Em andamento
    </span>
  )
}

function MatchAccordionItem({ match }) {
  return (
    <details className="group border-border/60 bg-card open:border-border open:shadow-sm rounded-xl border transition-[box-shadow,background-color] duration-200">
      <summary className="flex cursor-pointer list-none items-start gap-3 px-4 py-3.5 text-left [&::-webkit-details-marker]:hidden">
        <ChevronDown
          className="text-muted-foreground mt-0.5 size-4 shrink-0 transition-transform duration-200 group-open:rotate-180"
          aria-hidden
        />
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge match={match} />
          </div>
          <p className="text-foreground text-[15px] font-medium leading-snug tracking-tight">
            {matchSummaryLine(match)}
          </p>
          {match.snapshot?.tournamentFinished && (
            <p className="text-muted-foreground text-xs">Torneio encerrado</p>
          )}
        </div>
      </summary>
      <div className="border-border/50 border-t px-4 py-4">
        <MatchExpandedContent match={match} />
      </div>
    </details>
  )
}

function TournamentCard({ group }) {
  const sportName =
    group.matches.find((m) => m.sportName)?.sportName ??
    group.matches.find((m) => m.snapshot?.sportName)?.snapshot?.sportName

  return (
    <Card className="border-border/50 from-card to-muted/20 shadow-sm ring-1 ring-black/[0.04] transition-shadow duration-300 dark:ring-white/[0.06] rounded-2xl border bg-gradient-to-b hover:shadow-md">
      <CardHeader className="space-y-1 pb-4">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <CardTitle className="text-lg font-semibold tracking-tight md:text-xl">
            {group.tournamentName}
          </CardTitle>
          {sportName && (
            <span className="bg-secondary text-secondary-foreground rounded-md px-2.5 py-1 text-xs font-medium">
              {sportName}
            </span>
          )}
        </div>
        <CardDescription className="text-[13px] font-normal">
          {group.matches.length} partida{group.matches.length !== 1 ? 's' : ''}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-2 pt-0">
        {group.matches.map((m) => (
          <MatchAccordionItem key={m.id} match={m} />
        ))}
      </CardContent>
    </Card>
  )
}

function BlockTitle({ children, tone }) {
  return (
    <div className="mb-6 flex items-center gap-3">
      <span
        className={cn(
          'h-7 w-0.5 shrink-0 rounded-full',
          tone === 'ongoing' && 'bg-emerald-500/70 shadow-[0_0_12px_-2px_rgba(16,185,129,0.5)]',
          tone === 'finished' && 'bg-foreground/20'
        )}
        aria-hidden
      />
      <h2 className="text-foreground text-lg font-semibold tracking-tight md:text-xl">
        {children}
      </h2>
    </div>
  )
}

function TournamentSection({ title, matches, tone }) {
  const groups = useMemo(() => groupMatchesByTournament(matches), [matches])

  if (matches.length === 0) {
    return (
      <section>
        <BlockTitle tone={tone}>{title}</BlockTitle>
        <p className="text-muted-foreground pl-3.5 text-sm">Nenhum torneio nesta categoria.</p>
      </section>
    )
  }

  return (
    <section>
      <BlockTitle tone={tone}>{title}</BlockTitle>
      <div className="flex flex-col gap-5">
        {groups.map((g) => (
          <TournamentCard key={String(g.tournamentId)} group={g} />
        ))}
      </div>
    </section>
  )
}

function EventHeaderSkeleton() {
  return (
    <header className="border-border/50 mb-12 rounded-2xl border bg-card/80 px-5 py-6 shadow-sm ring-1 ring-black/[0.03] backdrop-blur-sm dark:bg-card/60 dark:ring-white/[0.05]">
      <div className="bg-muted mb-3 h-3 w-28 animate-pulse rounded" />
      <div className="bg-muted mb-4 h-8 max-w-md animate-pulse rounded-md" />
      <div className="bg-muted h-4 w-48 animate-pulse rounded" />
    </header>
  )
}

function EventHeader({ event }) {
  const locationLine = [event.institutionName, event.unitName].filter(Boolean).join(' · ')
  const start = formatDate(removeTime(event.startDate))
  const end = formatDate(removeTime(event.endDate))

  return (
    <header className="border-border/50 mb-12 rounded-2xl border bg-card/80 px-5 py-6 shadow-sm ring-1 ring-black/[0.03] backdrop-blur-sm dark:bg-card/60 dark:ring-white/[0.05]">
      <p className="text-muted-foreground mb-3 text-xs font-medium uppercase tracking-[0.14em]">
        Evento
      </p>
      <h1 className="text-foreground text-2xl font-semibold tracking-tight md:text-3xl">
        {event.name}
      </h1>
      {locationLine ? (
        <p className="text-muted-foreground mt-3 text-sm leading-relaxed">{locationLine}</p>
      ) : null}
      <p className="text-muted-foreground mt-2 text-sm">
        <span className="text-foreground/80 font-medium">Período</span>
        {' · '}
        <time dateTime={event.startDate}>{start}</time>
        {' — '}
        <time dateTime={event.endDate}>{end}</time>
      </p>
    </header>
  )
}

export default function PublicEventPage() {
  const { eventId } = useParams()
  const { getPublicMatchesByEventId, getPublicEventById } = useApi()
  const [matches, setMatches] = useState([])
  const [eventInfo, setEventInfo] = useState(null)
  const [pageLoading, setPageLoading] = useState(true)
  const [error, setError] = useState(null)

  const ongoingMatches = useMemo(() => matches.filter((m) => !m.tournamentFinished), [matches])
  const finishedTournamentMatches = useMemo(
    () => matches.filter((m) => m.tournamentFinished),
    [matches]
  )

  useEffect(() => {
    if (eventId == null || eventId === '') return

    let cancelled = false

    async function load() {
      setPageLoading(true)
      setError(null)

      const [evRes, mtRes] = await Promise.all([
        getPublicEventById(eventId),
        getPublicMatchesByEventId(eventId)
      ])

      if (cancelled) return

      setPageLoading(false)

      if (!evRes.requestSuccessful) {
        setEventInfo(null)
        setMatches([])
        setError(evRes.error)
        return
      }

      setEventInfo(evRes.data)
      if (mtRes.requestSuccessful) {
        setMatches(Array.isArray(mtRes.data) ? mtRes.data : [])
      } else {
        setMatches([])
      }
    }

    void load()

    return () => {
      cancelled = true
    }
  }, [eventId])

  return (
    <div className="from-muted/30 via-background to-muted/20 min-h-screen bg-gradient-to-b">
      <main className="mx-auto max-w-3xl px-4 py-10 md:px-8 md:py-14">
        {pageLoading ? (
          <EventHeaderSkeleton />
        ) : eventInfo ? (
          <EventHeader event={eventInfo} />
        ) : null}

        {!pageLoading && !error && eventInfo && matches.length > 0 && (
          <PublicEventInsights matches={matches} />
        )}

        {error && (
          <div className="border-destructive/25 bg-destructive/5 text-destructive rounded-xl border px-4 py-3 text-sm">
            {error}
          </div>
        )}

        {!pageLoading && !error && eventInfo && (
          <>
            {matches.length === 0 ? (
              <p className="text-muted-foreground text-center text-sm">
                Nenhuma partida neste evento.
              </p>
            ) : (
              <div className="flex flex-col gap-16 md:gap-20">
                <TournamentSection
                  title="Torneios em andamento"
                  matches={ongoingMatches}
                  tone="ongoing"
                />
                <TournamentSection
                  title="Torneios encerrados"
                  matches={finishedTournamentMatches}
                  tone="finished"
                />
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}
