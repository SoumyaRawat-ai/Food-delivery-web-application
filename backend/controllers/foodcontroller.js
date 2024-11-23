import foodModel from "../models/foodModel.js";
import fs from "fs"
// Add food item
const addFood = async (req, res) => {
    try {
        console.log('Request File:', req.file); // Log to debug

        if (!req.file) {
            return res.status(400).json({ success: false, message: "No file uploaded" });
        }

        let image_filename = `${req.file.filename}`; // Corrected property name

        const food = new foodModel({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            category: req.body.category,
            image: image_filename // Ensure this is correctly set
        });

        console.log('Saving file to:', image_filename); // Log the filename

        await food.save();
        res.json({ success: true, message: "Food Added" });
    } catch (error) {
        console.error("Error adding food:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

//all food list
const listFood = async (req,res) => {
    try {
        const foods = await foodModel.find({});
        res.json({success:true,data:foods})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
    }
}

// remove food item
const removeFood = async (req,res) => {
    try {
        const food = await foodModel.findById(req.body.id);
        fs.unlink(`uploads/${food.image}`,()=>{}) 

        await foodModel.findByIdAndDelete(req.body.id);
        res.json({success:true,message:'Food Removed'})
    } catch (error) {
        console.log(error)
        res.json({success:false,message:"Error"})
    }
}
export { addFood,listFood,removeFood};
