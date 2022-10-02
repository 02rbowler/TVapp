export const fetchWatchlist = async (): Promise<any[]> => {
  return fetch(process.env.NEXT_PUBLIC_OKTETO + '/getMyWatchlist?userId=1')
  .then(res => res.json())
  .then(res => {
    return res
  })
  .catch(err => {
    // Sentry.captureException("Reminders fetch failed: " + err);
  });
}

export const search = async (type: string, searchParam: string): Promise<any> => {
  const res = await fetch(`https://api.themoviedb.org/3/search/${type}?api_key=${process.env.NEXT_PUBLIC_TMDB_KEY}&query=${searchParam}`)
  const resJson = await res.json()
  return resJson
}

export const addToWatchlist = async ({
  accountNumber, 
  id, 
  type, 
  name,
  poster_path,
  backdrop_path,
  overview
}: {
  accountNumber: number | null, 
  id: number,
  type: string,
  name: string,
  poster_path: string,
  backdrop_path: string,
  overview: string
}) => {
  return fetch(process.env.NEXT_PUBLIC_NETLIFY_ENDPOINT + '.netlify/functions/addToWatchlist', {
    method: 'POST',
    body: JSON.stringify({
      userId: accountNumber,
      id,
      type,
      name,
      episode: "1.0",
      poster_path,
      backdrop_path,
      overview
    })
  })
  .then(res => res.json())
  .then(res => {
    // fetchReminders(account, channel, accountNumber);
    return res
  })
  .catch(err => {
    console.log(err)
    // Sentry.captureException("Reminders fetch failed: " + err);
  });
}

export const removeFromWatchlist = async (id: string) => {
  return fetch(process.env.NEXT_PUBLIC_NETLIFY_ENDPOINT + '.netlify/functions/removeFromWatchlist', {
    method: 'POST',
    body: JSON.stringify({
      id
    })
  })
  .then(res => res.json())
  .catch(err => {
    // Sentry.captureException("Reminders fetch failed: " + err);
  });
}

export const goToNextEpisode = async ({currentWatchlist, nextEpisode}: {currentWatchlist: any, nextEpisode?: string}) => {
  return fetch(process.env.NEXT_PUBLIC_NETLIFY_ENDPOINT + '.netlify/functions/updateWatchlist', {
    method: 'POST',
    body: JSON.stringify({
      ...currentWatchlist,
      episode: nextEpisode
    })
  })
  .then(res => res.json())
  .catch(err => {
    // Sentry.captureException("Reminders fetch failed: " + err);
  });
}
