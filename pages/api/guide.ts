import moment from "moment"

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

export const getFreeviewGuideData = async (): Promise<GuideData[]> => {
  const freeviewRes = await fetch(process.env.NEXT_PUBLIC_NETLIFY_ENDPOINT + '.netlify/functions/getFreeviewTV')
  const freeviewJson = await freeviewRes.json()
  if(!freeviewJson) {
    return []
  }

  const toReturn: GuideData[] = []
  Object.keys(freeviewJson).forEach(element => {
    toReturn.push({
      channel: freeviewJson[element].shows[0].displayName,
      schedule: freeviewJson[element].shows
    })
  });
  return toReturn;
}