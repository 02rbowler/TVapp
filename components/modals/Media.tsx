import { useEffect, useState } from "react"
import { AiOutlinePlus, AiOutlineCheck } from "react-icons/ai"
import styled from "styled-components"
import { getDetails } from "../../pages/api/streaming"
import { addToWatchlist, goToNextEpisode, removeFromWatchlist } from "../../pages/api/watchlist"
import { Spinner } from "../Spinner"
import { nextEpisodeToAirTranslation, nextEpisodeTranslation } from "./helper"
import { useMutation, useQueryClient } from "react-query";

const Backdrop = styled.img`
  width: 100%;
  max-width: 560px;
  margin-left: auto;
  display: block;
  mask-image: linear-gradient(
    270deg,
    rgba(0,0,0) 0%,
    rgba(0,0,0) 54%,
    rgba(255,255,255, 0.98) 56%,
    rgba(255,255,255, 0) 100%
  )
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
  position: absolute;
  top: -24px;
  left: -32px;
  padding-top: 24px;
  padding-left: 32px;
  padding-right: 60px;
  height: calc(100% + 24px);
  max-width: 55%;
`

const BackdropRow = styled.div`
  position: relative;
`

const ImageRow = styled.div`
  margin: -24px -32px 0;
  width: calc(100% + 64px);
`

const ButtonStack = styled.div`
  margin-top: 16px;
  display: flex;
  align-items: center;

  button {
    margin-right: 16px;
  }
`

const CircleButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  background: none;
  border: 2px solid white;
  color: white;
  border-radius: 100%;
  width: 30px;
  height: 30px;
`

const Button = styled.button`
  background: none;
  border: 1px solid white;
  color: white;
  font-size: 16px;
  border-radius: 5px;
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
      // const newRef = data.response["@ref"].id
      // setRef(newRef)
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
    updateMutation.mutate({
      currentWatchlist: watchlistItem,
      nextEpisode: watchlistItem.type === "tv" ? watchlistItem.nextEpisode : undefined
    })
  }

  if(!details || !details.backdrop_path) {
    return <Spinner />
  }
console.log(details)
console.log(watchlistItem)
  return <>
    <BackdropRow>
      <ImageRow>
        <Backdrop src={`https://www.themoviedb.org/t/p/w1920_and_h800_multi_faces/${details.backdrop_path}`} />
        {/* <Backdrop src={`https://image.tmdb.org/t/p/w500/${details.backdrop_path}`} /> */}
      </ImageRow>
      <TextContent>
        <ShowTitle>{details.title || details.name}</ShowTitle>
        {watchlistItem && mediaType === "tv" &&
          watchlistItem.nextEpisode ? 
            <b>Next episode: {nextEpisodeTranslation(watchlistItem.nextEpisode)}</b>
          : details?.next_episode_to_air
            ? <b>Next episode on {nextEpisodeToAirTranslation(details.next_episode_to_air)}</b>
            : details?.status === "Returning Series" 
              ? <b>New episodes coming soon</b>
              : null
        }
        <OverviewText>{details.overview}</OverviewText>
        <ButtonStack>
          <CircleButton onClick={onClickWatchlistButton}>
            { ref ? <AiOutlineCheck size={20} /> : <AiOutlinePlus size={20} /> }
          </CircleButton>
          {watchlistItem && mediaType === "tv" && ref && <Button onClick={onClickNextEpisodeButton}>Next episode</Button>}
        </ButtonStack>
      </TextContent>
    </BackdropRow>
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