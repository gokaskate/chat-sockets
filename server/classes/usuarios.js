class Usuarios {

    constructor(){
        this.personas = []
        this.salas = []

    }

    agregarPersona(id, nombre, sala){
        let persona = {id, nombre, sala}
        this.personas.push(persona)
        persona = this.getPersona(id)

       this.verificarUnicaSala(sala);

        return persona
    }

    verificarUnicaSala(sala){
        if(!this.salas.filter( s => s === sala)[0]){
            this.salas.push(sala)
        }
    }

    getSalas(){
        return this.salas
    }

    getPersona(id){
        let persona =  this.personas.filter(persona => persona.id === id)[0]
        return persona
    }

    getPersonas(){
        return this.personas
    }

    getPersonasPorSala(sala){
        return this.personas.filter( persona => persona.sala === sala)
    }

    borrarPersona(id){

        let personaBorrada = this.getPersona(id);
        this.personas = this.personas.filter(persona =>  persona.id !=id)
        this.borrarSala(personaBorrada.sala)
        return personaBorrada
    }

    borrarSala(sala){
        if(this.getPersonasPorSala(sala).length === 0 ){
            this.salas = this.salas.filter(s => s != sala )
        }
    }




}

module.exports ={
    Usuarios
}   