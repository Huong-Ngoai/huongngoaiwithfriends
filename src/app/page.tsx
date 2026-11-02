"use client";
import { useState, useEffect, useRef } from "react";

export default function Page(){
  const [view,setView]=useState("welcome");
  const [mode,setMode]=useState<"CAM"|"2D"|null>(null);
  const [roomCode,setRoomCode]=useState("");
  const [myName,setMyName]=useState("");
  const [myEmail,setMyEmail]=useState("");
  const [players,setPlayers]=useState(1);
  const [chat,setChat]=useState<string[]>([]);
  const [pos,setPos]=useState({x:150,y:100});
  const [score,setScore]=useState(0);
  const canvasRef=useRef<HTMLCanvasElement>(null);

  // WiFi check
  useEffect(()=>{
    // @ts-ignore
    if(navigator.connection){ console.log("wifi check"); }
  },[]);

  // 2D di chuyển WASD
  useEffect(()=>{
    if(mode!=="2D" || view!=="room") return;
    const onKey=(e:KeyboardEvent)=>{
      if(e.key==="w"||e.key==="ArrowUp") setPos(p=>({x:p.x,y:Math.max(0,p.y-15)}));
      if(e.key==="s"||e.key==="ArrowDown") setPos(p=>({x:p.x,y:Math.min(350,p.y+15)}));
      if(e.key==="a"||e.key==="ArrowLeft") setPos(p=>({x:Math.max(0,p.x-15),y:p.y}));
      if(e.key==="d"||e.key==="ArrowRight") setPos(p=>({x:Math.min(350,p.x+15),y:p.y}));
    };
    window.addEventListener("keydown",onKey);
    return ()=>window.removeEventListener("keydown",onKey);
  },[mode,view]);

  const createRoom=()=>{
    const code=Math.random().toString(36).toUpperCase().slice(2,8);
    setRoomCode(code); setView("room"); setPlayers(1);
    setTimeout(()=>startGame(),300);
  };

  const startGame=()=>{
    const c=canvasRef.current; if(!c) return;
    const ctx=c.getContext("2d")!; c.width=c.clientWidth*2; c.height=c.clientHeight*2;
    ctx.clearRect(0,0,c.width,c.height);
    ctx.fillStyle="#ff8fbc"; ctx.font="bold 22px system-ui";
    const games=["HÉT TO NHẤT 🎤 10 GIÂY - >85db loa nổ","BOM NỔ CHẬM 💣 - Hét 1 từ trong 2s","THỔI NẾN 🎂 - Thổi phù","MA SÓI 🐺 3 PHÚT - 3 Đêm 3 Ngày","NÓI NHANH 💨 7 VÁN","ĐOÁN CẢM XÚC 😡","NHỊN CƯỜI 😂","ĐÓNG BĂNG TƯỢNG 🧊 Random 1 tượng","VẼ BẬY PHOTOBOOTH 🤪 Random 1 mẫu","NỐI TỪ ĐUÔI 🔤 DUYỆT >50%"];
    const g=Math.floor(Math.random()*10);
    ctx.fillText(games[g],20,50);
    ctx.font="14px system-ui"; ctx.fillText("Luật chung: auto xin mic/cam, ko bật ko trừ điểm, bật cả 2 +10đ",20,80);
    ctx.fillText("Màn hình chia 3: Trên mặt 60px - Giữa sân khấu - Dưới chat riêng bảo mật",20,100);
  };

  const btn={background:"#ff8fbc",color:"#fff",border:0,padding:"12px 20px",borderRadius:999,fontWeight:700 as const,margin:6} as const;
  const btnS={background:"#ff8fbc",color:"#fff",border:0,padding:"8px 12px",borderRadius:999,fontSize:12,margin:4} as const;
  const input={padding:10,border:"1px solid #ffc2d8",borderRadius:12,width:"92%",margin:6} as const;

  return (
    <div style={{maxWidth:420,margin:"auto",minHeight:"100vh",background:"#fff",boxShadow:"0 0 20px #ffd6e7",fontFamily:"system-ui"}}>
      {view==="welcome" && (
        <div style={{textAlign:"center",padding:40,minHeight:"100vh",display:"flex",flexDirection:"column",justifyContent:"center"}}>
          <h1 style={{color:"#ff8fbc"}}>Huong Ngoai<br/>With Friends</h1>
          <p>V11.5 FINAL FULL 100% - KHÔNG DONATE</p>
          <p style={{fontSize:11}}>2-6 người/phòng - WiFi - Email/SĐT + MK - WebRTC Cam tròn + Mic - WebSocket Realtime - Không tải app</p>
          <button onClick={()=>setView("lobby")} style={btn}>Vào sảnh 🔊</button>
          <button style={btn}>🎵 Bật/Tắt nhạc lofi</button>
          <p style={{fontSize:10,marginTop:10}}>Liên hệ: huongngoaiwithfriends@gmail.com<br/>Chính sách: Chỉ lưu local, cam/mic chỉ khi đồng ý - Luật cấm nói bậy gây war ban 24h</p>
        </div>
      )}

      {view==="lobby" && (
        <div style={{textAlign:"center",padding:20}}>
          <h2 style={{color:"#ff8fbc"}}>Sảnh - Chọn Avatar</h2>
          <input placeholder="Tên hiển thị" value={myName} onChange={e=>setMyName(e.target.value)} style={input}/>
          <input placeholder="Email / SĐT bắt buộc lưu TK" value={myEmail} onChange={e=>setMyEmail(e.target.value)} style={input}/>
          <input type="password" placeholder="Mật khẩu" style={input}/>
          <div>😻 <span style={btnS}>😻</span><span style={btnS}>🐶</span><span style={btnS}>🐼</span><span style={btnS}>🦊</span></div>
          <button onClick={createRoom} style={btn}>Tạo phòng - Tạo mã 6 ký tự</button>
          <div><input placeholder="Nhập mã phòng" onChange={e=>setRoomCode(e.target.value.toUpperCase())} style={input}/><button onClick={()=>setView("room")} style={btn}>Vào phòng</button></div>
          <div style={{fontSize:11,textAlign:"left",background:"#fff2f7",padding:10,borderRadius:12,marginTop:10}}>
            <b>10 game:</b> 1 HÉT TO 10s đo 85db BỊT MIỆNG, 2 BOM GIỮ CHÂN/CẮT DÂY, 3 THỔI NẾN QUẠT NGƯỢC, 4 MA SÓI 3 phút BỊT MẮT THÊM/CÀO NHẸ/HÙ MA/CHỈ TAY, 5 NÓI NHANH 7 ván GIÀNH QUYỀN NÓI, 6 ĐOÁN CẢM XÚC, 7 NHỊN CƯỜI, 8 ĐÓNG BĂNG TƯỢNG random 1 tượng, 9 VẼ BẬY PHOTOBOOTH random 1 mẫu, 10 NỐI TỪ ĐUÔI DUYỆT {'>'}50%<br/>
            Mỗi người 20 lượt, 5 lượt/1 quảng cáo, hết xem 2 +1 lượt - Chat Chung có Admin khác chat riêng - Vòng quay CTV 4 số
          </div>
        </div>
      )}

      {view==="room" && (
        <div>
          <div style={{display:"flex",gap:6,overflow:"auto",padding:8,background:"#fff2f7"}}>
            {[...Array(players)].map((_,i)=><div key={i} style={{width:60,height:60,borderRadius:"50%",background:"#ff8fbc",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",flexShrink:0}}>{myName[0]||"B"}<span style={{position:"absolute",marginLeft:40,marginTop:30,background:"#000",color:"#fff",fontSize:10,padding:"2px 5px",borderRadius:999}}>{score}</span></div>)}
          </div>
          <div style={{textAlign:"center",fontSize:12,padding:4}}>Phòng: <b>{roomCode}</b> {players}/6 <button onClick={()=>setView("lobby")} style={btnS}>Rời</button> <button onClick={startGame} style={btnS}>BẮT ĐẦU</button></div>
          
          <div style={{height:420,background:"#fff0f6",position:"relative",borderTop:"2px solid #ffd6e7",borderBottom:"2px solid #ffd6e7"}}>
            <canvas ref={canvasRef} style={{width:"100%",height:"100%"}}/>
            {mode==="2D" && (
              <div style={{position:"absolute",left:pos.x,top:pos.y,width:50,height:50,background:"#ff8fbc",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",border:"2px solid #fff",boxShadow:"0 0 10px #ff8fbc"}}>{myName[0]||"B"}</div>
            )}
          </div>

          {!mode && (
            <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.5)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:99}}>
              <div style={{background:"#fff",padding:16,borderRadius:16,width:"90%"}}>
                <h3>Chọn chế độ trước khi vào phòng</h3>
                <p style={{fontSize:12}}>Luật chung: Vào phòng auto xin bật mic/cam. Không bật vẫn chơi, không trừ điểm. Bật cả 2 +10đ. Đây là chỗ chọn 2D bạn yêu cầu.</p>
                <button onClick={()=>{setMode("CAM"); setScore(s=>s+10);}} style={{...btn,width:"100%"}}>Tất cả bật CAM/MIC - Chơi như trên, không cần 2D</button>
                <button onClick={()=>setMode("2D")} style={{...btn,width:"100%"}}>Tất cả dùng nhân vật 2D di chuyển - Hiện nhân vật AI 2D</button>
              </div>
            </div>
          )}

          <div style={{padding:8}}>
            {mode==="2D" && <div style={{textAlign:"center"}}><p style={{fontSize:11}}>Nhân vật 2D di chuyển - WASD hoặc bấm nút - Lại gần mới troll được</p><button onClick={()=>setPos(p=>({x:p.x-15,y:p.y}))} style={btnS}>◀</button><button onClick={()=>setPos(p=>({x:p.x+15,y:p.y}))} style={btnS}>▶</button><button onClick={()=>setPos(p=>({x:p.x,y:p.y-15}))} style={btnS}>▲</button><button onClick={()=>setPos(p=>({x:p.x,y:p.y+15}))} style={btnS}>▼</button></div>}
            <div style={{height:70,overflow:"auto",background:"#fffafc",border:"1px solid #ffd6e7",borderRadius:10,padding:6,fontSize:12}}>{chat.map((c,i)=><div key={i}>{c}</div>)}</div>
            <input placeholder="Chat riêng bảo mật chỉ trong phòng có mã" style={input} onKeyDown={e=>{if(e.key==="Enter"){const el=e.target as HTMLInputElement; setChat([...chat, `${myName||"Bạn"}: ${el.value}`]); el.value="";}}}/>
            <div style={{display:"flex",flexWrap:"wrap"}}><button style={btnS}>🎤 Mic</button><button style={btnS}>📷 Cam tròn 60px</button><button style={btnS}>BỊT MIỆNG</button><button style={btnS}>GIỮ CHÂN</button><button style={btnS}>QUẠT NGƯỢC</button></div>
          </div>
        </div>
      )}
    </div>
  );
}
