import { SCHEMA, DEFAULT_VALUES } from './const';
import { prepareRRuleData } from './helpers'
import { useForm } from "react-hook-form";
import RRule from 'rrule';
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from 'react';
import SchedulingSettings from './SchedulingSettings';
import OutputComponent from './OutputComponent';

export function App() {
  const { register, handleSubmit, watch, getValues, formState: { errors } } = useForm({
    resolver: yupResolver(SCHEMA),
    defaultValues: DEFAULT_VALUES
  });

  const [rruleOptions, setRRuleOptions] = useState();
  const [rrule, setRRule] = useState();
  const [timezone, setTimezone] = useState()

  const [freq, onMonthly, endType] = watch(['freq', 'onMonthly', 'endType'])

  const onSubmit = data => {
    const options = prepareRRuleData(data)
    setTimezone(data.timezone)
    setRRuleOptions(options)
    setRRule(new RRule(options))
  };

  return (
    <div className='container mx-auto p-4 my-12'>
      <div className='grid grid-cols-2 gap-4'>
        <SchedulingSettings
          register={register}
          handleSubmit={handleSubmit}
          onSubmit={onSubmit}
          errors={errors}
          freq={freq}
          onMonthly={onMonthly}
          endType={endType}
        />
        <OutputComponent
          rrule={rrule}
          rruleOptions={rruleOptions}
          timezone={timezone}
          getValues={getValues}
        />
      </div>
    </div>
  );
}