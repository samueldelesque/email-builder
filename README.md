#### DS EMAIL FRAMEWORK ####


This framework uses Node.js to compile html emails with inline styles. The basic template is based of http://zurb.com/ink/


To get started, install the email compiler module as follows:

* ```npm install ds-email-builder -g```
* You can then go into your project folder which should contain a source and dest directory
* run ```ds-email-builder source dest```
* `Note: You can use both relative and absolute paths.`
* The module now serves the templates on http://localhost:3000/emailpath.html as well as having the html written in the output dir.


*Writing the HTML*

Templates in the `/templates` directory should now show up in the browser at http://localhost:3729/

The rendered HTML is simply spit out in the browser - you can use the source to copy paste into MailChimp/Litmus or other testing platform.

The images should be hosted either on S3 or MailChimp host.

*Writing the CSS*
Since the styles are parsed inline, feel free to add LESS or SASS and include the output CSS like you would in regular HTML. Be mindful that not all css properties parse well in html emails.

