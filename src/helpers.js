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
  if (data.freq === RRule.WEEKLY) options.wkst = data.weekday
  if (data.freq === RRule.MONTHLY) {
    if (data.onMonthly === 0) options.bymonthday = data.day
    else options.byweekday = RRule[data.weekday].nth(data.onMonthly)
  }
  if (data.freq === RRule.YEARLY) {
    options.bymonth = data.month
    options.bymonthday = data.day
  }
  if (data.endType === 'by') {
    const [year, month, date] =getYearMonthDate(data.until)
    options.until = new Date(Date.UTC(year, month, date, 23, 59, 59))
  }
  if (data.endType === 'after') options.count = data.count
  return options
}

export const calculateNextOccurence = (rrule, afterDate, afterTime) => {
  if (!afterDate) return {}
  const [year, month, date] = getYearMonthDate(afterDate)
  const [hour = 0, minute = 0] = afterTime?.split(':')
  const afterDateTime = new Date(Date.UTC(year, month, date, hour, minute))
  const nextOccurence = rrule.after(afterDateTime, true)
  return { afterDateTime, nextOccurence }
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