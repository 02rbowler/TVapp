import styled from "styled-components"
import { AiOutlineSearch } from 'react-icons/ai'

const Container = styled.div`
  width: 100vw;
  height: 400px;
  background-color: #1c1d43c7;
  position: absolute;
  top: 0;
  left: 0;
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

export const Search = () => {
  return (
    <>
      <SpacingBlock />
      <Container>
        <Input type="text" />
      </Container>
      <IconWrapper>
        <AiOutlineSearch size={30} />
      </IconWrapper>
    </>
  )
}