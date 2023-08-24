import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest){
    const accessoken = process.env.FB_ACCESS_TOKEN;
    const apiRes = await fetch("https://api.quotable.io/random", { method: "GET", next: { revalidate: 10 } });
    const data = await apiRes.json();
    const hashtags = function(data: any) {
        let txt="";
        for(let i=0; i < data.tags.length;  i++){
            txt = txt + `#${data.tags[i]} `;
        };
        txt.slice(0, -1);
        txt.replace(" ", "-");
        return txt;
    }
    const post = `"${data.content} - ${data.author} ${hashtags(data)}"`;
    let fbRes = await fetch(`https://graph.facebook.com/v17.0/120584134465038/feed?message=${encodeURIComponent(post)}&access_token=${accessoken}`, {
        method: 'POST'
    });
    console.log(fbRes);
    return NextResponse.json({ postData: post })
}