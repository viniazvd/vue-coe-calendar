const isValid = value => {
  if (Array.isArray(value)) return !!value.length
  if (typeof value === 'object') return !!Object.keys(value).length
  if (typeof value === 'string') return !!value.length
  if (typeof value === 'number') return !!value
  return !!value
}

export const equals = (obj1, obj2) => {
  if (!isValid(obj1) || !isValid(obj2)) return false

  const isObject = (data) => typeof (data) === 'object'
  const hasOwnProperty = (obj1, obj2, key) => obj1.hasOwnProperty(key) === obj2.hasOwnProperty(key)

  return Object.keys(obj1).every(key => {
    if (!hasOwnProperty(obj1, obj2, key)) return false

    return isObject(obj1[key])
      ? equals(obj1[key], obj2[key])
      : obj1[key] === obj2[key]
  })
}
