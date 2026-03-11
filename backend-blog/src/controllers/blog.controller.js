import { Blog } from "../model/blog.model.js";
import { User } from "../model/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { formatDistanceToNow } from "date-fns";
import {
  deleteFileOnCloudinary,
  fileUploadOnCloudinary,
} from "../utils/fileupload.js";

const uploadBlog = asyncHandler(async (req, res) => {
  const { title, description, category } = req.body;

  if (!title || !description || !category) {
    return res
      .status(400)
      .json({ error: "Title and description and category are required" });
  }

  const imagePath = req.file?.path;

  if (!imagePath) {
    return res.status(400).json({ error: "Image file is required" });
  }

  try {
    const uploadedImage = await fileUploadOnCloudinary(imagePath);
    if (!uploadedImage || !uploadedImage.url) {
      throw new Error("Error uploading image to Cloudinary");
    }

    const newBlog = await Blog.create({
      title,
      description,
      category,
      image: uploadedImage.url,
      owner: req.user?._id,
    });

    if (!newBlog) {
      throw new Error("Error creating new blog post");
    }

    await User.findByIdAndUpdate(req.user._id, {
      $push: { posts: newBlog },
    });


    const createdBlog = await Blog.findById(newBlog._id);

    if (!createdBlog) {
      throw new Error("Error retrieving created blog post");
    }

    return res.status(201).json({
      message: "Blog uploaded successfully",
      createdBlog,
    });
  } catch (error) {
    console.error("Error uploading the blog:", error);
    return res.status(500).json({ error: "Error uploading the blog" });
  }
});

const getAllBlog = asyncHandler(async (req, res) => {
  const blogs = await Blog.find({})
    .populate({
      path: "owner",
      select: "-password -refreshToken",
    })
    .sort({ createdAt: -1 });
  if (blogs) {
    const blogsWithTimeAgo = blogs.map((blog) => ({
      ...blog.toObject(),
      formattedTimeAgo: formatDistanceToNow(new Date(blog.createdAt), {
        addSuffix: true,
      }),
    }));
    res.status(200).json(blogsWithTimeAgo);
  } else {
    res.status(400);
    throw new Error("No blogs found");
  }
});

const getOwnerBlog = asyncHandler(async (req, res) => {
  try {
    const { username } = req.params;
    // console.log(username);

    const user = await User.findOne({ username });

    const blog = await Blog.find({ owner: user._id }).populate({
      path: "owner",
      select: "-password -refreshToken",
    });
    if (blog) {
      res.status(200).json(blog);
    }
  } catch (error) {
    throw new Error("Owner post cannot fatched");
  }
});

const getBlogById = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    const blog = await Blog.findById(id).populate({
      path: "owner",
      select: "-password -refreshToken",
    });

    if (blog) {
      res.status(200).json(blog);
    } else {
      res.status(404).json({ message: "Blog not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Owner post cannot be fetched" });
  }
});

const updateBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, description, category } = req.body;

  // Validation
  // if (!title || !description || !category) {
  //   throw new Error("All fields are required");
  // }

  const author = req.user?._id;

  // Find the blog post by ID
  const blog = await Blog.findById(id);
  if (!blog) {
    throw new Error("Blog not found");
  }

  if (blog.owner.toString() !== author.toString()) {
    throw new Error("Only the author can update this blog");
  }

  // Check if image path exists
  // const imagePath = req.files?.image[0]?.path;
  // if (!imagePath) {
  //   throw new Error("Image not found");
  // }

  // Upload image to Cloudinary
  try {
    // const imagePath_public_id = blog.image.split("/").pop().split(".")[0];
    // await deleteFileOnCloudinary(imagePath_public_id);
    // const updatedImage = await fileUploadOnCloudinary(imagePath);

    // if (!updatedImage || !updatedImage.url) {
    //   throw new Error("Error while updating image");
    // }
    // Update the blog post with the new image URL
    const updatedBlog = await Blog.findByIdAndUpdate(
      id,
      {
        title,
        description,
        // image: updatedImage.url || image,
        category,
        owner: author,
      },
      { new: true }
    );
    if (!updatedBlog) {
      throw new Error("Error while updating the blog");
    }
    res.status(200).json(updatedBlog);
  } catch (error) {
    console.error("Error while updating blog:", error);
    throw new Error("Error while updating blog");
  }
});

const deleteBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  // console.log(id);

  // Find the blog post by ID
  const blog = await Blog.findById(id);

  if (!blog) {
    return res.status(404).json({ error: "Blog not found" });
  }

  // Check if the user is the owner of the blog
  if (blog.owner.toString() !== req.user._id.toString()) {
    return res
      .status(403)
      .json({ error: "Only the owner can delete this blog" });
  }

  try {
    // Delete the blog from the database
    await Blog.findByIdAndDelete(id);

    // Remove blog reference from user
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { posts: id },
    });
    // Delete the image from Cloudinary
    const imagePublicId = blog.image.split("/").pop().split(".")[0];
    await deleteFileOnCloudinary(imagePublicId);

    res.status(200).json({ message: "Blog deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting blog" });
  }
});

export {
  uploadBlog,
  getAllBlog,
  getOwnerBlog,
  updateBlog,
  deleteBlog,
  getBlogById,
};
