import { FREQUENCIES, WEEKDAYS, MONTHS, DAYS, TIMEZONES } from './const';
import { prepareIntervalLabel } from './helpers'
import RRule from 'rrule';
import { Fragment, useMemo } from 'react';

const SchedulingSettings = ({ register, handleSubmit, onSubmit, errors, freq, onMonthly, endType }) => {

  const intervalLabel = useMemo(() => {
    return prepareIntervalLabel(freq)
  }, [freq])

  return (
    <div className='p-8 border bg-gray-50'>
      <form onSubmit={handleSubmit(onSubmit)}>
        <h2 className='font-bold text-center text-xl mb-8'>Scheduling Settings</h2>
        <div>
          <h3 className="text-md leading-6 font-medium text-gray-900">Interval</h3>
        </div>
        <div className="flex items-center space-x-2 mt-4">
          <select
            {...register("freq", { valueAsNumber: true })}
            id="freq"
            name="freq"
            className={`block shadow-sm text-sm border-gray-300 rounded-md ${errors?.freq ? 'border-red-300 focus:border-red-300 !ring-red-300' : ''}`}
          >
            {FREQUENCIES.map(({ value, label }) => (<option key={value} value={value}>{label}</option>))}
          </select>
          {
            freq !== RRule.DAILY && <div>on</div>
          }
          {
            freq === RRule.MONTHLY &&
            <select
              {...register("onMonthly", { valueAsNumber: true })}
              id="onMonthly"
              name="onMonthly"
              className={`block shadow-sm text-sm border-gray-300 rounded-md ${errors?.onMonthly ? 'border-red-300 focus:border-red-300 !ring-red-300' : ''}`}
            >
              <option value={0}>day</option>
              <option value={1}>first</option>
              <option value={2}>second</option>
              <option value={3}>third</option>
              <option value={4}>fourth</option>
              <option value={-1}>last</option>
            </select>
          }
          {
            (freq === RRule.WEEKLY || (freq === RRule.MONTHLY && onMonthly > 0)) &&
            <select
              {...register("weekday")}
              id="weekday"
              name="weekday"
              className={`block shadow-sm text-sm border-gray-300 rounded-md ${errors?.weekday ? 'border-red-300 focus:border-red-300 !ring-red-300' : ''}`}
            >
              {WEEKDAYS.map(({ value, label }) => (<option key={value} value={value}>{label}</option>))}
            </select>
          }
          {
            (freq === RRule.YEARLY || (freq === RRule.MONTHLY && onMonthly === 0)) &&
            <select
              {...register("day", { valueAsNumber: true })}
              id="day"
              name="day"
              className={`block shadow-sm text-sm border-gray-300 rounded-md ${errors?.day ? 'border-red-300 focus:border-red-300 !ring-red-300' : ''}`}
            >
              {DAYS.map(({ value, label }) => (<option key={value} value={value}>{label}</option>))}
            </select>
          }
          {
            freq === RRule.YEARLY &&
            <select
              {...register("month", { valueAsNumber: true })}
              id="month"
              name="month"
              className={`block shadow-sm text-sm border-gray-300 rounded-md ${errors?.month ? 'border-red-300 focus:border-red-300 !ring-red-300' : ''}`}
            >
              {MONTHS.map(({ value, label }) => (<option key={value} value={value}>{label}</option>))}
            </select>
          }
          <div>of every</div>
          <input
            {...register("interval", { valueAsNumber: true })}
            type="number"
            name="interval"
            id="interval"
            className={`block shadow-sm text-sm border-gray-300 rounded-md w-16 ${errors?.interval ? 'border-red-300 focus:border-red-300 !ring-red-300' : ''}`}
          />
          <div>{intervalLabel}</div>
        </div>
        <div className='flex space-x-8 mt-8'>
          <div>
            <div>
              <h3 className="text-md leading-6 font-medium text-gray-900">Start Date</h3>
            </div>
            <div className="flex items-center space-x-2 mt-4">
              <input
                {...register("dtstart")}
                type="date"
                name="dtstart"
                id="dtstart"
                className={`block shadow-sm text-sm border-gray-300 rounded-md ${errors?.dtstart ? 'border-red-300 focus:border-red-300 !ring-red-300' : ''}`}
              />
            </div>
          </div>
          <div>
            <div>
              <h3 className="text-md leading-6 font-medium text-gray-900">End</h3>
            </div>
            <div className="flex items-center space-x-2 mt-4">
              <select
                {...register("endType")}
                id="endType"
                name="endType"
                className={`block shadow-sm text-sm border-gray-300 rounded-md ${errors?.endType ? 'border-red-300 focus:border-red-300 !ring-red-300' : ''}`}
              >
                <option value=''>None</option>
                <option value='by'>By</option>
                <option value='after'>After</option>
              </select>
              {
                endType === 'by' &&
                <input
                  {...register("until")}
                  type="date"
                  name="until"
                  id="until"
                  className={`block shadow-sm text-sm border-gray-300 rounded-md ${errors?.until ? 'border-red-300 focus:border-red-300 !ring-red-300' : ''}`}
                />
              }
              {
                endType === 'after' &&
                <Fragment>
                  <input
                    {...register("count", { valueAsNumber: true })}
                    type="number"
                    name="count"
                    id="count"
                    className={`block shadow-sm text-sm border-gray-300 rounded-md w-16 ${errors?.count ? 'border-red-300 focus:border-red-300 !ring-red-300' : ''}`}
                  />
                  <div>occurrences</div>
                </Fragment>
              }
            </div>
          </div>
        </div>
        <div className='flex space-x-8 mt-8'>
          <div>
            <div>
              <h3 className="text-md leading-6 font-medium text-gray-900">Timezone</h3>
            </div>
            <div className="mt-4">
              <select
                {...register("timezone")}
                id="timezone"
                name="timezone"
                className={`block shadow-sm text-sm border-gray-300 rounded-md ${errors?.timezone ? 'border-red-300 focus:border-red-300 !ring-red-300' : ''}`}
              >
                {TIMEZONES.map(({ value, label }) => (<option key={value} value={value}>{label}</option>))}
              </select>
            </div>
          </div>
          <div>
            <div>
              <h3 className="text-md leading-6 font-medium text-gray-900">Time <span className='text-xs font-normal'>(Optional)</span></h3>
            </div>
            <div className="mt-4">
              <input
                {...register("time")}
                type="time"
                name="time"
                id="time"
                className={`block shadow-sm text-sm border-gray-300 rounded-md ${errors?.time ? 'border-red-300 focus:border-red-300 !ring-red-300' : ''}`}
              />
            </div>
          </div>
        </div>
        <div className='mt-8'>
          <h3 className="text-md leading-6 font-medium text-gray-900">Next Occurrence After <span className='text-xs font-normal'>(Optional)</span></h3>
        </div>
        <div className='flex space-x-8'>
          <div className="flex items-center space-x-4 mt-4">
            <input
              {...register("afterDate")}
              type="date"
              name="afterDate"
              id="afterDate"
              className={`block shadow-sm text-sm border-gray-300 rounded-md ${errors?.afterDate ? 'border-red-300 focus:border-red-300 !ring-red-300' : ''}`}
            />
            <input
              {...register("afterTime")}
              type="time"
              name="afterTime"
              id="afterTime"
              className={`block shadow-sm text-sm border-gray-300 rounded-md ${errors?.afterTime ? 'border-red-300 focus:border-red-300 !ring-red-300' : ''}`}
            />
          </div>
        </div>
        <div className='flex space-x-8 justify-end'>
          <button
            type="submit"
            className="py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 mt-8 w-28"
          >
            Preview
          </button>
        </div>
      </form>
    </div>
  );
}

export default SchedulingSettings