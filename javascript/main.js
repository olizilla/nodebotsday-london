var n = {
  colours: [
  "springgreen", "yellow", "chartreuse", "cyan", "fuchsia"
  ],
  
  assignColour: function(node) {
    if(node.style) {
      node.style.backgroundColor = n.colours[Math.floor( Math.random() * n.colours.length )]
      node.style.color = n.colours[Math.floor( Math.random() * n.colours.length )]
    }
    
    for(var i = 0; i < node.childNodes.length; i++) {
      n.assignColour(node.childNodes[i])
    }
  },
  
  go: function() {
    setInterval(n.assignColour.bind(null, document.body), 100)
  }
}

var k = new Konami()
k.code = function() {
  n.go()
}
k.load()
