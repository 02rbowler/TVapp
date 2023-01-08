import styled from "styled-components"

const Background = styled.div`
  background-color: #101010a8;
  position: absolute;
  z-index: 1;
  width: 100vw;
  height: 100vh;
  top: 0;
`

const Container = styled.div`
  background-color: #070655;
  margin-top: 8vh;
  margin-left: auto;
  margin-right: auto;
  width: 70%;
  max-width: 750px;
  height: 84vh;
  padding: 0 32px;
  border-radius: 20px;
  overflow: hidden;
  position: relative;
`

export const Modal = ({children, onClose}: {children: JSX.Element, onClose: () => void}) => {
  return (
    <Background onClick={onClose}>
      <Container onClick={(e) => e.stopPropagation()}>
        {children}
      </Container>
    </Background>
  )
}
