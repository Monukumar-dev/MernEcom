const Banner = require("../models/Banner");

// ✅ Create Banner
exports.createBanner = async (req, res) => {
  try {
    const { title } = req.body;
    //const imageUrl = `/uploads/${req.file.filename}`;
    const imageUrl = req.files?.image ? `/uploads/${req.files.image[0].filename}` : undefined;

    const newBanner = new Banner({ title, imageUrl });
    await newBanner.save();

    res.status(201).json({ message: "Banner created successfully!", banner: newBanner });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get All Banners
exports.getAllBanners = async (req, res) => {
  try {
    const banners = await Banner.find();
    res.json(banners);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Update Banner
exports.updateBanner = async (req, res) => {
  try {
    const { title } = req.body;
    const updateData = { title };
    //if (req.file) updateData.imageUrl = `/uploads/${req.file.filename}`;
    if (req.files?.image) {
      updateData.imageUrl = `/uploads/${req.files.image[0].filename}`;
    }

    const updatedBanner = await Banner.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json({ message: "Banner updated successfully!", banner: updatedBanner });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Delete Banner
exports.deleteBanner = async (req, res) => {
  try {
    await Banner.findByIdAndDelete(req.params.id);
    res.json({ message: "Banner deleted successfully!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Toggle Active/Inactive
exports.toggleBannerStatus = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (!banner) return res.status(404).json({ message: "Banner not found" });

    banner.isActive = !banner.isActive;
    await banner.save();
    res.json({ message: `Banner ${banner.isActive ? "Activated" : "Deactivated"}` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
