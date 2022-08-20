type Schedule = {
  minutesLength: string
  startTime: string
  title: string
}

export type GuideData = {
  channel: string
  schedule: Schedule[]
}

export const getGuideData = async (): Promise<GuideData[]> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_HEROKU_BACKEND}/tvGuideData`,
  );
  const json = await response.json();
  return json;
}