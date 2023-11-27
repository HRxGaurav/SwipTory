import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import Story from "../models/story.js";
dotenv.config();

const createStory = async (req, res) => {
  try {

    const token = req.header('Authorization');
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);


    const addedBy = decoded.userID;

    const { slides } = req.body;

    if (!slides || !addedBy) {
      return res.status(422).json({ error: "Please fill in all fields properly" });
    }

    const newStory = new Story({
      slides,
      addedBy,
    });

    await newStory.save();

    res.status(201).json({ message: "Story created successfully", story: newStory });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};


const getStoriesByCategory = async (req, res) => {

  try {
    const {  category, page, userId } = req.body;

    const pageSize = 4;
    const skip = (page - 1) * pageSize;

    // Fetch stories from the database based on the category with pagination
    const stories = await Story.aggregate([
      {
        $match: {
          'slides': {
            $elemMatch: { 'category': category }
          }
        }
      },
      {
        $project: {
          slides: {
            $filter: {
              input: '$slides',
              as: 'slide',
              cond: { $eq: ['$$slide.category', category] }
            }
          },
          likes: 1,
          bookmarks: 1,
          totalLikes: 1,
          addedBy: 1,
          createdAt: 1,
          updatedAt: 1,
          isEditable: { $eq: ['$addedBy', userId] } // Check if the story is editable by the current user
        }
      },
      {
        $sort: { createdAt: -1 } // Sort by most recent createdAt
      },
      {
        $skip: skip
      },
      {
        $limit: pageSize
      }
    ]);

    // Count all stories based on the category
    const totalStoriesCount = await Story.aggregate([
      {
        $match: {
          'slides': {
            $elemMatch: { 'category': category }
          }
        }
      },
      {
        $count: 'total'
      }
    ]);

    const remainStoriesCount = totalStoriesCount.length > 0 ? totalStoriesCount[0].total - (page * pageSize) : 0;

    if (stories.length === 0) {
      return res.status(404).json({ error: `No stories found for the category '${category}'` });
    }

    res.status(200).json({ message: 'Stories fetched successfully', stories, remainStoriesCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};


const getStoryById = async (req, res) => {

  try {
    const id = req.params.id;

    // Fetch the story from the database based on the provided ID
    const story = await Story.findById(id);

    if (!story) {
      return res.status(404).json({ error: 'Story not found' });
    }

    res.status(200).json({ message: 'Story fetched successfully', story });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};


const getMyStories = async (req, res) => {
  try {
    const token = req.header('Authorization');
    const { page } = req.body;

    const pageSize = 4;
    const skip = (page - 1) * pageSize;

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const userId = decoded.userID;

    // Fetch stories based on the user ID and apply sorting
    const stories = await Story.find({ addedBy: userId })
      .sort({ createdAt: -1 }) // Sort by latest created at
      .skip(skip)
      .limit(parseInt(pageSize));

    // Count all stories added by the user
    const remainStoriesCount = await Story.countDocuments({ addedBy: userId }) - page * 4;

    // Check if each story is editable
    const storiesWithEditability = stories.map(story => ({
      ...story._doc,
      isEditable: story.addedBy === userId,
    }));

    res.status(200).json({
      message: 'Stories fetched successfully',
      stories: storiesWithEditability,
      remainStoriesCount,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};


const editStory = async (req, res) => {
  try {
    const token = req.header('Authorization');
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const userId = decoded.userID;
    const { id, slides } = req.body;

    if (!id || !slides) {
      return res.status(422).json({ error: 'Please provide id and slides' });
    }

    // Find the existing story by ID
    const existingStory = await Story.findById(id);

    if (!existingStory) {
      return res.status(404).json({ error: 'Story not found' });
    }

    // Check if the user is the owner of the story
    if (existingStory.addedBy !== userId) {
      return res.status(403).json({ error: 'Unauthorized: You do not have permission to edit this story' });
    }

    // Update the story with new slides
    existingStory.slides = slides;

    // Save the updated story
    await existingStory.save();

    res.status(200).json({ message: 'Story updated successfully', story: existingStory });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

const updateLikeBookmark = async (req, res) => {
  try {
    const token = req.header('Authorization');
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const userId = decoded.userID;
    const { interactionType, storyId } = req.body; 

    // Fetch the story based on the provided ID
    const story = await Story.findById(storyId);

    if (!story) {
      return res.status(404).json({ error: 'Story not found' });
    }

    // Check if the user has already interacted with the story (like or bookmark)
    const hasInteracted = story[interactionType].includes(userId);

    // Toggle the interaction status
    if (hasInteracted) {
      // If already interacted, remove the user from the interaction array
      story[interactionType] = story[interactionType].filter(interactionUserId => interactionUserId !== userId);
    } else {
      // If not interacted, add the user to the interaction array
      story[interactionType].push(userId);
    }

    // Save the updated story
    await story.save();

    // Send the updated story data as a response
    res.status(200).json({ message: `${interactionType} status updated successfully`, story });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};


const getBookmarkedStories = async (req, res) => {
  try {
    const token = req.header('Authorization');
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const userId = decoded.userID;

    const { page } = req.body;
    const pageSize = 4;
    const skip = (page - 1) * pageSize;

    // Fetch bookmarked stories with pagination
    const stories = await Story.aggregate([
      {
        $match: {
          bookmarks: userId,
        }
      },
      {
        $project: {
          slides: 1,
          likes: 1,
          bookmarks: 1,
          totalLikes: 1,
          addedBy: 1,
          createdAt: 1,
          updatedAt: 1,
          isEditable: { $eq: ['$addedBy', userId] } // Check if the story is editable by the current user
        }
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $skip: skip,
      },
      {
        $limit: pageSize,
      },
    ]);

    // Count all bookmarked stories
    const totalBookmarkedStoriesCount = await Story.countDocuments({
      bookmarks: userId,
    });

    const remainStoriesCount = totalBookmarkedStoriesCount > 0 ? totalBookmarkedStoriesCount - (page * pageSize) : 0;

    res.status(200).json({
      message: 'Bookmarked stories fetched successfully',
      stories,
      remainStoriesCount,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};





export default { createStory, getStoriesByCategory, getStoryById, getMyStories, editStory, updateLikeBookmark, getBookmarkedStories };
