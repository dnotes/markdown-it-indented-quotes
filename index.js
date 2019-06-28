'use strict'

function code(state, startLine, endLine/*, silent*/) {
  var nextLine, last, token, match, content, indent = 0
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
  content  = state.getLines(startLine, last, 4 + state.blkIndent, true)
  match = content.match(/^ +/)
  if (match) {
    content = content.replace(/^ +/, '')
    if (match[0].length >= 4) {
      indent = 1 + Math.floor(match[0].length / 4)
    }
  }
  content = content.replace(/[\r\n]+$/g, '')

  token         = state.push('indented_quote_open', 'blockquote', 1)
  token.map     = [startLine, state.line]
  if (indent) {
    /* istanbul ignore next */
    // New tokens from state.push NEVER have attrs set--but just in case...
    if (!token.attrs) {
      token.attrs = []
    }
    token.attrs.push(['class', 'indent-' + indent])
  }

  token = state.push('inline', '', 0)
  token.content = content
  token.map      = [startLine, state.line]
  token.children = []
  token.map     = [startLine, state.line]

  token         = state.push('indented_quote_close', 'blockquote', -1)

  return true
}


module.exports = function plugin(md) {
  md.block.ruler.disable('code')
  md.block.ruler.before('code', 'code_', code)
  return md
}
