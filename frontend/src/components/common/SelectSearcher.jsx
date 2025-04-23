import { ChevronDown } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

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
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)
  const inputRef = useRef(null)

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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleChange = (value) => {
    setSelectedValue(value)
    onChange?.(value)
    setIsOpen(false)
  }

  const handleInputChange = (e) => {
    const newValue = e.target.value
    setSearchTerm(newValue)

    // If input is cleared, clear the selected value
    if (!newValue) {
      handleChange(null)
    }
  }

  const handleTriggerClick = () => {
    setIsOpen(!isOpen)
    if (!isOpen) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 0)
    }
  }

  return (
    <div className="w-full relative" ref={dropdownRef}>
      <div
        onClick={handleTriggerClick}
        className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
      >
        <span className="truncate">{selectedValue ? selectedValue[labelField] : placeholder}</span>
        <ChevronDown className="h-4 w-4 opacity-50" />
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 rounded-md border bg-popover text-popover-foreground shadow-md">
          <div className="p-2 border-b">
            <input
              ref={inputRef}
              type="text"
              value={searchTerm}
              onChange={handleInputChange}
              placeholder="Digite para buscar..."
              className="w-full pl-8 pr-4 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="max-h-[200px] overflow-auto">
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
                <div
                  key={index}
                  onClick={() => handleChange(option)}
                  className="px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground cursor-pointer"
                >
                  {option[labelField]}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default SelectSearcher
