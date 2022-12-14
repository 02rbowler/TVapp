import type { NextPage } from 'next'
import Head from 'next/head'
import styled from 'styled-components'
import { fetchWatchlist } from './api/watchlist'
import { useQuery } from 'react-query'
import { Search } from '../components/Search'
import { Spinner } from '../components/Spinner'
import { Modal } from '../components/Modal'
import { Media } from '../components/modals/Media'
import { useEffect, useState } from 'react'
import { getSimilar } from './api/streaming'

const Main = styled.main`
  padding: 32px 24px;
`

const ImageDiv = styled.div<{hasContent: boolean}>`
  width: calc(14.28% - 8px);
  flex: none;
  margin-right: 8px;
  margin-bottom: 8px;
  box-sizing: border-box;

  img {
    width: 100%;
    overflow: hidden;
    border-radius: 10px;
    ${props => !props.hasContent && `opacity: 0.5;`}
  }
`

const ImageWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-right: -8px;
`

const Watchlist: NextPage = () => {
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const [similar, setSimilar] = useState<any[]>([])
  const [showModal, setShowModal] = useState(true);

  const query = useQuery('watchlist', () => fetchWatchlist())

  useEffect(() => {
    if(showModal && query.data && selectedItem) {
      const selected = query.data.find(item => selectedItem.id === item.id)
      setSelectedItem(selected)
    }
  }, [query, showModal])

  useEffect(() => {
    const go = async () => {
      const [similarData] = await Promise.all([
        getSimilar(selectedItem.type, selectedItem.id)
      ]);
      // console.log(similarData)
      setSimilar(similarData.results)
    }

    if(selectedItem) {
      go();
    }
  }, [selectedItem]);

  return (
    <div>
      <Main>
        {query.isLoading ? <Spinner />
        : <>
          <Search />
          <ImageWrapper>
            {query.data
              ?.sort((a, b) => a.ts > b.ts ? -1 : 1)
              .map(listItem => <ImageDiv key={listItem.id} onClick={() => {
                  setSelectedItem(listItem)
                  setShowModal(true)
                }}
                hasContent={listItem.type === "movie" || listItem.isEpisodeAvailable}
              >
                <img src={`https://image.tmdb.org/t/p/w500${listItem.poster_path}`} alt="" />
              </ImageDiv>
            )}
          </ImageWrapper>
        </>}
      </Main>
      {showModal && selectedItem && (
        <Modal onClose={() => {
          setShowModal(false);
          setSelectedItem(null);
        }}>
          <Media 
            tmdbId={selectedItem.id}
            mediaType={selectedItem.type}
            similar={similar} 
            watchlistItem={selectedItem}
          />
        </Modal>
      )}
    </div>
  )
}

export default Watchlist
