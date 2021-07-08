import moment from 'moment'

export function isValidEmail (email: string) {
  if (!email) return false
  const trimmed = email.trim()
  return /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(trimmed)
}

export function isValidPassword (password: string) {
  if (!password) return false
  if (password.length < 6) return false
  return true
}

export function isValidPhone (phoneNumber) {
  const re = /^-{0,1}\d*\.{0,1}\d+$/
  return (
    re.test(phoneNumber) &&
    typeof phoneNumber === 'string' &&
    phoneNumber.length >= 10
  )
}

export function isValidDateOfBirth (dateOfBirth) {
  const re = /(19|20)\d\d$[- /.]^(0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])/
  return re.test(dateOfBirth)
}

export function isValidBirth (year) {
  const currentYear = moment().format('YYYY');
  return !isNaN(year) && ( Number(currentYear) - Number(year) > 17) && ( Number(currentYear) - Number(year) < 100)
}
