import { generateChatTitle, generateResponse } from "../services/ai.service.js";
import chatModel from "../models/chat.model.js";
import messageModel from "../models/message.model.js";

export const sendMessage = async (req, res) => {
  try {
    const { message, chat: chatId } = req.body;

    if (!message || message.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Message content is required",
      });
    }

    let title = null, chat = null

    if(!chatId){
      title = await generateChatTitle(message).catch(() => "New conversation");
      console.log("Generated Title:", title);
      
      chat = await chatModel.create({
        user: req.user.id,
        title,
      });
    }

    const useMessage = await messageModel.create({
      chat: chatId || chat._id,
      content: message,
      role: 'user'
    })

    const messages = await messageModel.find({chat: chatId || chat._id})
    
    const aiResponse = await generateResponse(messages);

    const aiMessage = await messageModel.create({
      chat: chatId || chat._id,
      content: aiResponse,
      role: "ai",
    });

    return res.status(201).json({
      success: true,
      title,
      chat,
      useMessage, 
      aiMessage,
    });
  } catch (error) {
    console.error("Unexpected error in sendMessage:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message || "Something went wrong",
    });
  }
};

export const getChats = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const chats = await chatModel.find({ user: userId })

    res.status(200).json({
      success: true,
      message: "Chats retrieved successfully",
      chats
    })

  } catch (error) {
    console.error("Unexpected error in getChats:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message || "Something went wrong",
    })
  }
}


export const getMessages = async (req, res) => {
  try {
    
    const { chatId } = req.params;
    const userId = req.user.id;

    const chat = await chatModel.findOne({
      _id: chatId,
      user: userId
    })

    if(!chat) return res.status(404).json({
      success: false,
      message: "Chat not found",
      error: "No chat found with the provided ID for this user"
    })

    const messages = await messageModel.find({ chat: chatId })

    res.status(200).json({
      success: true,
      message: "Messages retrieved successfully",
      messages
    })


  } catch (error) {
    console.error("Unexpected error in getMessages:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message || "Something went wrong",
    })
  }
}

export const deleteChat = async (req, res) => {
  try {
    
    const { chatId } = req.params;
    const userId = req.user.id;

    if(!chatId || chatId.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Chat ID is required",
      });
    }

    const chat = await chatModel.findOne({
      _id: chatId,
      user: userId
    })

    if(!chat) return res.status(404).json({
      success: false,
      message: "Chat not found",
      error: "No chat found with the provided ID for this user"
    })

    await messageModel.deleteMany({ chat: chatId })
    await chatModel.deleteOne({ _id: chatId })

    res.status(200).json({
      success: true,
      message: "Chat deleted successfully",
    })

  } catch (error) {
    console.error("Unexpected error in deleteChat:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message || "Something went wrong",
    })
  }
}