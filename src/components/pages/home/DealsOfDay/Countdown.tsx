import { FC, useEffect, useState } from 'react'

type Countdown = {
  endDate: string,
}

const Countdown: FC<Countdown> = ({ endDate }) => {
  const [TimeCountDown, setTimeCountDown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    const second = 1000,
      minute = second * 60,
      hour = minute * 60,
      day = hour * 24

    let countDown = new Date(endDate).getTime()
    const x = setInterval(function () {
      let now = new Date().getTime(),
        distance = countDown - now

      setTimeCountDown({
        days: Math.floor(distance / day),
        hours: Math.floor((distance % day) / hour),
        minutes: Math.floor((distance % hour) / minute),
        seconds: Math.floor((distance % minute) / second),
      })

      //do something later when date is reached
      if (distance < 0) {
        clearInterval(x)
      }
    }, second)

    return () => clearInterval(x)
  })

  if (!endDate) return null

  return (
    <div className="counter-numbers">
      <div className="c-card">
        <span id="days">{TimeCountDown.days}</span>
        <small>d</small>
      </div>
      <div className="c-card">
        <span id="hours">{TimeCountDown.hours}</span>
        <small>h</small>
      </div>
      <div className="c-card">
        <span id="minutes">{TimeCountDown.minutes}</span>
        <small>m</small>
      </div>
      <div className="c-card">
        <span id="seconds">{TimeCountDown.seconds}</span>
        <small>s</small>
      </div>
    </div>
  )
}

export default Countdown
