import { useEffect, useState } from "react"
import styled from "styled-components"
import { getDetails } from "../../pages/api/streaming"
import { addToWatchlist, goToNextEpisode, removeFromWatchlist } from "../../pages/api/watchlist"
import { Spinner } from "../Spinner"
import { nextEpisodeToAirTranslation, nextEpisodeTranslation } from "./helper"
import { useMutation, useQueryClient } from "react-query";

const Backdrop = styled.img`
  width: 100%;
  margin-left: auto;
  display: block;
  mask-image: linear-gradient(
    270deg,
    rgba(0,0,0) 0%,
    rgba(0,0,0) 44%,
    rgba(255,255,255, 0.98) 46%,
    rgba(255,255,255, 0) 90%
  )
`

const BackdropBottomFade = styled.div`
  background: linear-gradient(0deg, #070555, #07055500);
  height: 50px;
  position: absolute;
  width: 100%;
  bottom: 0;
`

const ShowTitle = styled.h1``

const OverviewText = styled.div`
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
`

const TextContent = styled.div`
  position: relative;
  padding-right: 60px;
  margin-bottom: 16px;
  height: calc(100% + 24px);
  max-width: 55%;
  min-height: 250px;
`

const BackdropRow = styled.div`
`

const ImageRow = styled.div`
  position: absolute;
  top: 0;
  min-width: 100%;
  left: 0;
  height: inherit;
`

const ButtonStack = styled.div`
  margin-top: 16px;
  display: flex;
  align-items: center;

  button {
    margin-right: 16px;
  }
`

const Button = styled.button`
  background: #6b759a;
  border: 1px solid white;
  color: white;
  font-size: 16px;
  border-radius: 5px;
  padding: 5px;
  min-width: 110px;

  &:disabled {
    opacity: 0.7;
  }
`

const ClearButton = styled(Button)<{selected: boolean}>`
  background: none;
  border: 0;
  text-align: left;
  ${props => props.selected ? "font-weight: bold;" : ''}
`

const Title = styled.div`
  font-size: 20px;
  margin-bottom: 8px;
`

const ImageDiv = styled.div`
  width: calc(14.28% - 8px);
  flex: none;
  margin-right: 8px;
  margin-bottom: 8px;
  box-sizing: border-box;

  img {
    width: 100%;
    overflow: hidden;
    border-radius: 10px;
  }
`

const Row = styled.div`
  position: relative;
  display: flex;
  margin-bottom: 16px;
  overflow-x: auto;
  width: calc(100% + 32px);
  padding-right: 32px;
`

interface MediaProps {
  tmdbId: string;
  mediaType: "tv" | "movie";
  similar: any[];
  watchlistItem?: any;
}

export const Media = ({tmdbId, mediaType, similar, watchlistItem}: MediaProps) => {
  const [ref, setRef] = useState(watchlistItem?.ref)
  const [details, setDetails] = useState<any>(null)
  const [mutating, setMutating] = useState(false)
  const [selectedSeason, setSelectedSeason] = useState(0)

  useEffect(() => {
    const go = async () => {
      const output = await getDetails(mediaType, tmdbId)
      setDetails(output)
    }

    go()
  }, [])

  const queryClient = useQueryClient()
  const addMutation = useMutation(addToWatchlist, {
    onSuccess: (data) => {
      // Invalidate and refetch
      queryClient.invalidateQueries('watchlist')
      const newRef = data.response["@ref"].id
      setRef(newRef)
    },
  })

  const removeMutation = useMutation(removeFromWatchlist, {
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries('watchlist')
    },
  })

  const updateMutation = useMutation(goToNextEpisode, {
    onSuccess: () => {
      queryClient.invalidateQueries('watchlist')
      setMutating(false)
      // const newRef = data.response["@ref"].id
      // setRef(newRef)
    },
    onError: () => {
      setMutating(false)
    }
  })

  const onClickWatchlistButton = async () => {
    if(ref) {
      removeMutation.mutate(ref)
      setRef("")
    } else {
      addMutation.mutate({
        accountNumber: 1, 
        id: details.id, 
        type: mediaType, 
        name: details.title || details.name, 
        poster_path: details.poster_path, 
        backdrop_path: details.backdrop_path, 
        overview: details.overview
      })
    }
  }

  const onClickNextEpisodeButton = async () => {
    setMutating(true)
    updateMutation.mutate({
      currentWatchlist: watchlistItem,
      nextEpisode: watchlistItem.type === "tv" ? watchlistItem.nextEpisode : undefined
    })
  }

  const onClickEpisodeButton = async (newValue: string) => {
    setMutating(true)
    updateMutation.mutate({
      currentWatchlist: watchlistItem,
      nextEpisode: newValue
    })
  }

  if(!details || !details.backdrop_path) {
    return <Spinner />
  }
