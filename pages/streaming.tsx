import moment from 'moment'
import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { BsPlusLg } from 'react-icons/bs'
import styled from 'styled-components'
import { Modal } from '../components/Modal'
import { Media } from '../components/modals/Media'
import { Spinner } from '../components/Spinner'
import { getDetails, getMovieDiscover, getNetflix, getSimilar, getTrending, getTVDiscover } from './api/streaming'

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
  const [showModal, setShowModal] = useState(true);
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const [modalDetails, setModalDetails] = useState<any>(null)
  const [similar, setSimilar] = useState<any[]>([])

  useEffect(() => {
    const go = async () => {
      const [movieDiscover, tvDiscover, trendingContent, netflixContent] = await Promise.all([
        getMovieDiscover(),
        getTVDiscover(),
        getTrending(),
        getNetflix()
      ])

      setMovies(movieDiscover.results)
      setTv(tvDiscover.results)
      setTrending(trendingContent.results)
      setNetflix(netflixContent)
    }

    go()
  }, [])

  useEffect(() => {
    const go = async () => {
      const [similarData, detailsData] = await Promise.all([
        getSimilar(selectedItem.type, selectedItem.item.id),
        getDetails("tv", selectedItem.item.id)
      ]);
      // console.log(similarData)
      setSimilar(similarData.results)
      setModalDetails(detailsData);
    }

    if(selectedItem) {
      go();
    }
  }, [selectedItem]);

  console.log(modalDetails)

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

            {netflix.length > 0 && <>
              <Title>Nextflix</Title>
              <Row>
                {netflix.map(item => (
                  <ImageDiv key={item.id} onClick={() => {
                    // setSelectedItem({item, type: "movie"})
                    // setShowModal(true)
                    console.log("TODO")
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
            primaryImage={selectedItem.item.backdrop_path} 
            primaryTitle={selectedItem.item.title || selectedItem.item.name}
            primaryOverview={selectedItem.item.overview}
            similar={similar} 
          />
        </Modal>
      )}
    </div>
  )
}

export default Streaming
