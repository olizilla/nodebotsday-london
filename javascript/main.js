(function() {
  // Detect if the browser is IE or not.
  // If it is not IE, we assume that the browser is NS.
  var IE = document.all?true:false

  // If NS -- that is, !IE -- then set up for mouse capture
  if (!IE) document.captureEvents(Event.MOUSEMOVE)

  var Faux3d = function (tag, elements) {
    this.el = document.getElementsByTagName(tag)[0]

    var x = ~~(this.el.offsetWidth/2)
    var y = ~~(this.el.offsetHeight/2)

    document.addEventListener("mousemove", this._onMouseMove.bind(this, elements))
    document.addEventListener("resize", this._updateLayers.bind(this, elements, x, y))

    this._updateLayers(elements, x, y)
  }

  Faux3d.prototype._onMouseMove = function (elements, e) {
    var x = 0
    var y = 0

    if (IE) {
      x = event.clientX + document.body.scrollLeft
      y = event.clientY + document.body.scrollTop
    } else {
      x = e.pageX
      y = e.pageY
    }

    x = x < 0 ? 0 : x
    y = y < 0 ? 0 : y

    this._updateLayers(elements, x, y)

    return true
  }

  Faux3d.prototype._updateLayers = function (elements, x, y) {
    console.info('updating layers', x, y)

    var backgroundImage = []
    var backgroundRepeat = []
    var backgroundPosition = []
    var backgroundSize = []

    var headerWidth = this.el.offsetWidth
    var numElements = elements.length
    var widthMultiplier = 0.2 / numElements

    elements.forEach(function (path, index) {
      var factor = (1 + ((numElements - index) * widthMultiplier))
      //var offset = (0.5 * headerWidth - x)
      //offset *= factor - 1

      var offset = (headerWidth / 8) - x
      offset *= factor - 1

      if (offset > 0) {
        offset = 0
      }

      backgroundImage.push('url("' + path + '")')
      backgroundRepeat.push('no-repeat')
      console.info('bottom ' + offset + 'px')
      backgroundPosition.push(offset + 'px bottom')

      var size = headerWidth * factor

      backgroundSize.push(size + 'px')
    })

    backgroundImage.push('radial-gradient(#111, #323232)')
    backgroundPosition.push('center bottom')

    this.el.style.backgroundImage = backgroundImage.join(', ')
    this.el.style.backgroundRepeat = backgroundRepeat.join(', ')
    this.el.style.backgroundPosition = backgroundPosition.join(', ')
    this.el.style.backgroundSize = backgroundSize.join(', ')
  }

  new Faux3d('header', [
    'images/buildings_4.min.svg',
    'images/buildings_3.min.svg',
    'images/buildings_2.min.svg',
    'images/buildings_1.min.svg'
  ])
})()
