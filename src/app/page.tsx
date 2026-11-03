"use client";
import { useState, useEffect, useRef } from "react";

const GAMES = [
  {k:"HÉT",n:"HÉT TO NHẤT",d:"Hét 10s, >85db nổ loa"},
  {k:"BOM",n:"BOM NỔ CHẬM",d:"Giữ bom hét 1 từ trong 2s để chuyền"},
  {k:"THỔI",n:"THỔI NẾN",d:"Thổi phù vào mic"},
  {k:"MA",n:"MA SÓI 3 PHÚT",d:"3 Đêm + 3 Ngày"},
  {k:"NÓI",n:"NÓI NHANH",d:"Giành quyền nói 7s +2đ"},
  {k:"ĐOÁN",n:"ĐOÁN CẢM XÚC",d:"Làm mặt theo lệnh"},
  {k:"NHỊN",n:"NHỊN CƯỜI",d:"Ai cười thua"},
  {k:"ĐÓNG",n:"ĐÓNG BĂNG TƯỢNG",d:"Random 1 người làm tượng"},
  {k:"VẼ",n:"VẼ BẬY",d:"Random 1 mẫu vẽ 30s"},
  {k:"NỐI",n:"NỐI TỪ",d:"15s gõ, duyệt >50%"},
];

export default function Page(){
  const [view,setView]=useState("welcome");
  const [room,setRoom]=useState("");
  const [mode,setMode]=useState(null as any);
  const [game,setGame]=useState(0);
  const [score,setScore]=useState(11);
  const [micOn,setMicOn]=useState(false);
  const [camOn,setCamOn]=useState(false);
  const [db,setDb]=useState(0);
  const [name,setName]=useState("B");
  const [pos,setPos]=useState({x:160,y:140});
  const [chat,setChat]=useState([] as string[]);
  const [chatIn,setChatIn]=useState("");
  const videoRef=useRef(null as any);
  const streamRef=useRef(null as any);
  const canvasRef=useRef(null as any);

  const toggleMic = async () => {
    try{
      if(micOn){
        streamRef.current?.getTracks().forEach((t:any)=>t.stop());
        setMicOn(false); return;
      }
      const s = await navigator.mediaDevices.getUserMedia({audio:true});
      streamRef.current=s; setMicOn(true); setScore(v=>v+10);
      const ctx=new (window.AudioContext||(window as any).webkitAudioContext)();
      const src=ctx.createMediaStreamSource(s);
      const an=ctx.createAnalyser(); src.connect(an);
      const data=new Uint8Array(an.frequencyBinCount);
      const loop=()=>{ an.getByteFrequencyData(data); setDb(Math.max(...Array.from(data))); if(micOn) requestAnimationFrame(loop); };
      loop();
    }catch{ alert("Cho phép Mic ở trên thanh địa chỉ nhé!"); }
  };

  const toggleCam = async () => {
    try{
      if(camOn){
        streamRef.current?.getTracks().forEach((t:any)=>t.stop());
        setCamOn(false); return;
      }
      const s = await navigator.mediaDevices.getUserMedia({video:true});
      streamRef.current=s;
      if(videoRef.current){ videoRef.current.srcObject=s; videoRef.current.play(); }
      setCamOn(true); setScore(v=>v+10);
    }catch{ alert("Cho phép Cam ở trên thanh địa chỉ nhé!"); }
  };

  useEffect(()=>{
    const c=canvasRef.current; if(!c) return; const ctx=c.getContext("2d"); if(!ctx) return;
    c.width=c.clientWidth; c.height=260;
    ctx.fillStyle="#fff6f9"; ctx.fillRect(0,0,c.width,c.height);
    ctx.fillStyle="#ff8fbc"; ctx.font="bold 16px sans-serif"; ctx.fillText(GAMES[game].n,12,28);
    ctx.fillStyle="#888"; ctx.font="12px sans-serif"; ctx.fillText(GAMES[game].d,12,44);
    if(GAMES[game].k==="HÉT"){
      ctx.fillStyle="#ffd6e7"; ctx.fillRect(12,60,180,12);
      ctx.fillStyle="#ff4d8a"; ctx.fillRect(12,60,Math.min(180,db),12);
      ctx.fillStyle="#333"; ctx.fillText(db>85?"LOA NỔ! +diem":"Do: "+db+"db",12,90);
    }
    if(GAMES[game].k==="ĐÓNG"){
      ctx.fillStyle="#8ecfff"; ctx.fillRect(c.width/2-26,70,52,80);
      ctx.fillStyle="#333"; ctx.fillText("TUONG - Dong bang!",c.width/2-60,170);
    }
  },[game,db,view]);

  return(
    <div style={{maxWidth:420,margin:"auto",background:"#fff",minHeight:"100vh",fontFamily:"system-ui"}}>
      {view==="welcome"&&<div style={{padding:60,textAlign:"center"}}>
        <h1 style={{color:"#ff8fbc"}}>Huong Ngoai<br/>With Friends</h1>
        <button onClick={()=>setView("lobby")} style={{background:"#ff8fbc",color:"#fff",border:0,padding:"14px 0",width:"100%",borderRadius:999,fontWeight:700}}>Vao sanh</button>
      </div>}

      {view==="lobby"&&<div style={{padding:20}}>
        <input value={name} onChange={e=>setName(e.target.value)} placeholder="Ten ban" style={{width:"100%",padding:12,borderRadius:12,border:"1px solid #ffd6e7"}}/>
        <button onClick={()=>{setRoom("ZQ2UU");setView("room");setMode(null);}} style={{marginTop:12,background:"#ff8fbc",color:"#fff",border:0,padding:"12px 0",width:"100%",borderRadius:999}}>Tao phong</button>
      </div>}

      {view==="room"&&<div>
        <div style={{display:"flex",gap:8,padding:10,background:"#fff2f7",alignItems:"center"}}>
          <div style={{width:56,height:56,borderRadius:"50%",background:"#ff8fbc",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden",position:"relative"}}>
            {camOn?<video ref={videoRef} autoPlay muted playsInline style={{width:"100%",height:"100%",objectFit:"cover"}}/>:name[0]}
          </div>
          <div style={{fontSize:12}}>Phong {room} - {mode||"Chua chon"}<br/>Bat ca mic+cam +10d - Diem: {score}</div>
          <button onClick={()=>setView("lobby")} style={{marginLeft:"auto",background:"#fff",border:"1px solid #ffd6e7",borderRadius:999,padding:"6px 12px"}}>Roi</button>
        </div>

        <div style={{position:"relative",height:280,background:"#fff8fb",border:"1px solid #ffe4ee"}}>
          <canvas ref={canvasRef} style={{width:"100%",height:"100%"}}/>
          {mode==="2D"&&<div style={{position:"absolute",left:pos.x,top:pos.y,width:44,height:44,background:"#ff8fbc",borderRadius:"50%",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center"}}>{name[0]}</div>}
        </div>

        {!mode&&<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.4)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:99}}>
          <div style={{background:"#fff",padding:20,borderRadius:20,width:300,textAlign:"center"}}>
            <h3>Chon cach choi</h3>
            <button onClick={()=>setMode("CAM")} style={{background:"#ff8fbc",color:"#fff",border:0,padding:12,width:"100%",borderRadius:12,marginTop:8}}>Tat ca bat CAM/MIC</button>
            <button onClick={()=>setMode("2D")} style={{background:"#333",color:"#fff",border:0,padding:12,width:"100%",borderRadius:12,marginTop:8}}>Tat ca dung nhan vat 2D di chuyen</button>
          </div>
        </div>}

        <div style={{padding:10,display:"flex",gap:6,flexWrap:"wrap"}}>
          {GAMES.map((g,i)=><button key={i} onClick={()=>setGame(i)} style={{background:i===game?"#ff8fbc":"#fff",color:i===game?"#fff":"#ff8fbc",border:"1px solid #ffd6e7",borderRadius:999,padding:"6px 10px",fontSize:11}}>{g.k}</button>)}
        </div>

        <div style={{padding:"0 10px",display:"flex",gap:6,flexWrap:"wrap"}}>
          <button onClick={toggleMic} style={{border:"1px solid #ffd6e7",borderRadius:999,padding:"6px 10px",background:micOn?"#ff8fbc":"#fff",color:micOn?"#fff":"#ff8fbc"}}>Mic {micOn?"ON":"OFF"}</button>
          <button onClick={toggleCam} style={{border:"1px solid #ffd6e7",borderRadius:999,padding:"6px 10px",background:camOn?"#ff8fbc":"#fff",color:camOn?"#fff":"#ff8fbc"}}>Cam tron {camOn?"ON":"OFF"}</button>
          <button onClick={()=>setScore(s=>s+1)} style={{border:"1px solid #ffd6e7",borderRadius:999,padding:"6px 10px",background:"#fff"}}>BIT MIENG</button>
          <button onClick={()=>setScore(s=>s+2)} style={{border:"1px solid #ffd6e7",borderRadius:999,padding:"6px 10px",background:"#fff"}}>GIU CHAN</button>
          <button onClick={()=>setScore(s=>s+1)} style={{border:"1px solid #ffd6e7",borderRadius:999,padding:"6px 10px",background:"#fff"}}>QUAT NGUOC</button>
        </div>

        {mode==="2D"&&<div style={{display:"flex",gap:6,justifyContent:"center",marginTop:8}}>
          <button onClick={()=>setPos(p=>({...p,x:Math.max(0,p.x-16)}))}>◀</button>
          <button onClick={()=>setPos(p=>({...p,x:p.x+16}))}>▶</button>
          <button onClick={()=>setPos(p=>({...p,y:Math.max(0,p.y-16)}))}>▲</button>
          <button onClick={()=>setPos(p=>({...p,y:p.y+16}))}>▼</button>
        </div>}

        <div style={{padding:10}}>
          <div style={{border:"1px solid #ffe4ee",borderRadius:12,padding:6,height:80,overflow:"auto",background:"#fff8fb"}}>{chat.map((c,i)=><div key={i} style={{fontSize:12}}>{c}</div>)}</div>
          <div style={{display:"flex",gap:4,marginTop:6}}>
            <input value={chatIn} onChange={e=>setChatIn(e.target.value)} placeholder="Chat rieng - chi trong phong co ma moi thay" style={{flex:1,padding:8,borderRadius:12,border:"1px solid #ffd6e7"}}/>
            <button onClick={()=>{ if(!chatIn) return; setChat([...chat,name+": "+chatIn]); setChatIn(""); }} style={{background:"#ff8fbc",color:"#fff",border:0,borderRadius:12,padding:"8px 14px"}}>Gui</button>
          </div>
        </div>
      </div>}
    </div>
  );
}
