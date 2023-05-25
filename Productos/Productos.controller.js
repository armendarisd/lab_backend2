import ProdModel from "./Productos.model.js";
import CatModel from "../Categorias de productos/Cat_Productos.model.js";
import { Verifytoken } from "../helper/generatetoken.js";
import mongoose from "mongoose";

// Mostrar todos los productos
export async function ProdAll() {
  const Prod = await ProdModel.aggregate([
    {
      $lookup: {
        from: "Categoria",
        localField: "Id_Categoria",
        foreignField: "_id",
        pipeline: [{ $project: { _id: 0, Nombre: 1 } }],
        as: "Categoria",
      },
    },
    { $unwind: "$Categoria" },
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
    { $project: { Id_Categoria: 0, createdAt: 0, updatedAt: 0, __v: 0 } },
  ]);
  return Prod;
}

// Mostrar productos de un usuario
export async function ProdUs(body) {
  const Prod = await buscprod(body._idus);
  return Prod;
}

// Mostrar productos de un usuario (token)
export async function ProdUsT(req) {
  const token = req.headers.authorization.split(" ").pop();
  const tokendata = await Verifytoken(token);
  const Prod = await buscprod(tokendata._id);
  return Prod;
}

// Mostrar producto individual
export async function ProdIn(body) {
  const Prod = await ProdModel.findById(body._id);
  console.log("se Mostro el productos individual");
  return Prod;
}

// Mostrar producto segun nombre
export async function ProdNom(body) {
  const Prod = await ProdModel.aggregate([
    { $match: { Nombre: body.ProdName } },
    {
      $lookup: {
        from: "Categoria",
        localField: "Id_Categoria",
        foreignField: "_id",
        pipeline: [{ $project: { _id: 0, Nombre: 1 } }],
        as: "Categoria",
      },
    },
    { $unwind: "$Categoria" },
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
    {
      $project: {
        _id: 0,
        Id_Categoria: 0,
        Id_Usuario: 0,
        createdAt: 0,
        updatedAt: 0,
        __v: 0,
      },
    },
  ]);
  return Prod;
}

// Mostrar producto segun categoria
export async function ProdCat(body) {
  const id_cat = await CatModel.findOne({ Nombre: body.CatName });
  /* otra opcion es recibir el id de la categoria directamente
    {id_Categoria:  mongoose.Types.ObjectId(body.Catid)}
    */
  const Prod = await ProdModel.aggregate([
    { $match: { Id_Categoria: mongoose.Types.ObjectId(id_cat._id) } },
    {
      $lookup: {
        from: "Categoria",
        localField: "Id_Categoria",
        foreignField: "_id",
        pipeline: [{ $project: { _id: 0, Nombre: 1 } }],
        as: "Categoria",
      },
    },
    { $unwind: "$Categoria" },
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
    {
      $project: {
        _id: 0,
        Id_Categoria: 0,
        Id_Usuario: 0,
        createdAt: 0,
        updatedAt: 0,
        __v: 0,
      },
    },
  ]);
  return Prod;
}

// Crear un producto
export async function CreateProduct(req) {
  const token = req.headers.authorization.split(" ").pop();
  const tokendata = await Verifytoken(token);
  const id_cat = await CatModel.find({ Nombre: req.body.CatName });
  const Prod = new ProdModel({
    Nombre: req.body.Nombre,
    Precio: req.body.Precio,
    Id_Categoria: id_cat[0]._id,
    Id_Usuario: tokendata._id,
  });
  await Prod.save();
  return "Producto creado con exito";
}

// Actualizar un Producto
export async function ActProd(req) {
  const token = req.headers.authorization.split(" ").pop();
  const tokendata = await Verifytoken(token);
  const id_cat = await CatModel.findOne({ Nombre: req.body.CatName });
  const Prod = await ProdModel.findOneAndUpdate({ _id: req.body._id, Id_Usuario: tokendata._id },
    {
      Nombre: req.body.Nombre,
      Precio: req.body.Precio,
      id_Categoria: id_cat ? id_cat._id : undefined,
    }
  );
  return "se actualizo el prodcuto";
}

// Borrar una Producto
export async function DelProd(req) {
  const token = req.headers.authorization.split(" ").pop();
  const tokendata = await Verifytoken(token);
  const Prod = await ProdModel.findOneAndDelete({
    _id: req.body._id,
    Id_Usuario: tokendata._id,
  });
  return "el producto fue borrado con exito";
}

// busqueda de producto por id_producto, segun usuario
async function buscprod(id) {
  const Prod = await ProdModel.aggregate([
    { $match: { Id_Usuario: mongoose.Types.ObjectId(id) } },
    {
      $lookup: {
        from: "Categoria",
        localField: "Id_Categoria",
        foreignField: "_id",
        pipeline: [{ $project: { _id: 0, Nombre: 1 } }],
        as: "Categoria",
      },
    },
    { $unwind: "$Categoria" },
    {
      $project: {
        _id: 0,
        Id_Categoria: 0,
        Id_Usuario: 0,
        createdAt: 0,
        updatedAt: 0,
        __v: 0,
      },
    },
  ]);
  return Prod;
}
