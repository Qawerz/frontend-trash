# js-terminal
>[!IMPORTANT]
>Moved to [Qawerz/frontend-trash](https://github.com/Qawerz/frontend-trash/)

Simple javascript terminal

[Live Demo](https://qawerz.github.io/js-terminal/terminal.html)

#### Commands:
* help
* echo
* color
* alert
* time
* about
* cls

#### Installation
Put this code in to `<head>`
```html
<link rel="stylesheet" href="terminal.css">
<script defer src="terminal.js"></script>
```
Put this code in to `<body>`
```html
<span id="terminal">
  <span id="out">Simple JS Terminal<br>Terminal V1.0<br></span><br>
  <span id="prompt">$ </span><input autofocus="true" id="cmdinput" type="text"  onkeypress="keypress_handle(event, this)" />
</span>
```
![screenshot of sample](https://raw.githubusercontent.com/Qawerz/js-terminal/main/cmd.png)

#### New commands
```js
term.commands.push([
'(name)',
function (args){
  --code--},
'(discription)'
])
```
