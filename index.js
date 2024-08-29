import express from 'express';
import fs from 'fs';
import bodyParser from "body-parser"

const app = express();
app.use(bodyParser.json());

const readData = () => {
    try{
        const data = fs.readFileSync("./db.json");
        return JSON.parse(data);
    } catch (error){
        console.log(error);
    }
};

const writeData = (data) => {
    try{
        fs.writeFileSync("./db.json", JSON.stringify(data));
    } catch (error){
        console.log(error);
    }
}

// Prueba
app.get("/", (req, res) => {
    res.send("Mi primer API con Node js!");
});


// Leer todas las tareas.
app.get("/tasks", (req, res) => {
    const data = readData();
    res.json(data.tareas);
});

// Leer una tarea específica por su ID.
app.get("/tasks/:id", (req, res) => {
    const data = readData();
    const id = parseInt(req.params.id);
    const tarea = data.tareas.find((tarea) => tarea.id === id);
    res.json(tarea);
});

// Cantidad total de tareas.
app.get("/totalTask", (req, res) => {
    const data = readData();
    const totaltareas = data.tareas.length;
    res.json( { totalTareas: totaltareas } );
});

// Crear una nueva tarea.
app.post("/tasks", (req, res) => {
    const data = readData();
    const body = req.body;
    const newTask = {
        id: data.tareas.length + 1, 
        ...body,
    };
    data.tareas.push(newTask);
    writeData(data);
    res.json(newTask);
});

// Actualizar una tarea existente.
app.put("/tasks/:id", (req, res) => {
    const data = readData();
    const body = req.body;
    const id = parseInt(req.params.id);
    const taskIndex = data.tareas.findIndex((tarea) => tarea.id === id);
    data.tareas[taskIndex] = {
        ...data.tareas[taskIndex],
        ...body,
    };
    writeData(data);
    res.json({ message: "Task updated successfully"});
});

// Eliminar una tarea por su ID.
app.delete("/tasks/:id", (req, res) => {
    const data = readData();
    const id = parseInt(req.params.id);
    const taskIndex = data.tareas.findIndex((tarea) => tarea.id === id);
    data.tareas.splice(taskIndex, 1);
    writeData(data);
    res.json({ message: "Task deleted successfully"});
});

// Se le asigna al servidor un puerto para escuchar
app.listen(3000, () => {
    console.log("Server listening on port 3000");
});
