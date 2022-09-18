import moment from 'moment'
import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Modal } from '../components/Modal'
import { Spinner } from '../components/Spinner'
import { getMovieDiscover, getSimilar, getTrending, getTVDiscover } from './api/streaming'

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

const Backdrop = styled.img`
  margin: -24px -32px 0;
  width: calc(100% + 64px);
`

const ShowTitle = styled.h1``

const TextContent = styled.div`
  position: absolute;
  top: -24px;
  left: -32px;
  padding-top: 24px;
  padding-left: 32px;
  padding-right: 60px;
  height: calc(100% + 24px);
  background: linear-gradient(90deg,#000000ab 0%,#0000007d 60%,#1c298d00 100%);
  max-width: 55%;
`

const BackdropRow = styled.div`
  position: relative;
`

const ButtonStack = styled.div`
  margin-top: 16px;
`

const Button = styled.button`
  padding: 8px 24px;
  display: inline-block;
  min-width: 150px;
  text-align: center;
  background: #babad4;
  border-radius: 10px;
`

const Streaming: NextPage = () => {
  const [movies, setMovies] = useState<any[]>([])
  const [tv, setTv] = useState<any[]>([])
  const [trending, setTrending] = useState<any[]>([])
  const [showModal, setShowModal] = useState(true);
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const [similar, setSimilar] = useState<any[]>([])

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

  useEffect(() => {
    const go = async () => {
      const returned = await getSimilar(selectedItem.type, selectedItem.item.id)
      console.log(returned)
      setSimilar(returned.results)
    }

    if(selectedItem) {
      go();
    }
  }, [selectedItem]);

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
          </>
        )}
      </Main>
      {showModal && selectedItem && (
        <Modal onClose={() => {
          setShowModal(false);
          setSelectedItem(null);
        }}>
          <>
            <BackdropRow>
              <Backdrop src={`https://image.tmdb.org/t/p/w500/${selectedItem.item.backdrop_path}`} />
              <TextContent>
                <ShowTitle>{selectedItem.item.title || selectedItem.item.name}</ShowTitle>
                <div>{selectedItem.item.overview}</div>
                <ButtonStack>
                  <Button>Add</Button>
                </ButtonStack>
              </TextContent>
            </BackdropRow>
            <Title>Similar</Title>
            <Row>
              {similar.map(item => (
                <ImageDiv key={item.id}>
                  <img src={`https://image.tmdb.org/t/p/w500${item.poster_path}`} alt="" />
                </ImageDiv>
              ))}
            </Row>
          </>
        </Modal>
      )}
    </div>
  )
}

export default Streaming
