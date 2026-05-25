import http from "node:http";
import { randomBytes } from "node:crypto";

const port = Number(process.env.PORT ?? 5173);
const clients = new Set();
const packets = [];
const alerts = [];

const protocols = ["TCP", "UDP", "ICMP", "HTTP", "HTTPS", "DNS", "SSH", "FTP"];
const ports = [22, 23, 53, 80, 443, 445, 993, 1433, 3306, 3389, 5900, 8080];
const suspicious = ["45.155.205.233", "185.220.101.14", "103.167.150.91"];

function id(prefix) {
  return `${prefix}_${randomBytes(6).toString("hex")}`;
}

function pick(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function rand(min, max) {
  return Math.floor(min + Math.random() * (max - min + 1));
}

function publicIp() {
  return `${rand(11, 223)}.${rand(0, 255)}.${rand(0, 255)}.${rand(1, 254)}`;
}

function privateIp() {
  return `10.${rand(0, 12)}.${rand(0, 255)}.${rand(1, 254)}`;
}

function makePacket() {
  const protocol = pick(protocols);
  const sourceIp = Math.random() > 0.9 ? pick(suspicious) : publicIp();
  const portNumber = protocol === "DNS" ? 53 : protocol === "HTTPS" ? 443 : protocol === "HTTP" ? 80 : pick(ports);
  const severity = suspicious.includes(sourceIp) || portNumber === 23 ? "high" : Math.random() > 0.8 ? "medium" : "low";
  return {
    id: id("pkt"),
    sourceIp,
    destinationIp: privateIp(),
    protocol,
    port: portNumber,
    size: rand(64, 8400),
    timestamp: new Date().toISOString(),
    packetType: pick(["inbound", "outbound", "lateral"]),
    action: severity === "high" ? "flagged" : Math.random() > 0.94 ? "blocked" : "allowed",
    severity,
    payloadSignature: pick(["TLS_CLIENT_HELLO", "DNS_QUERY", "HTTP_POST", "SYN", "ACK", "ICMP_ECHO", "SSH_KEX"])
  };
}

function analyze(packet) {
  const output = [];
  if (suspicious.includes(packet.sourceIp)) {
    output.push({
      id: id("alert"),
      title: "Suspicious source IP detected",
      description: "Known hostile infrastructure matched reputation intelligence.",
      severity: "critical",
      sourceIp: packet.sourceIp,
      destinationIp: packet.destinationIp,
      createdAt: packet.timestamp
    });
  }
  if ([22, 23, 445, 3389, 5900].includes(packet.port)) {
    output.push({
      id: id("alert"),
      title: "Risky service port accessed",
      description: `Traffic targeted sensitive port ${packet.port}.`,
      severity: packet.port === 23 ? "high" : "medium",
      sourceIp: packet.sourceIp,
      destinationIp: packet.destinationIp,
      createdAt: packet.timestamp
    });
  }
  return output;
}

function sendEvent(type, data) {
  const message = `event: ${type}\ndata: ${JSON.stringify(data)}\n\n`;
  for (const client of clients) client.write(message);
}

function dashboard() {
  const protocolCounts = Object.entries(
    packets.reduce((acc, packet) => {
      acc[packet.protocol] = (acc[packet.protocol] ?? 0) + 1;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));
  const topIps = Object.entries(
    packets.reduce((acc, packet) => {
      acc[packet.sourceIp] = (acc[packet.sourceIp] ?? 0) + 1;
      return acc;
    }, {})
  )
    .map(([ip, count]) => ({ ip, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);
  const timeline = packets
    .slice(0, 40)
    .reverse()
    .map((packet) => ({ time: new Date(packet.timestamp).toLocaleTimeString(), packets: 1, bytes: packet.size }));
  return {
    totals: {
      packets: packets.length,
      bytes: packets.reduce((sum, packet) => sum + packet.size, 0),
      alerts: alerts.length,
      blocked: packets.filter((packet) => packet.action === "blocked").length,
      flagged: packets.filter((packet) => packet.action === "flagged").length
    },
    protocolCounts,
    topIps,
    timeline,
    alerts: alerts.slice(0, 8)
  };
}

for (let i = 0; i < 45; i += 1) {
  const packet = makePacket();
  packets.unshift(packet);
  alerts.unshift(...analyze(packet));
}

setInterval(() => {
  const packet = makePacket();
  packets.unshift(packet);
  packets.splice(300);
  const newAlerts = analyze(packet);
  alerts.unshift(...newAlerts);
  alerts.splice(100);
  sendEvent("packet", packet);
  newAlerts.forEach((alert) => sendEvent("alert", alert));
  sendEvent("analytics", dashboard());
}, 1100);

const server = http.createServer((req, res) => {
  const url = new URL(req.url ?? "/", `http://${req.headers.host}`);
  if (url.pathname === "/events") {
    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive"
    });
    clients.add(res);
    res.write(`event: analytics\ndata: ${JSON.stringify(dashboard())}\n\n`);
    req.on("close", () => clients.delete(res));
    return;
  }
  if (url.pathname === "/api/packets") return json(res, { data: packets.slice(0, 50), total: packets.length });
  if (url.pathname === "/api/analytics") return json(res, dashboard());
  if (url.pathname === "/api/export/json") return json(res, packets);
  if (url.pathname === "/api/export/csv") {
    res.writeHead(200, { "Content-Type": "text/csv", "Content-Disposition": "attachment; filename=sentineldpi-demo.csv" });
    return res.end(["id,sourceIp,destinationIp,protocol,port,size,timestamp,severity,action", ...packets.map((p) => `${p.id},${p.sourceIp},${p.destinationIp},${p.protocol},${p.port},${p.size},${p.timestamp},${p.severity},${p.action}`)].join("\n"));
  }
  res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
  res.end(html);
});

function json(res, payload) {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify(payload));
}

server.listen(port, () => {
  console.log(`SentinelDPI live preview running at http://localhost:${port}`);
});

const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>SentinelDPI Live Preview</title>
  <style>
    *{box-sizing:border-box}body{margin:0;background:#090d14;color:#e5eefb;font-family:Inter,Segoe UI,Arial,sans-serif}.app{display:grid;grid-template-columns:260px 1fr;min-height:100vh}.side{border-right:1px solid #223047;padding:24px;background:#070a10}.brand{display:flex;gap:12px;align-items:center}.logo{display:grid;place-items:center;width:42px;height:42px;border:1px solid rgba(56,217,255,.35);border-radius:8px;color:#38d9ff;background:rgba(56,217,255,.1)}.nav{margin-top:32px;display:grid;gap:8px}.nav a{color:#b7c4d8;text-decoration:none;padding:10px 12px;border-radius:7px}.nav a:hover{background:rgba(255,255,255,.05);color:white}.main{min-width:0}.hero{border-bottom:1px solid #223047;padding:26px 32px;display:flex;justify-content:space-between;gap:20px;align-items:center}.eyebrow{color:#38d9ff;font-size:12px;letter-spacing:.22em;text-transform:uppercase}.hero h1{margin:8px 0;font-size:32px}.hero p{margin:0;color:#94a3b8}.live{border:1px solid #223047;background:#111827;border-radius:8px;padding:12px 14px;color:#7cff9e}.content{padding:22px 32px;display:grid;gap:18px}.metrics{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:14px}.card,.panel{border:1px solid #223047;background:rgba(17,24,39,.82);border-radius:8px}.card{padding:18px}.label{font-size:12px;color:#94a3b8;text-transform:uppercase}.value{font-size:27px;font-weight:700;margin-top:8px}.grid{display:grid;grid-template-columns:1fr 390px;gap:18px}.toolbar{display:grid;grid-template-columns:1.5fr repeat(4,1fr);gap:10px;padding:14px}.toolbar input,.toolbar select{height:40px;border:1px solid #223047;background:#090d14;color:white;border-radius:7px;padding:0 12px}.panel h2{font-size:17px;margin:0}.panel-head{padding:16px;border-bottom:1px solid #223047;display:flex;justify-content:space-between;align-items:center}.table-wrap{overflow:auto}table{width:100%;min-width:920px;border-collapse:collapse;font-size:14px}th{color:#94a3b8;text-align:left;font-size:12px;text-transform:uppercase;background:rgba(255,255,255,.03)}th,td{padding:12px 14px;border-bottom:1px solid #223047}.mono{font-family:Consolas,monospace;color:#38d9ff}.pill{border-radius:4px;padding:4px 7px;font-size:12px}.low{background:rgba(124,255,158,.1);color:#7cff9e}.medium{background:rgba(247,201,72,.1);color:#f7c948}.high,.critical{background:rgba(255,92,122,.12);color:#ff8aa1}.alerts{max-height:548px;overflow:auto}.alert{padding:15px;border-bottom:1px solid #223047}.alert p{color:#94a3b8;margin:6px 0}.charts{display:grid;grid-template-columns:1fr 1fr;gap:18px}.chart{height:260px;padding:16px}.bars{display:flex;align-items:end;gap:9px;height:190px;margin-top:18px}.bar{flex:1;background:linear-gradient(#38d9ff,#7cff9e);border-radius:5px 5px 0 0;min-height:8px}.export a{display:inline-block;color:#38d9ff;margin-right:10px}@media(max-width:1100px){.app{grid-template-columns:1fr}.side{display:none}.metrics{grid-template-columns:repeat(2,1fr)}.grid,.charts{grid-template-columns:1fr}}@media(max-width:640px){.hero{display:block;padding:22px 16px}.content{padding:16px}.metrics{grid-template-columns:1fr}.toolbar{grid-template-columns:1fr}}
  </style>
</head>
<body>
  <div class="app">
    <aside class="side"><div class="brand"><div class="logo">◆</div><div><strong>SentinelDPI</strong><br><span style="color:#94a3b8;font-size:12px">SOC packet intelligence</span></div></div><nav class="nav"><a href="#">Dashboard</a><a href="#packets">Live Packets</a><a href="#alerts">Threat Alerts</a><a href="#analytics">Analytics</a></nav><p class="export"><a href="/api/export/csv">CSV Export</a><a href="/api/export/json">JSON Export</a></p></aside>
    <main class="main"><header class="hero"><div><div class="eyebrow">Deep packet inspection</div><h1>Network Traffic Command Center</h1><p>Monitor live packets, detect suspicious traffic, filter forensic logs, and export reports.</p></div><div class="live">● Live SSE stream connected</div></header>
    <section class="content"><div class="metrics" id="metrics"></div><div class="grid"><div><section class="panel"><div class="toolbar"><input id="search" placeholder="Search IP, protocol, signature"><select id="protocol"><option value="">Protocol</option><option>TCP</option><option>UDP</option><option>HTTP</option><option>HTTPS</option><option>DNS</option><option>SSH</option></select><select id="severity"><option value="">Severity</option><option>low</option><option>medium</option><option>high</option><option>critical</option></select><input id="port" placeholder="Port"><select id="type"><option value="">Type</option><option>inbound</option><option>outbound</option><option>lateral</option></select></div></section><section class="panel" id="packets" style="margin-top:18px"><div class="panel-head"><div><h2>Real-Time Packet Monitor</h2><span style="color:#94a3b8;font-size:14px" id="packetCount"></span></div></div><div class="table-wrap"><table><thead><tr><th>Time</th><th>Source</th><th>Destination</th><th>Protocol</th><th>Port</th><th>Size</th><th>Type</th><th>Risk</th><th>Action</th></tr></thead><tbody id="rows"></tbody></table></div></section></div><section class="panel" id="alerts"><div class="panel-head"><h2>Threat Alert Summary</h2></div><div class="alerts" id="alertRows"></div></section></div><div class="charts" id="analytics"><section class="panel chart"><h2>Protocol Usage</h2><div class="bars" id="protocolBars"></div></section><section class="panel chart"><h2>Top Active IPs</h2><div id="topIps"></div></section></div></section></main>
  </div>
  <script>
    let packets=[];let alerts=[];let analytics={totals:{packets:0,bytes:0,alerts:0,blocked:0,flagged:0},protocolCounts:[],topIps:[]};
    const filters={search:"",protocol:"",severity:"",port:"",type:""};
    async function boot(){const p=await fetch('/api/packets').then(r=>r.json());const a=await fetch('/api/analytics').then(r=>r.json());packets=p.data;alerts=a.alerts;analytics=a;render();}
    function metric(label,value,detail){return '<section class="card"><div class="label">'+label+'</div><div class="value">'+value+'</div><div style="color:#94a3b8;margin-top:8px;font-size:14px">'+detail+'</div></section>'}
    function render(){document.getElementById('metrics').innerHTML=metric('Packets Captured',analytics.totals.packets.toLocaleString(),'Indexed active logs')+metric('Traffic Volume',(analytics.totals.bytes/1000).toFixed(1)+' KB','Aggregated packet size')+metric('Threat Alerts',alerts.length,'Open detections')+metric('Blocked Logs',analytics.totals.blocked,'Policy blocks')+metric('Flagged Packets',analytics.totals.flagged,'DPI review queue');const visible=packets.filter(p=>(!filters.search||JSON.stringify(p).toLowerCase().includes(filters.search.toLowerCase()))&&(!filters.protocol||p.protocol===filters.protocol)&&(!filters.severity||p.severity===filters.severity)&&(!filters.port||String(p.port)===filters.port)&&(!filters.type||p.packetType===filters.type));document.getElementById('packetCount').textContent=visible.length+' packet logs visible';document.getElementById('rows').innerHTML=visible.slice(0,45).map(p=>'<tr><td>'+new Date(p.timestamp).toLocaleTimeString()+'</td><td class="mono">'+p.sourceIp+'</td><td>'+p.destinationIp+'</td><td>'+p.protocol+'</td><td>'+p.port+'</td><td>'+p.size.toLocaleString()+' B</td><td>'+p.packetType+'</td><td><span class="pill '+p.severity+'">'+p.severity+'</span></td><td>'+p.action+'</td></tr>').join('');document.getElementById('alertRows').innerHTML=(alerts.length?alerts:[]).slice(0,30).map(a=>'<article class="alert"><strong>'+a.title+'</strong> <span class="pill '+a.severity+'">'+a.severity+'</span><p>'+a.description+'</p><code>'+a.sourceIp+' → '+a.destinationIp+'</code></article>').join('')||'<div style="padding:28px;color:#94a3b8;text-align:center">No active alerts yet.</div>';const max=Math.max(1,...analytics.protocolCounts.map(x=>x.value));document.getElementById('protocolBars').innerHTML=analytics.protocolCounts.map(x=>'<div title="'+x.name+': '+x.value+'" class="bar" style="height:'+(x.value/max*100)+'%"></div>').join('');document.getElementById('topIps').innerHTML=analytics.topIps.map(x=>'<p><code class="mono">'+x.ip+'</code><span style="float:right">'+x.count+'</span></p>').join('')}
    ['search','protocol','severity','port','type'].forEach(id=>document.addEventListener('input',e=>{if(e.target.id===id){filters[id]=e.target.value;render()}}));
    const events=new EventSource('/events');events.addEventListener('packet',e=>{packets.unshift(JSON.parse(e.data));packets=packets.slice(0,300);render()});events.addEventListener('alert',e=>{alerts.unshift(JSON.parse(e.data));alerts=alerts.slice(0,100);render()});events.addEventListener('analytics',e=>{analytics=JSON.parse(e.data);render()});boot();
  </script>
</body>
</html>`;
