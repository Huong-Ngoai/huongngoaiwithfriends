"use client";
import { useState, useEffect, useRef } from "react";

const GAMES = [
  { id: 1, name: "Hét To Nhất", type: "Mic", icon: "📢", desc: "Hét 5s, ai to nhất thắng", how: "Cả nhóm cùng hét! AI đo độ to!", color: "from-red-400 to-orange-500" },
  { id: 2, name: "Bom Nổ Chậm", type: "Mic", icon: "💣", desc: "Nói 'truyền' để đẩy bom", how: "Bom nổ ngẫu nhiên! Nói TRUYỀN để đẩy!", color: "from-gray-700 to-black" },
  { id: 3, name: "Thổi Nến", type: "Mic", icon: "🕯️", desc: "Thổi tắt 10 nến", how: "Cả nhóm cùng thổi! AI phát hiện gió!", color: "from-yellow-200 to-orange-300" },
  { id: 4, name: "Giả Tiếng Con Vật", type: "Mic", icon: "🦁", desc: "Giả tiếng, cả nhóm đoán", how: "Giả tiếng con vật, cả nhóm đoán!", color: "from-green-300 to-emerald-500" },
  { id: 5, name: "Nói Nhanh", type: "Mic", icon: "🗣️", desc: "Đọc câu xoắn lưỡi", how: "Đọc nhanh, AI chấm thời gian!", color: "from-blue-300 to-cyan-500" },
  { id: 6, name: "Đoán Cảm Xúc", type: "Cam", icon: "🥹", desc: "Làm mặt theo yêu cầu", how: "AI ra đề VUI/BUỒN, cả nhóm làm mặt!", color: "from-pink-300 to-rose-400" },
  { id: 7, name: "Nhịn Cười", type: "Cam", icon: "😐", desc: "Ai cười trước thua", how: "Mở cam nhìn nhau, ai cười thua!", color: "from-violet-300 to-purple-500" },
  { id: 8, name: "Chớp Mắt", type: "Cam", icon: "👀", desc: "Ai chớp trước thua", how: "Mở to mắt 10s, ai chớp thua!", color: "from-sky-200 to-blue-400" },
  { id: 9, name: "Vẽ Bậy", type: "Cam", icon: "🤡", desc: "Vẽ lên mặt nhau", how: "Vẽ bậy như game công chúa!", color: "from-orange-200 to-pink-300" },
  { id: 10, name: "Kể Chuyện 1 Từ", type: "Cam", icon: "📖", desc: "Mỗi người 1 từ", how: "Mỗi người 1 từ tạo thành chuyện! Cấm từ bậy!", color: "from-amber-200 to-yellow-400" },
];

const AVATARS = ["😎","🤩","🥳","😜","🤠","👽","🤖","👻","🎃","🦄"];
const BANNED_WORDS = ["đm","vcl","cl","lồn","cặc","địt","chó chết","ngu","đéo","cc"];
const MOCK_MEMBERS = [
  { id: 2, name: "Minh", avatar: "🥳", isHost: false, micOn: true, camOn: true },
  { id: 3, name: "Linh", avatar: "🤩", isHost: false, micOn: false, camOn: true },
  { id: 4, name: "Khoa", avatar: "👽", isHost: false, micOn: true, camOn: false },
];

