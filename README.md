
<h1 align="center"><img src="https://readme-typing-svg.demolab.com?font=Montserrat&size=36&pause=7000&color=6699FF&center=true&vCenter=true&random=false&width=420&lines=Intelify" alt="Intelify" /></h1>
<p align="center">This is the first Node.js project I ever wrote from scratch. The concept is an <a href="https://en.wikipedia.org/wiki/Open-source_intelligence">OSINT (Open Source Intelligence)</a> tool for looking up breached data by username, email, IP address. The data used in the demo is not inlcuded with Intelify. Therefore, you will have to obtain it yourself. If someone wants to pay me 4 figures for the data and intel, then I might consider it. I combined and parsed hundreds of breached databases into one MySQL table which resulted in multiple gigabytes in size. With proper column indexing and code optimization, a query takes no more than 10-20 milliseconds at average.</p>

<p align="center">I spent only 2 days doing this from scratch. With a mild motivation boost and some extra time I could’ve turned this into way much greater OSINT tool, than just simply a database lookup.</p>

<p align="center"><img src="https://img.shields.io/badge/stack-NodeJS-6cba4e" alt="NodeJS" /> <img src="https://img.shields.io/badge/database-MySQL-0e778f" alt="NodeJS" /> <img src="https://img.shields.io/badge/depends-discord.js-7589d2" alt="discord.js" /></p>
<br>
<br>
<br>
<h1 align="center">Demo</h1>
<p align="center"><a href="https://www.youtube.com/watch?v=xQX1TlZ1V6I"><img src="https://i.imgur.com/YVoSTpa.jpg" width="426" height="240" alt="Intelify Discord OSINT tool demo 2022-11-20" /></a></p>
<p align="center"><a href="https://www.youtube.com/watch?v=xQX1TlZ1V6I">&#x25b6;&#xfe0f; <strong>Watch on YouTube</strong></a></p>
<br>
<br>
<br>
<h1 align="center">Remarks</h1>
<ul>
	<li>If you haven’t played around with discord bots or API before. Then you might want to consider reading the Discord API introduction.</li>
	<li>You will need to enter the client and user ID of your bot in .env file, along with the credentials to your MySQL database. Please note that the username, password, and database must be Base64 encoded in the `.env` file.</li>
	<li>Do not forget to import the `structure.sql` in your MySQL database.</li>
</ul>
