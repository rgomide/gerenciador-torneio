import axios from 'axios'
import { delay, http, HttpResponse } from 'msw'
import DropdownLoader from '../components/DropdownLoader/DropdownLoader'

export default {
  title: 'Components/DropdownLoader',
  component: DropdownLoader
}

const handlers = [
  http.get('http://localhost:3000/api/units', async () => {
    await delay(1000)

    return HttpResponse.json([
      {
        id: 1,
        name: 'Unit 1'
      },
      {
        id: 2,
        name: 'Unit 2'
      },
      {
        id: 3,
        name: 'Unit 3'
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
    label: 'name',
    placeholder: 'Digite para buscar...',
    minCharacters: 3,
    onChange: logChange,
    loadRecords: loadUnits
  },
  parameters: {
    msw: {
      handlers
    }
  }
}
