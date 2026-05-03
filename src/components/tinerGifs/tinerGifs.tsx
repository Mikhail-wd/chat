import { useContext, useEffect, useRef, useState } from "react";
import { AppState } from "../../App"
import Gif from '../../assets/photo.png'
import axios from "axios";
import styled from "styled-components"

const TinerSearchWrapper = styled.div`
    width: 100%;
    position: fixed;
    left:0px;
    z-index:99;
    background-color: var(--gray-500);
    box-sizing: border-box;
    padding: 8px;
`
const TinerSearch = styled.input`
    position: relative;
    z-index:100;
    width: 100%;
    padding: 8px;
    box-sizing: border-box;
    border-radius: 4px;
    background-color: var(--black-400);
`
const TinerGifWrapper = styled.div`
    margin-top: 40px;
    display: flex;
    flex-direction:row;
    flex-wrap: nowrap;
    justify-content: space-around
`
const TinerGif = styled.div`
    height:500px;
    width:100%;
    padding: 0px 8px 8px 8px;
    left:0px;
    box-sizing: border-box;
    background-color:var(--gray-500);
    overflow-y: scroll;
    position: absolute;
    bottom: 50px;
`
const ImageGif = styled.img`
    max-width:50%;
    min-width:100%;
        &:hover {
        cursor: pointer;
    }
`
const ImageIcon = styled.img`
    height:24px;
    width:24px;
    &:hover {
        cursor: pointer;
    }
`
const RightCol = styled.div`
    display: flex;
    flex-direction:column;
    padding:4px;
    gap:10px;
    min-width:45%;
`
const LeftCol = styled.div`
    display: flex;
    flex-direction:column;
    padding:4px;
    gap:10px;
    min-width:45%;
`

export default function TenerGif() {
    const context = useContext(AppState)
    const refController = useRef<AbortController | null>(null)
    const [searchPrase, setPhrase] = useState<null | String>(null)
    const [compState, setState] = useState(
        {
            urlTrend: "https://g.tenor.com/v1/categories",
            urlSearch: "https://g.tenor.com/v1/search",
            apiKey: "LIVDSRZULELA",
            psearch_term: "smile",
            lmt: 5,
            toggle: false
        }
    )
    const [compData, setData] = useState<null | Array<any>>(
        null
    )

    function httpGetRequestSearch(value: null | String) {
        document.getElementById("wrapper-target")?.focus()
        axios.get(compState.urlSearch + "?key=" + compState.apiKey + "&q=" + value).then(
            (resp) => {
                setData(resp.data.results)
            }
        )
    }

    function sendingGif(value: String) {
        if (value.endsWith(".jpeg") || value.endsWith(".jpg") || value.endsWith(".png") || value.endsWith(".gif") || value.endsWith(".webp") || value.endsWith(".svg")) {
            axios.post(import.meta.env.VITE_SERVER + "chat-api/message",
                JSON.stringify({ name: context.data.user_name, message: "images", image_link: value, user_color: context.data.userColor, selected_users: context.data.selected_users_list }),
                {
                    headers: {
                        'Content-Type': 'text/json'
                    }
                }
            ).catch(() => console.warn("ServerError"))
            setState({ ...compState, toggle: false })
            setPhrase(null)
        }
    }

    useEffect(() => {
        httpGetRequestSearch("wave")
    }, [])

    useEffect(() => {

        if (refController.current) {
            refController.current.abort()
        }
        refController.current = new AbortController()
        const signal = refController.current.signal

        setTimeout(() => {
            fetch(compState.urlSearch + "?key=" + compState.apiKey + "&q=" + searchPrase, { signal: signal })
                .then(response => { return response.json() })
                .then(res => { setData(res.results)})
        }, 2000)

        return () => {
            if (refController.current) {
                refController.current.abort()
            }
        }

    }, [searchPrase])

    return (
        <>
            {compState.toggle ?
                <TinerGif>
                    <TinerSearchWrapper id="wrapper-target">
                        <TinerSearch onChange={(event) => setPhrase(event.target.value)} />
                    </TinerSearchWrapper>
                    <TinerGifWrapper>
                        <LeftCol>
                            {compData !== null ? compData.map((elem, index) => {
                                if (!(index % 2)) {
                                    return <ImageGif src={elem.media[0].gif.url} key={index} onClick={() => sendingGif(elem.media[0].gif.url)} />
                                }
                            }) : "Loading..."}
                        </LeftCol>
                        <RightCol>
                            {compData !== null ? compData.map((elem, index) => {
                                if (index % 2) {
                                    return <ImageGif src={elem.media[0].gif.url} key={index} onClick={() => sendingGif(elem.media[0].gif.url)} />
                                }
                            }) : "Loading..."}
                        </RightCol>
                    </TinerGifWrapper>
                </TinerGif>
                : null}
            <ImageIcon src={Gif} alt="gif" onClick={() => setState({ ...compState, toggle: !compState.toggle })} />
        </>
    )
}