export const fetchWatchlist = async (): Promise<any[]> => {
  return fetch(process.env.NEXT_PUBLIC_OKTETO + '/getMyWatchlist?userId=1')
  .then(res => res.json())
  .then(res => {
    // setListData(res);
    console.log(res)
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
  episode,
  poster_path
}: {
  accountNumber: number | null, 
  id: number,
  type: string,
  name: string,
  episode: string,
  poster_path: string
}) => {
  return fetch(process.env.NEXT_PUBLIC_NETLIFY_ENDPOINT + '.netlify/functions/addToWatchlist', {
    method: 'POST',
    body: JSON.stringify({
      userId: accountNumber,
      id,
      type,
      name,
      episode,
      poster_path
    })
  })
  // .then(res => res.json())
  .then(res => {
    // fetchReminders(account, channel, accountNumber);
    return res
  })
  .catch(err => {
    // Sentry.captureException("Reminders fetch failed: " + err);
  });
}
