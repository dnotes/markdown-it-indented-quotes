'use strict'

function indented_quote(state, startLine, endLine/*, silent*/) {

  // If it's not indented, it's not a quote
  if (state.sCount[startLine] - state.blkIndent < 4) { return false }

  // Initialize variables
  let endQuote,
      indent,
      blkIndentNew = state.sCount[startLine] - state.blkIndent,
      blkIndentOld = state.blkIndent,
      tokenCount = state.tokens.length

  endQuote = startLine + 1
  while (endQuote < endLine) {
    if (state.sCount[endQuote] - state.blkIndent < 4 || state.isEmpty(endQuote)) {
      break
    }
    blkIndentNew = Math.min(blkIndentNew, state.sCount[endQuote] - state.blkIndent)
    endQuote++
  }

  // Indented quotes connected to a paragraph are part of the paragraph
  if (!state.isEmpty(endQuote)) {
    return false
  }

  state.blkIndent = blkIndentNew
  state.md.block.tokenize(state, startLine, endQuote)
  indent = ~~(state.blkIndent / 4) // eslint-disable-line
  for (; tokenCount < state.tokens.length; tokenCount++) {
    /* istanbul-ignore-if */
    if ((state.tokens[tokenCount].meta === null ||
        /* istanbul ignore next */ state.tokens[tokenCount].meta.indent === 'undefined') && // eslint-disable-line
        ['paragraph_open', 'fence'].indexOf(state.tokens[tokenCount].type) > -1) {
      state.tokens[tokenCount].attrPush(['class', 'indent-' + indent])
      state.tokens[tokenCount].meta = Object.assign({}, state.tokens[tokenCount].meta, { indent: indent })
    }
  }
  state.blkIndent = blkIndentOld

  return true
}

module.exports = function plugin(md) {
  md.block.ruler.at('code', indented_quote)
  return md
}
