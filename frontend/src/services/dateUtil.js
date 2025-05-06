export const formatDate = (dateString, addTime = false) => {
  const date = new Date(dateString)

  const dateOnly = maskDate(date, 'dd/mm/yyyy')

  if (addTime) {
    return dateOnly + ' ' + date.toLocaleTimeString('pt-BR')
  }

  return dateOnly
}

export const removeTime = (dateString) => {
  return dateString.split('T')[0]
}

export const formatDateTimeToInput = (date) => {
  return date.toISOString().split('T')[0] + 'T' + date.toLocaleTimeString('pt-BR')
}

export const formatDateToInput = (date) => {
  return date.toISOString().split('T')[0]
}

const maskDate = (date, format) => {
  const day = String(date.toISOString().substring(8, 10)).padStart(2, '0')
  const month = String(date.toISOString().substring(5, 7)).padStart(2, '0')
  const year = date.toISOString().substring(0, 4)

  return format.replace('dd', day).replace('mm', month).replace('yyyy', year)
}
