interface DaySchedule {
  day: number  // 0-6 (Sunday-Saturday)
  openTime: number  // minutes from midnight
  closeTime: number  // minutes from midnight
}

interface ParsedHours {
  isAlwaysOpen: boolean
  hasHoursData: boolean
  schedule: DaySchedule[]
}

const dayNames: Record<string, number> = {
  'sun': 0, 'sunday': 0,
  'mon': 1, 'monday': 1,
  'tue': 2, 'tues': 2, 'tuesday': 2,
  'wed': 3, 'wednesday': 3,
  'thu': 4, 'thur': 4, 'thurs': 4, 'thursday': 4,
  'fri': 5, 'friday': 5,
  'sat': 6, 'saturday': 6, 'saturdays': 6
}

function parseTime(timeStr: string): number | null {
  const normalized = timeStr.toLowerCase().trim()

  // Match patterns like "9am", "9:30am", "9:30 am", "17:00"
  const match = normalized.match(/^(\d{1,2})(?::(\d{2}))?\s*(am|pm)?$/)
  if (!match) return null

  let hours = parseInt(match[1], 10)
  const minutes = match[2] ? parseInt(match[2], 10) : 0
  const period = match[3]

  if (period === 'pm' && hours !== 12) {
    hours += 12
  } else if (period === 'am' && hours === 12) {
    hours = 0
  }

  if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
    return null
  }

  return hours * 60 + minutes
}

function getDayRange(startDay: number, endDay: number): number[] {
  const days: number[] = []
  let current = startDay
  while (current !== endDay) {
    days.push(current)
    current = (current + 1) % 7
  }
  days.push(endDay)
  return days
}

export function parseHours(hoursString: string | null): ParsedHours {
  if (!hoursString?.trim()) {
    return { isAlwaysOpen: false, hasHoursData: false, schedule: [] }
  }

  const normalized = hoursString.toLowerCase().trim()

  // Handle "24/7" patterns
  if (normalized.includes('24/7') || normalized.includes('24 hours') || normalized === 'always open') {
    return { isAlwaysOpen: true, hasHoursData: true, schedule: [] }
  }

  const schedule: DaySchedule[] = []

  // Split by common delimiters (comma, semicolon)
  const parts = normalized.split(/[;,]/).map(p => p.trim()).filter(Boolean)

  for (const part of parts) {
    // Pattern: "Mon-Fri 9am-5pm" or "Monday - Friday 8:30am-4:30pm"
    const dayRangeMatch = part.match(/([a-z]+)\s*[-–to]+\s*([a-z]+)\s+(\d{1,2}(?::\d{2})?)\s*(am|pm)?\s*[-–to]+\s*(\d{1,2}(?::\d{2})?)\s*(am|pm)?/i)
    if (dayRangeMatch) {
      const startDayName = dayRangeMatch[1].toLowerCase()
      const endDayName = dayRangeMatch[2].toLowerCase()
      const startDay = dayNames[startDayName]
      const endDay = dayNames[endDayName]

      if (startDay !== undefined && endDay !== undefined) {
        const openStr = dayRangeMatch[3] + (dayRangeMatch[4] || '')
        const closeStr = dayRangeMatch[5] + (dayRangeMatch[6] || '')
        const openTime = parseTime(openStr)
        const closeTime = parseTime(closeStr)

        if (openTime !== null && closeTime !== null) {
          const days = getDayRange(startDay, endDay)
          for (const day of days) {
            schedule.push({ day, openTime, closeTime })
          }
          continue
        }
      }
    }

    // Pattern: "Saturdays 9am-12pm" or "Saturday 9am-12pm"
    const singleDayMatch = part.match(/([a-z]+)s?\s+(\d{1,2}(?::\d{2})?)\s*(am|pm)?\s*[-–to]+\s*(\d{1,2}(?::\d{2})?)\s*(am|pm)?/i)
    if (singleDayMatch) {
      const dayName = singleDayMatch[1].toLowerCase()
      const day = dayNames[dayName]

      if (day !== undefined) {
        const openStr = singleDayMatch[2] + (singleDayMatch[3] || '')
        const closeStr = singleDayMatch[4] + (singleDayMatch[5] || '')
        const openTime = parseTime(openStr)
        const closeTime = parseTime(closeStr)

        if (openTime !== null && closeTime !== null) {
          schedule.push({ day, openTime, closeTime })
          continue
        }
      }
    }

    // Pattern: "daily 5pm-6pm" or "every day 9am-5pm"
    const dailyMatch = part.match(/(daily|every\s*day)\s+(\d{1,2}(?::\d{2})?)\s*(am|pm)?\s*[-–to]+\s*(\d{1,2}(?::\d{2})?)\s*(am|pm)?/i)
    if (dailyMatch) {
      const openStr = dailyMatch[2] + (dailyMatch[3] || '')
      const closeStr = dailyMatch[4] + (dailyMatch[5] || '')
      const openTime = parseTime(openStr)
      const closeTime = parseTime(closeStr)

      if (openTime !== null && closeTime !== null) {
        for (let day = 0; day <= 6; day++) {
          schedule.push({ day, openTime, closeTime })
        }
        continue
      }
    }

    // Simple time range pattern: "9am-5pm" (assume weekdays)
    const timeOnlyMatch = part.match(/^(\d{1,2}(?::\d{2})?)\s*(am|pm)?\s*[-–to]+\s*(\d{1,2}(?::\d{2})?)\s*(am|pm)?$/i)
    if (timeOnlyMatch) {
      const openStr = timeOnlyMatch[1] + (timeOnlyMatch[2] || '')
      const closeStr = timeOnlyMatch[3] + (timeOnlyMatch[4] || '')
      const openTime = parseTime(openStr)
      const closeTime = parseTime(closeStr)

      if (openTime !== null && closeTime !== null) {
        // Assume Mon-Fri for bare time ranges
        for (let day = 1; day <= 5; day++) {
          schedule.push({ day, openTime, closeTime })
        }
        continue
      }
    }
  }

  return {
    isAlwaysOpen: false,
    hasHoursData: schedule.length > 0,
    schedule
  }
}

export function isOpenNow(hoursString: string | null): boolean | null {
  const parsed = parseHours(hoursString)

  // If no hours data, return null (unknown)
  if (!parsed.hasHoursData) {
    return null
  }

  // If always open, return true
  if (parsed.isAlwaysOpen) {
    return true
  }

  // Check current time against schedule
  const now = new Date()
  const currentDay = now.getDay()
  const currentMinutes = now.getHours() * 60 + now.getMinutes()

  const todaySchedule = parsed.schedule.filter(s => s.day === currentDay)

  if (todaySchedule.length === 0) {
    return false
  }

  return todaySchedule.some(s =>
    currentMinutes >= s.openTime && currentMinutes < s.closeTime
  )
}
