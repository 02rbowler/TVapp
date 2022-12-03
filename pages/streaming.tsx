import moment from 'moment'
import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { BsPlusLg } from 'react-icons/bs'
import { useQuery } from 'react-query'
import styled from 'styled-components'
import { Modal } from '../components/Modal'
import { Media } from '../components/modals/Media'
import { Spinner } from '../components/Spinner'
import { getDetails, getMovieDiscover, getNetflix, getSimilar, getStandUpComedy, getTrending, getTVDiscover } from './api/streaming'
import { fetchWatchlist } from './api/watchlist'

const Main = styled.main`
  padding: 32px 24px;
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

const Title = styled.div`
  font-size: 20px;
  margin-bottom: 8px;
`

const Streaming: NextPage = () => {
  const [movies, setMovies] = useState<any[]>([])
  const [tv, setTv] = useState<any[]>([])
  const [trending, setTrending] = useState<any[]>([])
  const [netflix, setNetflix] = useState<any[]>([])
  const [comedy, setComedy] = useState<any[]>([])
  const [showModal, setShowModal] = useState(true);
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const [similar, setSimilar] = useState<any[]>([])

  const watchlistQuery = useQuery('watchlist', () => fetchWatchlist())

  useEffect(() => {
    const go = async () => {
      const [movieDiscover, tvDiscover, trendingContent, netflixContent, comedyContent] = await Promise.all([
        getMovieDiscover(),
        getTVDiscover(),
        getTrending(),
        getNetflix(),
        getStandUpComedy()
      ])

      setMovies(movieDiscover.results.filter((item: any) => item.poster_path))
      setTv(tvDiscover.results.filter((item: any) => item.poster_path))
      setTrending(trendingContent.results.filter((item: any) => item.poster_path))
      setNetflix(netflixContent)
      setComedy(comedyContent)
    }

    go()
  }, [])

  useEffect(() => {
    const go = async () => {
      const similarData = await getSimilar(selectedItem.type, selectedItem.item.id);
      // console.log(similarData)
      setSimilar(similarData.results.filter((item: any) => item.poster_path))
    }

    if(selectedItem) {
      go();
    }
  }, [selectedItem]);

  const isSelectedOnWatchlist = () => {
    if(!selectedItem) {
      return undefined
    }
    const matched = watchlistQuery.data?.find(listItem => listItem.id === selectedItem.item.id)
    if(matched) {
      return matched
    }

    return undefined
  }

  const selectedItemMatched = isSelectedOnWatchlist()

  return (
    <div>
      <Main>
        {(
          trending.length === 0 && 
          tv.length == 0 &&
          movies.length === 0
        ) ? <Spinner />
        : (
          <>
            {trending.length > 0 && <>
              <Title>Trending</Title>
              <Row>
                {trending.map(item => (
                  <ImageDiv key={item.id} onClick={() => {
                    setSelectedItem({item, type: item.title ? "movie" : "tv"})
                    setShowModal(true)
                  }}>
                    <img src={`https://image.tmdb.org/t/p/w500${item.poster_path}`} alt="" />
                  </ImageDiv>
                ))}
              </Row>
            </>}

            {tv.length > 0 && <>
              <Title>TV</Title>
              <Row>
                {tv.map(item => (
                  <ImageDiv key={item.id} onClick={() => {
                    setSelectedItem({item, type: "tv"})
                    setShowModal(true)
                  }}>
                    <img src={`https://image.tmdb.org/t/p/w500${item.poster_path}`} alt="" />
                  </ImageDiv>
                ))}
              </Row>
            </>}

            {movies.length > 0 && <>
              <Title>Movies</Title>
              <Row>
                {movies.map(item => (
                  <ImageDiv key={item.id} onClick={() => {
                    setSelectedItem({item, type: "movie"})
                    setShowModal(true)
                  }}>
                    <img src={`https://image.tmdb.org/t/p/w500${item.poster_path}`} alt="" />
                  </ImageDiv>
                ))}
              </Row>
            </>}

            {netflix.length > 0 && <>
              <Title>Nextflix</Title>
              <Row>
                {netflix.map(item => (
                  <ImageDiv key={item.id} onClick={() => {
                    setSelectedItem({item, type: item.title ? "movie" : "tv"})
                    setShowModal(true)
                  }}>
                    <img src={`https://image.tmdb.org/t/p/w500${item.poster_path}`} alt="" />
                  </ImageDiv>
                ))}
              </Row>
            </>}

            {comedy.length > 0 && <>
              <Title>Stand up comedy</Title>
              <Row>
                {comedy.map(item => (
                  <ImageDiv key={item.id} onClick={() => {
                    setSelectedItem({item, type: "movie"})
                    setShowModal(true)
                  }}>
                    <img src={`https://image.tmdb.org/t/p/w500${item.poster_path}`} alt="" />
                  </ImageDiv>
                ))}
              </Row>
            </>}
          </>
        )}
      </Main>
      {showModal && selectedItem && (
        <Modal onClose={() => {
          setShowModal(false);
          setSelectedItem(null);
        }}>
          <Media 
            tmdbId={selectedItem.item.id}
            mediaType={selectedItem.item.title ? "movie" : "tv"}
            similar={similar} 
            watchlistItem={selectedItemMatched}
          />
        </Modal>
      )}
    </div>
  )
}

export default Streaming
