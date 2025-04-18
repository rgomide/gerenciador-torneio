## Project Overview

This project is a web application that allows users to manage their sports teams and players.

## Accessing deployed version

- [Frontend](https://gerenciador-torneio.vercel.app/)
- [Backend](https://gerenciador-torneio.onrender.com/api)
- [Backend API Documentation](https://gerenciador-torneio.onrender.com/api/docs)

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
      date start_date
      date end_date
      date created_at
      date updated_at
    }

    tournaments {
      bigint id PK
      string name
      bigint event_id FK
      date start_date
      date end_date
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
      bigint unit_id FK
      date created_at
      date updated_at
    }

    players {
      bigint id PK
      string name
      bigint unit_id FK
      string email
      string phone
      date created_at
      date updated_at
    }

    teams_players {
      bigint team_id FK
      bigint player_id FK
      string details
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

    matches_participants {
      bigint id PK
      bigint match_id FK
      bigint team_id FK
      bigint player_id FK
      string participant_type
      date created_at
      date updated_at
    }

    match_scores {
      bigint id PK
      bigint match_id FK
      bigint team_id FK
      bigint player_id FK
      integer score
      text details
      date created_at
      date updated_at
    }

    users ||--o{ users_roles : has
    roles ||--o{ users_roles : has
    institutions ||--o{ units : has
    units ||--o{ events : has
    units ||--o{ players : has
    units ||--o{ teams : has
    events ||--o{ tournaments : has
    sports ||--o{ teams : has
    teams ||--o{ teams_players : has
    players ||--o{ teams_players : has
    tournaments ||--o{ matches : has
    matches ||--o{ matches_participants : has
    teams ||--o{ matches_participants : has
    players ||--o{ matches_participants : has
    matches ||--o{ match_scores : has
    teams ||--o{ match_scores : has
    players ||--o{ match_scores : has
```