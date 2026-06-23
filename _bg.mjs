import { chromium } from 'playwright'
const b = await chromium.launch({ args:['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--ignore-gpu-blocklist','--enable-webgl','--autoplay-policy=no-user-gesture-required'] })
const p = await b.newPage({ viewport:{ width:1440, height:900 } })
const errors=[]; p.on('console',m=>{if(m.type()==='error')errors.push(m.text())}); p.on('pageerror',e=>errors.push('PE: '+e.message))
await p.goto('http://localhost:4173/',{waitUntil:'networkidle'}); await p.waitForTimeout(2500)
await p.evaluate(()=>{const el=document.getElementById('album'); if(el) window.scrollTo(0, el.getBoundingClientRect().top+window.scrollY-20)})
await p.waitForTimeout(900)
await (await p.getByText('Play Album',{exact:false}).first()).click()
await p.waitForTimeout(1500)
// capture several album frames to catch a drop pop
for(let i=0;i<6;i++){ await p.waitForTimeout(700); await p.screenshot({path:`/tmp/bg-album-${i}.png`}) }
// scroll to STORE (far from album) to prove the background reacts everywhere
await p.evaluate(()=>{const el=document.getElementById('store'); if(el) window.scrollTo(0, el.getBoundingClientRect().top+window.scrollY-20)})
await p.waitForTimeout(1600)
await p.screenshot({path:'/tmp/bg-store.png'})
console.log('ERRORS:', errors.length); errors.slice(0,8).forEach(e=>console.log(' • '+e))
await b.close()
