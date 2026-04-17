import axios from 'axios'
import SelectSearcher from '../components/common/SelectSearcher'
import { globalHandlers } from './handlers/global'

export default {
  title: 'Components/SelectSearcher',
  component: SelectSearcher
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

export const DefaultValue = {
  name: 'With selected value',
  args: {
    labelField: 'name',
    placeholder: 'Digite para buscar...',
    minCharacters: 3,
    value: {
      id: 1,
      name: 'Campus Trindade'
    },
    onChange: logChange,
    onLoad: loadUnits
  },
  parameters: {
    msw: {
      handlers: globalHandlers
    }
  }
}
