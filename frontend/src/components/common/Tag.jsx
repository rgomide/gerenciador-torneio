const Tag = ({ label, color }) => {
  const colors = {
    blue: 'border-blue-500 bg-blue-200 text-blue-800',
    red: 'border-red-500 bg-red-200 text-red-800',
    green: 'border-green-500 bg-green-200 text-green-800',
    yellow: 'border-yellow-500 bg-yellow-200 text-yellow-800',
    purple: 'border-purple-500 bg-purple-200 text-purple-800',
    orange: 'border-orange-500 bg-orange-200 text-orange-800',
    pink: 'border-pink-500 bg-pink-200 text-pink-800',
    gray: 'border-gray-500 bg-gray-200 text-gray-800'
  }

  const colorClass = colors[color] ? colors[color] : colors.blue
  return (
    <div className={`inline-block px-2 py-1 rounded-lg ${colorClass}`}>
      <p className="text-sm">{label}</p>
    </div>
  )
}

export default Tag
