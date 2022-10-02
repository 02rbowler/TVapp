import moment from "moment";

export const nextEpisodeTranslation = (nextEpisode?: string) => {
  if(!nextEpisode) {
    return "S1 E1";
  }
  
  const [season, episode] = nextEpisode.split('.');
  return `S${season} E${episode}`;
}

export const nextEpisodeToAirTranslation = (nextEpisode: any) => {
  const date = moment(nextEpisode["air_date"])
  return date.format("D MMMM")
}
