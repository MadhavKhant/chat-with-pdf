import { askGroq } from "@/app/lib/groq";
import { searchSimilar } from "@/app/lib/search";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";


export async function POST(req) {
    try{

        const { question } = await req.json();
        if(!question)
            return NextResponse.json({
                error: "question is required"
            }, {status: 400});


        const { userId } = await auth();
        const chunks = await searchSimilar(question, userId, 2);
        const answer = await askGroq(question, chunks);
        
        return NextResponse.json({
            success: true,
            answer
        });
        
    } catch(err) {
        return NextResponse.json({
            error: err.message
        })
    }
}