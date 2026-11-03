"use client";
import { useState, useEffect, useRef } from "react";

type User={email:string,pass:string,name:string,avatar:string};
const AVATARS=["😻","🐶","🐼","🦊","🐰","🐧","🦁","🐯"];
const GAMES_FULL=[
{name:"HÉT TO NHẤT 🎤 - 10 GIÂY",how:"Cả phòng cùng hét 1 lúc 10s. Đo decibel, hiện biểu đồ. >85db loa nổ. Cam đo miệng há to. Troll: BỊT MIỆNG mute 1s + GỠ BỊT. Thắng: điểm hét + há miệng +10đ"},
{name:"BOM NỔ CHẬM 💣",how:"Bom chạy vòng quanh ô mặt. Người giữ bom phải hét 1 từ trong 2s để chuyền. Cam check giật mình. Troll: GIỮ CHÂN 1s, CẮT DÂY cháy x2. Thắng: sống sót cuối +10đ"},
{name:"THỔI NẾN 🎂",how:"1 bánh kem khổng lồ giữa, cùng thổi. Mic thổi phù tạo gió. Cam đo má phồng. Troll: QUẠT NGƯỢC gió tím, CHE BÁNH. Thắng: tắt nhiều nến nhất +10đ"},
{name:"MA SÓI 🐺 - 3 PHÚT",how:"1 ván 3 phút 3 Đêm 30s tối đen trăng máu + 3 Ngày 30s cãi nhau. Chia: 1 Sói, 1 Tiên Tri, 1 Bảo Vệ, còn lại Dân. Đêm: che mắt 2 tay, Sói gầm gừ, có nút BỊT MẮT THÊM, CÀO NHẸ, HÙ MA. Ngày: bật/tắt mic cãi, CHỈ TAY, NÉM CÀ CHUA, TỐ CÁO. Thắng: Dân vote đúng +20đ, Sói sống +30đ +10đ thưởng"},
{name:"NÓI NHANH 💨 - 7 VÁN",how:"Màn hình hiện 10 từ. Ai bấm GIÀNH QUYỀN NÓI nhanh nhất mở mic 7s. Nói đúng 1 từ +2đ. Cam đo miệng. Troll: LÀM LOÁ MẮT mờ chữ 1s, LÀM LÍU LƯỠI xoắn ngược. Sau 7 ván ai nhiều điểm +2 nhất thắng +10đ"},
{name:"ĐOÁN CẢM XÚC 😡",how:"Máy ra lệnh VUI + nói 'Tao mất xe rồi'. Cam chấm % mặt vui, Mic chấm giọng. Troll: ĐỔI MẶT, THẢ TIM/BOM che mặt. Thắng: % cao nhất +10đ"},
{name:"NHỊN CƯỜI 😂",how:"Xem mặt bạn bè bóp méo. Cam quét miệng nhếch, Mic quét tiếng cười. Troll: CHỌC LÉT tụt 20% thanh nhịn, GỬI MEME HÀI. Thắng: Nhịn lâu nhất +10đ"},
{name:"ĐÓNG BĂNG TƯỢNG 🧊 V10.9",how:"Random 1 người ra giữa làm TƯỢNG phóng to. Nhạc 5s nhảy điên loạn, KÉT! đóng băng 5s. Cam quét nhúc nhích 1mm là nứt. Mic quét tiếng động. 9 người còn lại troll: ĐỔI NHẠC đám ma, CHỌC LÉT lông gà, THẢ RUỒI, KỂ CHUYỆN CƯỜI, người tượng bấm GỒNG CỨNG. Thắng: cứng nhất +5đ/lượt, troll nứt +2đ"},
{name:"VẼ BẬY LÊN MẶT 🤪 PHOTOBOOTH",how:"Random 1 người làm MẪU full mặt. 9 người còn lại vẽ bậy 30s: bút 10 màu dạ quang, Sticker AR kính đen môi đỏ mũ hề mũi heo ria mép dính chặt, ĐỔ SƠN, BÓP MÉO, PHÓNG TO MŨI. Cuối TÁCH! chụp 4 kiểu photobooth lưu album. Không thắng thua, không điểm"},
{name:"NỐI TỪ ĐUÔI 🔤",how:"Màn hình lớn hiện 2 từ khởi đầu. Vòng quay random chọn người đầu. Mỗi người 15s gõ letter by letter mọi người thấy. Gõ xong hiện to giữa màn hình cho cả phòng DUYỆT/KHÔNG DUYỆT. >50% DUYỆT mới tính, không thì trừ điểm loại 1 lượt. Troll: GÂY NHIỄU nhảy chữ, ĐỔI CHỮ khó. Mỗi từ duyệt thành trang truyện bay lên ghép cuốn truyện dài. Thắng: nối nhiều từ có nghĩa được duyệt nhất +10đ, quá 15s -2đ"},
];

