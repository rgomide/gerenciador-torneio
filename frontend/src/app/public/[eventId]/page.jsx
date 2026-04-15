'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { formatDate } from '@/services/dateUtil'
import useApi from '@/services/useApi'
import { useParams } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'

function formatSnapshotDate(value) {
  if (value == null) return ''
  const d = typeof value === 'string' ? value : new Date(value).toISOString()
  return formatDate(d, true)
}

/** Agrupa partidas mantendo a ordem cronológica global dentro de cada torneio. */
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

function MatchExpandedContent({ match }) {
  const snap = match.snapshot

  if (snap) {
    return (
      <div className="space-y-4 text-sm">
        <p className="text-muted-foreground">
          {[snap.institutionName, snap.unitName, snap.sportName].filter(Boolean).join(' · ')}
        </p>
        {snap.matchParticipants && snap.matchParticipants.length > 0 && (
          <div>
            <h4 className="mb-2 font-medium text-foreground">Participantes</h4>
            <ul className="list-inside list-disc space-y-1 text-muted-foreground">
              {snap.matchParticipants.map((p, i) => (
                <li key={`${p.id}-${i}`}>
                  <span className="text-foreground">{p.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {' '}
                    ({p.participantType === 'team' ? 'equipe' : 'jogador'})
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
        {snap.totalScores && snap.totalScores.length > 0 && (
          <div>
            <h4 className="mb-2 font-medium text-foreground">Totais</h4>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Participante</TableHead>
                  <TableHead className="text-right">Pontos</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {snap.totalScores.map((row, i) => (
                  <TableRow key={`${row.id}-${i}`}>
                    <TableCell>{row.name}</TableCell>
                    <TableCell className="text-right tabular-nums">{row.totalScore}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
        {snap.matchScores && snap.matchScores.length > 0 && (
          <div>
            <h4 className="mb-2 font-medium text-foreground">Lançamentos</h4>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Participante</TableHead>
                  <TableHead className="text-right">Pts</TableHead>
                  <TableHead>Detalhes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {snap.matchScores.map((row, i) => (
                  <TableRow key={`${row.id}-${i}`}>
                    <TableCell>{row.name}</TableCell>
                    <TableCell className="text-right tabular-nums">{row.score}</TableCell>
                    <TableCell className="text-muted-foreground">{row.details || '—'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
        {snap.snapshotTakenAt && (
          <p className="text-xs text-muted-foreground">
            Registro finalizado em {formatSnapshotDate(snap.snapshotTakenAt)}
          </p>
        )}
      </div>
    )
  }

  const participants = match.participants
  const totals = match.totalScores

  return (
    <div className="space-y-4 text-sm">
      {participants && participants.length > 0 && (
        <div>
          <h4 className="mb-2 font-medium text-foreground">Participantes</h4>
          <ul className="list-inside list-disc space-y-1">
            {participants.map((p, i) => (
              <li key={i}>
                {p.name}{' '}
                <span className="text-xs text-muted-foreground">
                  ({p.participantType === 'team' ? 'equipe' : 'jogador'})
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
      {totals && totals.length > 0 && (
        <div>
          <h4 className="mb-2 font-medium text-foreground">Parciais / totais</h4>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Participante</TableHead>
                <TableHead className="text-right">Pontos</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {totals.map((row, i) => (
                <TableRow key={`${row.id}-${i}`}>
                  <TableCell>{row.name}</TableCell>
                  <TableCell className="text-right tabular-nums">{row.totalScore}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      {!participants?.length && !totals?.length && (
        <p className="text-muted-foreground">Sem participantes ou pontuação registrada ainda.</p>
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

function MatchAccordionItem({ match }) {
  const snap = match.snapshot

  return (
    <details className="group rounded-lg border border-border/80 bg-muted/20 open:bg-muted/35">
      <summary className="flex cursor-pointer list-none items-start justify-between gap-2 px-3 py-3 text-left transition-colors hover:bg-muted/50 [&::-webkit-details-marker]:hidden">
        <div className="min-w-0 flex-1">
          <p className="text-foreground text-sm font-medium leading-snug">
            {matchSummaryLine(match)}
          </p>
          <p className="text-muted-foreground mt-0.5 text-xs">
            {snap ? (
              <>
                Dados consolidados
                {snap.tournamentFinished ? ' · torneio encerrado' : ''}
              </>
            ) : (
              <>{match.finished ? 'Partida encerrada' : 'Em aberto ou em andamento'}</>
            )}
          </p>
        </div>
        <span className="text-muted-foreground mt-0.5 shrink-0 text-xs transition-transform group-open:rotate-180">
          ▼
        </span>
      </summary>
      <div className="border-t border-border/60 px-3 py-3">
        <MatchExpandedContent match={match} />
      </div>
    </details>
  )
}

function TournamentCard({ group }) {
  const sportName = group.matches.find((m) => m.snapshot?.sportName)?.snapshot?.sportName

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">{group.tournamentName}</CardTitle>
        <CardDescription>
          {sportName ? `${sportName} · ` : null}
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

function TournamentSection({ title, matches }) {
  const groups = useMemo(() => groupMatchesByTournament(matches), [matches])

  if (matches.length === 0) {
    return (
      <section>
        <h2 className="mb-3 text-lg font-semibold tracking-tight">{title}</h2>
        <p className="text-muted-foreground text-sm">Nenhum torneio nesta categoria.</p>
      </section>
    )
  }

  return (
    <section>
      <h2 className="mb-4 text-lg font-semibold tracking-tight">{title}</h2>
      <div className="flex flex-col gap-4">
        {groups.map((g) => (
          <TournamentCard key={String(g.tournamentId)} group={g} />
        ))}
      </div>
    </section>
  )
}

export default function PublicEventPage() {
  const { eventId } = useParams()
  const { getPublicMatchesByEventId, isLoading } = useApi()
  const [matches, setMatches] = useState([])
  const [error, setError] = useState(null)

  const ongoingMatches = useMemo(() => matches.filter((m) => !m.tournamentFinished), [matches])
  const finishedTournamentMatches = useMemo(
    () => matches.filter((m) => m.tournamentFinished),
    [matches]
  )

  useEffect(() => {
    if (eventId == null || eventId === '') return

    let cancelled = false

    async function loadMatches() {
      const resp = await getPublicMatchesByEventId(eventId)
      if (cancelled) return
      if (resp.requestSuccessful) {
        setMatches(Array.isArray(resp.data) ? resp.data : [])
        setError(null)
      } else {
        setMatches([])
        setError(resp.error)
      }
    }

    void loadMatches()

    return () => {
      cancelled = true
    }
  }, [eventId])

  return (
    <main className="mx-auto min-h-screen max-w-3xl px-4 py-8 md:px-8">
      <header className="mb-8 border-b pb-6">
        <p className="text-muted-foreground text-sm">Evento público</p>
        <p className="font-mono text-lg font-semibold tabular-nums">{String(eventId ?? '')}</p>
      </header>

      {isLoading && <p className="text-muted-foreground">Carregando…</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!isLoading && !error && (
        <>
          {matches.length === 0 ? (
            <p className="text-muted-foreground">Nenhuma partida neste evento.</p>
          ) : (
            <div className="flex flex-col gap-12">
              <TournamentSection title="Torneios em andamento" matches={ongoingMatches} />
              <TournamentSection title="Torneios encerrados" matches={finishedTournamentMatches} />
            </div>
          )}
        </>
      )}
    </main>
  )
}
