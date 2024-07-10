const candidates = require("../models/candidates");

const createCandidate = async (req, res) => {
  const { name, category, type, phoneNumber, email } = req.body;
  const imagefile = req.file;

  const candidate = await candidates.findOne({ name, email });
  if (candidate) {
    return res
      .status(400)
      .json({ status: false, message: "candidates already registered" });
  } else {
    const newCandidate = new candidates({
      name,
      category,
      type,
      image: imagefile?.path,
      phoneNumber,
      email,
      voteCount: 0,
    });
    const candidateData = await newCandidate.save();

    return res.status(200).json(candidateData);
  }
};

const deleteCandidate = async (req, res) => {
  const { email } = req.body;

  if (email) {
    return res.status(400).json("email is required");
  }

  const candidateData = await candidates.findOneAndDelete({ email });
  if (candidateData) {
    return res.status(200).json(`${candidateData?.name} candidate deleted`);
  } else {
    return res.status(400).json("candidate not found");
  }
};

module.exports = {
  createCandidate,
  deleteCandidate,
};
