#### DS EMAIL FRAMEWORK ####


This framework uses Node.js to compile html emails with inline styles. The basic template is based of http://zurb.com/ink/


To get started, run the following from /email-templates:

* ```npm update```
* ```node index.js```


*Writing the HTML*
Templates in the `/templates` directory should now show up in the browser at http://localhost:3000/

The rendered HTML is simply spit out in the browser - you can use the source to copy paste into MailChimp/Litmus or other testing platform.

The images should be hosted either on S3 or MailChimp host.

*Writing the CSS*
Since the styles are parsed inline, feel free to add LESS or SASS and include the output CSS like you would in regular HTML. Be mindful that not all css properties parse well in html emails.




/node_module
/src
	/index.email


/src
	/index.html



render:

emailrender src dest 