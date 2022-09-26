import styled from "styled-components"
import { AiOutlineSearch } from 'react-icons/ai'
import { ChangeEvent, useState } from "react"
import debounce from 'lodash.debounce';
import { addToWatchlist, search } from "../pages/api/watchlist";
import { useMutation, useQueryClient } from "react-query";

const Container = styled.div<{displaySearch: boolean}>`
  width: 100vw;
  height: ${props => props.displaySearch ? 360 : 0}px;
  background-color: #1c1d43c7;
  position: absolute;
  top: 0;
  left: 0;
  overflow: hidden;
  transition: height 0.3s ease-in-out;
`

const IconWrapper = styled.div`
  position: absolute;
  top: 32px;
`

const SpacingBlock = styled.div`
  height: 60px;
`

const Input = styled.input`
  margin-top: 28px;
  margin-left: 70px;
  font-size: 20px;
  border-radius: 10px;
  border: 0;
  padding: 8px 16px;
  width: 50%;
`

const ResultsRow = styled.div`
  margin: 24px;
  margin-left: 70px;

  img {
    height: 250px;
    margin-right: 8px;
    border-radius: 10px;
    overflow: hidden;
  }
`

export interface Suggestion {
  id: number
  poster_path: string
  backdrop_path: string
  overview: string
  name: string
  title: string
}

export const Search = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [tvSuggestions, setTVSuggestions] = useState<Suggestion[]>([])
  const [movieSuggestions, setMovieSuggestions] = useState<Suggestion[]>([])
  const [displaySearch, setDisplaySearch] = useState(false)

  const debouncedFetch = debounce(async () => { // debounce isn't working
    if(searchTerm) {
      const tvSearchResponse = await search('tv', searchTerm);
      const movieSearchResponse = await search('movie', searchTerm);

      if(tvSearchResponse.results) {
        setTVSuggestions(tvSearchResponse.results.slice(0, 3).filter((item: Suggestion) => item.poster_path));
      }
      if(movieSearchResponse.results) {
        setMovieSuggestions(movieSearchResponse.results.slice(0, 3).filter((item: Suggestion) => item.poster_path));
      }
    }
  }, 400);

  const onSearchInput = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value)
    if(searchTerm.length > 2) {
      debouncedFetch()
    } else {
      setTVSuggestions([])
      setMovieSuggestions([])
    }
  }

  const queryClient = useQueryClient()

  const addMutation = useMutation(addToWatchlist, {
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries('watchlist')
    },
  })
console.log(movieSuggestions);
  const selectSuggestion = (suggestion: Suggestion, type: 'tv' | 'movie') => {
    if(type === 'tv') {
      addMutation.mutate({
        accountNumber: 1,
        id: suggestion.id,
        type: "tv",
        episode: "1.0",
        name: suggestion.name,
        poster_path: suggestion.poster_path,
        backdrop_path: suggestion.backdrop_path,
        overview: suggestion.overview
      })
    } else {
      addMutation.mutate({
        accountNumber: 1,
        id: suggestion.id,
        type: "movie",
        episode: "1.0",
        name: suggestion.title,
        poster_path: suggestion.poster_path,
        backdrop_path: suggestion.backdrop_path,
        overview: suggestion.overview
      })
    }
    setSearchTerm("")
    setTVSuggestions([])
    setMovieSuggestions([])
  }

  const onClickedIcon = () => {
    setDisplaySearch(!displaySearch)
  }

  return (
    <>
      <SpacingBlock />
      <Container displaySearch={displaySearch}>
        <Input type="text" value={searchTerm} onChange={onSearchInput} />
        <ResultsRow>
          {tvSuggestions.map(suggestion => <img key={suggestion.id} onClick={() => selectSuggestion(suggestion, 'tv')} src={`https://image.tmdb.org/t/p/w500${suggestion.poster_path}`} alt="" />)}
          {movieSuggestions.map(suggestion => <img key={suggestion.id} onClick={() => selectSuggestion(suggestion, 'movie')} src={`https://image.tmdb.org/t/p/w500${suggestion.poster_path}`} alt="" />)}
        </ResultsRow>
      </Container>
      <IconWrapper>
        <AiOutlineSearch size={30} onClick={onClickedIcon} />
      </IconWrapper>
    </>
  )
}