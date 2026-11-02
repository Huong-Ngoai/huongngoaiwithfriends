"use client";
import { useState, useEffect, useRef } from "react";

export default function Page(){
  const [view,setView]=useState<"welcome">("welcome");
  const [mode,setMode]=useState<"CAM"|"2D"|null>(null);
  const [roomCode,setRoomCode]=useState("");
  const [myName,setMyName]=useState("Bạn");
  const [pos,setPos]=useState({x:160,y:180});
  const [gameIdx,setGameIdx]=useState(0);
  const [score,setScore]=useState(0);
  const [time,setTime]=useState(10);
  const canvasRef=useRef<HTMLCanvasElement>(null);

  const GAMES=[
    {name:"HÉT TO NHẤT 🎤", desc:"Cả phòng hét 10s - >85db loa nổ"},
    {name:"BOM NỔ CHẬM 💣", desc:"Hét 1 từ trong 2s để chuyền bom"},
    {name:"THỔI NẾN 🎂", desc:"Thổi phù tắt nến"},
    {name:"MA SÓI 🐺 3 PHÚT", desc:"3 Đêm 30s + 3 Ngày 30s"},
    {name:"NÓI NHANH 💨", desc:"Bấm giành quyền nói 7s"},
    {name:"ĐOÁN CẢM XÚC 😡", desc:"Làm mặt theo lệnh"},
    {name:"NHỊN CƯỜI 😂", desc:"Ai cười trước thua"},
    {name:"ĐÓNG BĂNG TƯỢNG 🧊", desc:"Random 1 người làm tượng"},
    {name:"VẼ BẬY 🤪", desc:"Random 1 người làm mẫu photobooth"},
    {name:"NỐI TỪ ĐUÔI 🔤", desc:"15s gõ - Cả phòng duyệt >50%"},
  ];

  // 2D di chuyển
  useEffect(()=>{
    if(mode!=="2D" || view!=="room") return;
    const onKey=(e:KeyboardEvent)=>{
      if(e.key.toLowerCase()==="w") setPos(p=>({x:p.x,y:Math.max(10,p.y-12)}));
      if(e.key.toLowerCase()==="s") setPos(p=>({x:p.x,y:Math.min(360,p.y+12)}));
      if(e.key.toLowerCase()==="a") setPos(p=>({x:Math.max(10,p.x-12),y:p.y}));
      if(e.key.toLowerCase()==="d") setPos(p=>({x:Math.min(340,p.x+12),y:p.y}));
    };
    window.addEventListener("keydown",onKey);
    return ()=>window.removeEventListener("keydown",onKey);
  },[mode,view]);

  // Vẽ game - FIX lỗi trắng màn hình
  useEffect(()=>{
    if(view!=="room") return;
    const c=canvasRef.current; if(!c) return;
    const ctx=c.getContext("2d")!; 
    c.width=c.clientWidth; c.height=c.clientHeight; // FIX: bỏ x2
    const draw=()=>{
      ctx.clearRect(0,0,c.width,c.height);
      ctx.fillStyle="#fff0f6"; ctx.fillRect(0,0,c.width,c.height);
      ctx.fillStyle="#ff8fbc"; ctx.font="bold 18px system-ui";
      ctx.fillText(GAMES[gameIdx].name, 16, 32);
      ctx.fillStyle="#666"; ctx.font="13px system-ui";
      ctx.fillText(GAMES[gameIdx].desc, 16, 52);
      // Hiệu ứng theo game
      if(gameIdx===0){ ctx.fillStyle="#ff8fbc"; ctx.fillRect(16,70,time*20,12); ctx.fillStyle="#333"; ctx.fillText(time+"s",16,100); }
      if(gameIdx===3){ ctx.fillStyle="rgba(0,0,0,0.7)"; ctx.fillRect(0,0,c.width,c.height); ctx.fillStyle="#ff3b3b"; ctx.fillText("🌕 Trăng máu - ĐÊM - Che mắt bằng 2 tay",16,80); }
      if(gameIdx===7){ ctx.fillStyle="#8ecfff"; ctx.fillRect(c.width/2-30,80,60,80); ctx.fillText("TƯỢNG - Đóng băng!",c.width/2-50,180); }
    };
    draw();
    const id=setInterval(()=>{ setTime(t=> t>0? t-1 : 10); draw(); },1000);
    return ()=>clearInterval(id);
  },[view,gameIdx,time]);

  const createRoom=()=>{ setRoomCode(Math.random().toString(36).toUpperCase().slice(2,7)); setView("room"); setMode(null); };

  return (
    <div style={{maxWidth:420,margin:"auto",minHeight:"100vh",background:"#fff",fontFamily:"system-ui",color:"#333"}}>
      {view==="welcome" && (
        <div style={{textAlign:"center",padding:"50px 24px",minHeight:"100vh",display:"flex",flexDirection:"column",justifyContent:"center",background:"linear-gradient(#fff,#fff2f7)"}}>
          <h1 style={{color:"#ff8fbc",fontSize:32,lineHeight:1.1,margin:0}}>Huong Ngoai<br/>With Friends</h1>
          <p style={{color:"#888",fontSize:14,marginTop:12}}>Game giải trí cùng bạn bè</p>
          <div style={{marginTop:28}}>
            <button onClick={()=>setView("lobby")} style={{background:"#ff8fbc",color:"#fff",border:0,padding:"14px 0",borderRadius:999,width:"100%",fontWeight:700,fontSize:16}}>Vào sảnh</button>
            <button onClick={()=>{}} style={{background:"#fff",color:"#ff8fbc",border:"1.5px solid #ffc2d8",padding:"12px 0",borderRadius:999,width:"100%",fontWeight:600,marginTop:10}}>🎵 Nhạc</button>
          </div>
          <p style={{fontSize:10,color:"#bbb",marginTop:24}}>huongngoaiwithfriends@gmail.com</p>
        </div>
      )}

      {view==="lobby" && (
        <div style={{padding:20,textAlign:"center"}}>
          <h2 style={{color:"#ff8fbc"}}>Sảnh</h2>
          <input placeholder="Tên của bạn" value={myName} onChange={e=>setMyName(e.target.value)} style={{padding:12,border:"1px solid #ffd6e7",borderRadius:12,width:"100%",margin:"8px 0"}}/>
          <div style={{margin:"12px 0"}}>😻 🐶 🐼 🦊 <span style={{fontSize:12,color:"#888"}}>Chọn avatar</span></div>
          <button onClick={createRoom} style={{background:"#ff8fbc",color:"#fff",border:0,padding:"14px 0",borderRadius:999,width:"100%",fontWeight:700}}>Tạo phòng mới</button>
          <div style={{display:"flex",gap:8,marginTop:10}}><input placeholder="Nhập mã phòng" onChange={e=>setRoomCode(e.target.value.toUpperCase())} style={{flex:1,padding:12,border:"1px solid #ffd6e7",borderRadius:12}}/><button onClick={()=>setView("room")} style={{background:"#333",color:"#fff",border:0,padding:"12px 18px",borderRadius:12}}>Vào</button></div>
        </div>
      )}

      {view==="room" && (
        <div>
          <div style={{display:"flex",gap:8,padding:10,background:"#fff2f7",overflow:"auto"}}>
            <div style={{width:56,height:56,borderRadius:"50%",background:"#ff8fbc",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,flexShrink:0,position:"relative"}}>{myName[0]}<span style={{position:"absolute",bottom:-4,right:-4,background:"#000",color:"#fff",fontSize:10,padding:"2px 6px",borderRadius:999}}>{score}</span></div>
            <div style={{fontSize:12,alignSelf:"center"}}>Phòng <b>{roomCode}</b> • {mode||"Chưa chọn"}<br/><span style={{color:"#888"}}>Bật cả mic+cam +10đ</span></div>
            <button onClick={()=>setView("lobby")} style={{marginLeft:"auto",background:"#fff",border:"1px solid #ffd6e7",borderRadius:999,padding:"6px 12px",fontSize:12}}>Rời</button>
          </div>

          <div style={{height:380,position:"relative",background:"#fff8fb",borderTop:"1px solid #ffe4ee",borderBottom:"1px solid #ffe4ee"}}>
            <canvas ref={canvasRef} style={{width:"100%",height:"100%",display:"block"}}/>
            {mode==="2D" && <div style={{position:"absolute",left:pos.x,top:pos.y,width:44,height:44,background:"#ff8fbc",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",boxShadow:"0 4px 12px #ffc2d8",border:"2px solid #fff",transition:"0.1s"}}>{myName[0]}</div>}
          </div>

          {!mode && (
            <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.45)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:99,padding:16}}>
              <div style={{background:"#fff",borderRadius:20,padding:20,width:"100%",maxWidth:360,textAlign:"center"}}>
                <h3 style={{margin:0}}>Chọn cách chơi</h3>
                <p style={{fontSize:12,color:"#888",margin:"8px 0 14px"}}>Luật chung: Vào phòng auto xin mic/cam. Không bật vẫn chơi không trừ điểm. Bật cả 2 +10đ</p>
                <button onClick={()=>{setMode("CAM");setScore(s=>s+10);}} style={{background:"#ff8fbc",color:"#fff",border:0,padding:"12px",borderRadius:12,width:"100%",fontWeight:700,marginBottom:8}}>🎥 Tất cả bật CAM/MIC</button>
                <button onClick={()=>setMode("2D")} style={{background:"#333",color:"#fff",border:0,padding:"12px",borderRadius:12,width:"100%",fontWeight:700}}>🧍 Tất cả dùng nhân vật 2D di chuyển</button>
              </div>
            </div>
          )}

          <div style={{padding:12}}>
            <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:8}}>
              {GAMES.map((g,i)=><button key={i} onClick={()=>setGameIdx(i)} style={{background:i===gameIdx?"#ff8fbc":"#fff",color:i===gameIdx?"#fff":"#ff8fbc",border:"1px solid #ffc2d8",borderRadius:999,padding:"6px 10px",fontSize:11}}>{g.name.split(" ")[0]}</button>)}
            </div>
            {mode==="2D" && <div style={{display:"flex",justifyContent:"center",gap:8,marginBottom:8}}><button onClick={()=>setPos(p=>({x:Math.max(10,p.x-15),y:p.y}))} style={sBtn}>◀</button><button onClick={()=>setPos(p=>({x:Math.min(340,p.x+15),y:p.y}))} style={sBtn}>▶</button><button onClick={()=>setPos(p=>({x:p.x,y:Math.max(10,p.y-15)}))} style={sBtn}>▲</button><button onClick={()=>setPos(p=>({x:p.x,y:Math.min(360,p.y+15)}))} style={sBtn}>▼</button><span style={{fontSize:10,color:"#888",alignSelf:"center"}}>WASD cũng được</span></div>}
            <input placeholder="Chat riêng - chỉ trong phòng có mã mới thấy" style={{width:"100%",padding:10,border:"1px solid #ffe4ee",borderRadius:12,fontSize:12}}/>
            <div style={{display:"flex",gap:6,marginTop:8,flexWrap:"wrap"}}>
              <button onClick={()=>{}} style={sBtn}>🎤 Mic</button><button onClick={()=>{}} style={sBtn}>📷 Cam tròn</button><button onClick={()=>setScore(s=>s+1)} style={sBtn}>BỊT MIỆNG</button><button style={sBtn}>GIỮ CHÂN</button><button style={sBtn}>QUẠT NGƯỢC</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
const sBtn={background:"#fff",border:"1px solid #ffd6e7",borderRadius:999,padding:"6px 10px",fontSize:11,color:"#ff8fbc"} as const;
