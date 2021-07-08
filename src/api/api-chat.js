import { api } from "./api";

export const apiChat = {
  createConversation: (book_id, list_user_ids) => {
    return api.post(`conversations`, { book_id, list_user_ids });
  },

  createSingleConversation: (customer_id, staff_id) => {
    return api.post(`single-conversations`, { customer_id, staff_id })
  },
  
  getConversation: (id) => {
    return api.get(`conversations/${id}`);
  },

  saveMessage: (params) => {
    return api.postFormData(`messages`, { ...params });
  },

  saveMessageSingle: (params) => {
    return api.postFormData(`single-messages`, { ...params });
  },
  

  conversationList: () => {
    //{"book_id":1,"content":"test merge rate - sroce","score":4.0,"type":1}
    return api.get(`user-conversation`);
  },

  userConversationList: () => {
    //{"book_id":1,"content":"test merge rate - sroce","score":4.0,"type":1}
    return api.get(`single-user-conversation`);
  },

  //update-read-datetime-conversations
  updateReadDatetimeConversation: (conversation_id) => {
    return api.post(`update-read-datetime-conversations`, { conversation_id });
  },

  
  updateReadDatetimeConversationSingle: (single_conversation_id) => {
    return api.post(`update-read-datetime-single-conversations`, { single_conversation_id });
  },

  //unread-conversation-message/{id}

  unreadConversationMessage: (conversation_id) => {
    return api.get(`unread-conversation-message/${conversation_id}`);
  },

  unreadSingleConversationMessage: (singleConversationId) => {
    return api.get(`unread-single-conversation-message/${singleConversationId}`);
  },

  

  getTotalUnread: () => {
    //total-unread-customer-message
    return api.get(`total-unread-customer-message`);
  },


  getTotalUnreadAll: () => {
    //total-unread-all-customer-message
    return api.get(`total-unread-all`);
  },
  

  outConversation: (conversation_id) => {
    //total-unread-customer-message
    return api.post(`out-conversation`, { conversation_id });
  },

  singleOutConversation: (single_conversation_id) => {
    //total-unread-customer-message
    return api.post(`out-single-conversation`, {
      single_conversation_id,
    });
  },
};
