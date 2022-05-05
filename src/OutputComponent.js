import moment from 'moment-timezone'
import { useMemo } from 'react';
import { calculateNextOccurence, calculateAllOccurences } from './helpers'

const OutputComponent = ({ rrule, rruleOptions, timezone, getValues }) => {
  
  const { rruleString, rruleText, occurrences, afterDateTime, nextOccurence } = useMemo(() => {
    if (!rrule) return {}
    const [afterDate, afterTime] = getValues(['afterDate', 'afterTime'])
    const { afterDateTime, nextOccurence } = calculateNextOccurence(rrule, afterDate, afterTime)
    return {
      rruleString: rrule.toString(),
      rruleText: rrule.toText(),
      occurrences: calculateAllOccurences(rrule),
      afterDateTime,
      nextOccurence
    }
  }, [rrule])

  return (
    <div className='p-8 border bg-green-50'>
      <h2 className='font-bold text-center text-xl mb-8'>Output</h2>
      <code className='text-sm'>
        <div className='flex-row space-y-8'>
          <div className='flex space-x-2'>
            <span className='font-bold'>Rule:</span>
            {
              rruleOptions && 
              <pre>
                {JSON.stringify(rruleOptions, null, 4)}
              </pre>
            }
          </div>
          <div className='flex space-x-2'>
            <span className='font-bold'>String:</span>
            {
              rruleString && 
              <span className='underline italic'>{rruleString}</span>
            }
          </div>
          <div className='flex space-x-2'>
            <span className='font-bold'>Text:</span>
            {
              rruleText && 
              <span className='capitalize underline italic'>{rruleText}</span>
            }
          </div>
          <div className='flex-row space-y-4'>
            <span className='font-bold'>Next Occurrence After{ afterDateTime && <span> ({ moment.tz(afterDateTime, timezone).format('llll') })</span> }:</span>
            {
              afterDateTime && 
              <table className="min-w-full divide-y divide-gray-300 text-center">
                <thead>
                  <tr>
                    <th scope="col" className="py-2 font-light sticky top-0 z-10 border-b border-gray-300 bg-gray-50">
                      {`(GMT${moment.tz(timezone).utcOffset() ? moment.tz(timezone).format('Z') : ''}) ${timezone}`}
                    </th>
                    <th scope="col" className="py-2 font-light sticky top-0 z-10 border-b border-gray-300 bg-gray-50">
                      UTC
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-green-200">
                  <tr>
                    <td className="py-1.5 font-light">{nextOccurence ? moment.tz(nextOccurence, timezone).format('llll') : '-'}</td>
                    <td className="py-1.5 font-light">{nextOccurence ? moment.utc(nextOccurence).format('llll') : '-'}</td>
                  </tr>
                </tbody>
              </table>
            }
          </div>
          <div className='flex-row space-y-4'>
            <span className='font-bold'>All Occurrences <span className='text-xs font-normal'>(max 100)</span>:</span>
            {
              occurrences && 
              <div className='flex overflow-y-auto max-h-96'>
                <table className="min-w-full divide-y divide-gray-300 text-center">
                  <thead>
                    <tr>
                      <th scope="col" className="py-2 font-light sticky top-0 z-10 border-b border-gray-300 bg-gray-50">
                        No.
                      </th>
                      <th scope="col" className="py-2 font-light sticky top-0 z-10 border-b border-gray-300 bg-gray-50">
                        {`(GMT${moment.tz(timezone).utcOffset() ? moment.tz(timezone).format('Z') : ''}) ${timezone}`}
                      </th>
                      <th scope="col" className="py-2 font-light sticky top-0 z-10 border-b border-gray-300 bg-gray-50">
                        UTC
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-green-200">
                    {occurrences?.map((oc, i) => {
                      const formattedOC = moment.tz(oc, timezone).format('llll')
                      const utcOC = moment.utc(oc).format('llll')
                      return (
                        <tr key={formattedOC}>
                          <td className="py-1.5 font-light">
                            {++i}
                          </td>
                          <td className="py-1.5 font-light">{formattedOC}</td>
                          <td className="py-1.5 font-light">{utcOC}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            }
          </div>
        </div>
      </code>
    </div>
  );
}

export default OutputComponent;