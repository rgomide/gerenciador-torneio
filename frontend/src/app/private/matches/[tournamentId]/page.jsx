'use client'
import OverlaySpinner from '@/components/common/OverlaySpinner'
import MatchForm from '@/components/MatchesComponents/MatchForm'
import MatchScoreForm from '@/components/MatchesComponents/MatchScoreForm'
import ParticipantsForm from '@/components/MatchesComponents/ParticipantsForm'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { formatDate } from '@/services/dateUtil'
import useApi from '@/services/useApi'
import { ArrowLeft } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

function Page() {
  const [tournament, setTournament] = useState(null)
  const [matches, setMatches] = useState([])

  const navigate = useNavigate()
  const { tournamentId } = useParams()
  const { getTournamentById, getMatchesByTournamentId, isLoading } = useApi()

  useEffect(() => {
    fetchTournament()
  }, [tournamentId])

  useEffect(() => {
    if (tournament) {
      fetchMatches()
    }
  }, [tournament])

  const fetchTournament = async () => {
    const response = await getTournamentById(tournamentId)

    if (response.requestSuccessful) {
      setTournament(response.data)
    } else {
      toast.error(response.error)
    }
  }

  const fetchMatches = async () => {
    const response = await getMatchesByTournamentId(tournamentId)

    if (response.requestSuccessful) {
      setMatches(response.data)
    } else {
      toast.error(response.error)
    }
  }

  return (
    <div className="flex flex-col items-center self-center h-screen w-full p-12 gap-8">
      {isLoading && <OverlaySpinner />}
      <h1>{tournament?.name} - Partidas</h1>

      <Table className="w-full">
        <TableCaption>Lista das partidas do torneio {tournament?.name}</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Descrição</TableHead>
            <TableHead>Data</TableHead>
            <TableHead>Local</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Ocorrências</TableHead>
            <TableHead>Rodada</TableHead>
            <TableHead>Data de registro</TableHead>
            <TableHead>Última atualização</TableHead>
            <TableHead>
              <MatchForm onClose={fetchMatches} tournament={tournament} />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {matches.map((match) => (
            <TableRow key={match.id}>
              <TableCell className="font-medium">{match.description}</TableCell>
              <TableCell className="font-medium">{formatDate(match.date, true)}</TableCell>
              <TableCell className="font-medium">{match.location}</TableCell>
              <TableCell className="font-medium">
                {match.finished ? 'Finalizada' : 'Não finalizada'}
              </TableCell>
              <TableCell className="font-medium">{match.occurrences}</TableCell>
              <TableCell className="font-medium">{match.roundNumber}</TableCell>
              <TableCell className="font-medium">{formatDate(match.createdAt, true)}</TableCell>
              <TableCell className="font-medium">{formatDate(match.updatedAt, true)}</TableCell>
              <TableCell className="font-medium">
                <MatchForm record={match} tournament={tournament} onClose={fetchMatches} />
              </TableCell>
              <TableCell className="font-medium">
                <ParticipantsForm record={match} />
              </TableCell>
              <TableCell className="font-medium">
                <MatchScoreForm record={match} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Button variant="outline" onClick={() => navigate(-1)}>
        <ArrowLeft /> Voltar para torneios
      </Button>
    </div>
  )
}

export default Page
