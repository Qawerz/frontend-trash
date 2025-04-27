const $code = document.querySelectorAll('.code')
let codecount = 1
const $head = document.querySelector('head')

$head.innerHTML += `<style>.code{margin:0;padding:0;background-color:#fff;font-size:12px;font-family:"Consolas";border:1px solid #ddd;border-radius:5px}.code table{border-spacing:0}.code tr{padding:0;height:21px;width:100%}.code tr td{padding:0;margin:0;height:21px}.code tr td.td_code{width:100%;padding-left:8px;color:#000}.code tr td.td_code div{padding:0 8px;margin:0 0 0 -7px;font-family:"Consolas";white-space:pre}.code tr td.td_line{padding-left:35px;margin-bottom:5px;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;color:#acacac;background-color:#f7f7f7;border-right:1px solid #ddd;text-align:right}.code .code_header{background-color:#f7f7f7;display:flex;justify-content:space-between;align-items:center;height:24px;border:1px solid #ddd;padding:5px 8px;font-weight:400;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.code .code_header .left{font-size:10px}.code .code_header .left .data__type{overflow:visible !important;font-size:12px;padding:2px 6px;font-family:"segoe ui";background-color:#ddd;color:#000;border-radius:3px;border:0;border-bottom:2px solid #ccc}.code .code_header .btn{font-size:12px;padding:2px 6px;border-radius:3px;font-family:"segoe ui";background-color:#ddd;color:#000;border:0;border-bottom:2px solid #ccc;cursor:pointer}.code .code_header .btn:hover{color:#acacac}.code .str{color:#b84815}.code .func{color:#8f6626}.code .subf{color:#0080d1}.code .var{color:#7bdcfe}.code .comm{color:#adff2f}.code .quot{color:pink}.code .kwrd__1{color:blue}.code .kwrd__2{color:#f0f}.code .kwrd__3{color:#358cd6}.code .str span{color:#b84815;font-weight:normal}.code .comm span{color:#adff2f;font-weight:normal}.code[dark]{background-color:#252525;border:1px solid #333}.code[dark] .code_header{background-color:#2b2b2b;border:1px solid #333}.code[dark] .code_header .left{color:#ddd}.code[dark] .code_header .left .data__type{background-color:#222;color:#81b6de;border-bottom:0}.code[dark] .code_header .btn{background-color:#222;color:#81b6de;border-bottom:0}.code[dark] .code_header .btn:hover{color:#ddd}.code[dark] tr td.td_code{color:#ddd}.code[dark] tr td.td_line{color:#acacac;background-color:#2b2b2b;border-right:1px solid #333}.code[dark] tr:hover{background-color:#2b2b2b}.code[dark] .str{color:#ce8349}.code[dark] .func{color:#dcdc8b}.code[dark] .subf{color:#bb86b6}.code[dark] .var{color:#7bdcfe}.code[dark] .comm{color:#adff2f}.code[dark] .quot{color:orange}.code[dark] .kwrd__1{color:#358cd6}.code[dark] .kwrd__2{color:#bb86b6}.code[dark] .kwrd__3{color:#358cd6}.code[dark] .str span{color:#ce8349;font-weight:normal}.code[dark] .comm span{color:#adff2f;font-weight:normal}<style>`

$code.forEach(code_block=> {
    code_block.dataset.codeid=codecount;

    

    /// Code settings
    let syntax_flag = code_block.dataset.syntax || false
    const data_height = code_block.dataset.height 
    const data_type = code_block.dataset.type || "text"
    
    if(data_type === "text"){
        syntax_flag = false
    }
    code_block.style.height = data_height
    code_block.style.overflow = "auto"

    const code = code_block.innerHTML
    const coderows = code.split('\n')
    if (coderows[coderows.length-1]==''){
        coderows.pop()
    }
    if(coderows[0]==''){
        coderows.shift()
    }
    code_block.innerHTML = ''
    
    /// Code header
    const code_header = document.createElement('div')
    const code_weight = code.length * 0.00098
    code_header.classList.add('code_header')
    code_header.innerHTML =
    `
        <div class="left">
            <span class="data__type">${data_type}</span>
            ${code_weight.toFixed(2)} KB
        </div>
    <div class="right">
        <button class="btn" onclick="raw(${codecount})">raw</button>
        <button class="btn" onclick="copy(${codecount})">copy</button>
        <button class="btn" onclick="download(${codecount})">download</button>
    </div>
    `

    /// Code
    const table = document.createElement('table')
    coderows.forEach((code, index) =>{
        const tr = document.createElement('tr')
        const td_n = document.createElement('td')
        const td_c = document.createElement('td')
        td_n.classList.add('td_line')
        td_c.classList.add('td_code')
        td_n.innerHTML = `${index+1}.`
        if (code!=''){
            if (!syntax_flag){
                td_c.innerHTML = `<div>${code}</div>`    
            } else{
                td_c.innerHTML = `<div>${Syntax(code)}</div>`    
            }
        } else {
            td_c.innerHTML = `<div>&nbsp;</div>`    
        }
        tr.appendChild(td_n)
        tr.appendChild(td_c)
        table.appendChild(tr)

    })
    code_block.appendChild(code_header)
    code_block.appendChild(table)
    codecount++
})

