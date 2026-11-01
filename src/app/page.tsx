"use client";
import { useEffect, useRef, useState } from "react";

const GAMES = [
  { id: 1, name: "Giả Tiếng Con Vật", emoji: "🐱" },
  { id: 2, name: "Ai Chớp Mắt Thua", emoji: "😳" },
  { id: 3, name: "Đứng Hình", emoji: "🗿" },
  { id: 4, name: "Mặt Xấu Nhất", emoji: "🤪" },
  { id: 5, name: "Ai Im Lặng Lâu", emoji: "🤫" },
  { id: 6, name: "Hát To Nhất", emoji: "🎤" },
  { id: 7, name: "Bắt Chước Cảm Xúc", emoji: "😡" },
  { id: 8, name: "Đập Muỗi", emoji: "🦟" },
  { id: 9, name: "Nói Lắp", emoji: "👅" },
  { id: 10, name: "Truyền Miệng", emoji: "🙊" },
];

export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream|null>(null);
  const [selectedGame, setSelectedGame] = useState<any>(null);
  const [volume, setVolume] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [showGame, setShowGame] = useState(false);
  const [micOk, setMicOk] = useState(false);
  const [winner, setWinner] = useState("");
  const [reactions, setReactions] = useState<string[]>([]);

  const startCam = async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({video:true, audio:true});
      setStream(s);
      if(videoRef.current) videoRef.current.srcObject = s;
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const analyser = ctx.createAnalyser();
      ctx.createMediaStreamSource(s).connect(analyser);
      const data = new Uint8Array(analyser.frequencyBinCount);
      const loop = () => {
        analyser.getByteFrequencyData(data);
        let sum=0; data.forEach(v=>sum+=v);
        const vol=sum/data.length;
        setVolume(vol);
        if(vol>15) setMicOk(true);
        if(showGame && vol>20) setScore(p=>p+1);
        requestAnimationFrame(loop);
      }; loop();
    } catch { alert("Cho phép Cam/Mic ở icon ổ khóa nhé!"); }
  };

  const openGame = (g:any) => { setSelectedGame(g); setShowGame(false); setWinner(""); setScore(0); setTimeLeft(10); startCam(); };

  useEffect(()=>{
    if(!showGame) return;
    if(timeLeft<=0){ setShowGame(false); setWinner(score>40?`VÔ ĐỊCH ${selectedGame.name}! ${score}đ 🎉`:`Được ${score}đ, cố lên!`); return; }
    const t=setTimeout(()=>setTimeLeft(v=>v-1),1000); return ()=>clearTimeout(t);
  },[timeLeft, showGame]);

  return (
    <div className="min-h-screen bg-[#f5eef8] flex flex-col items-center p-4">
      {/* ĐÂY LÀ GIAO DIỆN V8 CỦA BẠN - GIỮ NGUYÊN 100% */}
      <h1 className="font-black text-xl mt-4">huongngoaiwithfriends</h1>
      <p className="text-xs text-gray-500">BẢN CHUẨN STORE V8</p>
      <div className="bg-white px-3 py-1 rounded-full text-xs mt-1">Lượt: 10/15</div>

      <div className="bg-white w-full max-w-sm rounded-3xl p-4 mt-4 shadow flex items-center gap-3">
        <div className="text-3xl">😎</div>
        <div><div className="font-bold text-sm">2500012584</div><div className="text-xs text-gray-500">10/15 lượt</div></div>
      </div>

      <div className="flex gap-3 w-full max-w-sm mt-4">
        <button className="bg-[#1a1a2e] text-white flex-1 rounded-2xl py-6 font-bold">Tạo Phòng 👑</button>
        <div className="flex-1 flex flex-col gap-2">
          <input placeholder="Mã phòng" className="border rounded-xl px-3 py-2 text-sm"/>
          <button className="bg-[#1a1a2e] text-white rounded-xl py-2 text-sm">Vào Phòng</button>
        </div>
      </div>

      <div className="flex gap-3 w-full max-w-sm mt-4">
        <button className="bg-white flex-1 rounded-xl py-2 text-sm shadow">💬 Chat</button>
        <button className="bg-white flex-1 rounded-xl py-2 text-sm shadow">❄️ 19h</button>
        <button className="bg-white flex-1 rounded-xl py-2 text-sm shadow">❤️ Donate</button>
      </div>

      <div className="bg-white w-full max-w-sm rounded-2xl p-3 mt-4 grid grid-cols-3 gap-2 text-center text-xs shadow">
        <div>🔒<br/>Bảo mật</div><div>🚫<br/>Từ cấm</div><div>📞<br/>Liên hệ</div>
        <div className="col-span-3 text-[9px] text-gray-400 mt-2">© 2026 huongngoaiwithfriends - Bảo Vy - VCB 9865912660</div>
      </div>

      {/* DANH SÁCH 10 GAME CŨ - GIỮ NGUYÊN */}
      <div className="w-full max-w-sm mt-6">
        <p className="font-bold text-sm mb-2">10 Trò Chơi (Đã nâng cấp vui hơn):</p>
        <div className="grid grid-cols-2 gap-2">
          {GAMES.map(g=>(
            <button key={g.id} onClick={()=>openGame(g)} className="bg-white rounded-2xl p-3 text-left shadow hover:scale-105 transition">
              <div className="text-xl">{g.emoji}</div><div className="text-xs font-bold">{g.name}</div>
            </button>
          ))}
        </div>
      </div>

      {/* MODAL GAME MỚI - CHỈ CHỖ NÀY LÀ MỚI, BÊN NGOÀI VẪN V8 */}
      {selectedGame && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] w-full max-w-sm p-4 text-black">
            {!showGame && !winner && (
              <>
                <h2 className="font-bold text-center">{selectedGame.emoji} Phòng Chờ: {selectedGame.name}</h2>
                <div className="bg-black rounded-2xl aspect-video mt-3 overflow-hidden relative">
                  <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover"/>
                  {!stream && <div className="absolute inset-0 flex items-center justify-center text-white text-xs">Đang mở Cam/Mic...</div>}
                  <div className="absolute bottom-1 left-2 right-2 h-2 bg-white/30 rounded-full"><div className="h-full bg-green-500" style={{width:`${Math.min(volume*3,100)}%`}}/></div>
                  <div className="absolute top-2 left-2 text-xs bg-green-500 text-white px-2 rounded-full">{micOk?"✅ Mic OK":"Nói Alo đi"}</div>
                </div>
                <p className="text-[11px] text-center mt-2 text-gray-500">Tính năng mới: Thấy mặt nhau, đo mic, filter {selectedGame.emoji}</p>
                <button disabled={!micOk} onClick={()=>{setShowGame(true); setScore(0); setTimeLeft(10);}} className={`w-full mt-3 py-3 rounded-2xl font-bold ${micOk?"bg-black text-white":"bg-gray-200"}`}>Bắt Đầu - Sẵn Sàng 🚀</button>
                <button onClick={()=>setSelectedGame(null)} className="w-full mt-2 text-xs text-gray-500">Đóng</button>
              </>
            )}
            {showGame && (
              <>
                <div className="flex justify-between text-xs"><span>{selectedGame.emoji} {selectedGame.name}</span><span className="font-black">{timeLeft}s - {score}đ</span></div>
                <div className="bg-black rounded-2xl mt-2 aspect-video relative overflow-hidden"><video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover"/><div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-5xl">{selectedGame.emoji}</div>{reactions.map((r,i)=><div key={i} className="absolute text-2xl animate-bounce" style={{left:`${10+i*20}%`, top:"20%"}}>{r}</div>)}</div>
                <div className="flex gap-2 mt-2 justify-center"><button onClick={()=>setReactions(r=>[...r,"😂"])} className="bg-gray-100 px-2 py-1 rounded-full text-xs">😂</button><button onClick={()=>setReactions(r=>[...r,"❤️"])} className="bg-gray-100 px-2 py-1 rounded-full text-xs">❤️</button><button onClick={()=>setReactions(r=>[...r,"💩"])} className="bg-gray-100 px-2 py-1 rounded-full text-xs">💩 Trêu</button></div>
                <button onClick={()=>setTimeLeft(0)} className="w-full mt-3 bg-black text-white py-3 rounded-2xl">Hoàn Thành 🎉</button>
              </>
            )}
            {winner && (
              <div className="text-center py-6"><div className="text-5xl">👑</div><div className="font-black mt-2">{winner}</div><button onClick={()=>setSelectedGame(null)} className="mt-4 bg-black text-white w-full py-3 rounded-2xl">Về Trang Chủ V8</button></div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
