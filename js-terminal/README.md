# js-terminal

Simple javascript terminal

[Live Demo](https://qawerz.github.io/frontend-trash/js-terminal)

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
![image](https://github.com/user-attachments/assets/a5bc5013-b478-464c-ae4b-0714f57589cd)


#### New commands
```js
term.commands.push([
'(name)',
function (args){
  --code--},
'(discription)'
])
```
