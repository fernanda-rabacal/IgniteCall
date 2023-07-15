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

  const { year, month } = req.query

  if(!month || !year) {
    return res.status(400).json({message: 'Year or month not provided'})
  }

  const user = await prisma.user.findUnique({
    where: {
      username
    }
  })
  
  if(!user) {
    return res.status(400).json({message: 'User does not exists'})
  }

  const availableWeekDays = await prisma.userTimeInterval.findMany({
    select: {
      week_day: true
    },
    where: {
      user_id: user.id,
    }
  })

  const blockedWeekDays = [0, 1, 2, 3, 4, 5, 6].filter(weekDay => {
    return !availableWeekDays.some(day => day.week_day === weekDay)
  })

  const blockedDatesRaw: Array<{date: number}> = await prisma.$queryRaw`
    SELECT 
     EXTRACT(DAY FROM S.date) AS date,
     COUNT(S.date) AS amount,
     ((UTI.time_end_in_minutes - UTI.time_start_in_minutes) / 60) AS size

    FROM schedulings AS S

    LEFT JOIN user_time_intervals AS UTI 
      ON UTI.week_day = WEEKDAY(DATE_ADD(S.date, INTERVAL 1 DAY))

    WHERE S.user_id = ${user.id}
    AND DATE_FORMAT(S.date, "%Y-%m") = ${`${year}-${month}`}

    GROUP BY EXTRACT(DAY FROM S.date),
    ((UTI.time_end_in_minutes - UTI.time_start_in_minutes) / 60)

    HAVING amount >= size 
  `
  const blockedDates = blockedDatesRaw.map(item => item.date)


  return res.status(200).json({blockedWeekDays, blockedDates})
}