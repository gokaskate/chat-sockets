
var params = new URLSearchParams(window.location.search);

let nombre = params.get('nombre')
let sala = params.get('sala')

//Cambiar el nombre de la sala
$('#nombreSala').text(sala)

//referencias JQUERY 
let divUsers = $('#divUsuarios')
let f = $('#formEnviar')
let msn = $('#txtMensaje')
let chatBox = $('#divChatbox')

//renderizar mensajes
function renderizarMensajes(mensaje, yo) {

    var html = ""
    var fecha = new Date(mensaje.fecha)
    var hora = fecha.getHours() +":"+ fecha.getMinutes()
    let adminClass = 'info'
    if(mensaje.nombre === "Administrador"){
        adminClass = 'danger'
    }

    if (!yo){
        html+= `<li class="animated fade-in">`

        if(mensaje.nombre !== "Administrador") { 
        html+= `<div class="chat-img">
            <img src="assets/images/users/1.jpg" alt="user" />
            </div>`
        }

        html += `<div class="chat-content">
                <h5>${mensaje.nombre}</h5>
            <div class="box bg-light-${adminClass}">${mensaje.mensaje}</div>
            </div>
            <div class="chat-time">${hora}</div>
        </li>`;

    } else {
        html+= `<li class="reverse">
            <div class="chat-content">
                <h5>${mensaje.nombre}</h5>
                <div class="box bg-light-inverse">${mensaje.mensaje}</div>
            </div>
            <div class="chat-img">
                <img src="assets/images/users/5.jpg" alt="user" />
            </div>
            <div class="chat-time">${hora}</div>
            </li>`
    }

    
   

    chatBox.append(html)

}

function scrollBottom() {

    // selectors
    var newMessage = chatBox.children('li:last-child');

    // heights
    var clientHeight = chatBox.prop('clientHeight');
    var scrollTop = chatBox.prop('scrollTop');
    var scrollHeight = chatBox.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight() || 0;

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        chatBox.scrollTop(scrollHeight);
    }
}

//funcion para renderizar usuarios
function renderizarUsuarios(personas){

    var html = "";

    html += `<li>
        <a href="javascript:void(0)" class="active"> Chat de <span> ${params.get('sala')}</span></a>
    </li>`;

    let pics = 1;
    for (let i = 0; i < personas.length; i++) {
        html += `<li>
            <a data-id="${personas[i].id }" href="javascript:void(0)">
            <img 
                src="assets/images/users/${pics}.jpg" 
                alt="user-img" class="img-circle"> 
                <span> ${personas[i].nombre} <small class="text-success">online</small></span></a>
        </li>`
         pics++;
         pics = (pics > 8) ? pics = 1 : pics;
    }

    divUsers.html(html)

} 

//listeners
divUsers.on('click', 'a', function(){

    let id = $(this).data('id')

    if (id){
       console.log(id); 
    }

})

f.on('submit', function(e){
    e.preventDefault();
    if ( msn.val().trim().length === 0 )  return;
    
    //Enviar información
    socket.emit('crearMensaje', {
        nombre,
        mensaje: msn.val().trim(),
        sala
    }, function(resp) {
        renderizarMensajes(resp, true)
        msn.val("").focus()
        scrollBottom()
    });

    

})