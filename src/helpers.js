import { RRule } from 'rrule';
import moment from 'moment-timezone'

const getYearMonthDate = (date) => {
  return [
    moment(date).get('year'),
    moment(date).get('month'),
    moment(date).get('date'),
  ]
}

export const prepareRRuleData = (data) => {
  const [year, month, date] = getYearMonthDate(data.dtstart)
  const [hour = 0, minute = 0] = data.time?.split(':')
  const options = {
    freq: data.freq,
    interval: data.interval,
    dtstart: new Date(Date.UTC(year, month, date, hour, minute)),
  }
  if (data.freq === RRule.WEEKLY) options.byweekday = RRule[data.weekday]
  if (data.freq === RRule.MONTHLY) {
    if (data.onMonthly === 0) options.bymonthday = data.day
    else options.byweekday = RRule[data.weekday].nth(data.onMonthly)
  }
  if (data.freq === RRule.YEARLY) {
    options.bymonth = data.month
    options.bymonthday = data.day
  }
  if (data.endType === 'by') {
    const [year, month, date] = getYearMonthDate(data.until)
    options.until = new Date(Date.UTC(year, month, date, 23, 59, 59))
  }
  if (data.endType === 'after') options.count = data.count
  return options
}

const parseDateTimeWithTimezone = (dt, timezone = 'UTC') => {
  const timezoneOffset = moment.tz(timezone).utcOffset()
  return moment.utc(dt).add(timezoneOffset, 'minutes') // utc to timezone without changing timezone
}

export const calculateAllOccurences = (rrule, timezone) => {
  return rrule.all((date, i) => i < 100).map(dt => {
    return parseDateTimeWithTimezone(dt, timezone)
  })
}

export const calculateNextOccurence = (rrule, timezone, afterDate, afterTime) => {
  if (!afterDate) return {}
  const [year, month, date] = getYearMonthDate(afterDate)
  const [hour = 0, minute = 0] = afterTime?.split(':')
  const afterDateTime = new Date(Date.UTC(year, month, date, hour, minute))
  const nextOccurence = rrule.after(afterDateTime, true)
  return { 
    afterDateTime: parseDateTimeWithTimezone(afterDateTime, timezone), 
    nextOccurence: nextOccurence && parseDateTimeWithTimezone(nextOccurence, timezone) 
  }
}

export const prepareIntervalLabel = (freq) => {
  switch (freq) {
    case RRule.DAILY:
      return 'day(s)'
    case RRule.WEEKLY:
      return 'week(s)'
    case RRule.MONTHLY:
      return 'month(s)'
    case RRule.YEARLY:
      return 'year(s)'
  }
}