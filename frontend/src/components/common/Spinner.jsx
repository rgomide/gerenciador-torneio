const Spinner = ({ size = 'md', color = 'blue' }) => {
  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-4',
    lg: 'w-16 h-16 border-6',
    xl: 'w-24 h-24 border-6'
  }

  const colors = {
    blue: 'border-t-blue-500',
    red: 'border-t-red-500',
    green: 'border-t-green-500',
    yellow: 'border-t-yellow-500',
    purple: 'border-t-purple-500',
    orange: 'border-t-orange-500',
    pink: 'border-t-pink-500',
    gray: 'border-t-gray-500'
  }

  const sizeClass = sizes[size] ? sizes[size] : sizes.md
  const colorClass = colors[color] ? colors[color] : colors.blue

  return <div className={`${sizeClass} border-white-200 ${colorClass} rounded-full animate-spin`} />
}

export default Spinner
