
"use client"

import { useEffect, useState } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function Component() {

  const [videoLink, setVideoLink] = useState("")
  const [queue, setQueue] = useState([
    {
      id: 1,
      url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      title: "Never Gonna Give You Up",
      votes: 100,
    },
    {
      id: 2,
      url: "https://www.youtube.com/watch?v=oHg5SJYRHA0",
      title: "You Spin Me Round (Like a Record)",
      votes: 50,
    },
    {
      id: 3,
      url: "https://www.youtube.com/watch?v=eBGIQ7ZuuiU",
      title: "Sandstorm",
      votes: 75,
    },
  ])
  const [currentVideo, setCurrentVideo] = useState(queue[0])
  const REFRESH_INTERVAL_MS = 10*1000;

  
   async function refreshstreams(){
        const res = await fetch('/api/streams/my',{
            credentials:"include"
        });
        console.log("hubbbaliiii");

        console.log("response for the my  page",res);
  }
  useEffect(()=>{
     refreshstreams();
     const interval = setInterval(()=>{

     },REFRESH_INTERVAL_MS);
     return () => clearInterval(interval);
  })
  const handleVideoLinkChange = (e:any) => {
    setVideoLink(e.target.value)
  }
  const handleAddToQueue = () => {
    const newVideo = {
      id: queue.length + 1,
      url: videoLink,
      title: "New Video",
      votes: 0,
    }
    setQueue([...queue, newVideo])
    setVideoLink("")
  }
  const handleVote = (id:number, direction:String) => {
    const updatedQueue = queue.map((video) =>
      video.id === id ? { ...video, votes: video.votes + (direction === "up" ? 1 : -1) } : video,
    )
    setQueue(updatedQueue.sort((a, b) => b.votes - a.votes))

    fetch("/api/streams/upvote",{
        method:"POST",
        body:JSON.stringify({
            streamId:id.toString()
        })
    })

  }
  return (
    


    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white">
      <div className="grid gap-6 max-w-4xl mx-auto px-4 py-8 relative">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="video-link" className="text-white">
              Enter a YouTube video link:
            </Label>
            <div className="flex items-center gap-2">
              <Input
                id="video-link"
                type="text"
                value={videoLink}
                onChange={handleVideoLinkChange}
                placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                className="bg-gray-800 text-white"
              />
              <Button onClick={handleAddToQueue} className="bg-primary text-primary-foreground hover:bg-primary/90">
                Add to Queue
              </Button>
            </div>
            {videoLink && (
              <div className="aspect-video rounded-lg overflow-hidden">
                <iframe
                  src={`https://www.youtube.com/embed/${new URL(videoLink).searchParams.get("v")}`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
            )}
          </div>
          <div className="grid gap-2">
            <div className="font-bold text-2xl">Now Playing</div>
            <div className="aspect-video rounded-lg overflow-hidden">
              <iframe
                src={`https://www.youtube.com/embed/${new URL(currentVideo.url).searchParams.get("v")}`}
                frameBorder="0"
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 text-white hover:bg-white hover:text-gray-900"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            className="size-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z"
            />
          </svg>
        </Button>
        <div className="grid gap-2">
          <div className="font-bold text-2xl">Upcoming Songs</div>
          <div className="grid gap-2">
            {queue.map((video) => (
              <Card key={video.id} className="flex items-center justify-between bg-gray-800 text-white">
                <div className="flex items-center gap-4">
                  <img
                    src="/placeholder.svg"
                    alt="Song Cover"
                    width={50}
                    height={50}
                    className="rounded-md"
                    style={{ aspectRatio: "50/50", objectFit: "cover" }}
                  />
                  <div className="flex flex-col items-start gap-1 md:flex-row md:items-center md:gap-2">
                    <div className="font-bold truncate max-w-[150px] md:max-w-none">{video.title}</div>
                    <div className="text-muted-foreground text-sm truncate max-w-[150px] md:max-w-none">
                      {new URL(video.url).searchParams.get("v")}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleVote(video.id, "up")}
                    className="text-green-500 hover:bg-green-500 hover:text-white"
                  >
                    <ThumbsUpIcon className="w-5 h-5" />
                  </Button>
                  <div className="font-bold">{video.votes}</div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleVote(video.id, "down")}
                    className="text-red-500 hover:bg-red-500 hover:text-white"
                  >
                    <ThumbsDownIcon className="w-5 h-5" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function ThumbsDownIcon(props:any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17 14V2" />
      <path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22h0a3.13 3.13 0 0 1-3-3.88Z" />
    </svg>
  )
}


function ThumbsUpIcon(props:any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7 10v12" />
      <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z" />
    </svg>
  )
}