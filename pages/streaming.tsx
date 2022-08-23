import moment from 'moment'
import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Spinner } from '../components/Spinner'
import { getMovieDiscover, getTrending, getTVDiscover } from './api/streaming'

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

  useEffect(() => {
    const go = async () => {
      const movieDiscover = await getMovieDiscover()
      const tvDiscover = await getTVDiscover()
      const trendingContent = await getTrending()
      console.log(movieDiscover, tvDiscover)
      setMovies(movieDiscover.results)
      setTv(tvDiscover.results)
      setTrending(trendingContent.results)
    }

    go()
  }, [])
  
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
                  <ImageDiv key={item.id}>
                    <img src={`https://image.tmdb.org/t/p/w500${item.poster_path}`} alt="" />
                  </ImageDiv>
                ))}
              </Row>
            </>}

            {tv.length > 0 && <>
              <Title>TV</Title>
              <Row>
                {tv.map(item => (
                  <ImageDiv key={item.id}>
                    <img src={`https://image.tmdb.org/t/p/w500${item.poster_path}`} alt="" />
                  </ImageDiv>
                ))}
              </Row>
            </>}

            {movies.length > 0 && <>
              <Title>Movies</Title>
              <Row>
                {movies.map(item => (
                  <ImageDiv key={item.id}>
                    <img src={`https://image.tmdb.org/t/p/w500${item.poster_path}`} alt="" />
                  </ImageDiv>
                ))}
              </Row>
            </>}
          </>
        )}
      </Main>
    </div>
  )
}

export default Streaming
