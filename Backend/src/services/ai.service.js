import { ChatGoogle } from "@langchain/google";

const model = new ChatGoogle({
    model: "gemini-2.5-flash-lite",
    apiKey: process.env.GOOGLE_API_KEY
});

export async function textAi() {
    model.invoke("Hellow ai").then((res)=>{
        console.log(res.text)
    })
}