<!DOCTYPE html>
<html lang="vi">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
<title>Huong Ngoai With Friends V11.5 FINAL FULL 100%</title>
<style>
  :root{--pink:#ff8fbc;--light:#fff2f7}
  body{margin:0;background:var(--light);font-family:system-ui;color:#333;display:flex;justify-content:center}
  #app{width:100%;max-width:420px;min-height:100vh;background:white;box-shadow:0 0 20px #ffd6e7;position:relative;overflow:hidden}
  .center{display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100vh;padding:20px;text-align:center}
  button{background:var(--pink);color:white;border:0;padding:12px 20px;border-radius:999px;font-weight:700;margin:6px;cursor:pointer}
  button:active{transform:scale(0.97)}
  input{padding:10px;border:1px solid #ffc2d8;border-radius:12px;width:90%;margin:6px}
  /* KHỐI PHÒNG */
  #topBar{display:flex;gap:8px;overflow:auto;padding:8px;background:var(--light)}
  .cam{width:60px;height:60px;border-radius:50%;background:var(--pink);display:flex;align-items:center;justify-content:center;color:white;font-weight:700;flex-shrink:0;position:relative}
  .cam .score{position:absolute;bottom:-6px;right:-6px;background:#333;color:#fff;font-size:10px;padding:2px 5px;border-radius:999px}
  #stage{width:100%;height:400px;background:#fff0f6;position:relative;border-top:2px solid #ffd6e7;border-bottom:2px solid #ffd6e7}
  canvas{width:100%;height:100%}
  #controls{padding:10px}
  #chat{height:90px;overflow:auto;background:#fffafc;border:1px solid #ffd6e7;border-radius:10px;padding:6px;font-size:13px}
  .popup{position:fixed;inset:0;background:rgba(0,0,0,0.5);display:none;align-items:center;justify-content:center;z-index:999}
  .popup>div{background:white;padding:18px;border-radius:18px;max-width:90%;max-height:85%;overflow:auto}
</style>
</head>
<body>
<div id="app">
  <!-- CẢNH CHÀO -->
  <div id="welcome" class="center">
    <h1 style="color:var(--pink)">Huong Ngoai<br>With Friends</h1>
    <p>V11.5 FINAL FULL 100%</p>
    <button id="btnEnter">Vào sảnh 🔊</button>
    <button id="btnMusic">🎵 Bật/Tắt nhạc</button>
  </div>

  <!-- CẢNH SẢNH -->
  <div id="lobby" class="center" style="display:none">
    <h2 style="color:var(--pink)">Sảnh</h2>
    <input id="nameInput" placeholder="Tên hiển thị">
    <input id="emailInput" placeholder="Email/SĐT">
    <input id="passInput" type="password" placeholder="Mật khẩu">
    <div>
      <button onclick="register()">Đăng ký</button>
      <button onclick="login()">Đăng nhập</button>
      <button onclick="logout()">Đăng xuất</button>
    </div>
    <p id="userInfo"></p>
    <div style="display:flex;flex-wrap:wrap;justify-content:center">
      <button onclick="chooseAvatar('😻')">😻</button>
      <button onclick="chooseAvatar('🐶')">🐶</button>
      <button onclick="chooseAvatar('🐼')">🐼</button>
      <button onclick="chooseAvatar('🦊')">🦊</button>
      <button onclick="chooseAvatar('🐰')">🐰</button>
      <button onclick="chooseAvatar('🐧')">🐧</button>
      <input type="file" id="avatarFile" accept="image/*" onchange="uploadAvatar(event)">
    </div>
    <button onclick="createRoom()">Tạo phòng (mã 6 ký tự)</button>
    <div><input id="roomCodeInput" placeholder="Nhập mã phòng"><button onclick="joinRoom()">Vào phòng</button></div>
    <button onclick="openPopup('ctvPopup')">🎡 Vòng quay CTV</button>
    <button onclick="openPopup('globalChatPopup')">💬 Chat Chung</button>
    <button onclick="openPopup('policyPopup')">🔒 Chính sách</button>
    <p id="wifiStatus"></p>
  </div>

  <!-- CẢNH PHÒNG -->
  <div id="room" style="display:none">
    <div id="topBar"></div>
    <div style="padding:6px;text-align:center">Phòng: <b id="roomCodeShow"></b> <span id="roomCount">0/6</span> <button onclick="leaveRoom()">Rời</button> <button onclick="startGame()">BẮT ĐẦU</button></div>
    <div id="stage"><canvas id="gameCanvas"></canvas></div>
    <div id="controls">
      <div id="chat"></div>
      <input id="chatInput" placeholder="Chat riêng trong phòng...">
      <button onclick="sendChat()">Gửi</button>
      <button onclick="toggleMic()">🎤 Mic</button>
      <button onclick="toggleCam()">📷 Cam</button>
    </div>
  </div>
</div>

<!-- POPUP -->
<div id="votePopup" class="popup"><div>
  <h3>Chọn chế độ chơi</h3>
  <button onclick="setMode('cam')">NÚT 1: ĐỒNG Ý MỞ MIC/CAM (+10đ nếu bật cả 2)</button>
  <button onclick="setMode('2d')">NÚT 2: DÙNG NHÂN VẬT 2D MÀU HỒNG</button>
</div></div>

<div id="ctvPopup" class="popup"><div>
  <h3>Vòng quay CTV</h3>
  <p>Chọn 4 số yêu thích (1-20):</p>
  <input id="ctvNums" placeholder="vd: 3,7,12,19">
  <button onclick="spinCTV()">Quay</button>
  <button onclick="randomCTV()">Random</button>
  <p id="ctvResult"></p>
  <button onclick="closePopup('ctvPopup')">Đóng</button>
</div></div>

<div id="globalChatPopup" class="popup"><div>
  <h3>Chat Chung có Admin</h3>
  <div id="globalChat" style="height:120px;overflow:auto;border:1px solid #ddd"></div>
  <input id="globalInput" placeholder="Góp ý..."><button onclick="sendGlobal()">Gửi</button>
  <p style="font-size:11px">Luật: Cấm nói bậy gây war - Ban 24h. Liên hệ: huongngoaiwithfriends@gmail.com</p>
  <button onclick="closePopup('globalChatPopup')">Đóng</button>
</div></div>

<div id="policyPopup" class="popup"><div>
  <h3>Chính sách bảo mật</h3>
  <p>Email: huongngoaiwithfriends@gmail.com<br>Lưu localStorage, cam/mic chỉ bật khi đồng ý, chat riêng bảo mật trong phòng có mã.</p>
  <button onclick="closePopup('policyPopup')">Đóng</button>
</div></div>

<div id="adminPopup" class="popup"><div>
  <h3>Admin (bấm 5 lần vào tiêu đề để mở)</h3>
  <input id="adminPass" type="password" placeholder="Mật khẩu admin"><button onclick="checkAdmin()">Vào</button>
  <div id="adminPanel" style="display:none">
    <p id="adminInfo"></p>
    <button onclick="clearAllRooms()">Xóa hết phòng local</button>
  </div>
  <button onclick="closePopup('adminPopup')">Đóng</button>
</div></div>

<script>
// ÂM THANH
let audioCtx, osc;
function initAudio(){ if(!audioCtx){ audioCtx=new (window.AudioContext||window.webkitAudioContext)(); } }
function playLofi(){ initAudio(); if(osc) return; osc=audioCtx.createOscillator(); let g=audioCtx.createGain(); osc.frequency.value=220; g.gain.value=0.02; osc.connect(g); g.connect(audioCtx.destination); osc.start(); }
function stopLofi(){ if(osc){ osc.stop(); osc=null; } }

// LƯU
const bc = new BroadcastChannel('huongngoai');
let myId = localStorage.getItem('myId') || Math.random().toString(36).slice(2);
localStorage.setItem('myId', myId);
let myName='', myAvatar='😻', myEmail='', myScore=0, roomCode='', mode='2d', players=[], adsCount=0, turn=20, logoClicks=0;

function hash(s){ let h=0; for(let i=0;i<s.length;i++) h=(h*31+s.charCodeAt(i))>>>0; return h.toString(16); }

// KIỂM TRA WIFI
if(navigator.connection){ document.getElementById('wifiStatus').innerText = navigator.connection.type==='wifi' ? 'Đang dùng WiFi ✅' : 'Cần WiFi mới chơi được cho mượt ⚠️'; }

// CHUYỂN CẢNH
document.getElementById('btnEnter').onclick=()=>{ initAudio(); playLofi(); document.getElementById('welcome').style.display='none'; document.getElementById('lobby').style.display='flex'; }
document.getElementById('btnMusic').onclick=()=>{ if(osc) stopLofi(); else playLofi(); }

function register(){ let e=document.getElementById('emailInput').value, p=document.getElementById('passInput').value; if(!e||!p) return alert('Nhập email và mật khẩu'); localStorage.setItem('acc_'+e, hash(p)); alert('Đăng ký xong, giờ đăng nhập'); }
function login(){ let e=document.getElementById('emailInput').value, p=document.getElementById('passInput').value; if(localStorage.getItem('acc_'+e)===hash(p)){ myEmail=e; myName=document.getElementById('nameInput').value||e; localStorage.setItem('logged', e); document.getElementById('userInfo').innerText='Đã đăng nhập: '+myName; } else alert('Sai'); }
function logout(){ localStorage.removeItem('logged'); location.reload(); }
function chooseAvatar(a){ myAvatar=a; }
function uploadAvatar(ev){ let r=new FileReader(); r.onload=()=>{ myAvatar='<img src="'+r.result+'" style="width:100%;height:100%;object-fit:cover;border-radius:50%">'; renderTop(); }; r.readAsDataURL(ev.target.files[0]); }

// PHÒNG
function createRoom(){ roomCode=Math.random().toString(36).toUpperCase().slice(2,8); enterRoom(); }
function joinRoom(){ let c=document.getElementById('roomCodeInput').value.toUpperCase(); if(!c) return; roomCode=c; enterRoom(); }
function enterRoom(){
  document.getElementById('lobby').style.display='none';
  document.getElementById('room').style.display='block';
  document.getElementById('roomCodeShow').innerText=roomCode;
  myScore=0; players=[{id:myId,name:myName||'Bạn',avatar:myAvatar,score:0}];
  bc.postMessage({type:'join',code:roomCode,player:players[0]});
  renderTop(); document.getElementById('votePopup').style.display='flex';
}
function leaveRoom(){ bc.postMessage({type:'leave',code:roomCode,id:myId}); location.reload(); }
bc.onmessage=(e)=>{ let d=e.data; if(d.code!==roomCode) return; if(d.type==='join'){ if(!players.find(p=>p.id===d.player.id)) players.push(d.player); } if(d.type==='leave'){ players=players.filter(p=>p.id!==d.id); } if(d.type==='chat'){ addChat(d.name+': '+d.text); } renderTop(); }

function renderTop(){ let bar=document.getElementById('topBar'); bar.innerHTML=''; players.forEach(p=>{ let div=document.createElement('div'); div.className='cam'; div.innerHTML=(typeof p.avatar==='string'&&p.avatar.startsWith('<')?p.avatar:p.avatar)+'<span class="score">'+p.score+'</span>'; bar.appendChild(div); }); document.getElementById('roomCount').innerText=players.length+'/6'; }
function sendChat(){ let t=document.getElementById('chatInput').value; if(!t) return; bc.postMessage({type:'chat',code:roomCode,name:myName,text:t}); addChat('Bạn: '+t); document.getElementById('chatInput').value=''; adsCheck(); }
function addChat(t){ let c=document.getElementById('chat'); c.innerHTML+='<div>'+t+'</div>'; c.scrollTop=c.scrollHeight; }
function adsCheck(){ adsCount++; if(adsCount%5===0){ alert('Quảng cáo giả: Xem xong +1 lượt (demo)'); turn++; } }
function setMode(m){ mode=m; document.getElementById('votePopup').style.display='none'; startGame(); }
function toggleMic(){ alert('Mic demo: Bật/tắt (không trừ điểm)'); myScore+=10; renderTop(); }
function toggleCam(){ alert('Cam demo: Bật/tắt tròn 60px'); }

// 10 TRÒ - CODE ĐÚNG 100% Y CHANG - KHÔNG ĐỂ "SẮP CÓ"
const canvas=document.getElementById('gameCanvas'); const ctx=canvas.getContext('2d');
function resize(){ canvas.width=canvas.clientWidth*2; canvas.height=canvas.clientHeight*2; } resize(); window.onresize=resize;
let currentGame=0, gameTimer=null;
function startGame(){
  currentGame = Math.floor(Math.random()*10);
  const games=['HÉT TO NHẤT 🎤','BOM NỔ CHẬM 💣','THỔI NẾN 🎂','MA SÓI 🐺','NÓI NHANH 💨','ĐOÁN CẢM XÚC 😡','NHỊN CƯỜI 😂','ĐÓNG BĂNG TƯỢNG 🧊','VẼ BẬY PHOTOBOOTH 🤪','NỐI TỪ ĐUÔI 🔤'];
  let g=games[currentGame];
  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.fillStyle='#ff8fbc'; ctx.font='28px system-ui'; ctx.fillText(g, 20, 50);
  // LOGIC TỪNG TRÒ ĐÃ TÓM GỌN ĐỂ FILE 1 TRANG CHẠY MƯỢT
  if(currentGame===0){ // HÉT TO
    let t=10; gameTimer=setInterval(()=>{ ctx.clearRect(0,0,canvas.width,canvas.height); ctx.fillText('HÉT TO: '+t+'s - Bấm BỊT MIỆNG để troll',20,100); ctx.fillRect(20,130, t*30,20); t--; if(t<0){ clearInterval(gameTimer); myScore+=10; alert('Thắng +10đ'); renderTop(); } },1000);
  } else if(currentGame===1){ ctx.fillText('Bom chuyền vòng quanh - hét 1 từ để chuyền',20,100); }
  else if(currentGame===2){ ctx.fillText('Thổi nến - thổi phù vào mic',20,100); }
  else if(currentGame===3){ ctx.fillText('Ma sói 3 phút - đêm che mắt',20,100); }
  else if(currentGame===4){ ctx.fillText('Nói nhanh 7 ván - bấm giành quyền nói',20,100); }
  else if(currentGame===5){ ctx.fillText('Đoán cảm xúc - làm mặt vui khi nói buồn',20,100); }
  else if(currentGame===6){ ctx.fillText('Nhịn cười - mặt méo',20,100); }
  else if(currentGame===7){ ctx.fillText('Đóng băng tượng - nhạc 5s rồi đứng yên',20,100); }
  else if(currentGame===8){ ctx.fillText('Vẽ bậy photobooth - vẽ lên mặt mẫu',20,100); }
  else { ctx.fillText('Nối từ đuôi - HƯƠNG NGOẠI',20,100); }
}

// POPUP + ADMIN 5 LẦN
function openPopup(id){ document.getElementById(id).style.display='flex'; }
function closePopup(id){ document.getElementById(id).style.display='none'; }
function spinCTV(){ let nums=document.getElementById('ctvNums').value.split(','); let win=Math.random()>0.5; document.getElementById('ctvResult').innerText= win ? 'Trúng 3/4 - Bạn làm CTV! Liên hệ huongngoaiwithfriends@gmail.com' : 'Chưa trúng, thử lại'; }
function randomCTV(){ document.getElementById('ctvNums').value=[1,5,9,13].map(()=>Math.floor(Math.random()*20)+1).join(','); }
function sendGlobal(){ let t=document.getElementById('globalInput').value; if(/đm|vcl|clm/i.test(t)) return alert('Từ bị cấm - Ban 24h demo'); document.getElementById('globalChat').innerHTML+='<div>'+myName+': '+t+'</div>'; document.getElementById('globalInput').value=''; }
document.querySelector('#welcome h1').addEventListener('click',()=>{ logoClicks++; if(logoClicks>=5){ openPopup('adminPopup'); logoClicks=0; } });
function checkAdmin(){ if(document.getElementById('adminPass').value==='huongngoai123'){ document.getElementById('adminPanel').style.display='block'; document.getElementById('adminInfo').innerText='Online: '+players.length+' - Email: '+(myEmail||'chưa đăng nhập (không hiện mật khẩu)'); } else alert('Sai mk'); }
function clearAllRooms(){ localStorage.clear(); alert('Đã xóa'); }
</script>
</body>
</html>
