export const nextEpisodeTranslation = (nextEpisode?: string) => {
  if(!nextEpisode) {
    return "S1 E1";
  }
  
  const [season, episode] = nextEpisode.split('.');
  return `S${season} E${episode}`;
}