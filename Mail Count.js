// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: purple; icon-glyph: envelope;
function loadData() {
  let fm = FileManager.iCloud()
  let path = fm.joinPath(fm.documentsDirectory(), "mailcount.json")
  if (fm.fileExists(path)) {
    let data = fm.readString(path)
    return JSON.parse(data)
  } else {
    return {}
  }
}

function columnGraph(data, width, height, color) {
  const max = Math.max(...data)
  let context = new DrawContext()
  context.size = new Size(width, height)
  context.opaque = false
  const drawColumn = (value, index, data) => {
    let w = width / (2 * data.length - 1)
    let h = value / max * height
    let x = width - (index * 2 + 1) * w
    let y = height - h
    let rect = new Rect(x, y, w, h)
    context.fillRect(rect)
  }
  context.setFillColor(color)
  data.forEach(drawColumn)
  return context
}

function createWidget(data) {
  const bgColor = Color.dynamic(Color.white(), new Color("1C1C1E"))
  const fgColor = Color.dynamic(Color.black(), Color.white())
  let widget = new ListWidget()
  widget.backgroundColor = bgColor
  widget.setPadding(16, 16, 16, 8)

  let stack = widget.addStack()
  stack.centerAlignContent()
  let symbol = SFSymbol.named("envelope").image
  let image = stack.addImage(symbol)
  image.imageSize = new Size(32, 32)
  image.tintColor = Color.blue()
  stack.addSpacer(8)

  if (data) {
    const [key, val] = Object.entries(data)[0]
    const sum = Object.values(data).reduce((a,b)=>a+b)
    text = val.toLocaleString()
    txt2 = ` / ${sum.toLocaleString()}`
    let title = stack.addText(text)
    title.textColor = Color.blue()
    title.font = Font.mediumSystemFont(32)
    let total = stack.addText(txt2)
    total.textColor = Color.blue()
    total.textOpacity = 0.5
    total.font = Font.mediumSystemFont(16)
    widget.addSpacer()
    const values = Object.values(data)
    const busy = Object.keys(data).reduce((a, b) => data[a] > data[b] ? a : b)
    const max = Math.max(...values).toLocaleString()
    let scale = widget.addText(`${max} ▶︎`)
    scale.textColor = fgColor
    scale.font = Font.boldSystemFont(10)
    let graph = columnGraph(values, 230, 100, fgColor).getImage()
    widget.addImage(graph).tintColor = fgColor
    let subtitle = widget.addText(`28 days to ${key}`)
    subtitle.textColor = fgColor
    subtitle.font = Font.mediumSystemFont(10)
  } else {
    let title = stack.addText("N/A")
    title.textColor = fgColor
    title.font = Font.mediumSystemFont(32)
  }

  if (config.runsInWidget) {
    Script.setWidget(widget)
  } else if (config.runsInApp) {
    widget.presentSmall()
  }
}

let data = loadData()
createWidget(data)

Script.complete()
