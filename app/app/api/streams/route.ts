import { prismaClient } from "@/app/lib/db";
import { url } from "inspector";
import { NextRequest, NextResponse } from "next/server";
import {z} from "zod";
// @ts-ignore
import youtubesearchapi from "youtube-search-api";

 export var YT_REGEX = /^(?:(?:https?:)?\/\/)?(?:www\.)?(?:m\.)?(?:youtu(?:be)?\.com\/(?:v\/|embed\/|watch(?:\/|\?v=))|youtu\.be\/)((?:\w|-){11})(?:\S+)?$/;const createStreamSchema = z.object({
  creatorId:z.string(),
  url:z.string()
})
export async function POST (req:NextRequest) {
   try{
     const data = createStreamSchema.parse(await req.json());
     const isyt = data.url.match(YT_REGEX); 
     console.log(isyt);

     if(!isyt){
        return NextResponse.json({
            message:"incorrect url format"
        },{
            status:400
        })
     }
     const extractedId = data.url.split("?v=")[1];
     const res = await youtubesearchapi.GetVideoDetails(extractedId);
     console.log(res.title);
     console.log(res.thumbnail.thumbnails);
     const thumbnials = res.thumbnail.thumbnails;
     thumbnials.sort((a:{width:number},b:{breadth:number})=>a.width<b.breadth?-1:1);
   const stream =  await prismaClient.stream.create({
       data:{
        userId:data.creatorId,
        url:data.url,
        extractedId,
        type:"youtube",
        title:res.title??" can't find",
        smallimg:(thumbnials.length>1?thumbnials[thumbnials.length-2].url:thumbnials[thumbnials.length-1].url)??"https://media.istockphoto.com/id/1443562748/photo/cute-ginger-cat.jpg?s=612x612&w=0&k=20&c=vvM97wWz-hMj7DLzfpYRmY2VswTqcFEKkC437hxm3Cg=",
        bigimg:thumbnials[thumbnials.length-1].url??"https://media.istockphoto.com/id/1443562748/photo/cute-ginger-cat.jpg?s=612x612&w=0&k=20&c=vvM97wWz-hMj7DLzfpYRmY2VswTqcFEKkC437hxm3Cg="
       }

     });
     return NextResponse.json({
        message: "Stream has been created",
        streamid:stream.id
      });
    }
    catch(e){
        console.error(e);
        return NextResponse.json({
            message:"error while adding a stream"
        },{
            status:500
        })
    }
  
}

export  async function GET(req:NextRequest){
  const creatorId = req.nextUrl.searchParams.get("creatorId");

  const streams = await prismaClient.stream.findMany({
    where:{
      userId:creatorId ?? ""
    }
  })

  return NextResponse.json({
    streams
  })
}