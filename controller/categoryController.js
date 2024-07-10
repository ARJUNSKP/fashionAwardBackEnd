const { Message } = require("twilio/lib/twiml/MessagingResponse");
const category = require("../models/category");

const newCategory = async (req, res) => {
  console.log(req.file);
  const imageFile = req.file;
  const { title } = req.body;

  const categoryData = await category.findOne({ title });
  if (categoryData) {
    return res
      .status(200)
      .json({ status: false, Message: "category is already registered" });
  } else {
    const newCategory = new category({
      title: title,
      image: imageFile?.path,
    });
    const catData = await newCategory.save();
    return res.status(200).json(catData);
  }
};

const deleteCategory = async (req, res) => {
  const { title } = req.body;
  if (!title) {
    return res.status(400).json("title is required");
  } else {
    const deleteCategoryData = await category.findOneAndDelete({ title });
    if (deleteCategoryData) {
      return res
        .status(200)
        .json(`${deleteCategoryData?.title} category is deleted`);
    } else {
      return res.status(400).json(`${title} category is not found`);
    }
  }
};

module.exports = {
  newCategory,
  deleteCategory,
};
