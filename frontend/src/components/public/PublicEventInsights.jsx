'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { useMemo } from 'react'
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'

const STATUS_COLORS = {
  ongoing: 'var(--chart-ongoing, #10b981)',
  closed: 'var(--chart-closed, #71717a)'
}

const SPORT_PALETTE = [
  '#0d9488',
  '#6366f1',
  '#d97706',
  '#db2777',
  '#7c3aed',
  '#0ea5e9',
  '#16a34a',
  '#64748b'
]

function buildInsights(matches) {
  const byTournament = new Map()
  for (const m of matches) {
    const id = String(m.tournamentId)
    if (!byTournament.has(id)) {
      byTournament.set(id, {
        tournamentFinished: Boolean(m.tournamentFinished),
        sportName: m.sportName || m.snapshot?.sportName || null
      })
    }
  }

  const tournaments = Array.from(byTournament.values())
  const ongoingTournaments = tournaments.filter((t) => !t.tournamentFinished).length
  const closedTournaments = tournaments.filter((t) => t.tournamentFinished).length

  const sportCounts = {}
  for (const t of tournaments) {
    const label = t.sportName || 'Sem modalidade'
    sportCounts[label] = (sportCounts[label] || 0) + 1
  }
  const sportChartData = Object.entries(sportCounts).map(([name, value]) => ({ name, value }))

  const statusChartData = [
    { name: 'Em andamento', value: ongoingTournaments, fill: STATUS_COLORS.ongoing },
    { name: 'Encerrados', value: closedTournaments, fill: STATUS_COLORS.closed }
  ].filter((d) => d.value > 0)

  const totalMatches = matches.length
  const finishedMatches = matches.filter((m) => m.finished).length
  const progressPct = totalMatches > 0 ? Math.round((finishedMatches / totalMatches) * 100) : 0

  return {
    tournamentCount: tournaments.length,
    ongoingTournaments,
    closedTournaments,
    statusChartData,
    sportChartData,
    totalMatches,
    finishedMatches,
    openMatches: totalMatches - finishedMatches,
    progressPct
  }
}

function PieTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const { name, value } = payload[0]
  return (
    <div className="border-border/60 bg-popover text-popover-foreground rounded-lg border px-3 py-2 text-xs shadow-md">
      <span className="font-medium">{name}</span>
      <span className="text-muted-foreground">
        {' · '}
        {value} {value === 1 ? 'torneio' : 'torneios'}
      </span>
    </div>
  )
}

function SportTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const { name, value } = payload[0]
  return (
    <div className="border-border/60 bg-popover text-popover-foreground rounded-lg border px-3 py-2 text-xs shadow-md">
      <span className="font-medium">{name}</span>
      <span className="text-muted-foreground">
        {' · '}
        {value} {value === 1 ? 'torneio' : 'torneios'}
      </span>
    </div>
  )
}

export function PublicEventInsights({ matches, className }) {
  const data = useMemo(() => buildInsights(matches), [matches])

  const hasStatusData = data.statusChartData.length > 0
  const hasSportData = data.sportChartData.length > 0

  return (
    <Card
      className={cn(
        'border-border/50 from-card to-muted/15 mb-12 rounded-2xl border bg-gradient-to-b shadow-sm ring-1 ring-black/[0.03] dark:ring-white/[0.05]',
        className
      )}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold tracking-tight md:text-xl">
          Visão geral
        </CardTitle>
        <CardDescription className="text-[13px] leading-relaxed">
          Resumo dos torneios e partidas deste evento.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8 pt-2">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatPill label="Torneios" value={data.tournamentCount} hint="neste evento" />
          <StatPill label="Partidas" value={data.totalMatches} hint="registradas no total" />
          <StatPill
            label="Partidas finalizadas"
            value={data.finishedMatches}
            hint="com resultado"
          />
          <div className="border-border/50 bg-muted/30 flex flex-col justify-center rounded-xl border px-4 py-3">
            <p className="text-muted-foreground text-[11px] font-medium uppercase tracking-wide">
              Progresso das partidas
            </p>
            <div className="mt-2 flex items-center gap-3">
              <div className="bg-muted h-2 flex-1 overflow-hidden rounded-full">
                <div
                  className="from-emerald-500 to-emerald-600 h-full rounded-full bg-gradient-to-r transition-all duration-500"
                  style={{ width: `${data.progressPct}%` }}
                />
              </div>
              <span className="text-foreground text-sm font-semibold tabular-nums">
                {data.progressPct}%
              </span>
            </div>
          </div>
        </div>

        <div className="grid gap-10 md:grid-cols-2 md:gap-8">
          <div>
            <h3 className="text-muted-foreground mb-1 text-xs font-semibold uppercase tracking-[0.12em]">
              Torneios por situação
            </h3>
            <p className="text-muted-foreground/90 mb-4 text-xs">
              Quantidade de torneios ainda em andamento versus já encerrados.
            </p>
            {hasStatusData ? (
              <div className="h-[220px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data.statusChartData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="48%"
                      innerRadius={48}
                      outerRadius={78}
                      paddingAngle={2}
                      strokeWidth={0}
                    >
                      {data.statusChartData.map((entry, i) => (
                        <Cell key={entry.name} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip content={<PieTooltip />} />
                    <Legend
                      verticalAlign="bottom"
                      height={36}
                      formatter={(value) => (
                        <span className="text-foreground text-xs font-medium">{value}</span>
                      )}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <EmptyChart />
            )}
          </div>

          <div>
            <h3 className="text-muted-foreground mb-1 text-xs font-semibold uppercase tracking-[0.12em]">
              Torneios por modalidade
            </h3>
            <p className="text-muted-foreground/90 mb-4 text-xs">
              Como os torneios se distribuem entre as modalidades esportivas.
            </p>
            {hasSportData ? (
              <div className="h-[220px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data.sportChartData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="48%"
                      innerRadius={48}
                      outerRadius={78}
                      paddingAngle={1}
                      strokeWidth={0}
                    >
                      {data.sportChartData.map((_, i) => (
                        <Cell key={i} fill={SPORT_PALETTE[i % SPORT_PALETTE.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<SportTooltip />} />
                    <Legend
                      verticalAlign="bottom"
                      height={52}
                      formatter={(value) => (
                        <span className="text-foreground max-w-[140px] truncate text-xs font-medium">
                          {value}
                        </span>
                      )}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <EmptyChart message="Sem modalidades identificadas." />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function StatPill({ label, value, hint }) {
  return (
    <div className="border-border/50 bg-muted/25 flex flex-col justify-center rounded-xl border px-3 py-3 md:px-4">
      <p className="text-muted-foreground text-[11px] font-medium uppercase tracking-wide">
        {label}
      </p>
      <p className="text-foreground mt-1 text-2xl font-semibold tabular-nums tracking-tight">
        {value}
      </p>
      {hint ? <p className="text-muted-foreground/80 mt-0.5 text-[11px]">{hint}</p> : null}
    </div>
  )
}

function EmptyChart({ message = 'Sem dados para exibir.' }) {
  return (
    <div className="border-border/40 text-muted-foreground flex h-[180px] items-center justify-center rounded-xl border border-dashed text-sm">
      {message}
    </div>
  )
}
