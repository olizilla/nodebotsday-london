(function() {
  var Faux3d = function (tag, elements) {
    this.el = document.getElementsByTagName(tag)[0]

    this._mouseX = ~~(this.el.offsetWidth/2)
    this._mouseY = ~~(this.el.offsetHeight/2)

    document.addEventListener("mousemove", this._onMouseMove.bind(this, elements))
    document.addEventListener("resize", this._updateLayers.bind(this, elements))

    this._updateLayers(elements)
  }

  Faux3d.prototype._onMouseMove = function (elements, e) {
    this._mouseX = e.pageX < 0 ? 0 : e.pageX
    this._mouseY = e.pageY < 0 ? 0 : e.pageY

    return true
  }

  Faux3d.prototype._updateLayers = function (elements) {
    var backgroundImage = []
    var backgroundRepeat = []
    var backgroundPosition = []
    var backgroundSize = []

    var headerWidth = this.el.offsetWidth
    var numElements = elements.length
    var widthMultiplier = 0.2 / numElements

    elements.forEach(function (path, index) {
      var factor = (1 + ((numElements - index) * widthMultiplier))
      var offset = (headerWidth / 8) - this._mouseX
      offset *= factor - 1

      if (offset > 0) {
        offset = 0
      }

      backgroundImage.push('url("' + path + '")')
      backgroundRepeat.push('no-repeat')
      backgroundPosition.push(offset + 'px bottom')

      var size = headerWidth * factor

      backgroundSize.push(size + 'px')
    }.bind(this))

    backgroundImage.push('radial-gradient(#111, #323232)')
    backgroundPosition.push('center bottom')

    this.el.style.backgroundImage = backgroundImage.join(', ')
    this.el.style.backgroundRepeat = backgroundRepeat.join(', ')
    this.el.style.backgroundPosition = backgroundPosition.join(', ')
    this.el.style.backgroundSize = backgroundSize.join(', ')

    requestAnimationFrame(this._updateLayers.bind(this, elements))
  }

  var getNextMeetup = function (callback) {
    var httpRequest = new XMLHttpRequest()
    httpRequest.onreadystatechange = function () {
      if (httpRequest.readyState !== XMLHttpRequest.DONE) {
        return
      }

      try {
        callback(null, JSON.parse(httpRequest.responseText)[0])
      } catch (error) {
        return callback(error)
      }
    }
    // fuck you meetup api. https://github.com/meetup/api/issues/130
    httpRequest.open('GET', 'https://jsonp.afeld.me/?url=https://api.meetup.com/nodebots-of-london/events?photo-host=secure&sig_id=12125832&sig=283dcf3b6096023ffa68e7d7257714756fdc37b0', true)
    httpRequest.send(null)
  }

  new Faux3d('header', [
    'images/buildings_4.min.svg',
    'images/buildings_3.min.svg',
    'images/buildings_2.min.svg',
    'images/buildings_1.min.svg'
  ])

  var nextElement = document.getElementById('next-meetup')
  nextElement.innerHTML = '<h2>Next meetup</h2><p>Fetching details...</p>'

  var DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

  getNextMeetup(function (error, meetup) {
    var html = ['<h2>Next meetup</h2>']

    if (error) {
      html.push('<p>There was an error fetching the next meetup.</p>')
      html.push('<p>Please visit the <a href="http://www.meetup.com/NodeBots-of-London/">Meetup group</a> to see when it is!</p>')
    } else if (!meetup) {
      html.push('<p>NodeBots is usually on the last Sunday of the month but nothing is currently organised for this month.</p>')
      html.push('<p>See <a href="http://www.meetup.com/NodeBots-of-London/events/past">past meetups</a> or <a href="http://www.meetup.com/NodeBots-of-London/">join the Meetup group</a> to be notified when new meetups are posted!</p>')
    } else {
      var date = new Date(meetup.time)
      var venue = 'https://www.google.com/maps?q=' + meetup.venue.lat + '%20' + meetup.venue.lon + '&z=16&ll=' + meetup.venue.lat + ',' + meetup.venue.lon

      html.push('<p>The next NodeBots meetup is on ' + DAYS[date.getDay()] + ' ' + MONTHS[date.getMonth()] + ' ' + date.getDate() + ' at ' + date.getHours() + ':' + date.getMinutes() + ' ' + (date.getHours() < 12 ? 'AM' : 'PM') + '</p>')
      html.push('<p>' + meetup.venue.name + ', ' + meetup.venue.address_1 + ' - <a href="' + venue + '">Map</a></p>')

      if (meetup.yes_rsvp_count < meetup.rsvp_limit) {
        html.push('<p>There are ' + (meetup.rsvp_limit - meetup.yes_rsvp_count) + ' spaces left, <a href="' + meetup.link + '">sign up here!</a></p>')
      } else {
        html.push('<p>Sorry, there are no spaces left!</p>')
        html.push('<p><a href="http://www.meetup.com/NodeBots-of-London/">Join the meetup group</a> to find out about the next one.</p>')
      }
    }

    nextElement.innerHTML = html.join('')
  })
})()
