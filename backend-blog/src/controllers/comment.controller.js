import { Comment } from "../model/comment.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createComment = asyncHandler(async (req, res) => {
  const { content } = req.body;
  const { id } = req.params;

  if (!content || !id) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide all required fields" });
  }

  try {
    const comment = await Comment.create({
      content,
      blogId: id,
      owner: req.user?._id,
    });

    const newComment = await Comment.findById(comment._id);

    if (!newComment) {
      return res.status(500).json({
        success: false,
        message: "some error while adding a comment in blog",
      });
    }

    res.status(200).json({
      newComment,
      message: "Comment added successfully",
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "some error while creating a comment" });
  }
});

const getComment = asyncHandler(async (req, res) => {
  const { blogId } = req.params;

  const comment = await Comment.find({ blogId })
    .populate({
      path: "owner",
      select: "username avatar _id",
    })
    .sort({ createdAt: -1 });

  if (!comment) {
    return res.status(400).json({
      message: "no comment found",
    });
  }

  return res.status(200).json({
    comment,
  });
});

const updateComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const { content } = req.body;

  if (!commentId || !content) {
    return res.status(400).json({
      success: false,
      message: "all fileds are required",
    });
  }

  try {
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(400).json({
        success: false,
        message: "no comment found",
      });
    }

    if (comment.owner.toString() !== req.user?.id.toString()) {
      return res.status(400).json({
        success: false,
        message: "only auther update this comment",
      });
    }

    const updatedComment = await Comment.findByIdAndUpdate(
      commentId,
      {
        content,
      },
      {
        new: true,
      }
    );

    if (!updatedComment) {
      return res.status(500).json({
        message: "error while update the blog",
      });
    }

    res.status(200).json({
      success: true,
      message: "comment updated successfully",
      updatedComment,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "some error while updating a comment" });
  }
});

const deleteComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  if (!commentId) {
    return res.status(400).json({
      message: "please provide id",
    });
  }
  try {
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(500).json({
        message: "comment not found",
      });
    }

    if (comment.owner.toString() !== req.user?._id.toString()) {
      return res.status(400).json({
        message: "only auther can delete this comment",
      });
    }

    await Comment.findByIdAndDelete(commentId);

    res.status(200).json({
      success: true,
      message: "comment deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "some error while deleting a comment",
    });
  }
});

export { createComment, getComment, updateComment, deleteComment };
