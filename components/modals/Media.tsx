import { useEffect, useState } from "react"
import { BsCheckLg, BsPlusLg } from "react-icons/bs"
import styled from "styled-components"
import { getDetails } from "../../pages/api/streaming"
import { addToWatchlist, removeFromWatchlist } from "../../pages/api/watchlist"
import { Spinner } from "../Spinner"
import { nextEpisodeTranslation } from "./helper"

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
`

const Button = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  background: none;
  border: 3px solid white;
  color: white;
  border-radius: 100%;
  width: 40px;
  height: 40px;
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
  watchlistRef?: string;
  nextEpisode?: string;
}

export const Media = ({tmdbId, mediaType, similar, watchlistRef, nextEpisode}: MediaProps) => {
  const [ref, setRef] = useState(watchlistRef)
  const [details, setDetails] = useState<any>(null)

  useEffect(() => {
    const go = async () => {
      const output = await getDetails(mediaType, tmdbId)
      setDetails(output)
    }

    go()
  }, [])

  if(!details || !details.backdrop_path) {
    return <Spinner />
  }
console.log(details)
  return <>
    <BackdropRow>
      <ImageRow>
        <Backdrop src={`https://image.tmdb.org/t/p/w500/${details.backdrop_path}`} />
      </ImageRow>
      <TextContent>
        <ShowTitle>{details.title || details.name}</ShowTitle>
        {mediaType === "tv" && <b>Next episode: {nextEpisodeTranslation(nextEpisode)}</b>}
        <OverviewText>{details.overview}</OverviewText>
        <ButtonStack>
          <Button onClick={async () => {
            if(ref) {
              removeFromWatchlist(ref)
              setRef("")
            } else {
              const output = await addToWatchlist({
                accountNumber: 1, 
                id: details.id, 
                type: mediaType, 
                name: details.title || details.name, 
                poster_path: details.poster_path, 
                backdrop_path: details.backdrop_path, 
                overview: details.overview
              })

              const newRef = output.response["@ref"].id
              setRef(newRef)
            }
          }}>
            {
              ref ? <BsCheckLg size={20} /> : <BsPlusLg size={20} />
            }
          </Button>
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