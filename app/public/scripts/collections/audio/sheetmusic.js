export function SheetMusic($pseudoCanvas) {
  var self = this;
  var VF = Vex.Flow;

  self.canvas = {
    element: $pseudoCanvas,
    height: parseFloat(window.getComputedStyle($pseudoCanvas, null).height, 10) || 250,
    width: parseFloat(window.getComputedStyle($pseudoCanvas, null).width, 10)
  };

  var maxWidth = self.canvas.width - 21;

  var renderer = new VF.Renderer(self.canvas.element, VF.Renderer.Backends.SVG);

  // Configure the rendering context.
  renderer.resize(self.canvas.width, self.canvas.height);
  var context = renderer.getContext();
  context.setFont("Arial", 10, "").setBackgroundFillStyle("#eed");

  var stave = new VF.Stave(10, 40, maxWidth);

  stave.addClef("treble").addTimeSignature("4/4");
  stave.setContext(context).draw();
}

export default { SheetMusic }
