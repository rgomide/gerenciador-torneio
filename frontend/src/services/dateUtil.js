export const formatDate = (dateString, addTime = false) => {
  const date = new Date(dateString)
  if (addTime) {
    return date.toLocaleDateString('pt-BR') + ' ' + date.toLocaleTimeString('pt-BR')
  }
  return date.toLocaleDateString('pt-BR')
}
