import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { useEffect, useState } from 'react'

const SelectSearcher = ({
  value,
  placeholder,
  labelField,
  onLoad,
  minCharacters = 2,
  onChange
}) => {
  const [selectedValue, setSelectedValue] = useState(value)
  const [searchTerm, setSearchTerm] = useState('')
  const [options, setOptions] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  // Update selectedValue when value prop changes
  useEffect(() => {
    setSelectedValue(value)
  }, [value])

  useEffect(() => {
    const fetchOptions = async () => {
      if (searchTerm.length < minCharacters) {
        setOptions([])
        return
      }

      setIsLoading(true)
      try {
        const response = await onLoad(searchTerm)

        if (response instanceof Array) {
          setOptions(response)
        } else {
          setOptions([])
        }
      } catch (error) {
        setOptions([])
      } finally {
        setIsLoading(false)
      }
    }

    const debounceTimer = setTimeout(fetchOptions, 300)
    return () => clearTimeout(debounceTimer)
  }, [searchTerm, onLoad])

  const handleChange = (value) => {
    setSelectedValue(value)
    onChange?.(value)
  }

  const handleInputChange = (e) => {
    const newValue = e.target.value
    setSearchTerm(newValue)

    // If input is cleared, clear the selected value
    if (!newValue) {
      handleChange(null)
    }
  }

  return (
    <div className="w-full">
      <Select value={selectedValue} onValueChange={handleChange}>
        <SelectTrigger>
          <SelectValue placeholder={placeholder}>
            {selectedValue && selectedValue[labelField]}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <div className="relative p-2 border-b">
            <input
              type="text"
              value={searchTerm}
              onChange={handleInputChange}
              placeholder="Digite para buscar..."
              className="w-full pl-8 pr-4 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center p-2">
              <div className="w-4 h-4 border-2 border-gray-200 border-t-blue-500 rounded-full animate-spin" />
            </div>
          ) : options.length === 0 ? (
            <div className="p-2 text-sm text-gray-500 text-center">
              {searchTerm.length < minCharacters
                ? `Digite pelo menos ${minCharacters} caracteres`
                : 'Nenhum resultado encontrado'}
            </div>
          ) : (
            options.map((option, index) => (
              <SelectItem key={index} value={option}>
                {option[labelField]}
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
    </div>
  )
}

export default SelectSearcher
