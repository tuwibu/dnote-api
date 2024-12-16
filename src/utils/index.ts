import crypto from 'crypto'
import dotenv from 'dotenv'
dotenv.config()

export const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export const random = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

export const shuffleArray = (array: any[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
  return array
}

export const generateStr = (length: number, type: 'hex' | 'number' | 'string') => {
  let charSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  if (type) {
    if (type === 'hex') charSet = 'abcdef0123456789'
    if (type === 'number') charSet = '0123456789'
  }
  let randomString = ''
  for (let i = 0; i < length; i++) {
    const randomPoz = Math.floor(Math.random() * charSet.length)
    randomString += charSet[randomPoz]
  }
  return randomString
}

export const generateNid = (sourceId: number) => {
  const hex = sourceId.toString(16).slice(-2)
  const timestamp = Date.now().toString(16).slice(-4)
  const randomPart = generateStr(5, 'hex')
  return `${hex}${randomPart}${timestamp}`.toUpperCase()
}

export const randomDouble = (min: number, max: number, length: number) => {
  return Number((Math.random() * (max - min) + min).toFixed(length))
}

export const getRandomObject = (obj: { [key: string]: number }): string => {
  const entriesArray = Object.entries(obj)
  let totalRatio = 0

  for (let i = 0; i < entriesArray.length; i++) {
    totalRatio += entriesArray[i][1]
  }

  let randomNumber = Math.random() * totalRatio
  let selected = ''

  for (let i = 0; i < entriesArray.length; i++) {
    if (randomNumber <= entriesArray[i][1]) {
      selected = entriesArray[i][0]
      break
    } else {
      randomNumber -= entriesArray[i][1]
    }
  }
  return selected
}
export const md5 = (str: string) => {
  return crypto.createHash('md5').update(str).digest('hex')
}
export const calculateRatio = (obj: { [key: string]: number }): string => {
  const entriesArray = Object.entries(obj)
  let totalRatio = 0

  for (let i = 0; i < entriesArray.length; i++) {
    totalRatio += entriesArray[i][1]
  }

  let randomNumber = Math.random() * totalRatio
  let selected = ''

  for (let i = 0; i < entriesArray.length; i++) {
    if (randomNumber <= entriesArray[i][1]) {
      selected = entriesArray[i][0]
      break
    } else {
      randomNumber -= entriesArray[i][1]
    }
  }
  return selected
}

export const numberFormat = (num?: string | number, prefix?: string): string => {
  try {
    if (num) {
      num = (num + '').replace(/[^0-9+\-Ee.]/g, '')
      let n = !isFinite(+num) ? 0 : +num
      let prec = 6
      let sep = ','
      let dec = '.'
      let s: any = ''
      let toFixedFix = (ns: any, precs: any) => {
        if (('' + ns).indexOf('e') === -1) {
          let vls: any = ns + 'e+' + precs
          return +(Math.round(vls) + 'e-' + prec)
        } else {
          let arr = ('' + n).split('e')
          let sig = ''
          if (+arr[1] + precs > 0) {
            sig = '+'
          }
          let vlss: any = +arr[0] + 'e' + sig + (+arr[1] + precs)
          let vlsss = +Math.round(vlss) + 'e-' + precs
          return Number(vlsss).toFixed(precs)
        }
      }
      s = (prec ? toFixedFix(n, prec).toString() : '' + Math.round(n)).split('.')
      if (s[0].length > 3) {
        s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep)
      }
      let result = s.join(dec)
      if (prefix) result = prefix + result
      return result
    } else {
      return '0'
    }
  } catch (ex) {
    return '0'
  }
}

export const convertSlug = (str: string) => {
  try {
    // Chuyển hết sang chữ thường
    str = str.toLowerCase()
    // xóa dấu
    str = str.replace(/(à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ)/g, 'a')
    str = str.replace(/(è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ)/g, 'e')
    str = str.replace(/(ì|í|ị|ỉ|ĩ)/g, 'i')
    str = str.replace(/(ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ)/g, 'o')
    str = str.replace(/(ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ)/g, 'u')
    str = str.replace(/(ỳ|ý|ỵ|ỷ|ỹ)/g, 'y')
    str = str.replace(/(đ)/g, 'd')
    // Xóa ký tự đặc biệt
    str = str.replace(/([^0-9a-z-\s])/g, '')
    // Xóa khoảng trắng thay bằng ký tự -
    str = str.replace(/(\s+)/g, '-')
    // xóa phần dự - ở đầu
    str = str.replace(/^-+/g, '')
    // xóa phần dư - ở cuối
    str = str.replace(/-+$/g, '')
    // return
    return str
  } catch (ex) {
    return 'full'
  }
}

export const durationToSeconds = (duration: string) => {
  // 9h13m50s => 33130
  let seconds = 0
  const hours = duration.match(/(\d+)h/)
  const minutes = duration.match(/(\d+)m/)
  const secs = duration.match(/(\d+)s/)
  if (hours) {
    seconds += parseInt(hours[1]) * 3600
  }
  if (minutes) {
    seconds += parseInt(minutes[1]) * 60
  }
  if (secs) {
    seconds += parseInt(secs[1])
  }
  return seconds
}

export const secondsToDuration = (seconds: number) => {
  // 33130 => 9h13m50s
  const hours = Math.floor(seconds / 3600)
  seconds %= 3600
  const minutes = Math.floor(seconds / 60)
  seconds %= 60
  if (hours > 0) {
    return `${hours}h${minutes}m${seconds}s`
  }
  if (minutes > 0) {
    return `${minutes}m${seconds}s`
  }
  return `${seconds}s`
}

export const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1) + min)
