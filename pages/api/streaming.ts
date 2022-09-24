import moment from "moment"

export const getMovieDiscover = async () => {
  const res = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${process.env.NEXT_PUBLIC_TMDB_KEY}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&vote_average.gte=6&with_watch_monetization_types=flatrate`)
  const json = await res.json()
  return json
}

export const getTVDiscover = async () => {
  const res = await fetch(`https://api.themoviedb.org/3/discover/tv?api_key=${process.env.NEXT_PUBLIC_TMDB_KEY}&with_original_language=en&sort_by=popularity.desc&page=1&timezone=America%2FNew_York&vote_average.gte=6&with_watch_monetization_types=flatrate`)
  const json = await res.json()
  return json
}

export const getTrending = async () => {
  const res = await fetch(`https://api.themoviedb.org/3/trending/all/week?api_key=${process.env.NEXT_PUBLIC_TMDB_KEY}`)
  const json = await res.json()
  return json
}

export const getSimilar = async (type: "movie" | "tv", id: string) => {
  const res = await fetch(`https://api.themoviedb.org/3/${type}/${id}/similar?api_key=${process.env.NEXT_PUBLIC_TMDB_KEY}`)
  const json = await res.json()
  return json
}

const NETFLIX_PROVIDER_ID = 8;
const UK_WATCH_REGION = "GB";

export const getNetflix = async () => {
  const dateToSearch = moment().subtract(3, 'months').format('YYYY-MM-DD');
  const [tv, movie] = await Promise.all([
    fetch(`https://api.themoviedb.org/3/discover/tv?api_key=${process.env.NEXT_PUBLIC_TMDB_KEY}&with_watch_providers=${NETFLIX_PROVIDER_ID}&watch_region=${UK_WATCH_REGION}&with_original_language=en&sort_by=popularity.desc&air_date.gte=${dateToSearch}`),
    fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${process.env.NEXT_PUBLIC_TMDB_KEY}&with_watch_providers=${NETFLIX_PROVIDER_ID}&watch_region=${UK_WATCH_REGION}&with_original_language=en&sort_by=popularity.desc&air_date.gte=${dateToSearch}`)
  ])
  const tvJson = await tv.json()
  const movieJson = await movie.json()
  return [...tvJson.results.slice(0, 6), ...movieJson.results.slice(0, 6)]
}
