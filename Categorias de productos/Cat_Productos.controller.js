import CatModel from "./Cat_Productos.model.js";
import { Verifytoken } from "../helper/generatetoken.js";
import mongoose from "mongoose";

// obtener todas las categorias (y quien la creo)
export async function GetCat() {
  const Cat = await CatModel.aggregate([
    {
      $lookup: {
        from: "Usuarios",
        localField: "Id_Usuario",
        foreignField: "_id",
        pipeline: [{ $project: { _id: 0, Usuario: 1 } }],
        as: "Usuario",
      },
    },
    { $unwind: "$Usuario" },
    { $project: { Id_Usuario: 0, createdAt: 0, updatedAt: 0, __v: 0 } },
  ]);
  return Cat;
}

// obtener todas las categorias de los porductos de un usuario
export async function GetCatUs() {
  const token = req.headers.authorization.split(" ").pop();
  const tokendata = await Verifytoken(token);
  const Cat = await CatModel.find({Id_Usuario: mongoose.Types.ObjectId(tokendata._id)}, 'Nombre -_id')
  return Cat;
}

// crear una categoria
export async function CreatCat(req) {
  const token = req.headers.authorization.split(" ").pop();
  const tokendata = await Verifytoken(token);
  const Cat = new CatModel({
    Nombre: req.body.Cat,
    Id_Usuario: tokendata._id,
  });
  await Cat.save();
  return "Categoria creada con exito";
}

// Actualiza una categoria (token)
export async function ActCat(body) {
  const Cat = await CatModel.findByIdAndUpdate(
    { _id: body._id },
    { Nombre: body.Cat }
  ); // por id, actualiza nombre
  return "se actualizo la categoria";
}

// Borrar una categoria (token)
export async function DelCat(req) {
  const token = req.headers.authorization.split(" ").pop();
  const tokendata = await Verifytoken(token);
  const Cat = await CatModel.findOneAndDelete({
    Nombre: req.body.Cat,
    Id_Usuario: tokendata._id,
  }); // por nombre (unico)
  // const Catid = await CatModel.find({Nombre: body.Cat})
  // const Cat = await CatModel.findOneAndDelete({Nombre: Catid[0]._id, Id_Usuario: tokendata._id}) // por id
  return "La categoria fue borrada con exito";
}
