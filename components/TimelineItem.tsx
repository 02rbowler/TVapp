import styled from "styled-components";

interface TimelineItem {
  widthOverride?: number
  timeValue: string
}

const Item = styled.div<{widthOverride?: number}>`
  width: ${props => props.widthOverride || 370}px;
`

export const TimelineItem = ({
  widthOverride,
  timeValue,
}: TimelineItem) => {
  return <Item widthOverride={widthOverride}>{timeValue}</Item>;
};