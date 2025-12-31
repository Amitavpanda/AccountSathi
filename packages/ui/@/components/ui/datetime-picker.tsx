"use client"

import React from "react"
import DateTimePicker from "react-datetime-picker"
import "react-datetime-picker/dist/DateTimePicker.css"
import "react-calendar/dist/Calendar.css"
import "react-clock/dist/Clock.css"

export type DateTimePickerProps = React.ComponentProps<typeof DateTimePicker>

function DateTimePickerComponent({
  value,
  onChange,
  className,
  ...props
}: DateTimePickerProps) {
  // Convert className to string or undefined to match div's expected type
  const divClassName = Array.isArray(className) 
    ? className.filter(Boolean).join(' ') 
    : className || undefined;

  return (
    <div className={divClassName}>
      <DateTimePicker
        value={value}
        onChange={onChange}
        format="dd/MM/yyyy hh:mm a"
        locale="en-IN"
        disableClock={false}
        clearIcon={null}
        maxDetail="minute"
        className="w-full border border-gray-300 rounded-md p-2 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent"
        {...props}
      />
    </div>
  )
}

export { DateTimePickerComponent as DateTimePicker }
