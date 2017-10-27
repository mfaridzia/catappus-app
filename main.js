Pusher.logToConsole = true

var pusher = new Pusher('your key', {
	cluster: 'ap1',
	encrypted: true
})

var channel = pusher.subscribe('chat-channel')

var vi = new Vue({
	el: '#app',
	data: {
		url:'your endpoint',
		chats: [],
		username: '',
		chatInput: '',
		last_inserted_id: ''
	},
	methods: {
		sendMessage: function(e) {
			if(e.keyCode === 13 && !e.shiftKey) {
				e.preventDefault()

				if(this.chatInput == '' || this.chatInput.trim() == '') 
					return

				var date = new Date()
				var tempChatInput = this.chatInput
				var now = this.last_inserted_id = Date.now()

				this.chatInput = ''

				this.chats.push({
					id: now,
					username: this.username,
					message: tempChatInput,
					time: date.toLocaleString()
				})

				axios.post(this.url + '?method=sendMessage', {
					id: now,
					username: this.username,
					message: tempChatInput,
					time: date.toLocaleString()
				}).then(function(data) {
					console.log(data)
				})
			}
		}
	}
})

channel.bind('chat-event', function(data) {
	if(data.username != null && data.id != vi.last_inserted_id)
		vi.chats.push({
			id: data.id,
			username: data.username,
			message: data.message,
			time: data.time
		})
})