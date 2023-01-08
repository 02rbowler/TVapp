import moment from "moment"

type Schedule = {
  minutesLength: string
  startTime: string
  title: string
  unliked?: boolean
}

export type GuideData = {
  channel: string
  schedule: Schedule[]
}

export const getGuideData = async (): Promise<GuideData[]> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_NETLIFY_ENDPOINT}.netlify/functions/getGuideFromDB`,
    );
    const json = await response.json();
    return json;
  } catch {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_HEROKU_BACKEND}/getGuideFromDB`,
    );
    const json = await response.json();
    return json;
  }
}

// export const getFreeviewGuideData = async (): Promise<GuideData[]> => {
//   const freeviewRes = await fetch(process.env.NEXT_PUBLIC_NETLIFY_ENDPOINT + '.netlify/functions/getFreeviewTV')
//   const freeviewJson = await freeviewRes.json()
//   if(!freeviewJson) {
//     return []
//   }

//   const starts = moment("18:00", "HH:mm");
//   const ends = moment("18:28", "HH:mm")
//   const minutesLength = ends.diff(starts, "minutes")
//   console.log(minutesLength)

//   const toReturn: GuideData[] = []
//   Object.keys(freeviewJson).forEach(element => {
//     toReturn.push({
//       channel: freeviewJson[element].shows[0].displayName,
//       schedule: freeviewJson[element].shows
//     })
//   });
//   return toReturn;
// }