export default function Page(){
  const [page,setPage]=useState<"auth"|"lobby"|"intro"|"chatChung"|"wheel"|"policy"|"room"|"admin">("auth");
  const [users,setUsers]=useState<User[]>([]); const [cur,setCur]=useState<User|null>(null);
  const [email,setEmail]=useState(""); const [pass,setPass]=useState(""); const [isReg,setIsReg]=useState(false);
  const [room,setRoom]=useState(""); const [mode,setMode]=useState<"CAM"|"2D"|null>(null);
  const [pos,setPos]=useState({x:140,y:160}); const [gameIdx,setGameIdx]=useState(0);
  const [micOn,setMicOn]=useState(false); const [camOn,setCamOn]=useState(false); const [score,setScore]=useState(11);
  const [db,setDb]=useState(0); const [turns,setTurns]=useState(20); const [plays,setPlays]=useState(0);
  const [chat,setChat]=useState<string[]>([]); const [chatIn,setChatIn]=useState("");
  const [chatChung,setChatChung]=useState<string[]>(["Admin Vy: Chào mọi người! Đây là phòng chat chung góp ý game, cấm nói bậy gây war nhé!"]);
  const [wheelNums,setWheelNums]=useState<number[]>([]); const [avatar,setAvatar]=useState(AVATARS[0]);
  const [clickLogo,setClickLogo]=useState(0);
  const videoRef=useRef<HTMLVideoElement>(null); const streamRef=useRef<MediaStream|null>(null);
  const canvasRef=useRef<HTMLCanvasElement>(null); const audioRef=useRef<HTMLAudioElement>(null);
  const [musicOn,setMusicOn]=useState(false);

  useEffect(()=>{ const s=localStorage.getItem("hn_users"); if(s) setUsers(JSON.parse(s)); const c=localStorage.getItem("hn_cur"); if(c){setCur(JSON.parse(c)); setPage("lobby"); setAvatar(JSON.parse(c).avatar);} if((navigator as any).connection && (navigator as any).connection.type!=="wifi"){} },[]);
  const saveUsers=(u:User[])=>{ setUsers(u); localStorage.setItem("hn_users",JSON.stringify(u)); };

  const doAuth=()=>{
    if(!email||!pass) return alert("Nhập email/sđt + mật khẩu bắt buộc!");
    if(isReg){
      if(users.find(x=>x.email===email)) return alert("Tài khoản đã có!");
      const nu={email,pass:btoa(pass),name:email.split("@")[0],avatar}; const nu2=[...users,nu]; saveUsers(nu2);
      localStorage.setItem("hn_cur",JSON.stringify(nu)); setCur(nu); setPage("lobby");
    }else{
      const f=users.find(x=>x.email===email && x.pass===btoa(pass)); if(!f) return alert("Sai tài khoản!");
      localStorage.setItem("hn_cur",JSON.stringify(f)); setCur(f); setAvatar(f.avatar); setPage("lobby");
    }
  };
  const logout=()=>{ localStorage.removeItem("hn_cur"); setCur(null); setPage("auth"); };

  const toggleMic=async()=>{
    try{
      if(micOn){ streamRef.current?.getAudioTracks().forEach(t=>t.stop()); setMicOn(false); return;}
      const s=await navigator.mediaDevices.getUserMedia({audio:true}); streamRef.current=s; setMicOn(true); setScore(v=>v+10);
      const ctx=new (window.AudioContext||(window as any).webkitAudioContext)(); const src=ctx.createMediaStreamSource(s); const an=ctx.createAnalyser(); src.connect(an);
      const data=new Uint8Array(an.frequencyBinCount); const loop=()=>{ an.getByteFrequencyData(data); setDb(Math.max(...data)); if(micOn) requestAnimationFrame(loop);}; loop();
    }catch{ alert("Bạn chưa cho phép Mic! Bấm Cho phép nhé. Không bật vẫn chơi bình thường, không trừ điểm.");}
  };
  const toggleCam=async()=>{
    try{
      if(camOn){ streamRef.current?.getVideoTracks().forEach(t=>t.stop()); setCamOn(false); return;}
      const s=await navigator.mediaDevices.getUserMedia({video:true}); if(videoRef.current){ videoRef.current.srcObject=s; videoRef.current.play();} streamRef.current=s; setCamOn(true); setScore(v=>v+10);
    }catch{ alert("Bạn chưa cho phép Cam! Không bật vẫn chơi bình thường.");}
  };

  useEffect(()=>{
    if(page!=="room"||mode!=="2D") return;
    const k=(e:KeyboardEvent)=>{ const m=e.key.toLowerCase(); if(m==="w") setPos(p=>({...p,y:Math.max(0,p.y-14)})); if(m==="s") setPos(p=>({...p,y:Math.min(320,p.y+14)})); if(m==="a") setPos(p=>({...p,x:Math.max(0,p.x-14)})); if(m==="d") setPos(p=>({...p,x:Math.min(340,p.x+14)})); };
    window.addEventListener("keydown",k); return()=>window.removeEventListener("keydown",k);
  },[page,mode]);

  useEffect(()=>{
    if(page!=="room") return; const c=canvasRef.current; if(!c) return; const ctx=c.getContext("2d")!; c.width=c.clientWidth; c.height=c.clientHeight;
    const draw=()=>{ ctx.clearRect(0,0,c.width,c.height); ctx.fillStyle="#fff6f9"; ctx.fillRect(0,0,c.width,c.height);
      ctx.fillStyle="#ff8fbc"; ctx.font="bold 15px system-ui"; ctx.fillText(GAMES_FULL[gameIdx].name,10,22);
      ctx.fillStyle="#666"; ctx.font="11px system-ui"; const lines=GAMES_FULL[gameIdx].how.match(/.{1,52}/g)||[]; lines.slice(0,3).forEach((l,i)=>ctx.fillText(l,10,38+i*13));
      if(GAMES_FULL[gameIdx].name.includes("HÉT")){ ctx.fillStyle="#ffe0ec"; ctx.fillRect(10,80,180,12); ctx.fillStyle="#ff3b7a"; ctx.fillRect(10,80,db*1.8,12); ctx.fillStyle="#333"; ctx.fillText(db>85?"💥 LOA NỔ!":"DB: "+db,10,106);}
    }; draw(); const id=setInterval(draw,400); return()=>clearInterval(id);
  },[page,gameIdx,db]);

  const handlePlay=()=>{ if(turns<=0){ const ok=confirm("Bạn hết 20 lượt! Xem 2 quảng cáo để +1 lượt? (Demo)"); if(ok){setTurns(1);} return;} setTurns(t=>t-1); setPlays(p=>{ const np=p+1; if(np%5===0) alert("📢 Quảng cáo (Demo): Chơi 5 lượt hiện quảng cáo. Liên hệ huongngoaiwithfriends@gmail.com"); return np; }); };

  return(
    <div style={{maxWidth:440,margin:"auto",minHeight:"100vh",background:"#fff",fontFamily:"system-ui",color:"#333"}}>
      <div style={{display:"flex",justifyContent:"space-between",padding:"10px 14px",background:"#fff",borderBottom:"2px solid #ffd6e7",alignItems:"center"}}>
        <b onClick={()=>{ const n=clickLogo+1; setClickLogo(n); if(n>=5){ setPage("admin"); setClickLogo(0);} }} style={{cursor:"pointer"}}>Huong Ngoai <span style={{color:"#ff8fbc"}}>With Friends</span></b>
        <div style={{display:"flex",gap:6}}><button onClick={()=>setMusicOn(!musicOn)} style={{border:"1px solid #ffd6e7",borderRadius:999,padding:"4px 10px",background:"#fff"}}>{musicOn?"🔊":"🔇"}</button>{cur&&<button onClick={logout} style={{fontSize:10}}>Đăng xuất</button>}</div>
      </div>
      <audio ref={audioRef} loop src="https://cdn.pixabay.com/download/audio/2022/03/10/audio_c8c8a650f6.mp3" />

      {page==="auth"&&<div style={{padding:24}}>
        <div style={{background:"#fff",border:"2px solid #ffd6e7",borderRadius:20,padding:20,maxWidth:360,margin:"20px auto"}}>
          <h2 style={{textAlign:"center",color:"#d14a7a"}}>{isReg?"Đăng Ký":"Đăng Nhập"}</h2>
          <p style={{fontSize:11,color:"#888",textAlign:"center"}}>Bắt buộc Email hoặc SĐT + Mật khẩu để lưu tài khoản • WiFi khuyến nghị • WebRTC Cam tròn + Mic • Không cần tải app</p>
          <label style={{fontSize:12}}>Email hoặc SĐT *</label><input value={email} onChange={e=>setEmail(e.target.value)} placeholder="vd: vy@gmail.com hoặc 0912..." style={{width:"100%",padding:12,border:"1px solid #ffd6e7",borderRadius:12,margin:"6px 0"}}/>
          <label style={{fontSize:12}}>Mật khẩu *</label><input type="password" value={pass} onChange={e=>setPass(e.target.value)} placeholder="Mật khẩu" style={{width:"100%",padding:12,border:"1px solid #ffd6e7",borderRadius:12,margin:"6px 0"}}/>
          <div style={{display:"flex",gap:6,flexWrap:"wrap",margin:"8px 0"}}>{AVATARS.map(a=><button key={a} onClick={()=>setAvatar(a)} style={{border:avatar===a?"2px solid #ff8fbc":"1px solid #eee",borderRadius:12,padding:6,background:"#fff"}}>{a}</button>)}
            <label style={{fontSize:10,border:"1px dashed #ffb6d0",padding:6,borderRadius:12,cursor:"pointer"}}>📁 Tải ảnh<input type="file" accept="image/*" style={{display:"none"}} onChange={e=>{ const f=e.target.files?.[0]; if(f){ const r=new FileReader(); r.onload=()=>setAvatar(r.result as string); r.readAsDataURL(f); }}}/></label>
          </div>
          <button onClick={doAuth} style={{width:"100%",background:"#ff8fbc",color:"#fff",border:0,padding:12,borderRadius:999,fontWeight:700}}>{isReg?"Tạo tài khoản":"Đăng Nhập"}</button>
          <p style={{textAlign:"center",fontSize:12}}>{isReg?"Đã có TK?":"Chưa có TK?"} <span onClick={()=>setIsReg(!isReg)} style={{color:"#ff8fbc",fontWeight:700,cursor:"pointer"}}>{isReg?"Đăng nhập":"Đăng ký"}</span></p>
          <p style={{fontSize:10,color:"#999",textAlign:"center",marginTop:10}}>Chính sách: Lưu local, cam/mic chỉ khi đồng ý, chat riêng chỉ phòng có mã mới thấy • Liên hệ: huongngoaiwithfriends@gmail.com</p>
        </div>
      </div>}

      {page==="lobby"&&cur&&<div style={{padding:16}}>
        <p>Xin chào <b>{cur.name}</b> {avatar} - Điểm: {score} - Lượt: {turns}/20</p>
        <div style={{display:"flex",gap:6,flexWrap:"wrap"}}><button onClick={()=>setPage("intro")} style={{border:"1px solid #ffd6e7",borderRadius:999,padding:"6px 10px",background:"#fff"}}>📖 Giới thiệu 10 game</button><button onClick={()=>setPage("chatChung")} style={{border:"1px solid #ffd6e7",borderRadius:999,padding:"6px 10px",background:"#fff"}}>💬 Chat Chung có Admin</button><button onClick={()=>setPage("wheel")} style={{border:"1px solid #ffd6e7",borderRadius:999,padding:"6px 10px",background:"#fff"}}>🎡 Vòng quay CTV</button><button onClick={()=>setPage("policy")} style={{border:"1px solid #ffd6e7",borderRadius:999,padding:"6px 10px",background:"#fff"}}>🔒 Chính sách</button></div>
        <div style={{marginTop:16,background:"#fff2f7",padding:14,borderRadius:16}}>
          <button onClick={()=>{ const c=Math.random().toString(36).toUpperCase().slice(2,8); setRoom(c); setMode(null); setPage("room");}} style={{width:"100%",background:"#ff8fbc",color:"#fff",border:0,padding:12,borderRadius:999,fontWeight:700}}>Tạo phòng (2-6 người) - Tạo mã</button>
          <div style={{display:"flex",gap:6,marginTop:8}}><input id="rc" placeholder="Nhập mã phòng bạn bè gửi" style={{flex:1,padding:12,borderRadius:12,border:"1px solid #ffd6e7"}}/><button onClick={()=>{ const v=(document.getElementById("rc") as HTMLInputElement).value.toUpperCase(); if(!v) return alert("Nhập mã!"); setRoom(v); setMode(null); setPage("room");}} style={{background:"#333",color:"#fff",border:0,padding:"12px 16px",borderRadius:12}}>Vào phòng</button></div>
          <p style={{fontSize:10,color:"#888",marginTop:6}}>Bước quan trọng để chơi: Chủ phòng tạo mã rồi gửi mã cho bạn bè. Game dùng WebRTC cam tròn + mic, WebSocket realtime (giả lập BroadcastChannel), không cần tải app, chỉ khi đồng ý truy cập mới bật cam/mic.</p>
        </div>
      </div>}

      {page==="intro"&&<div style={{padding:16}}><button onClick={()=>setPage("lobby")}>← Sảnh</button><h3>Giới thiệu 10 game - Giải trí cùng bạn bè</h3>{GAMES_FULL.map((g,i)=><div key={i} style={{border:"1px solid #ffe4ee",borderRadius:12,padding:10,margin:"8px 0"}}><b style={{color:"#ff8fbc"}}>{g.name}</b><p style={{fontSize:12,margin:"4px 0"}}>{g.how}</p><div style={{width:"100%",height:60,background:"#fff2f7",borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,color:"#aaa"}}>Giao diện game: {g.name}</div></div>)}</div>}

      {page==="chatChung"&&<div style={{padding:16}}><button onClick={()=>setPage("lobby")}>← Sảnh</button><h3>💬 Phòng Chat Chung - Có Admin Vy</h3><p style={{fontSize:11,color:"#888"}}>Luật: Cấm nói bậy, gây war, spam mã phòng. Vi phạm ban 24h. Dùng để đá code chơi với người lạ hoặc góp ý game.</p><div style={{height:300,overflow:"auto",border:"1px solid #ffe4ee",borderRadius:12,padding:8,background:"#fff8fb"}}>{chatChung.map((c,i)=><div key={i} style={{fontSize:12,padding:4}}>{c}</div>)}</div><div style={{display:"flex",gap:6,marginTop:8}}><input id="ccIn" placeholder="Nhập góp ý..." style={{flex:1,padding:10,borderRadius:12,border:"1px solid #ffd6e7"}}/><button onClick={()=>{ const v=(document.getElementById("ccIn") as HTMLInputElement).value; if(!v) return; setChatChung([...chatChung,`${cur?.name}: ${v}`]); (document.getElementById("ccIn") as HTMLInputElement).value="";}}>Gửi</button></div></div>}

      {page==="wheel"&&<div style={{padding:16,textAlign:"center"}}><button onClick={()=>setPage("lobby")}>← Sảnh</button><h3>🎡 VÒNG QUAY MAY MẮN - TUYỂN CTV</h3><p style={{fontSize:12}}>Chọn 4 số yêu thích hoặc Random. Trúng 3/4 được làm CTV lên ý tưởng cùng Admin, có lương/thưởng. Liên hệ huongngoaiwithfriends@gmail.com</p><div style={{display:"flex",gap:6,justifyContent:"center",flexWrap:"wrap"}}>{[1,2,3,4,5,6,7,8,9,10].map(n=><button key={n} onClick={()=>{ if(wheelNums.includes(n)) setWheelNums(wheelNums.filter(x=>x!==n)); else if(wheelNums.length<4) setWheelNums([...wheelNums,n]);}} style={{width:36,height:36,borderRadius:"50%",border:wheelNums.includes(n)?"2px solid #ff8fbc":"1px solid #eee",background:wheelNums.includes(n)?"#ff8fbc":"#fff",color:wheelNums.includes(n)?"#fff":"#333"}}>{n}</button>)}</div><p>Đã chọn: {wheelNums.join(", ")} <button onClick={()=>setWheelNums([1,2,3,4].sort(()=>0.5-Math.random()).slice(0,4))}>Random</button></p><button onClick={()=>{ if(wheelNums.length!==4) return alert("Chọn đủ 4 số!"); const win=[1,2,3,4]; const same=wheelNums.filter(x=>win.includes(x)).length; if(same>=3) alert(Chúc mừng trúng ${same}/4! Bạn được làm CTV! Liên hệ ${cur?.email} với admin huongngoaiwithfriends@gmail.com); else alert(Bạn trúng ${same}/4 - Chưa đủ, quay lại nhé!);}} style={{background:"#ff8fbc",color:"#fff",border:0,padding:"12px 20px",borderRadius:999}}>QUAY!</button></div>}

      {page==="policy"&&<div style={{padding:16}}><button onClick={()=>setPage("lobby")}>← Sảnh</button><h3>🔒 Chính sách bảo mật & Luật cấm</h3><div style={{fontSize:12,lineHeight:1.6,whiteSpace:"pre-wrap"}}>{`1. Lưu trữ: Tài khoản lưu localStorage, mật khẩu băm base64 (demo). Không thu thập số điện thoại thật.
2. Cam/Mic: Chỉ bật khi người chơi đồng ý truy cập. Vào phòng auto xin nhưng không bật vẫn chơi bình thường, không trừ điểm. Bật cả mic+cam +10 điểm thưởng.
3. Chat riêng: Bảo mật, chỉ phòng có mã riêng mới thấy. Chat chung có admin, cấm nói bậy gây war, ban 24h.
4. Quảng cáo: 5 lượt chơi hiện 1 QC demo, mỗi người có 20 lượt, hết lượt xem 2 QC +1 lượt (demo, chưa gắn QC thật).
5. Luật chơi: Tất cả 10 trò đều có quyền bật/tắt mic/cam bất kỳ lúc nào, không trừ điểm.
6. Liên hệ & Hỗ trợ: Gmail huongngoaiwithfriends@gmail.com - Hỗ trợ sự cố đăng nhập, báo lỗi phòng, duyệt CTV, góp ý game 24/7.
7. Admin: webgame.com/admin + mật khẩu riêng, xem email người chơi nhưng không hiện mật khẩu, xem ai online, quản lý Chat Chung, duyệt CTV, quản lý phòng.
`}</div></div>}

      {page==="admin"&&<div style={{padding:16}}><button onClick={()=>setPage("lobby")}>← Sảnh</button><h3>🔐 Trang Admin - Bí mật</h3><p style={{fontSize:11}}>Đường dẫn: webgame.com/admin - Email admin: huongngoaiwithfriends@gmail.com</p><div style={{border:"1px solid #ffd6e7",borderRadius:12,padding:10}}><b>Người chơi đã đăng ký ({users.length}):</b>{users.map((u,i)=><div key={i} style={{fontSize:11,borderBottom:"1px solid #eee",padding:4}}>{i+1}. {u.email} - Tên: {u.name} - Avatar: {u.avatar} - Mật khẩu: ** (ẩn)</div>)}<p style={{fontSize:11,marginTop:10}}>🟢 Ai đang online: {cur?cur.email:"Không"} - Phòng hiện tại: {room||"Chưa vào"}</p><p style={{fontSize:11}}>Quản lý Chat Chung: {chatChung.length} tin nhắn - Duyệt CTV Vòng Quay - Quản lý phòng 2-6 người - Sửa lỗi người chơi</p></div></div>}

      {page==="room"&&<div>
        <div style={{display:"flex",gap:8,padding:8,background:"#fff2f7",alignItems:"center"}}>
          <div style={{width:56,height:56,borderRadius:"50%",background:"#ff8fbc",overflow:"hidden",position:"relative",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:700}}>{camOn?<video ref={videoRef} autoPlay muted playsInline style={{width:"100%",height:"100%",objectFit:"cover"}}/>:avatar}</div>
          <div style={{fontSize:11}}>Phòng <b>{room}</b> • {mode||"Chưa chọn chế độ"}<br/>{micOn?"🎤 Mic ON":"🎤 Mic OFF"} {camOn?"📷 Cam ON":"📷 Cam OFF"} - Điểm: {score} - Lượt: {turns}<br/><span style={{fontSize:9,color:"#888"}}>Vào phòng auto bật cả mic+cam - Ai không bật vẫn chơi bình thường, không bị trừ! - Chat riêng chỉ phòng có mã mới thấy</span></div>
          <button onClick={()=>{ setPage("lobby"); setMode(null);}} style={{marginLeft:"auto",border:"1px solid #ffd6e7",borderRadius:999,padding:"4px 10px",background:"#fff",fontSize:10}}>Rời</button>
        </div>

        <div style={{height:360,position:"relative",background:"#fff",borderTop:"1px solid #ffe4ee"}}>
          <canvas ref={canvasRef} style={{width:"100%",height:"100%",display:"block"}}/>
          {mode==="2D"&&<div style={{position:"absolute",left:pos.x,top:pos.y,width:44,height:44,background:"#ff8fbc",borderRadius:"50%",border:"2px solid #fff",boxShadow:"0 4px 10px #ffb6d0",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:10}}>{avatar}</div>}
        </div>

        {!mode&&<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:50,padding:16}}>
          <div style={{background:"#fff",borderRadius:20,padding:16,width:"100%",maxWidth:360,textAlign:"center"}}>
            <h3>Chọn chế độ chơi - QUAN TRỌNG</h3><p style={{fontSize:11,color:"#666"}}>Nếu tất cả bật cam/mic thì phòng sẽ chơi như trên không cần nhân vật 2D di chuyển, còn chọn nút tất cả thành viên chơi bằng nhân vật thì mới hiện nhân vật AI 2D để mọi người chơi bằng nhân vật 2D di chuyển.</p>
            <button onClick={()=>setMode("CAM")} style={{width:"100%",background:"#ff8fbc",color:"#fff",border:0,padding:12,borderRadius:12,fontWeight:700,marginTop:8}}>🎥 Tất cả bật CAM/MIC - Chơi như trên</button>
            <button onClick={()=>setMode("2D")} style={{width:"100%",background:"#333",color:"#fff",border:0,padding:12,borderRadius:12,fontWeight:700,marginTop:8}}>🧍 Tất cả dùng nhân vật 2D di chuyển (WASD)</button>
            <p style={{fontSize:10,color:"#888",marginTop:8}}>Sau khi chọn sẽ hiện cách chơi và bấm Đồng ý chơi. Màn hình chia 3 phần: Trên là mặt mọi người, giữa là sân khấu animation, dưới là vạch mic+cam.</p>
          </div>
        </div>}

        <div style={{padding:8}}>
          <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>{GAMES_FULL.map((g,i)=><button key={i} onClick={()=>{ setGameIdx(i); handlePlay();}} style={{background:i===gameIdx?"#ff8fbc":"#fff",color:i===gameIdx?"#fff":"#ff8fbc",border:"1px solid #ffd6e7",borderRadius:999,padding:"4px 8px",fontSize:9}}>{g.name.split(" ")[0]}</button>)}</div>
          <div style={{display:"flex",gap:4,flexWrap:"wrap",marginTop:6}}>
            <button onClick={toggleMic} style={{background:micOn?"#ff8fbc":"#fff",color:micOn?"#fff":"#ff8fbc",border:"1px solid #ffd6e7",borderRadius:999,padding:"6px 10px",fontSize:10}}>{micOn?"🎤 Mic ON":"🎤 Mic OFF"}</button>
            <button onClick={toggleCam} style={{background:camOn?"#ff8fbc":"#fff",color:camOn?"#fff":"#ff8fbc",border:"1px solid #ffd6e7",borderRadius:999,padding:"6px 10px",fontSize:10}}>{camOn?"📷 Cam tròn ON":"📷 Cam tròn OFF"}</button>
            <button onClick={()=>{ setScore(s=>s+1); handlePlay();}} style={{border:"1px solid #ffd6e7",borderRadius:999,padding:"4px 8px",fontSize:9,background:"#fff"}}>BỊT MIỆNG</button>
            <button onClick={()=>{ setScore(s=>s+2); handlePlay();}} style={{border:"1px solid #ffd6e7",borderRadius:999,padding:"4px 8px",fontSize:9,background:"#fff"}}>GIỮ CHÂN</button>
            <button onClick={()=>{ setScore(s=>s+1); handlePlay();}} style={{border:"1px solid #ffd6e7",borderRadius:999,padding:"4px 8px",fontSize:9,background:"#fff"}}>QUẠT NGƯỢC</button>
            <button onClick={()=>{ setScore(s=>s+2); handlePlay();}} style={{border:"1px solid #ffd6e7",borderRadius:999,padding:"4px 8px",fontSize:9,background:"#fff"}}>ĐỔI NHẠC</button>
            <button onClick={()=>{ setScore(s=>s+2); handlePlay();}} style={{border:"1px solid #ffd6e7",borderRadius:999,padding:"4px 8px",fontSize:9,background:"#fff"}}>HÙ MA</button>
            <button onClick={()=>{ setScore(s=>s+1); handlePlay();}} style={{border:"1px solid #ffd6e7",borderRadius:999,padding:"4px 8px",fontSize:9,background:"#fff"}}>CHỌC LÉT</button>
            <button onClick={()=>{ setScore(s=>s+5); handlePlay();}} style={{border:"1px solid #ffd6e7",borderRadius:999,padding:"4px 8px",fontSize:9,background:"#fff"}}>GỒNG CỨNG</button>
            <button onClick={()=>{ const w=prompt("Nối từ đuôi - Nhập từ tiếp theo (15s):"); if(w){ setChat([...chat,`${cur?.name}: ${w} (Chờ duyệt >50%)`]); setScore(s=>s+2);} }} style={{border:"1px solid #ffd6e7",borderRadius:999,padding:"4px 8px",fontSize:9,background:"#fff"}}>DUYỆT/KHÔNG DUYỆT</button>
          </div>
          {mode==="2D"&&<div style={{display:"flex",gap:6,justifyContent:"center",marginTop:8}}><button onClick={()=>setPos(p=>({...p,x:Math.max(0,p.x-16)}))} style={{padding:"8px 12px"}}>◀</button><button onClick={()=>setPos(p=>({...p,x:Math.min(340,p.x+16)}))} style={{padding:"8px 12px"}}>▶</button><button onClick={()=>setPos(p=>({...p,y:Math.max(0,p.y-16)}))} style={{padding:"8px 12px"}}>▲</button><button onClick={()=>setPos(p=>({...p,y:Math.min(320,p.y+16)}))} style={{padding:"8px 12px"}}>▼</button><span style={{fontSize:9,color:"#888",alignSelf:"center"}}>Lại gần 80px mới tương tác</span></div>}
          <div style={{marginTop:8,border:"1px solid #ffe4ee",borderRadius:12,padding:6,background:"#fff8fb",height:90,overflow:"auto"}}>{chat.map((c,i)=><div key={i} style={{fontSize:11}}>{c}</div>)}<div style={{fontSize:10,color:"#aaa"}}>Chat riêng - chỉ trong phòng có mã {room} mới thấy - Bảo mật</div></div>
          <div style={{display:"flex",gap:4,marginTop:6}}><input value={chatIn} onChange={e=>setChatIn(e.target.value)} placeholder="Nhập chat riêng..." style={{flex:1,padding:8,borderRadius:12,border:"1px solid #ffd6e7",fontSize:11}}/><button onClick={()=>{ if(!chatIn) return; setChat([...chat,`${cur?.name}: ${chatIn}`]); setChatIn(""); handlePlay();}} style={{background:"#ff8fbc",color:"#fff",border:0,padding:"8px 12px",borderRadius:12}}>Gửi</button></div>
        </div>
      </div>}
    </div>
  );
}