function raw(index){
    const $codes = document.querySelectorAll(`.code`)
    const codesarr =[]
    $codes.forEach(code => codesarr.push(code))
    const code = codesarr.find(code => code.dataset.codeid == index)
    let raw_code = ``
    const table = code.querySelector('table').children
    const rcw = window.open("about:blank", "hello", "width=200,height=200")
    rcw.document.head.innerHTML = `<style>div{white-space: pre;}</style>`
    for (let i = 0; i < table.length; i++) {
        rcw.document.body.innerHTML += table[i].querySelectorAll('td')[1].innerHTML
    } 
}

function copy(index){
    const $codes = document.querySelectorAll(`.code`)
    const codesarr =[]
    $codes.forEach(code => codesarr.push(code))
    const code = codesarr.find(code => code.dataset.codeid == index)
    let raw_code = ``
    const table = code.querySelector('table').children
    for (let i = 0; i < table.length; i++) {
        if(table[i].querySelectorAll('td')[1].querySelector('div').innerHTML != "&nbsp;"){
            raw_code += table[i].querySelectorAll('td')[1].querySelector('div').innerText+"\n"
        } else raw_code += ' \n'
    }
    navigator.clipboard.writeText(raw_code)
}

function download(index){

    const $codes = document.querySelectorAll(`.code`)
    const codesarr =[]
    $codes.forEach(code => codesarr.push(code))
    const code = codesarr.find(code => code.dataset.codeid == index)
    let code_type = (code.dataset.type)?code.dataset.type : 'text'
    switch(code_type.toLowerCase()) {
        case 'text':
            code_type='txt'
            break
        case 'javascript':
            code_type='js'
            break
        case 'json':
            code_type='json'
            break
        case 'python':
            code_type='py'
            break
        case 'C++':
            code_type='cpp'
            break
        case 'html':
            code_type='html'
            break
        case 'css':
            code_type='html'
            break
        
    }
    let raw_code = ``
    const table = code.querySelector('table').children
    for (let i = 0; i < table.length; i++) {
        if(table[i].querySelectorAll('td')[1].querySelector('div').innerHTML != "&nbsp;"){
            raw_code += table[i].querySelectorAll('td')[1].querySelector('div').innerText+"\n"
        } else raw_code += ' \n'
    }

    let blob = new Blob([raw_code], {type: "text/plain"});
    let link = document.createElement("a");
    link.setAttribute("href", URL.createObjectURL(blob));
    link.setAttribute("download", `code.${code_type}`);
    link.click();
    link.remove()

}

function Syntax(code){

    return code

    .replace(/(var|function|const|let|for|in|def)([^a-z0-9\$_])/gi,
        '<span class="kwrd__1">$1</span>$2')
    .replace(/(return|if|while|breack|do|continue|switch|case|else|try|catch|import|from)([^a-z0-9\$_])/gi,
        '<span class="kwrd__2">$1</span>$2')
    .replace(/(typeof|new)([^a-z0-9\$_])/gi,
        '<span class="kwrd__3">$1</span>$2')
    .replace(/(\.)([\w]+)([\.;:+\-\!]|\s)/gi, '$1<span class="subf">$2</span>$3')
    // всякие скобочки
    .replace(/(\{|\}|\]|\[|\|)/gi,'<span class="quot">$1</span>')
    // строки
    .replace(/('.*?')/g,'<span class="str">$1</span>')
    
    // функции (когда после идентификатора идет скобка)
    .replace(/([a-z\_\$][a-z0-9_]*)\(/gi,'<span class="func">$1</span>(')
    // не люблю восьмизначные табы, пусть лучше будет 4 пробела
    .replace(/\t/g,'    ');
}

