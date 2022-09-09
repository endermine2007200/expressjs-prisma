const express = require('express')
const body = require('body-parser')
const e = require('../main')
const app = express()
const fs = require('fs')
let qrcode = require('qrcode')
const port = process.env.PORT || 3000;

let db = {}
fs.writeFile('../db/db.json',JSON.stringify(db),(err)=>{})

app.use(express.static("views"))
app.use(body.raw())
app.use(body.json())
app.use(body.urlencoded({extended:true}))

app.get('/', (req, res, next) => {
	let re = `<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8">
		<meta http-equiv="X-UA-Compatible" content="IE=edge">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<link rel="icon" href="1656075322891.webp">
		<title>Baaa3</title>
    <link rel='stylesheet' href='https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css' integrity='sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm' crossorigin='anonymous'>
  <script src='https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js' integrity='sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl' crossorigin='anonymous'></script>
  <link rel='stylesheet' href='../css/style.css'>
  <link rel='stylesheet' href='https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.2/css/all.min.css' integrity='sha512-HK5fgLBL+xu6dm/Ii3z4xhlSUyZgTT9tuc/hSrtw6uzJOvgRr2a9jyxxT1ely+B+xFAmJKVSTbpM/CuL7qxO8w==' crossorigin='anonymous'>
		<audio hidden autoplay loop> 
			<source src="../audio/MUSIC.mp3" type="audio/mpeg">
		</audio>
	</head> 
	<body>
		<div class="animation-wrapper">
			<div class="particle particle-1"></div>
			<div class="particle particle-2"></div>
			<div class="particle particle-3"></div>
			<div class="particle particle-4"></div>
		</div>
		<div class="row no-gutters">
			<div class="col-xl-4">
				<section class="main">
					<a href="">
					<img src="../img/1656075322891.webp" alt="img" style="object-fit: cover;">
					</a>
					<span>Baaa3</span>
					<p> simple API for you</p>
				</section>
			</div>
			<div class="col-lg-8">
				<header>
					<nav>
						<div class="header_logo">
						</div>
						<div class="header_links">
							<ul class="nav_links">
								<form id="qr" method='POST' action='/qr'>
								<input hidden='' type='text' name='id' value=#{id}>
								<li class="nav_link"><a href="#" onclick="document.getElementById('qr').submit()" >GET QR</a></li>
							</form>
								<li class="nav_link"><a href="https://github.com/GUNTER404">GITHUB</a></li>
							</ul>
						</div>
					</nav>
					<section class="main2">
						<ul>
							<li><a target="_blank" href="https://wa.me/21260075639"><i class="fab fa-whatsapp"></i></a></li>
							<li><a target="_blank" href="https://instagram.com/virus.js"><i class="fab fa-instagram"></i></a></li>
						</ul>
					</section>
				</header>
			</div>
		</div>
	</body>
</html>
<!--by Baaa3-->
`
	res.send((''+re).replace('#{id}',e.create()))
});
app.post('/qr', async (req,res)=>{
	let qr = await e.get(req.body.id)
	if(qr == 'error'|| !qr) res.end('error')
	else{
		res.setHeader('content-type','image/png')
		res.send(await qrcode.toBuffer(qr))
	}
})
app.get('/qr', async (req,res)=>{
res.end('404 : method not true')
})

app.get('*', (req, res, next) => {
	res.send('Sorry, page not found');
	next();
});

app.listen(port)
