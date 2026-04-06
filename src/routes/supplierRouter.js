const express = require("express");
const {
	createSupplier,
	deleteSupplier,
	editSupplier,
	getAllSuppliers,
	getSupplierById,
} = require("../controller/supplierController.js");

const supplierRouter = express.Router();

supplierRouter.get("/", getAllSuppliers);
supplierRouter.get("/:id", getSupplierById);
supplierRouter.post("/", createSupplier);
supplierRouter.put("/:id", editSupplier);
supplierRouter.delete("/:id", deleteSupplier);

module.exports = supplierRouter;
