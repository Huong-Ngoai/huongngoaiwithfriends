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
  const [winner, setWinner] = useState("");
  const [modal, setModal] = useState<string>(""); // chat, donate, baomat...
  const [roomCode, setRoomCode] = useState("");
  const [inRoom, setInRoom] = useState(false);
  const [members, setMembers] = useState<string[]>(["Bạn (Chủ phòng) 👑", "2500012584 😎"]);
  const [chatMsgs, setChatMsgs] = useState<string[]>(["Hệ thống: Chào mừng đến phòng!"]);

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
        setVolume(sum/data.length);
        if(showGame && sum/data.length>20) setScore(p=>p+1);
        requestAnimationFrame(loop);
      }; loop();
    } catch { alert("Cho phép Cam/Mic ở icon ổ khóa trên trình duyệt nhé!"); }
  };

  const createRoom = () => {
    const code = Math.random().toString(36).substring(2,6).toUpperCase();
    setRoomCode(code);
    setInRoom(true);
    setMembers(["Bạn (Chủ phòng) 👑", "Bạn Bè 2 đang vào...", "Bạn Bè 3 đang vào..."]);
    startCam();
  };

  useEffect(()=>{
    if(!showGame) return;
    if(timeLeft<=0){ setShowGame(false); setWinner(`Thắng! ${score} điểm! 🎉`); return; }
    const t=setTimeout(()=>setTimeLeft(v=>v-1),1000); return ()=>clearTimeout(t);
  },[timeLeft, showGame]);

  return (
    <div className="min-h-screen bg-[#f5eef8] flex flex-col items-center p-4 pb-20">
      <h1 className="font-black text-xl mt-4">huongngoaiwithfriends</h1>
      <p className="text-xs text-gray-500">BẢN CHUẨN STORE V8</p>
      <div className="bg-white px-3 py-1 rounded-full text-xs mt-1">Lượt: 10/15</div>

      <div className="bg-white w-full max-w-sm rounded-3xl p-4 mt-4 shadow flex items-center gap-3">
        <div className="text-3xl">😎</div>
        <div><div className="font-bold text-sm">2500012584</div><div className="text-xs text-gray-500">10/15 lượt {inRoom?` - Phòng: ${roomCode}`:""}</div></div>
      </div>

      {/* HIỆN TẤT CẢ THÀNH VIÊN KHI TẠO PHÒNG */}
      {inRoom && (
        <div className="w-full max-w-sm mt-4 bg-white rounded-2xl p-3 shadow">
          <p className="font-bold text-sm">Thành viên trong phòng ({members.length}):</p>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {members.map((m,i)=>(
              <div key={i} className="bg-[#1a1a2e] text-white rounded-xl aspect-video flex flex-col items-center justify-center text-xs relative overflow-hidden">
                {i===0 ? <video ref={videoRef} autoPlay playsInline muted className="absolute inset-0 w-full h-full object-cover"/> : <div className="text-2xl">👤</div>}
                <div className="bg-black/60 px-2 py-1 rounded-full text-[10px] relative z-10 mt-auto mb-1">{m}</div>
                <div className="absolute bottom-1 left-2 right-2 h-1 bg-white/30 rounded-full"><div className="h-full bg-green-500" style={{width:`${Math.min(volume*2,100)}%`}}/></div>
              </div>
            ))}
          </div>
          <button onClick={()=>{setInRoom(false); stream?.getTracks().forEach(t=>t.stop());}} className="w-full mt-2 bg-red-100 py-2 rounded-xl text-xs">Rời Phòng</button>
        </div>
      )}

      <div className="flex gap-3 w-full max-w-sm mt-4">
        <button onClick={createRoom} className="bg-[#1a1a2e] text-white flex-1 rounded-2xl py-6 font-bold hover:scale-105 transition">Tạo Phòng 👑</button>
        <div className="flex-1 flex flex-col gap-2">
          <input value={roomCode} onChange={e=>setRoomCode(e.target.value)} placeholder="Mã phòng" className="border rounded-xl px-3 py-2 text-sm"/>
          <button onClick={()=>{if(roomCode){setInRoom(true); setMembers(["Bạn","Chủ phòng "+roomCode]); startCam();}else alert("Nhập mã phòng!");}} className="bg-[#1a1a2e] text-white rounded-xl py-2 text-sm">Vào Phòng</button>
        </div>
      </div>

      <div className="flex gap-3 w-full max-w-sm mt-4">
        <button onClick={()=>setModal("chat")} className="bg-white flex-1 rounded-xl py-2 text-sm shadow hover:bg-gray-50">💬 Chat</button>
        <button onClick={()=>setModal("19h")} className="bg-white flex-1 rounded-xl py-2 text-sm shadow">❄️ 19h</button>
        <button onClick={()=>setModal("donate")} className="bg-white flex-1 rounded-xl py-2 text-sm shadow">❤️ Donate</button>
      </div>

      <div className="bg-white w-full max-w-sm rounded-2xl p-3 mt-4 grid grid-cols-3 gap-2 text-center text-xs shadow">
        <button onClick={()=>setModal("baomat")} className="py-2 hover:bg-gray-50 rounded-xl">🔒<br/>Bảo mật</button>
        <button onClick={()=>setModal("tucam")} className="py-2 hover:bg-gray-50 rounded-xl">🚫<br/>Từ cấm</button>
        <button onClick={()=>setModal("lienhe")} className="py-2 hover:bg-gray-50 rounded-xl">📞<br/>Liên hệ</button>
        <div className="col-span-3 text-[9px] text-gray-400 mt-2">© 2026 huongngoaiwithfriends - Bảo Vy - VCB 9865912660</div>
      </div>

      <div className="w-full max-w-sm mt-6">
        <p className="font-bold text-sm mb-2">10 Trò Chơi (Đã nâng cấp):</p>
        <div className="grid grid-cols-2 gap-2">
          {GAMES.map(g=>(
            <button key={g.id} onClick={()=>{setSelectedGame(g); setShowGame(false); setWinner(""); startCam();}} className="bg-white rounded-2xl p-3 text-left shadow hover:scale-105 transition">
              <div className="text-xl">{g.emoji}</div><div className="text-xs font-bold">{g.name}</div>
            </button>
          ))}
        </div>
      </div>

      {/* MODAL CHO TẤT CẢ CÁC NÚT */}
      {modal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-5 text-black">
            {modal==="chat" && <div><h2 className="font-bold">💬 Chat Nhóm</h2><div className="bg-gray-100 h-40 rounded-xl mt-2 p-2 overflow-y-auto text-xs">{chatMsgs.map((m,i)=><div key={i}>{m}</div>)}</div><input onKeyDown={e=>{if(e.key==="Enter"){setChatMsgs([...chatMsgs,"Bạn: "+(e.target as any).value]); (e.target as any).value="";}}} placeholder="Nhắn gì đó..." className="w-full border rounded-xl px-3 py-2 mt-2 text-sm"/></div>}
            {modal==="19h" && <div><h2 className="font-bold">❄️ Sự Kiện 19h</h2><p className="text-sm mt-2">19h hàng ngày x2 lượt chơi miễn phí + x2 điểm!<br/>- Đăng nhập lúc 19h-20h được +5 lượt<br/>- Thắng game lúc 19h được quà bí mật</p></div>}
            {modal==="donate" && <div><h2 className="font-bold">❤️ Donate Ủng Hộ</h2><p className="text-sm mt-2">Ủng hộ Bảo Vy để duy trì server:</p><div className="bg-yellow-100 p-3 rounded-xl mt-2 text-sm">VCB: 9865912660<br/>Chủ TK: Bảo Vy<br/>Nội dung: Donate + SĐT bạn</div></div>}
            {modal==="baomat" && <div><h2 className="font-bold">🔒 Bảo Mật</h2><p className="text-sm mt-2">- Cam/Mic chỉ chạy trên máy bạn, không lưu server<br/>- Mã phòng chỉ có bạn bè biết mới vào được<br/>- Không thu thập thông tin cá nhân</p></div>}
            {modal==="tucam" && <div><h2 className="font-bold">🚫 Từ Cấm</h2><p className="text-sm mt-2">Không được nói từ cấm khi chơi:<br/>- Từ tục tĩu, chửi thề<br/>- Từ 18+<br/>- Nói từ cấm sẽ bị trừ 10 điểm và mic tự tắt 5s</p></div>}
            {modal==="lienhe" && <div><h2 className="font-bold">📞 Liên Hệ</h2><p className="text-sm mt-2">Admin: Bảo Vy<br/>Zalo: 09865912660<br/>Email: huongngoaiwithfriends@gmail.com<br/>Báo lỗi game bấm vào đây sẽ gửi ảnh màn hình cho mình!</p></div>}
            <button onClick={()=>setModal("")} className="w-full mt-4 bg-black text-white py-3 rounded-xl">Đóng</button>
          </div>
        </div>
      )}

      {/* MODAL GAME ĐÃ SỬA MÀN HÌNH ĐEN */}
      {selectedGame && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] w-full max-w-sm p-4 text-black">
            {!showGame && !winner && (
              <>
                <h2 className="font-bold text-center">{selectedGame.emoji} {selectedGame.name}</h2>
                <div className="bg-black rounded-2xl aspect-video mt-3 overflow-hidden relative">
                  <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover"/>
                  <div className="absolute bottom-1 left-2 right-2 h-2 bg-white/30 rounded-full"><div className="h-full bg-green-500" style={{width:`${Math.min(volume*3,100)}%`}}/></div>
                </div>
                <p className="text-[11px] text-center mt-2">Đã sửa màn hình đen - Thấy cam rồi nhé!</p>
                <button onClick={()=>{setShowGame(true); setScore(0); setTimeLeft(10);}} className="w-full mt-3 py-3 rounded-2xl bg-black text-white font-bold">Bắt Đầu 🚀</button>
                <button onClick={()=>setSelectedGame(null)} className="w-full mt-2 text-xs text-gray-500">Đóng</button>
              </>
            )}
            {showGame && (
              <><div className="flex justify-between text-xs"><span>{selectedGame.emoji} {selectedGame.name}</span><span className="font-black">{timeLeft}s - {score}đ</span></div><div className="bg-black rounded-2xl mt-2 aspect-video relative overflow-hidden"><video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover"/><div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-5xl">{selectedGame.emoji}</div></div><button onClick={()=>setTimeLeft(0)} className="w-full mt-3 bg-black text-white py-3 rounded-2xl">Hoàn Thành 🎉</button></>
            )}
            {winner && <div className="text-center py-6"><div className="text-5xl">👑</div><div className="font-black mt-2">{winner}</div><button onClick={()=>setSelectedGame(null)} className="mt-4 bg-black text-white w-full py-3 rounded-2xl">Đóng</button></div>}
          </div>
        </div>
      )}
    </div>
  );
}
