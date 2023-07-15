import { 
  Container, 
  TimePicker, 
  TimePickerHeader, 
  TimePickerItem, 
  TimePickerList 
} from "./styles";
import { Calendar } from "@/components/Calendar";
import { api } from "@/lib/axios";
import { useRouter } from "next/router";
import { useState } from "react";
import { useQuery } from '@tanstack/react-query';
import dayjs from "dayjs";

interface Availability {
  possibleTimes: number[],
  availableTimes: number[]
}
interface CalendarStepProps {
  onSelectDateTime: (date: Date) => void
}

export function CalendarStep({ onSelectDateTime } : CalendarStepProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  
  const router = useRouter()
  const username = String(router.query.username)

  const selectedDateWithoutTime = selectedDate ? dayjs(selectedDate).format('YYYY-MM-DD') : null
  const isDateSelected = !!selectedDate

  const { data: availability } = useQuery<Availability>(['availability', selectedDateWithoutTime], async () => {
    const response = await api.get(`/users/${username}/availability`, {
      params: {
        date: selectedDateWithoutTime
      }
    })

    return response.data
  }, {
    enabled: isDateSelected
  })

  const weekDay = selectedDate ? dayjs(selectedDate).format('dddd') : null
  const describedDay = selectedDate ? dayjs(selectedDate).format('DD[ de ]MMMM') : null

  function handleSelectTime(hour: number) {
    const dateTime = dayjs(selectedDate)
      .set('hour', hour)
      .startOf('hour')
      .toDate()

      onSelectDateTime(dateTime)
  }

  return (
    <Container isTimePickerOpen={isDateSelected}>
      <Calendar selectedDate={selectedDate} onDateSelected={setSelectedDate} />

      {isDateSelected && (
        <TimePicker>
          <TimePickerHeader>
            {weekDay} <span>{describedDay}</span>
          </TimePickerHeader>

          <TimePickerList>
            {availability?.possibleTimes.map(hour => {
              return (
                <TimePickerItem 
                  key={hour} 
                  disabled={!availability.availableTimes.includes(hour)}
                  onClick={() => handleSelectTime(hour)}
                  >
                  {String(hour).padStart(2, '0')}:00h
                </TimePickerItem>
              )
            })}
          </TimePickerList>
        </TimePicker>
      )}
    </Container>
  )
}