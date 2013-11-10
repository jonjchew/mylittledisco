var Chat = {
  init: function() {
    Chat.wrapper = $('#chat-wrapper')

    Chat.bind()
  },

  bind: function() {
    Ws.channel.bind('new_user', Chat.printNewUserMessage)
    Ws.channel.bind('user_left', Chat.printUserLeftMessage)
  },

  printNewMessage: function(message) {
    Chat.wrapper.append('<li>' + message + '</li>')
  },

  printNewUserMessage: function(data) {
    Chat.printNewMessage(Chat.getNewUserMessage(data))
  },

  printUserLeftMessage: function(data) {
    Chat.printNewMessage(Chat.getUserLeftMessage(data))
  },

  getNewUserMessage: function(data) {
    return '<span class="user-name">' + data.user_name + '</span> joined the room';
  },

  getUserLeftMessage: function(data) {
    return '<span class="user-name">' + data.user_name + '</span> left the room';
  }
}
