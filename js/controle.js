console.log("Teste JS")

console.log(document.querySelectorAll('div.livro div.card img')[0])

let img=document.querySelectorAll('div.livro div.card img')[0]
let imgAll=document.querySelectorAll('div.livro div.card img')

img.getElementsByClassName.cursor="pointer"

/* img.onclick = function(){
    alert(this.src)
} */

console.log(imgAll.length)

for (i=0; i<imgAll.length; i++){
    imgAll[i].style.opacity="0.8"
}