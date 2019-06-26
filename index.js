'use strict'

function code(state, startLine, endLine/*, silent*/) {
  var nextLine, last, token, match
  if (state.sCount[startLine] - state.blkIndent < 4) { return false }
  last = nextLine = startLine + 1
  while (nextLine < endLine) {
    if (state.sCount[nextLine] - state.blkIndent >= 4) {
      nextLine++
      last = nextLine
      continue
    }
    break
  }
  state.line = last
  token         = state.push('indented_quote', 'blockquote', 0)
  token.content = state.getLines(startLine, last, 4 + state.blkIndent, true)
  match = token.content.match(/^ +/)
  if (match) {
    token.content = token.content.replace(/^ +/, '')
    if (match[0].length >= 4) {
      if (!token.attrs) token.attrs = {}
      token.attrs.indent = 1 + Math.floor(match[0].length / 4)
    }
  }
  token.map     = [startLine, state.line]

  return true
}


module.exports = function plugin(md) {
  md.renderer.rules.indented_quote = function (tokens, idx) {
    return '<blockquote' +
      (tokens[idx].attrs && tokens[idx].attrs.indent > 1 ? ' class="indent-' + tokens[idx].attrs.indent + '"' : '') +
      '>' +
      tokens[idx].content.replace(/[\r\n]+$/g, '') + '</blockquote>\n'
  }


  md.block.ruler.disable('code')
  md.block.ruler.before('code', 'code_', code)
  return md
}
