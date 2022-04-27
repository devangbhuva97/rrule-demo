import { RRule } from 'rrule';
import moment from 'moment-timezone'
import * as yup from "yup";

export const FREQUENCIES = [
  {
    value: RRule.DAILY,
    label: 'Daily',
  },
  {
    value: RRule.WEEKLY,
    label: 'Weekly',
  },
  {
    value: RRule.MONTHLY,
    label: 'Monthly',
  },
  {
    value: RRule.YEARLY,
    label: 'Yearly',
  }
]

export const WEEKDAYS = [
  {
    value: 'MO',
    label: 'Monday',
  },
  {
    value: 'TU',
    label: 'Tuesday',
  },
  {
    value: 'WE',
    label: 'Wednesday',
  },
  {
    value: 'TH',
    label: 'Thursday',
  },
  {
    value: 'FR',
    label: 'Friday',
  },
  {
    value: 'SA',
    label: 'Saturday',
  },
  {
    value: 'SU',
    label: 'Sunday',
  }
]

export const MONTHS = [
  {
    value: 1,
    label: 'January',
  },
  {
    value: 2,
    label: 'February',
  },
  {
    value: 3,
    label: 'March',
  },
  {
    value: 4,
    label: 'April',
  },
  {
    value: 5,
    label: 'May',
  },
  {
    value: 6,
    label: 'June',
  },
  {
    value: 7,
    label: 'July',
  },
  {
    value: 8,
    label: 'August',
  },
  {
    value: 9,
    label: 'September',
  },
  {
    value: 10,
    label: 'October',
  },
  {
    value: 11,
    label: 'November',
  },
  {
    value: 12,
    label: 'December',
  }
]

export const DAYS = [
  {
    value: 1,
    label: '1st',
  },
  {
    value: 2,
    label: '2nd',
  },
  {
    value: 3,
    label: '3rd',
  },
  {
    value: 4,
    label: '4th',
  },
  {
    value: 5,
    label: '5th',
  },
  {
    value: 6,
    label: '6th',
  },
  {
    value: 7,
    label: '7th',
  },
  {
    value: 8,
    label: '8th',
  },
  {
    value: 9,
    label: '9th',
  },
  {
    value: 10,
    label: '10th',
  },
  {
    value: 11,
    label: '11th',
  },
  {
    value: 12,
    label: '12th',
  },
  {
    value: 13,
    label: '13th',
  },
  {
    value: 14,
    label: '14th',
  },
  {
    value: 15,
    label: '15th',
  },
  {
    value: 16,
    label: '16th',
  },
  {
    value: 17,
    label: '17th',
  },
  {
    value: 18,
    label: '18th',
  },
  {
    value: 19,
    label: '19th',
  },
  {
    value: 20,
    label: '20th',
  },
  {
    value: 21,
    label: '21st',
  },
  {
    value: 22,
    label: '22nd',
  },
  {
    value: 23,
    label: '23rd',
  },
  {
    value: 24,
    label: '24th',
  },
  {
    value: 25,
    label: '25th',
  },
  {
    value: 26,
    label: '26th',
  },
  {
    value: 27,
    label: '27th',
  },
  {
    value: 28,
    label: '28th',
  },
  {
    value: -1,
    label: 'last',
  }
]

const ALLOWED_DAYS = [...Array.from(Array(28), (_, i) => i + 1), -1]
const ALLOWED_MONTHS = [...Array.from(Array(12), (_, i) => i + 1)]

export const SCHEMA = yup.object({
  freq: yup.mixed().oneOf([RRule.DAILY, RRule.WEEKLY, RRule.MONTHLY, RRule.YEARLY]).required(),
  interval: yup.number().positive().integer().required('Enter interval'),
  onMonthly: yup.mixed().when('freq', (freq) => {
    if (freq === RRule.MONTHLY) return yup.mixed().oneOf([-1, 0, 1, 2, 3, 4]).required()
  }),
  day: yup.mixed().when(['freq', 'onMonthly'], (freq, onMonthly) => {
    if (freq === RRule.YEARLY || (freq === RRule.MONTHLY && onMonthly === 0)) {
      return yup.mixed().oneOf(ALLOWED_DAYS).required()
    }
  }),
  weekday: yup.mixed().when(['freq', 'onMonthly'], (freq, onMonthly) => {
    if (freq === RRule.WEEKLY || (freq === RRule.MONTHLY && onMonthly !== 0)) {
      return yup.mixed().oneOf(['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU']).required()
    }
  }),
  month: yup.mixed().when('freq', (freq) => {
    if (freq === RRule.YEARLY) return yup.mixed().oneOf(ALLOWED_MONTHS).required()
  }),
  dtstart: yup.date().nullable().transform((curr, orig) => orig === '' ? null : curr).required(),
  endType: yup.mixed().oneOf(['', 'by', 'after']).required(),
  until: yup.mixed().when('endType', (endType) => {
    if (endType === 'by') return yup.date().required()
  }),
  count: yup.mixed().when('endType', (endType) => {
    if (endType === 'after') return yup.number().nullable().positive().integer().required()
  }),
  time: yup.string().optional(),
  timezone: yup.string().required(),
  afterDate: yup.date().nullable().transform((curr, orig) => orig === '' ? null : curr).optional(),
  afterTime: yup.string().optional(),
});

export const DEFAULT_VALUES = {
  freq: RRule.MONTHLY,
  onMonthly: 0,
  day: 1,
  weekday: RRule.MO.toString(),
  month: 1,
  interval: 1,
  dtstart: moment().format('YYYY-MM-DD'),
  timezone: moment.tz.guess()
}

export const TIMEZONES = moment.tz.names()
.reduce((memo, tz) => {
  const name = tz
  const offset = moment.tz(name).utcOffset()
  const timezone = offset ? moment.tz(name).format('Z') : ''
  memo.push({
    value: name,
    offset: moment.tz(tz).utcOffset(),
    label: `(GMT${timezone}) ${name}`
  });
  
  return memo;
}, [])
.sort((a, b) => {
  return a.offset - b.offset
})

