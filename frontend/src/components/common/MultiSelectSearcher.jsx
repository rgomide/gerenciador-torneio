import { X } from 'lucide-react'
import { useState } from 'react'
import SelectSearcher from './SelectSearcher'

const MultiSelectSearcher = ({
  labelField,
  idField,
  placeholder,
  minCharacters = 2,
  values = [],
  onLoad,
  onChange
}) => {
  const [selectedItems, setSelectedItems] = useState(values)

  const handleItemSelect = (item) => {
    if (selectedItems.some((selected) => selected[idField] === item[idField])) {
      return
    }

    const newSelectedItems = [...selectedItems, item]
    setSelectedItems(newSelectedItems)
    onChange?.(newSelectedItems)
  }

  const handleRemoveItem = (itemToRemove) => {
    const newSelectedItems = selectedItems.filter((item) => item[idField] !== itemToRemove[idField])
    setSelectedItems(newSelectedItems)
    onChange?.(newSelectedItems)
  }

  return (
    <div className="flex flex-col gap-2 w-full">
      {/* Select Component */}
      <SelectSearcher
        labelField={labelField}
        placeholder={placeholder}
        onLoad={onLoad}
        minCharacters={minCharacters}
        onChange={handleItemSelect}
        // Filter out already selected items
        filterOptions={(options) =>
          options.filter(
            (option) => !selectedItems.some((selected) => selected[idField] === option[idField])
          )
        }
      />

      {/* Selected Items Tags */}
      {selectedItems.length > 0 && (
        <div className="flex flex-wrap gap-2 p-2 bg-gray-50 rounded-md">
          {selectedItems.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-1 px-2 py-1 text-sm bg-blue-100 text-blue-800 rounded-full"
            >
              <span>{item[labelField]}</span>
              <button
                onClick={() => handleRemoveItem(item)}
                className="p-0.5 hover:bg-blue-200 rounded-full transition-colors"
              >
                <X className="cursor-pointer w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MultiSelectSearcher
