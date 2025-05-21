import asyncHandler from "express-async-handler";
import Story from "../model/Story.js";

//@desc     Create story
//@route    POST /api/v1/stories
//@access   Public

export const createStoryCtrl = asyncHandler(async (req, res)=>{ 
    const { 
        title, 
        description, 
        location,
        phone, 
    } = req.body;

    //create the story
    const story = await Story.create({
        title, 
        description, 
        images: req.files.map(file => file.path),
        user: req.userAuthId, 
        phone,
        location,
    });

    //send response
    res.json({
        status: "success",
        message: "Story created successfully",
        story,
    });
});

//@desc     Get all stories
//@route    Get /api/v1/stories
//@access   Public 

export const getStoriesCtrl = asyncHandler(async (req, res) => {
  // Base query
  let storyQuery = Story.find().populate("user", "fullname");

  // Search filter
  if (req.query.title) {
    storyQuery = storyQuery.find({
      title: { $regex: req.query.title, $options: "i" },
    });
  }

  // Pagination setup
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Story.countDocuments();

  storyQuery = storyQuery.skip(startIndex).limit(limit);

  const pagination = {};
  if (endIndex < total) pagination.next = { page: page + 1, limit };
  if (startIndex > 0) pagination.prev = { page: page - 1, limit };

  // Fetch and format stories
  const storiesRaw = await storyQuery;
  const stories = storiesRaw.map((story) => ({
    _id: story._id,
    title: story.title,
    description: story.description,
    location: story.location,
    phone: story.phone,
    createdAt: story.createdAt,
    images: story.images,
    user: story.user, // includes { _id, fullname }
  }));

  res.json({
    status: "success",
    total,
    results: stories.length,
    pagination,
    message: "Stories fetched successfully",
    stories,
  });
});


//@desc     Get single story
//@route    Get /api/v1/story/:id
//@access   Public

export const getStoryCtrl = asyncHandler(async(req, res)=>{
    const story = await Story.findById(req.params.id);
    if (!story) {
        throw new Error("Story not found");
    }
    res.json({
        status: "success",
        message: "Story fetched successfully",
        story,
    });
});

// GET /stories/my-stories

export const getMyStoriesCtrl = asyncHandler(async (req, res) => {
  const userId = req.userAuthId;
  const myStories = await Story.find({ user: userId }).sort({ createdAt: -1 });
  res.json({ stories: myStories });
});


//@desc     Delete story
//@route    DELETE /api/v1/stories/:id/delete
//@access   Public

export const deleteStoryCtrl = asyncHandler(async(req, res)=>{
    const story = await Story.findByIdAndDelete(req.params.id);  
    res.json({
        status: "success",
        message: "Story deleted successfully",
        story,
    });
});
