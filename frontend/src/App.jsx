import PrivateLayout from '@/app/private/layout'
import PublicLayout from '@/app/public/layout'
import HomePage from '@/app/page'
import DashboardPage from '@/app/private/dashboard/page'
import EventsPage from '@/app/private/events/page'
import InstitutionsPage from '@/app/private/institutions/page'
import MatchesPage from '@/app/private/matches/[tournamentId]/page'
import PlayersPage from '@/app/private/players/page'
import RequestLogsPage from '@/app/private/request-logs/page'
import SportsPage from '@/app/private/sports/page'
import TeamsPage from '@/app/private/teams/page'
import TournamentsPage from '@/app/private/tournaments/page'
import UnitsPage from '@/app/private/units/[institutionId]/page'
import UsersPage from '@/app/private/users/page'
import PublicEventPage from '@/app/public/event/[eventId]/page'
import PublicEventsListPage from '@/app/public/page'
import RequireAuth from '@/components/RequireAuth'
import { Route, Routes } from 'react-router-dom'
import { Toaster } from 'sonner'

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />

        <Route path="/public" element={<PublicLayout />}>
          <Route index element={<PublicEventsListPage />} />
          <Route path="event/:eventId" element={<PublicEventPage />} />
        </Route>

        <Route
          path="/private"
          element={
            <RequireAuth>
              <PrivateLayout />
            </RequireAuth>
          }
        >
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="events" element={<EventsPage />} />
          <Route path="institutions" element={<InstitutionsPage />} />
          <Route path="tournaments" element={<TournamentsPage />} />
          <Route path="teams" element={<TeamsPage />} />
          <Route path="players" element={<PlayersPage />} />
          <Route path="sports" element={<SportsPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="request-logs" element={<RequestLogsPage />} />
          <Route path="matches/:tournamentId" element={<MatchesPage />} />
          <Route path="units/:institutionId" element={<UnitsPage />} />
        </Route>
      </Routes>
      <Toaster />
    </>
  )
}
