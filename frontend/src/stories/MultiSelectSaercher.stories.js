import axios from 'axios'
import { delay, http, HttpResponse } from 'msw'
import MultiSelectSearcher from '../components/common/MultiSelectSearcher'

export default {
  title: 'Components/MultiSelectSearcher',
  component: MultiSelectSearcher
}

const handlers = [
  http.get('http://localhost:3000/api/units', async () => {
    await delay(1000)

    return HttpResponse.json([
      {
        id: 1,
        name: 'Campus Trindade'
      },
      {
        id: 2,
        name: 'Campus Rio Verde'
      },
      {
        id: 3,
        name: 'Campus Ceres'
      },
      {
        id: 4,
        name: 'Campus Cristalina'
      },
      {
        id: 5,
        name: 'Campus Hidrolândia'
      }
    ])
  })
]

const loadUnits = async (name) => {
  const response = await axios.get(`http://localhost:3000/api/units?name=${name}`)
  return response.data
}

const logChange = (value) => {
  console.log(value)
}

export const Default = {
  name: 'Load units',
  args: {
    labelField: 'name',
    idField: 'id',
    placeholder: 'Digite para buscar...',
    minCharacters: 3,
    onChange: logChange,
    onLoad: loadUnits
  },
  parameters: {
    msw: {
      handlers
    }
  }
}

export const DefaultValues = {
  name: 'With selected values',
  args: {
    labelField: 'name',
    idField: 'id',
    placeholder: 'Digite para buscar...',
    minCharacters: 3,
    values: [
      {
        id: 1,
        name: 'Campus Trindade'
      },
      {
        id: 2,
        name: 'Campus Rio Verde'
      }
    ],
    onChange: logChange,
    onLoad: loadUnits
  },
  parameters: {
    msw: {
      handlers
    }
  }
}
