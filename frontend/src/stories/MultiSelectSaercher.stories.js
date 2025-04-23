import axios from 'axios'
import MultiSelectSearcher from '../components/common/MultiSelectSearcher'
import { globalHandlers } from './handlers/global'

export default {
  title: 'Components/MultiSelectSearcher',
  component: MultiSelectSearcher
}

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
      handlers: globalHandlers
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
      handlers: globalHandlers
    }
  }
}
