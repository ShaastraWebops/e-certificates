##Quick Setup
<ul>
	<li>First, install wkhtmltopdf from <a href="http://wkhtmltopdf.org/downloads.html">here</a>.</li>
        <li>Navigate to the server directory in our app using command-line.</li>
	<li>Run <kbd>npm install</kbd></li>
	<li>Rename your excel file to input.xls and place in the server/uploads directory</li>
	<li>Run <kbd>node initial.js</kbd> and wait for it to finish</li>
	<li>Now, if you run <kbd>node app.js</kbd>, the mails would be sent to the participants</li>
</ul>

##Note
<ul>
	<li>Your excel file should only be in .xls format</li>
	<li>Your excel file should contain name, lastName, email, college and event columns</li>
</ul>
