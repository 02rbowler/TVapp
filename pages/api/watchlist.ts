export const fetchWatchlist = async (): Promise<any[]> => {
  return fetch(process.env.NEXT_PUBLIC_OKTETO + '/getMyWatchlist?userId=1')
  .then(res => res.json())
  .then(res => {
    // setListData(res);
    return res
  })
  .catch(err => {
    // Sentry.captureException("Reminders fetch failed: " + err);
  });
}