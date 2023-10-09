<h1 align="center">Intelify</h1>
<div>
	<p align="center">This is the first Node.js project I ever wrote from scratch. The concept is an <a href="https://en.wikipedia.org/wiki/Open-source_intelligence">OSINT (Open Source Intelligence)</a> tool for looking up breached data by username, email, IP address. The data used in the demo is not inlcuded with Intelify. Therefore, you will have to obtain it yourself. If someone wants to pay me 4 figures for the data and intel, then I might consider it. I combined and parsed hundreds of breached databases into one MySQL table which resulted in multiple gigabytes in size. With proper column indexing and code optimization, a query takes no more than 10-20 milliseconds at average.</p>
	<p align="center">I spent only 2 days doing this from scratch. With a mild motivation boost and some extra time I could’ve turned this into way much greater OSINT tool, than just simply a database lookup. If you would like me to continue this in future, feel free to donate me some BTC. You may find my Bitcoin wallet address below.</p>
 	<p align="center">
		<a href="https://nodejs.org/"><img src="https://img.shields.io/badge/language-Node%2Ejs-6cc24a" alt="Node.js" /></a>
		<a href="https://www.mysql.com/"><img src="https://img.shields.io/badge/database-MySQL-00758F" alt="MySQL" /></a>
		<a href="https://github.com/discordjs/discord.js"><img src="https://img.shields.io/badge/dependency-discord%2Ejs-7289da" alt="discord.js" /></a>
	</p>
</div>
<br />
<br />
<h2 align="center">Demo</h2>
<p align="center"><a href="https://www.youtube.com/watch?v=xQX1TlZ1V6I"><img src="https://i.imgur.com/U6HmMRq.jpg" alt=""Intelify" Discord OSINT tool demo 2022-11-20" /></a></p>
<p align="center"><a href="https://www.youtube.com/watch?v=xQX1TlZ1V6I">&#x25b6;&#xfe0f; <strong>Watch on YouTube</strong></a></p>
<br />
<h2 align="center">Remarks</h2>
<ul>
	<li>If you haven’t played around with discord bots or API before. Then you might want to consider reading the <a href="https://discord.com/developers/docs/getting-started">Discord API introduction</a></li>.
	<li>You will need to enter the client and user ID of your bot in <code>.env</code> file, along with the credentials to your MySQL database. Please note that the username, password, and database <strong>must be Base64 encoded</strong> in the <code>.env</code> file.</li>
	<li>Do not forget to import the <code>structure.sql</code> in your MySQL database.</li>
</ul>
<br />
<h2 align="center">Donations</h2>
<p align="center">If you would like to support the development further. You might want to motivate me by buying me a coffee.</p>
<p align="center"><img src="https://i.imgur.com/K7uTfHJ.png" alt="Bitcoin Address"> <code>bc1qgqeaztn9j75syqcx4lskpgkxg2eee5q23gsxl5</code></p>
