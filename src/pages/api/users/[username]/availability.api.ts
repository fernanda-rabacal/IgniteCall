import { prisma } from "@/lib/prisma";
import dayjs from "dayjs";
import { NextApiRequest, NextApiResponse } from "next";

//rota de verificação de horários disponíveis

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if(req.method !== 'GET') {
    return res.status(405).end()
  }

  //a rota vai ter o username e o dia a verificar disponibilidade
  const username = String(req.query.username)

  const { date } = req.query

  if(!date) {
    return res.status(400).json({message: 'Date not provided'})
  }

  const user = await prisma.user.findUnique({
    where: {
      username
    }
  })
  
  if(!user) {
    return res.status(400).json({message: 'User does not exists'})
  }

  const referenceDate = dayjs(String(date))
  const isPastDate = referenceDate.endOf('day').isBefore(new Date())

  if(isPastDate) {
    return res.json({possibleTimes: [], availableTimes: []})
  }

  //captar horarios que o usuário deixou disponiveis naquele dia específico
  const userAvailability = await prisma.userTimeInterval.findFirst({
    where: {
      user_id: user.id,
      week_day: referenceDate.get('day')
    }
  })

  if(!userAvailability) {
    return res.json({possibleTimes: [], availableTimes: []})
  }

  const { time_start_in_minutes, time_end_in_minutes } = userAvailability

  //captar o intervalo de horarios do dia, que está em minutos
  const startHour = time_start_in_minutes / 60
  const endHour = time_end_in_minutes / 60

  //array de intervalo de horarios talvez liberados em horas
  const possibleTimes = Array.from({
    length: endHour - startHour
  }).map((_, i) => {
    return startHour + i
  })

  //captar horarios já marcados para esta data
  const blockedTimes = await prisma.scheduling.findMany({
    select: {
      date: true
    },
    where: {
      user_id: user.id,
      date: {
        gte: referenceDate.set('hour', startHour).toDate(), //maior que o horario de inicio
        lte: referenceDate.set('hour', endHour).toDate(), //menor que o horario final
      }
    }
  })

  /*intercessão entre horarios possivelmente disponiveis e horarios já marcados
  para descobrir os horarios realmente disponíveis */
  const availableTimes = possibleTimes.filter(time => {
    const isTimeBlocked = blockedTimes.some(
        (blockedTime) => blockedTime.date.getHours() === time
      )
    const isTimeInPast = referenceDate.set('hour', time).isBefore(new Date())

    return !isTimeBlocked && !isTimeInPast
  })

  return res.status(200).json({possibleTimes, availableTimes})
}