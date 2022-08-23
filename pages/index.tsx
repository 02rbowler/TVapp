import moment from 'moment'
import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Spinner } from '../components/Spinner'
import { Timeline } from '../components/Timeline'
import { getFreeviewGuideData, getGuideData, GuideData } from './api/guide'

const Main = styled.main`
  padding: 32px 24px;
  font-size: 20px;
  display: flex;
`

const GuideRow = styled.div`
  display: flex;
`

const Item = styled.div<{widthOverride?: number}>`
  background-color: rgba(48, 56, 131, 0.5);
  border-radius: 10px;
  width: ${props => props.widthOverride || 200}px;
  margin-right: 4px;
  padding: 8px ${props => !!props.widthOverride && props.widthOverride < 30 ? 0 : 16}px;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const Channel = styled(Item)`
  background: #252657;
  width: 200px;
  flex: none;
  margin-right: 8px;
`

const EmptyChannel = styled(Channel)`
  height: 19px;
  margin-bottom: 8px;
  background: transparent;
`

const TimelineWrapper = styled(GuideRow)`
  margin-bottom: 8px;
  font-size: 16px;
`

const ChannelWrapper = styled.div`
  ${Channel} {
  }
`

const Scrollable = styled.div`
  display: flex;
`

const ScheduleWrapper = styled.div`
  min-width: 0;
  overflow-x: auto;
  padding-bottom: 10px;
`


const Home: NextPage = () => {
  const [data, setData] = useState<GuideData[]>([]);
  const [isLoading, setIsLoading] = useState(true)
  const currentTime = moment();

  useEffect(() => {
    const go = async () => {
      const fetchedSkySportsData = await getGuideData()
      const fetchedFreeviewData = await getFreeviewGuideData()
      setData([...fetchedFreeviewData, ...fetchedSkySportsData])
      setIsLoading(false)
    }

    go()
  }, [])

  const calculateItemWidth = (minutesLength: string) => {
    const minPerPixel = 30 / 370;
    const parsedNum = parseInt(minutesLength, 10);
    // const pixelPerMin = 370 / 30;
  
    return parsedNum / minPerPixel;
  };
  
  const getTimeLeft = (current: any, item: any) => {
    const endTime = moment(item.startTime, ['HH:mm']).add(
      item.minutesLength,
      'minutes',
    );
    const duration = moment.duration(endTime.diff(current));
    return duration.asMinutes().toString();
  };

  const hasFinished = (schedule: any) => {
    const endTime = moment(schedule.startTime, ['HH:mm']).add(
      schedule.minutesLength,
      'minutes',
    );
    
    return endTime < currentTime
  }

  console.log(data)

  return (
    <div>
      <Head>
        <title>TV</title>
        <meta name="description" content="TV app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Main>
        {isLoading && data.length === 0 ? <Spinner />
        : !isLoading && data.length === 0 ?
          <div>Error. Something went wrong!</div>
        : (
          <>
          <ChannelWrapper>
            <EmptyChannel />
            {
              data.map((channelData, i) => {
                return <Channel key={i}>{channelData.channel}</Channel>
              })
            }
          </ChannelWrapper>
          <ScheduleWrapper>
            <TimelineWrapper>
              <Scrollable>
                <Timeline current={currentTime} />
              </Scrollable>
            </TimelineWrapper>
            {
              data.map((channelData, i) => {
                let renderedFirstShow = false
                
                return (
                  <GuideRow key={i}>
                    <Scrollable>
                      {
                        channelData.schedule.map((schedule, i) => {
                          if (hasFinished(schedule)) {
                            return null
                          }

                          if(schedule.title === "Pointless") {
                            console.log("FOUND IT")
                          }

                          const isFirstShow = !renderedFirstShow
                          renderedFirstShow = true

                          const widthOverride = isFirstShow
                            ? calculateItemWidth(getTimeLeft(currentTime, schedule))
                            : calculateItemWidth(schedule.minutesLength)

                          return (
                            <Item 
                              key={i}
                              widthOverride={widthOverride}
                            >{widthOverride < 30 ? "" : schedule.title}</Item>
                          )
                        })
                      }
                    </Scrollable>
                  </GuideRow>
                )
              })
            }
          </ScheduleWrapper>
        </>
      )}
      </Main>
    </div>
  )
}

export default Home