export default function Home() {
  const [step, setStep] = useState("login");
  const [user, setUser] = useState<any>(null);
  const [avatar, setAvatar] = useState(AVATARS[0]);
  const [customAvatar, setCustomAvatar] = useState<string | null>(null);
  const [roomCode, setRoomCode] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [micOn, setMicOn] = useState(false);
  const [camOn, setCamOn] = useState(false);
  const [selectedGame, setSelectedGame] = useState<any>(null);
  const [gamePhase, setGamePhase] = useState("info");
  const [chatMsgs, setChatMsgs] = useState([{user:"ADMIN", text:"Chào mừng! Đọc Luật Từ Cấm trước khi chat nhé!", isAdmin:true}]);
  const [chatInput, setChatInput] = useState("");
  const [playsLeft, setPlaysLeft] = useState(15);
  const [totalPlayed, setTotalPlayed] = useState(0);
  const [showAd, setShowAd] = useState(false);
  const [adForExtra, setAdForExtra] = useState(0);
  const [luckyNumbers, setLuckyNumbers] = useState<number[]>([]);
  const [myLuckySaved, setMyLuckySaved] = useState<number[] | null>(null);
  const [winningNumbers, setWinningNumbers] = useState<number[]>([]);
  const [countdown, setCountdown] = useState("");
  const [volume, setVolume] = useState(0);
  const [gameScore, setGameScore] = useState(0);
  const [candles, setCandles] = useState(Array(10).fill(true));
  const [isHost, setIsHost] = useState(false);
  const [musicOn, setMusicOn] = useState(false);
  const [members, setMembers] = useState<any[]>([]);
  const [isMuted, setIsMuted] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const musicRef = useRef<HTMLAudioElement>(null);
  const audioContextRef = useRef<any>(null);

  useEffect(()=>{
    const savedPlays = localStorage.getItem("playsLeft");
    const savedDate = localStorage.getItem("playsDate");
    const today = new Date().toDateString();
    if(savedDate !== today){ localStorage.setItem("playsDate", today); localStorage.setItem("playsLeft", "15"); setPlaysLeft(15); }
    else if(savedPlays) setPlaysLeft(parseInt(savedPlays));
    const savedLucky = localStorage.getItem("myLucky");
    if(savedLucky) setMyLuckySaved(JSON.parse(savedLucky));
  },[]);

  useEffect(()=>{
    const timer = setInterval(()=>{
      const now = new Date(); const target = new Date(); target.setHours(19,0,0,0);
      if(now > target) target.setDate(target.getDate()+1);
      const diff = target.getTime() - now.getTime();
      const h = Math.floor(diff/3600000); const m = Math.floor((diff%3600000)/60000); const s = Math.floor((diff%60000)/1000);
      setCountdown(`${h}h ${m}p ${s}s`);
      if(now.getHours() >= 19 && winningNumbers.length === 0) setWinningNumbers([7,14,20,35]);
    },1000);
    return ()=>clearInterval(timer);
  },[winningNumbers]);

  useEffect(()=>{ if(musicRef.current){ if(musicOn) musicRef.current.play().catch(()=>{}); else musicRef.current.pause(); } },[musicOn]);

  const startMicAI = async () => {
    try{
      const stream = await navigator.mediaDevices.getUserMedia({audio:true});
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const analyser = audioCtx.createAnalyser();
      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);
      audioContextRef.current = {ctx: audioCtx, stream};
      const data = new Uint8Array(analyser.frequencyBinCount);
      const loop = () => { analyser.getByteFrequencyData(data); const avg = data.reduce((a,b)=>a+b,0)/data.length; setVolume(avg); if(gamePhase==="playing") requestAnimationFrame(loop); };
      loop(); setMicOn(true);
    } catch{ alert("Cho phép mic!"); }
  };
  const stopMicAI = () => { if(audioContextRef.current){ audioContextRef.current.stream.getTracks().forEach((t:any)=>t.stop()); audioContextRef.current.ctx.close(); } setMicOn(false); setVolume(0); };

  const containsBanned = (text:string) => BANNED_WORDS.some(w=>text.toLowerCase().includes(w));

  const handleLogin = (e:any) => { e.preventDefault(); const email = e.target.email.value; if(!email) return alert("Nhập Email/SĐT!"); setUser({email, name: email.split("@")[0]}); setStep("avatar"); };
  const handleAlbumClick = () => { fileInputRef.current?.click(); };
  const handleFileChange = (e:any) => { const file = e.target.files[0]; if(file){ const url = URL.createObjectURL(file); setCustomAvatar(url); setAvatar(url); } };
  const createRoom = () => { if(playsLeft<=0) return setShowAd(true); const code = Math.random().toString(36).substring(2,7).toUpperCase(); setRoomCode(code); setIsHost(true); setMembers([{id:1, name:user.name, avatar:customAvatar||avatar, isHost:true, micOn, camOn, isMe:true}, ...MOCK_MEMBERS]); setStep("room"); setMusicOn(true); };
  const joinRoom = () => { if(!joinCode) return alert("Nhập mã!"); if(playsLeft<=0) return setShowAd(true); setRoomCode(joinCode.toUpperCase()); setIsHost(false); setMembers([{id:1, name:user.name, avatar:customAvatar||avatar, isHost:false, micOn, camOn, isMe:true}, {id:99, name:"Host Vy", avatar:"😎", isHost:true, micOn:true, camOn:true}, ...MOCK_MEMBERS.slice(0,2)]); setStep("room"); setMusicOn(true); };
  const startGamePlay = (g:any) => { if(!isHost) return alert("Chỉ chủ phòng mới được chọn!"); if(playsLeft <= 0) return setShowAd(true); setSelectedGame(g); setGamePhase("info"); setGameScore(0); setCandles(Array(10).fill(true)); setStep("gameDetail"); };
  const confirmPlay = () => { const newLeft = playsLeft - 1; setPlaysLeft(newLeft); setTotalPlayed(totalPlayed+1); localStorage.setItem("playsLeft", newLeft.toString()); setGamePhase("playing"); if(selectedGame.id <=3) startMicAI(); if(selectedGame.id===1){ let s=0; const it = setInterval(()=>{ s+=volume; setGameScore(Math.floor(s/5)); },100); setTimeout(()=>{ clearInterval(it); setGamePhase("result"); stopMicAI(); },5000); } if(selectedGame.id===3){ const it = setInterval(()=>{ if(volume>40){ setCandles(prev=>{ const idx=prev.indexOf(true); if(idx!==-1){ const n=[...prev]; n[idx]=false; if(n.every(c=>!c)){ clearInterval(it); setGamePhase("result"); stopMicAI(); } return n; } return prev; }); } },300); setTimeout(()=>{ clearInterval(it); setGamePhase("result"); stopMicAI(); },10000); } if((totalPlayed+1)%5===0) setTimeout(()=>setShowAd(true),2000); };
  const toggleCam = async () => { if(!camOn){ try{ const stream = await navigator.mediaDevices.getUserMedia({video:true}); if(videoRef.current) videoRef.current.srcObject = stream; setCamOn(true); setMembers(m=>m.map(x=>x.isMe?{...x, camOn:true}:x)); } catch{ alert("Cho phép cam!"); } } else { setCamOn(false); setMembers(m=>m.map(x=>x.isMe?{...x, camOn:false}:x)); if(videoRef.current && videoRef.current.srcObject){ (videoRef.current.srcObject as any).getTracks().forEach((t:any)=>t.stop()); } } };
  const toggleMicLocal = async () => { if(!micOn){ await startMicAI(); setMembers(m=>m.map(x=>x.isMe?{...x, micOn:true}:x)); } else { stopMicAI(); setMembers(m=>m.map(x=>x.isMe?{...x, micOn:false}:x)); } };
  const confirmLucky = () => { if(luckyNumbers.length!==4) return alert("Chọn đủ 4 số!"); localStorage.setItem("myLucky", JSON.stringify(luckyNumbers)); setMyLuckySaved(luckyNumbers); alert("Đã lưu!"); };
  const sendChat = () => {
    if(!chatInput) return;
    if(isMuted) return alert("Bạn bị cấm chat 5 phút vì dùng từ cấm!");
    if(containsBanned(chatInput)){
      setIsMuted(true);
      setChatMsgs([...chatMsgs, {user:"HỆ THỐNG", text:`${user.name} bị cấm chat 5 phút vì dùng từ cấm!`, isAdmin:true}]);
      setTimeout(()=>setIsMuted(false), 300000);
      setChatInput("");
      return alert("Bạn dùng từ cấm! Bị cấm chat 5 phút!");
    }
    setChatMsgs([...chatMsgs, {user:user.name, text:chatInput}]);
    setChatInput("");
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-violet-100 to-pink-100 p-4">
      <audio ref={musicRef} loop src="https://cdn.pixabay.com/download/audio/2022/03/10/audio_c8c8a73467.mp3?filename=happy-day-113985.mp3" />
      <div className="max-w-md mx-auto">
        <header className="text-center py-3 relative">
          <h1 className="text-2xl font-black">huongngoaiwithfriends</h1>
          <p className="text-xs text-gray-500">BẢN CHUẨN STORE V8</p>
          <button onClick={()=>setMusicOn(!musicOn)} className={`absolute right-0 top-2 p-2 rounded-full text-xs ${musicOn?'bg-green-500 text-white':'bg-white'}`}>{musicOn?'🔊':'🔇'}</button>
          {user && <p className="text-xs mt-1 bg-white inline-block px-3 py-1 rounded-full">Lượt: {playsLeft}/15</p>}
        </header>

        {step === "login" && (<form onSubmit={handleLogin} className="bg-white rounded-3xl p-6 shadow-xl"><h2 className="text-xl font-bold mb-4">Đăng nhập</h2><input name="email" placeholder="Email hoặc SĐT" className="w-full p-3 rounded-xl border mb-3" /><input name="pass" type="password" placeholder="Mật khẩu" className="w-full p-3 rounded-xl border mb-4" /><button className="w-full bg-black text-white p-3 rounded-xl font-bold">Đăng nhập</button><p className="text-[10px] text-center mt-3 text-gray-500">Bằng việc đăng nhập, bạn đồng ý với <button onClick={(e)=>{e.preventDefault(); setStep("privacy")}} className="text-blue-600 underline">Chính sách bảo mật</button></p></form>)}
        {step === "avatar" && (<div className="bg-white rounded-3xl p-6 shadow-xl"><h2 className="text-xl font-bold">Chọn Avatar</h2><div className="grid grid-cols-5 gap-3 mt-4">{AVATARS.map(a=><button key={a} onClick={()=>{setAvatar(a); setCustomAvatar(null);}} className={`text-3xl p-3 rounded-xl border ${avatar===a?'bg-black text-white scale-110':''}`}>{a}</button>)}</div>{customAvatar && <img src={customAvatar} className="w-20 h-20 rounded-full mx-auto mt-4 object-cover" />}<button onClick={handleAlbumClick} className="w-full mt-4 p-3 rounded-xl border-2 border-dashed">📷 Tải ảnh từ Album</button><input ref={fileInputRef} type="file" accept="image/*" hidden onChange={handleFileChange} /><button onClick={()=>setStep("intro")} className="w-full bg-black text-white p-3 rounded-xl font-bold mt-4">Tiếp tục</button></div>)}
        {step === "intro" && (<div className="bg-white rounded-3xl p-6 shadow-xl"><h2 className="text-xl font-bold">Luật chơi nhóm</h2><div className="p-3 bg-yellow-50 rounded-xl mt-3 text-sm">👑 Chủ phòng chọn trò - Cả nhóm chơi theo<br/>👥 Hiện Avatar nhóm<br/>🔊 Có nhạc nền</div><button onClick={()=>setStep("lobby")} className="w-full bg-green-600 text-white p-3 rounded-xl font-bold mt-4">Vào sảnh</button></div>)}

        {step === "lobby" && (
          <div className="space-y-4">
            <div className="bg-white rounded-3xl p-5 shadow flex items-center gap-3"><div className="text-4xl">{customAvatar ? <img src={customAvatar} className="w-12 h-12 rounded-full object-cover" /> : avatar}</div><div><b>{user?.name}</b><p className="text-xs">{playsLeft}/15 lượt</p></div></div>
            <div className="grid grid-cols-2 gap-3"><button onClick={createRoom} className="bg-black text-white p-5 rounded-3xl font-bold">Tạo Phòng 👑</button><div className="bg-white p-3 rounded-3xl"><input value={joinCode} onChange={e=>setJoinCode(e.target.value)} placeholder="Mã phòng" className="w-full p-2 border rounded-xl mb-2" /><button onClick={joinRoom} className="w-full bg-gray-900 text-white p-2 rounded-xl">Vào Phòng</button></div></div>
            <div className="grid grid-cols-3 gap-3"><button onClick={()=>setStep("chat")} className="bg-white p-4 rounded-2xl">💬 Chat</button><button onClick={()=>setStep("lucky")} className="bg-white p-4 rounded-2xl">🎡 19h</button><button onClick={()=>setStep("donate")} className="bg-white p-4 rounded-2xl">❤️ Donate</button></div>
            {/* FOOTER CHÍNH SÁCH - MỚI */}
            <div className="bg-white rounded-2xl p-4 shadow">
              <div className="grid grid-cols-3 gap-2 text-center">
                <button onClick={()=>setStep("privacy")} className="text-[11px] p-2 bg-gray-50 rounded-xl">🔒<br/>Bảo mật</button>
                <button onClick={()=>setStep("rules")} className="text-[11px] p-2 bg-red-50 rounded-xl">🚫<br/>Từ cấm</button>
                <button onClick={()=>setStep("contact")} className="text-[11px] p-2 bg-blue-50 rounded-xl">📞<br/>Liên hệ</button>
              </div>
              <p className="text-[9px] text-center text-gray-400 mt-3">© 2026 huongngoaiwithfriends - Bảo Vy - VCB 9865912660</p>
            </div>
          </div>
        )}

        {step === "room" && (
          <div className="bg-white rounded-3xl p-5 shadow-xl">
            <div className="flex justify-between items-center"><h2 className="font-bold">Phòng: {roomCode} {isHost&&"👑"}</h2><button onClick={()=>{setStep("lobby"); setMusicOn(false);}} className="text-sm text-red-500">Rời</button></div>
            <div className="mt-4 p-3 bg-violet-50 rounded-2xl">
              <p className="text-xs font-bold mb-2">👥 Thành viên ({members.length}): {isHost?"Bạn chọn trò!":"Chờ chủ phòng..."}</p>
              <div className="grid grid-cols-4 gap-3">
                {members.map((m:any)=>(
                  <div key={m.id} className="text-center relative">
                    <div className={`w-14 h-14 mx-auto rounded-full flex items-center justify-center text-2xl border-2 bg-white shadow ${m.isMe?'border-green-500':''}`}>
                      {typeof m.avatar === 'string' && (m.avatar.includes('blob') || m.avatar.startsWith('http')) ? <img src={m.avatar} className="w-14 h-14 rounded-full object-cover" /> : m.avatar}
                    </div>
                    {m.isHost && <span className="absolute -top-1 -right-1 text-xs">👑</span>}
                    <p className="text-[10px] mt-1 truncate">{m.name}</p>
                    <div className="flex justify-center gap-1 mt-1">
                      <span className={`text-[9px] px-1 rounded ${m.micOn?'bg-green-500 text-white':'bg-gray-300'}`}>🎤</span>
                      <span className={`text-[9px] px-1 rounded ${m.camOn?'bg-green-500 text-white':'bg-gray-300'}`}>📷</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex gap-3 my-4"><button onClick={toggleMicLocal} className={`flex-1 p-3 rounded-xl font-bold ${micOn?'bg-green-600 text-white':'bg-gray-100'}`}>Mic {micOn?'Bật':'Tắt'}</button><button onClick={toggleCam} className={`flex-1 p-3 rounded-xl font-bold ${camOn?'bg-green-600 text-white':'bg-gray-100'}`}>Cam {camOn?'Bật':'Tắt'}</button></div>
            <video ref={videoRef} autoPlay playsInline className={`w-full h-32 bg-black rounded-xl ${camOn?'':'hidden'}`}></video>
            <h3 className="font-bold mt-4">{isHost?"👑 Bạn chọn trò cho cả nhóm:":"⏳ Chờ chủ phòng chọn..."}</h3>
            <div className="grid grid-cols-1 gap-2 mt-2 max-h-64 overflow-auto">
              {GAMES.map(g=><button key={g.id} disabled={!isHost} onClick={()=>startGamePlay(g)} className={`text-left p-3 rounded-xl border flex justify-between ${!isHost?'opacity-60':''} ${isHost?`bg-gradient-to-r text-white ${g.color}`:'bg-gray-50'}`}><span>{g.icon} {g.name}</span><span className="text-xs">{g.type}</span></button>)}
            </div>
          </div>
        )}

        {step === "gameDetail" && selectedGame && (
          <div className="bg-white rounded-3xl p-6 shadow-xl text-center">
            {gamePhase==="info" && (<><div className={`w-20 h-20 mx-auto rounded-full bg-gradient-to-r ${selectedGame.color} flex items-center justify-center text-4xl animate-bounce`}>{selectedGame.icon}</div><h2 className="font-black text-2xl mt-3">{selectedGame.name}</h2><p className="text-xs bg-black text-white px-3 py-1 rounded-full inline-block mt-2">Chủ phòng chọn - Cả nhóm cùng chơi!</p><div className="mt-4 p-4 bg-yellow-50 rounded-2xl text-left border-2 border-dashed"><b>📖 Cách chơi nhóm:</b><p className="text-sm mt-1">{selectedGame.how}</p><p className="text-[10px] mt-2 text-red-600">⚠️ Cấm nói từ cấm, vi phạm bị cấm chat 5p!</p></div><button onClick={confirmPlay} className="w-full mt-5 bg-gradient-to-r from-violet-600 to-pink-600 text-white p-4 rounded-2xl font-black">🎮 BẮT ĐẦU CHO CẢ NHÓM!</button><button onClick={()=>setStep("room")} className="mt-3 text-sm">← Quay lại phòng</button></>)}
            {gamePhase==="playing" && (<><h2 className="font-bold">Đang chơi nhóm: {selectedGame.name} 👥</h2><div className="mt-4">{selectedGame.id===1 && (<div><div className="text-6xl animate-pulse">📢</div><div className="w-full h-6 bg-gray-200 rounded-full mt-3 overflow-hidden"><div className="h-full bg-red-500" style={{width:`${Math.min(volume*2,100)}%`}}></div></div><p className="font-black text-3xl mt-3">{gameScore} điểm</p></div>)} {selectedGame.id===3 && (<div><div className="grid grid-cols-5 gap-2 mt-2">{candles.map((c,i)=><div key={i} className={`text-3xl ${c?'animate-pulse':'opacity-20'}`}>🕯️</div>)}</div><p className="mt-4">{candles.filter(c=>c).length} nến còn lại</p></div>)} {selectedGame.id!==1 && selectedGame.id!==3 && (<div><video ref={videoRef} autoPlay playsInline className="w-full h-40 bg-black rounded-xl"></video><button onClick={()=>{ setGamePhase("result"); setGameScore(95); }} className="mt-4 w-full bg-black text-white p-3 rounded-xl">Hoàn thành 🎉</button></div>)}</div></>)}
            {gamePhase==="result" && (<div><div className="text-7xl">🏆</div><h2 className="font-black text-2xl mt-3">Kết quả nhóm!</h2><div className="mt-3 space-y-1">{members.map((m:any)=><div key={m.id} className="flex justify-between p-2 bg-gray-50 rounded-xl text-sm"><span>{m.name} {m.isMe&&'(Bạn)'}</span><span className="font-bold">{Math.floor(Math.random()*50)+50}đ</span></div>)}</div><button onClick={()=>{setStep("room"); stopMicAI();}} className="w-full mt-5 bg-black text-white p-4 rounded-xl font-bold">Về phòng ➡️</button></div>)}
          </div>
        )}

        {/* 3 TRANG MỚI - CHÍNH SÁCH, LUẬT, LIÊN HỆ */}
        {step === "privacy" && (
          <div className="bg-white rounded-3xl p-6 shadow-xl">
            <h2 className="font-black text-xl">🔒 Chính Sách Bảo Mật</h2>
            <div className="mt-4 text-sm space-y-3 max-h-96 overflow-auto leading-relaxed">
              <p><b>1. Thu thập:</b> Chúng tôi chỉ thu thập Email/SĐT để đăng nhập, Avatar do bạn chọn. Không thu thập mật khẩu ngân hàng.</p>
              <p><b>2. Mic & Cam:</b> Mic/Cam chỉ được bật khi bạn bấm Bật trong phòng chơi. Chúng tôi <b>KHÔNG ghi âm, KHÔNG lưu video</b>. Dữ liệu âm thanh chỉ xử lý trực tiếp trên máy bạn (AI đo độ to) rồi xóa ngay.</p>
              <p><b>3. Album ảnh:</b> Khi bạn chọn ảnh từ Album, ảnh chỉ lưu trên máy bạn, không upload lên server.</p>
              <p><b>4. Donate:</b> QR Vietcombank 9865912660 - NGUYEN PHAM BAO VY. Giao dịch trực tiếp qua ngân hàng, chúng tôi không lưu số thẻ.</p>
              <p><b>5. Quảng cáo:</b> Có quảng cáo nhỏ trong game để duy trì server.</p>
              <p><b>6. Trẻ em:</b> Game phù hợp 13+. Không thu thập dữ liệu trẻ em dưới 13 tuổi.</p>
              <p className="text-xs text-gray-500 mt-4">Cập nhật: 01/11/2026 - Liên hệ: huongngoaiwithfriends@gmail.com</p>
            </div>
            <button onClick={()=>setStep("lobby")} className="mt-4 w-full bg-black text-white p-3 rounded-xl">Đã hiểu</button>
          </div>
        )}

        {step === "rules" && (
          <div className="bg-white rounded-3xl p-6 shadow-xl">
            <h2 className="font-black text-xl">🚫 Luật Từ Cấm & Quy Định</h2>
            <div className="mt-4 text-sm space-y-3 max-h-96 overflow-auto">
              <div className="p-3 bg-red-50 rounded-xl border border-red-200">
                <b>AI tự động phát hiện và cấm chat 5 phút nếu vi phạm!</b>
              </div>
              <p><b>1. Từ cấm tuyệt đối:</b></p>
              <div className="flex flex-wrap gap-2">{BANNED_WORDS.map(w=><span key={w} className="px-2 py-1 bg-black text-white rounded-full text-xs">{w}</span>)}</div>
              <p><b>2. Không được:</b> Chửi bậy, phân biệt vùng miền, nói tục trong Kể Chuyện 1 Từ, giả tiếng con vật có từ bậy, quấy rối cam/mic người khác.</p>
              <p><b>3. Hình phạt:</b></p>
              <ul className="list-disc ml-5 space-y-1 text-xs">
                <li>Lần 1: Cấm chat 5 phút</li>
                <li>Lần 2: Cấm chat 30 phút + Mất 5 lượt chơi</li>
                <li>Lần 3: Khóa tài khoản 24h</li>
                <li>Nặng (đe dọa, 18+): Khóa vĩnh viễn + Báo ADMIN</li>
              </ul>
              <p><b>4. Khuyến khích:</b> Nói chuyện vui vẻ, tôn trọng, giúp đỡ người mới!</p>
              <p className="text-xs bg-yellow-50 p-2 rounded-xl">Mọi vi phạm sẽ được AI ghi lại để ADMIN duyệt tại /admin</p>
            </div>
            <button onClick={()=>setStep("lobby")} className="mt-4 w-full bg-black text-white p-3 rounded-xl">Tôi đã đọc và đồng ý</button>
          </div>
        )}

        {step === "contact" && (
          <div className="bg-white rounded-3xl p-6 shadow-xl">
            <h2 className="font-black text-xl">📞 Liên Hệ & Hỗ Trợ</h2>
            <div className="mt-4 space-y-4">
              <div className="p-4 bg-gradient-to-br from-violet-50 to-pink-50 rounded-2xl border">
                <p className="font-bold">👩‍💻 Chủ game: NGUYEN PHAM BAO VY</p>
                <p className="text-sm mt-2">📧 Email: <b>huongngoaiwithfriends@gmail.com</b></p>
                <p className="text-sm">💬 Zalo hỗ trợ: <b>0986.591.266</b> (9h-21h)</p>
                <p className="text-sm">🏦 Donate VCB: <b>9865912660</b></p>
              </div>
              <div>
                <p className="font-bold text-sm">Gửi tin nhắn cho ADMIN:</p>
                <input placeholder="Email của bạn" className="w-full p-3 border rounded-xl mt-2" />
                <textarea placeholder="Bạn cần hỗ trợ gì? VD: Lỗi mic, bị cấm oan, muốn xóa tài khoản..." className="w-full p-3 border rounded-xl mt-2 h-24"></textarea>
                <button onClick={()=>alert("Đã gửi! ADMIN sẽ trả lời qua Email trong 24h!")} className="w-full bg-black text-white p-3 rounded-xl mt-2 font-bold">Gửi Liên Hệ ✉️</button>
              </div>
              <div className="text-[11px] text-gray-500">
                <p>⏰ Thời gian hỗ trợ: 9:00 - 21:00 mỗi ngày</p>
                <p>📍 Địa chỉ: TP. Hồ Chí Minh</p>
                <p>🔗 Fanpage: fb.com/huongngoaiwithfriends</p>
              </div>
            </div>
            <button onClick={()=>setStep("lobby")} className="mt-4 w-full bg-gray-100 p-3 rounded-xl">Quay lại sảnh</button>
          </div>
        )}

        {step === "donate" && (<div className="bg-white rounded-3xl p-6 shadow-xl text-center"><h2 className="font-bold text-xl">Ủng hộ</h2><div className="mt-5 p-4 bg-gradient-to-br from-yellow-50 to-green-50 rounded-2xl border"><img src="https://img.vietqr.io/image/970436-9865912660-compact2.png?accountName=NGUYEN%20PHAM%20BAO%20VY&addInfo=Ung%20ho%20huongngoaiwithfriends" alt="QR" className="w-64 h-auto mx-auto rounded-xl border-2 border-green-500 shadow bg-white p-2" /><p className="font-black mt-4">NGUYEN PHAM BAO VY - 9865912660 - VCB</p><p className="text-[10px] text-gray-500 mt-2">Donate giúp duy trì server + xóa quảng cáo</p></div><button onClick={()=>setStep("lobby")} className="mt-4 w-full bg-black text-white p-3 rounded-xl">Quay lại</button></div>)}
        {step === "lucky" && (<div className="bg-white rounded-3xl p-6 shadow-xl text-center"><h2 className="font-bold text-xl">Vòng Quay 19h</h2><p className="text-xs mt-2 bg-yellow-100 p-2 rounded-xl">Còn {countdown} - KQ: {winningNumbers.join(", ")||"Chưa có"}</p>{myLuckySaved ? (<div className="mt-4 p-4 bg-green-50 rounded-xl"><b>Đã chọn:</b><p className="text-2xl mt-2">{myLuckySaved.join(" - ")}</p><button onClick={()=>{localStorage.removeItem("myLucky"); setMyLuckySaved(null); setLuckyNumbers([]);}} className="text-xs text-red-500 mt-2">Chọn lại</button></div>) : (<><div className="grid grid-cols-5 gap-2 mt-4">{Array.from({length:20},(_,i)=>i+1).map(n=><button key={n} onClick={()=>{if(luckyNumbers.includes(n)) setLuckyNumbers(luckyNumbers.filter(x=>x!==n)); else if(luckyNumbers.length<4) setLuckyNumbers([...luckyNumbers,n]);}} className={`p-3 rounded-xl border ${luckyNumbers.includes(n)?'bg-black text-white':''}`}>{n}</button>)}</div><button onClick={confirmLucky} className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 p-4 rounded-xl font-bold mt-4">XÁC NHẬN</button></>)}<button onClick={()=>setStep("lobby")} className="mt-4 text-sm">Quay lại</button></div>)}
        {step === "chat" && (
          <div className="bg-white rounded-3xl p-4 shadow-xl h-[70vh] flex flex-col">
            <div className="flex justify-between"><h2 className="font-bold">Chat Chung {isMuted&&"(Bạn bị cấm)"}</h2><button onClick={()=>setStep("lobby")}>X</button></div>
            <p className="text-[10px] bg-red-50 p-2 rounded-xl mt-2">🚫 Cấm từ: {BANNED_WORDS.slice(0,5).join(", ")}... - Vi phạm cấm 5p!</p>
            <div className="flex-1 overflow-auto mt-3 space-y-2">{chatMsgs.map((m,i)=><div key={i} className="text-sm"><span className={m.isAdmin?'text-red-600 font-bold':''}>{m.user}{m.isAdmin&&" ✅"}: </span>{m.text}</div>)}</div>
            <div className="flex gap-2 mt-3"><input value={chatInput} onChange={e=>setChatInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sendChat()} placeholder={isMuted?"Bạn bị cấm chat...":"Nhập tin nhắn..."} disabled={isMuted} className="flex-1 p-2 border rounded-xl disabled:bg-gray-100" /><button onClick={sendChat} disabled={isMuted} className="bg-black text-white px-4 rounded-xl disabled:bg-gray-300">Gửi</button></div>
          </div>
        )}
        {showAd && (<div className="fixed inset-0 bg-black/80 flex items-center justify-center p-6 z-50"><div className="bg-white rounded-3xl p-6 w-full max-w-sm text-center"><h2 className="font-bold">Quảng cáo</h2><div className="w-full h-40 bg-black mt-3 rounded-xl flex items-center justify-center text-white">Video QC</div><button onClick={()=>setShowAd(false)} className="w-full bg-black text-white p-3 rounded-xl mt-4">Bỏ qua</button></div></div>)}
      </div>
    </main>
  );
}