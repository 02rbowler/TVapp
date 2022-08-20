import moment from 'moment';
import { TimelineItem } from './TimelineItem';

interface Timeline {
  current: moment.Moment
}

export const Timeline = ({current}: Timeline) => {
  const getTimeLeft = (current: any) => {
    const endTime = moment('11:30pm', ['h:mm a']);
    const duration = moment.duration(endTime.diff(current));
    const timeLeft = duration.asMinutes() % 60;
    const minutesToUse = timeLeft <= 30 ? timeLeft : timeLeft - 30;
    const minPerPixel = 30 / 365;
  
    return minutesToUse / minPerPixel;
  };
  
  const getTimeMark = (stepNumber: number) => {
    const start = current;
    const remainder = 30 - (start.minute() % 30);

    const dateTime = moment(current)
      .add(remainder + stepNumber * 30, 'minutes')
      .format('h:mma');

    return dateTime;
  };

  const compareTime = moment('23:59pm', ['h:mm a']);
  const duration = moment.duration(compareTime.diff(current));
  const minutesLeftInDay = duration.asMinutes();
  const intervals = Math.floor(minutesLeftInDay / 30);

  return (
    <>
      <TimelineItem widthOverride={getTimeLeft(current)} timeValue="Now" />
      {[...Array(intervals)].map((_, i) => (
        <TimelineItem key={i} timeValue={getTimeMark(i)} />
      ))}
    </>
  )
}