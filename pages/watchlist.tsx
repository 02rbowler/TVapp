import type { NextPage } from 'next'
import Head from 'next/head'
import styled from 'styled-components'
import { fetchWatchlist } from './api/watchlist'
import { useQuery } from 'react-query'
import { Search } from '../components/Search'
import { Spinner } from '../components/Spinner'

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

const ImageWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-right: -8px;
`

const Watchlist: NextPage = () => {
  const query = useQuery('watchlist', () => fetchWatchlist())
  // console.log(query)
  
  return (
    <div>
      <Main>
        {query.isLoading ? <Spinner />
        : <>
          <Search />
          <ImageWrapper>
            {query.data?.map(listItem => <ImageDiv key={listItem.id}>
              <img src={`https://image.tmdb.org/t/p/w500${listItem.poster_path}`} alt="" />
            </ImageDiv>)}
          </ImageWrapper>
        </>}
      </Main>
    </div>
  )
}

export default Watchlist
