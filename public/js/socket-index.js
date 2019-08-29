var socket = io();

var params = new URLSearchParams(window.location.search);

var listaSalas = $('#listaSalas')
var inputSala = $('#inputSala')


//socket para ver las salas 
socket.on('salasCreadas', (salas, callback)=> {
    console.log(salas);
    renderizarSalas(salas);
})

//functions
listaSalas.on('click', 'a', function(){
    inputSala.val($(this).text().trim())
})

//renders 
function renderizarSalas(salas){
    var html =""
    for (let i = 0; i < salas.length; i++) {
        html += `<a class="myRoom pointer">${salas[i]}</a><br>` 
    }

    if(salas.length < 1){
        html="No hay salas :C" 
    }

    listaSalas.html(html);
}

