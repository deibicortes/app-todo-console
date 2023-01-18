const { guardarDB, leerDB } = require('./helpers/guardarArchivo');
const { inquirerMenu, pausa, leerInput, listadoTareasBorrar, confirmar, mostrarListadoCheckList } = require('./helpers/inquirer');
//const Tarea = require('./models/tarea');
const Tareas = require('./models/tareas');
//const { mostrarMenu, pausa } = require('./helpers/mensajes');
require('colors');

console.clear();

const main = async () => {

    let opt = '';
    const tareas = new Tareas();
    const tareasDB = leerDB();

    if (tareasDB) {
        tareas.cargarTareasFromArray(tareasDB);
    }
    
    do {
        
        opt = await inquirerMenu();
        
        switch (opt) {
            case '1': //Crear tarea
                const desc = await leerInput('Descripción:');
                tareas.crearTarea(desc);
                break;
        
            case '2': //Listar tareas
                tareas.listadoCompleto();
                break;
            
            case '3': //Listar tareas completadas
                tareas.listarPendientesCompletadas(true);
                break;
            
            case '4': //Listar tareas pendientes
                tareas.listarPendientesCompletadas(false);
                break;

            case '5': //Completar tareas
                const ids = await mostrarListadoCheckList(tareas.listadoArr);
                tareas.toggleCompletadas(ids);
                break;
            
            case '6': //Borrar tarea
                const id = await listadoTareasBorrar(tareas.listadoArr);
                if (id !== '0') {
                    const ok = await confirmar('Estas seguro?');
                    if (ok) {
                        tareas.borrarTarea(id);
                        console.log('Tarea borrada');
                    }    
                }
                
                break;

            case '0': //Salir
                break;
        }

        guardarDB(tareas.listadoArr);

        await pausa();

    } while (opt !== '0');
    

    //pausa();
}

main();