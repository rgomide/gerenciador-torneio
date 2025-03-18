
## Admin endpoints

- `GET /auth/login`: Login to the admin panel
- CRUD Institutions
- CRUD Units
- CRUD Events
- CRUD Tournaments
- CRUD Sports
- CRUD Teams*
- CRUD Players*
- CRUD Matches*
- CRUD Scores*

\* Available for `manager` users

## Webpage endpoints (open access)

- `GET /events`: List all events
- `GET /events/:id/tournaments`: List all tournaments for an event
- `GET /sports`: List all sports
- `GET /sprots/:id/teams`: List all teams of a sport
- `GET /teams/:id/players`: List all players of a team
- `GET /matches`: List all matches
- `GET /tournaments/:id/matches`: List all matches of a tournament
- `GET /matches/:id`: Show the defails of a match with scores 

## ER Diagram

```mermaid
erDiagram
    users {
        bigint id PK
        string first_name
        string last_name
        string user_name
        string email
        string password
        date created_at
        date updated_at
    }
    
    roles {
        bigint id PK
        string name
        date created_at
        date updated_at
    }
    
    users_roles {
        bigint user_id FK
        bigint role_id FK
        date created_at
        date updated_at
    }

    institutions {
      bigint id PK
      string name
      date created_at
      date updated_at
    }

    units {
      bigint id PK
      string name
      bigint institution_id FK
      date created_at
      date updated_at
    }

    events {
      bigint id PK
      string name
      bigint unit_id FK
      date created_at
      date updated_at
    }

    tournaments {
      bigint id PK
      string name
      bigint event_id FK
      date created_at
      date updated_at
    }

    sports {
      bigint id PK
      string name
      date created_at
      date updated_at
    }

    teams {
      bigint id PK
      string name
      bigint sport_id FK
      date created_at
      date updated_at
    }

    players {
      bigint id PK
      string first_name
      string last_name
      bigint team_id FK
      date created_at
      date updated_at
    }

    matches {
      bigint id PK
      bigint tournament_id FK
      date date
      string location
      boolean finished
      string occurrences
      integer round_number
      date created_at
      date updated_at
    }

    matches_teams {
      bigint match_id FK
      bigint team_id FK
      bigint player_id FK
      date created_at
      date updated_at
    }

    scores {
      bigint id PK
      bigint match_id FK
      bigint team_id FK
      bigint player_id FK
      integer score
      date created_at
      date updated_at
    }

    users ||--o{ users_roles : has
    roles ||--o{ users_roles : has
    institutions ||--o{ units : has
    units ||--o{ events : has
    events ||--o{ tournaments : has
    sports ||--o{ teams : has
    teams ||--o{ players : has
    tournaments ||--o{ matches : has
    matches ||--o{ matches_teams : has
    teams ||--o{ matches_teams : has
    players ||--o{ matches_teams : has
    matches ||--o{ scores : has
    teams ||--o{ scores : has
    players ||--o{ scores : has
```