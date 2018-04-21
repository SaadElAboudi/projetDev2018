const app = {

	initialize: function() {
		document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
	},

	onDeviceReady: function() {
    phonon.options({
        navigator: {
            defaultPage: 'home',
            animatePages: true,
            enableBrowserBackButton: true,
            templateRootDirectory: './tpl'
        },
        i18n: null
    })
    const phononApp = phonon.navigator();

    phononApp.on({ page: 'home', preventClose: false, content: 'home.html', readyDelay: 1}, activity => {
      function subscribe() {
        const ul = document.querySelector('#users');
        ul.innerHTML = ""
        fetch("http://localhost:3000/users")
          .then(res => res.json())
          .then(json => {
            json.forEach(user => {
              const li = document.createElement('li')
              li.innerHTML = "<a href='#' data-id='" + user._id + "' class='pull-right icon icon-close delete'></a><a href='#!user/" + user._id + "' class='pull-right icon icon-edit'></a><span class='padded-list'>" + user.name + " (" + user.email + ")</span>"
              ul.appendChild(li)
            })
            document.querySelectorAll(".delete").on('tap', event => {
              event.preventDefault()
              let id = event.target.getAttribute("data-id")
              fetch("http://localhost:3000/users/" + id, {
                method: "DELETE",
              }).then(res => {
                subscribe()
              })
            })
          })
      }

      activity.onReady(() => {
        subscribe()
      })
    })
    phononApp.on({ page: 'user', preventClose: false, content: 'user.html', readyDelay: 1}, activity => {
      activity.id = null
      activity.onCreate(self => {
        document.querySelector('.primary').on('tap', () => {
          if (activity.id) {
            fetch("http://localhost:3000/users/" + activity.id, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                name: document.querySelector('#name').value,
                email: document.querySelector('#email').value,
                password: document.querySelector('#password').value

              })
            })
              .then(res => {
                activity.id = null
                phonon.navigator().changePage('home')
              })
          }
          else {
            fetch("http://localhost:3000/users/", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                name: document.querySelector('#name').value,
                email: document.querySelector('#email').value,
                password: document.querySelector('#password').value

              })
            })
            .then(res => {
              phonon.navigator().changePage('home')
            })
          }
        })
      })

      activity.onHashChanged(id => {
        activity.id = id
        if (!activity.id) {
          document.querySelector('#name').value = ""
          email: document.querySelector('#email').value = ""
          password: document.querySelector('#password').value = ""

        }
        else {
          fetch("http://localhost:3000/users/" + activity.id)
            .then(res => res.json())
      			.then(user => {
              document.querySelector('#name').value = user.name
              document.querySelector('#email').value = user.email
              document.querySelector('#password').value = user.password

            })
        }
	    })
    })
    phononApp.start()
    // phononApp.on({ page: 'home', preventClose: false, content: 'home.html', readyDelay: 1}, activity => {
    //   function loadFriends() {
    //     const ul = document.querySelector('#friends');
    //     ul.innerHTML = ""
    // 		fetch("http://localhost:3000/friends")
    // 			.then(res => res.json())
    // 			.then(json => {
    // 				json.forEach(friend => {
    // 					const li = document.createElement('li')
    //           li.innerHTML = "<a href='#' data-id='" + friend._id + "' class='pull-right icon icon-close delete'></a><a href='#!friend/" + friend._id + "' class='pull-right icon icon-edit'></a><span class='padded-list'>" + friend.name + " (" + friend.email + ")</span>"
    // 					ul.appendChild(li)
    // 				})
    //         document.querySelectorAll(".delete").on('tap', event => {
    //           event.preventDefault()
    //           let id = event.target.getAttribute("data-id")
    //           fetch("http://localhost:3000/friends/" + id, {
    //             method: "DELETE",
    //           }).then(res => {
    //             loadFriends()
    //           })
    //         })
    // 			})
    //   }
    //
    //   activity.onReady(() => {
    //     loadFriends()
    //   })
    // })

    // phononApp.on({ page: 'friend', preventClose: false, content: 'friend.html', readyDelay: 1}, activity => {
    //   activity.id = null
    //   activity.onCreate(self => {
    //     document.querySelector('.primary').on('tap', () => {
    //       if (activity.id) {
    //         fetch("http://localhost:3000/friends/" + activity.id, {
    //           method: "PUT",
    //           headers: { "Content-Type": "application/json" },
    //           body: JSON.stringify({
    //             name: document.querySelector('#name').value,
    //             email: document.querySelector('#email').value
    //           })
    //         })
    //           .then(res => {
    //             activity.id = null
    //             phonon.navigator().changePage('home')
    //           })
    //       }
    //       else {
    //         fetch("http://localhost:3000/friends/", {
    //           method: "POST",
    //           headers: { "Content-Type": "application/json" },
    //           body: JSON.stringify({
    //             name: document.querySelector('#name').value,
    //             email: document.querySelector('#email').value
    //           })
    //         })
    //         .then(res => {
    //           phonon.navigator().changePage('home')
    //         })
    //       }
    //     })
    //   })
    //
    //   activity.onHashChanged(id => {
    //     activity.id = id
    //     if (!activity.id) {
    //       document.querySelector('#name').value = ""
    //       email: document.querySelector('#email').value = ""
    //     }
    //     else {
    //       fetch("http://localhost:3000/friends/" + activity.id)
    //         .then(res => res.json())
    //   			.then(friend => {
    //           document.querySelector('#name').value = friend.name
    //           document.querySelector('#email').value = friend.email
    //         })
    //     }
	  //   })
    // })
    // phononApp.start()
	}
};

app.initialize();
