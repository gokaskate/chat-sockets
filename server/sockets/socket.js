const { io } = require('../server');
const { Usuarios } = require('../classes/usuarios')
const { crearMensaje } = require('../utilidades/utilidades')

const usuarios = new Usuarios();

io.on('connection', (client) => {

    client.on('entrarChat', (data, callback) => {
        if(!data.nombre || !data.sala) return callback({err:true, mensage:"nombre/sala requeridos"});
        
        client.join(data.sala);

        let persona =  usuarios.agregarPersona( client.id, data.nombre, data.sala );

        client.broadcast.to(persona.sala).emit('crearMensaje', 
            crearMensaje(
                "Administrador", 
                `${persona.nombre} se unió al chat`
            ));

        client.broadcast.to(persona.sala).emit('listaPersona', usuarios.getPersonasPorSala(persona.sala));
        
        callback( usuarios.getPersonasPorSala(persona.sala))

        client.broadcast.emit('salasCreadas', usuarios.getSalas());

        
        
    })

    //recibir mensaje del cliente
    client.on('enviarMensaje', (data)=>{
        let persona = usuarios.getPersona(client.id)
        let mensaje = crearMensaje(persona.nombre, data.mensaje)
        client.broadcast.to(persona.sala).emit('enviarMensaje', mensaje)
    })

    client.on('crearMensaje', (data, callback)=>{
        let persona = usuarios.getPersona(client.id)
        let msn = crearMensaje(persona.nombre, data.mensaje )
        client.broadcast.to(persona.sala).emit('crearMensaje', msn)
        
        callback(msn)
    } )

    //recibir mensaje privado
    client.on('mensajePrivado', data => {
        //1ro saber quien mando el mensaje 
        let usuario = usuarios.getPersona(client.id)
        client.broadcast.to(data.para).emit('mensajePrivado', crearMensaje(usuario.nombre, data.mensaje ))
    })


    client.on('disconnect', () => {
        console.log('Usuario desconectado');
        let usuario = usuarios.getPersona( client.id );

        if (usuario) {
            usuarios.borrarPersona( client.id );
            client.broadcast.to(usuario.sala).emit('crearMensaje', 
                crearMensaje(
                    "Administrador", 
                    `${usuario.nombre} abandono el chat`
                ));
    
            client.broadcast.to(usuario.sala).emit('listaPersona', usuarios.getPersonasPorSala(usuario.sala) );
            client.broadcast.emit('salasCreadas', usuarios.getSalas()); 
        }
         

    });


    //sockets del index
    client.emit('salasCreadas', usuarios.getSalas());

});