console.log(details)
console.log(watchlistItem)

  const hasNextEpisodeAiredYet = () => {
    if(details.next_episode_to_air) {
      const nextEp = details.next_episode_to_air
      return `${nextEp.season_number}.${nextEp.episode_number}` !== watchlistItem.nextEpisode
    } else {
      const lastEpAired = details.last_episode_to_air;
      const watchlistEpisode = watchlistItem.nextEpisode.split('.');

      if(lastEpAired.season_number > parseInt(watchlistEpisode[0], 10)) {
        return true;
      } else {
        if(lastEpAired.season_number === parseInt(watchlistEpisode[0], 10)) {
          return lastEpAired.episode_number >= parseInt(watchlistEpisode[1], 10)
        } else {
          return false
        }
      }
    }
  }

  const displayedSeasons = mediaType === "tv" ?
    details.seasons.filter((seasonData: any) => seasonData.name.toLowerCase() !== 'specials')
    : []

  return <>
    <BackdropRow>
      <ImageRow>
        <Backdrop src={`https://www.themoviedb.org/t/p/w1920_and_h800_multi_faces/${details.backdrop_path}`} />
        {/* <Backdrop src={`https://image.tmdb.org/t/p/w500/${details.backdrop_path}`} /> */}
        <BackdropBottomFade />
      </ImageRow>
      <TextContent>
        <ShowTitle>{details.title || details.name}</ShowTitle>
        {watchlistItem ? 
          mediaType === "tv" &&
            watchlistItem.nextEpisode && hasNextEpisodeAiredYet() ? 
              <b>Next episode: {nextEpisodeTranslation(watchlistItem.nextEpisode)}</b>
            : details?.next_episode_to_air
              ? <b>Next episode on {nextEpisodeToAirTranslation(details.next_episode_to_air)}</b>
              : details?.status === "Returning Series" 
                ? <b>New episodes coming soon</b>
                : null
          : null
        }
        <OverviewText>{details.overview}</OverviewText>
        <ButtonStack>
          <Button onClick={onClickWatchlistButton}>
            { ref ? "Remove" : "Add" }
          </Button>
          {watchlistItem && mediaType === "tv" && ref && <Button disabled={mutating} onClick={onClickNextEpisodeButton}>Next episode</Button>}
        </ButtonStack>
      </TextContent>
    </BackdropRow>
    {mediaType === 'tv' &&
      <>
        <Row>
          {displayedSeasons.map((data: any, i: number) => (
            <ClearButton selected={i === selectedSeason} onClick={() => setSelectedSeason(i)} key={i}>{data.name}</ClearButton>
          ))}
        </Row>
        <Row>
          {[...Array(displayedSeasons[selectedSeason].episode_count)].map((_: any, i: number) => (
            <Button 
              disabled={!ref}
              onClick={() => onClickEpisodeButton(`${selectedSeason + 1}.${i}`)} 
              style={{marginRight: "16px"}} 
              key={i}
            >
              Episode {i + 1}
            </Button>
          ))}
        </Row>
      </>
    }
    {similar && 
      <>
        <Title>Similar</Title>
        <Row>
          {similar.map(item => (
            <ImageDiv key={item.id}>
              <img src={`https://image.tmdb.org/t/p/w500${item.poster_path}`} alt="" />
            </ImageDiv>
          ))}
        </Row>
      </>
    }
  </>
}