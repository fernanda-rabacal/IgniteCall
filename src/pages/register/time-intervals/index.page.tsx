import { Container, Header } from "../styles";
import { 
  Heading, 
  Text, 
  MultiStep, 
  Button, 
  Checkbox, 
  TextInput 
} from '@ignite-ui/react'
import { 
  IntervalBox, 
  IntervalDay, 
  IntervalInputs, 
  IntervalItem, 
  IntervalsContainer 
} from "./styles";
import { ArrowRight } from "phosphor-react";
import { useFieldArray, useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from '@hookform/resolvers/zod'
import { getWeekDays } from "@/utils/get-week-days";

const timeIntervalsSchema = z.object({

})


export default function TimeIntervals() {
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: {
      isSubmitting,
      errors
    }
  } = useForm({
    defaultValues: {
      intervals: [
        { weekDay: 0, enabled: false, startTime: '08:00', endTime: '18:00'},
        { weekDay: 1, enabled: true, startTime: '08:00', endTime: '18:00'},
        { weekDay: 2, enabled: true, startTime: '08:00', endTime: '18:00'},
        { weekDay: 3, enabled: true, startTime: '08:00', endTime: '18:00'},
        { weekDay: 4, enabled: true, startTime: '08:00', endTime: '18:00'},
        { weekDay: 5, enabled: true, startTime: '08:00', endTime: '18:00'},
        { weekDay: 6, enabled: false, startTime: '08:00', endTime: '18:00'},
      ]
    },
    resolver: zodResolver(timeIntervalsSchema)
  })

  const weekDays = getWeekDays()

  const { fields } = useFieldArray({
    name: 'intervals',
    control
  })

  const intervals = watch('intervals')

  async function handleSetTimeIntervals() {

  }

  return(
    <Container>
      <Header>
        <Heading as="strong">Quase lá!</Heading>
        <Text>
          Defina o intervalo de horários que você está 
          disponível em cada dia da semana.
        </Text>

        <MultiStep size={4} currentStep={3}/>
      </Header>

      <IntervalBox as="form" onSubmit={handleSubmit(handleSetTimeIntervals)}>
        <IntervalsContainer>
          
          {fields.map((field, index) => {
            return (
              <IntervalItem key={field.id}>
                <IntervalDay>
                  <Controller 
                    name={`intervals.${index}.enabled`} 
                    control={control} 
                    render={({ field }) => {
                      return (
                        <Checkbox 
                          onCheckedChange={checked => {
                            field.onChange(checked === true)
                          }}
                          checked={field.value}
                        />
                      )}}
                    />
                  
                  <Text>{weekDays[field.weekDay]}</Text>
                </IntervalDay>
                <IntervalInputs>
                  <TextInput 
                    size="sm"
                    type="time"
                    step={60}
                    disabled={!intervals[index].enabled}
                    {...register(`intervals.${index}.startTime`)}
                    />
                  <TextInput 
                    size="sm"
                    type="time"
                    step={60}
                    disabled={!intervals[index].enabled}
                    {...register(`intervals.${index}.endTime`)}
                  />
                </IntervalInputs>
              </IntervalItem>
            )
          })}
        </IntervalsContainer>

        <Button type="submit">
          Proximo passo

          <ArrowRight />
        </Button>
      </IntervalBox>
      
    </Container>
  )
}
