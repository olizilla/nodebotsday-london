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

  new Faux3d('header', [
    'images/buildings_4.min.svg',
    'images/buildings_3.min.svg',
    'images/buildings_2.min.svg',
    'images/buildings_1.min.svg'
  ])
})()
