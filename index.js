'use strict'

function indented_quote(state, startLine, endLine/*, silent*/) {

  // If it's empty or not indented, it's not a quote
  if (state.isEmpty(startLine) || state.sCount[startLine] - state.blkIndent < 4) { return false }

  // Initialize variables
  let endQuote = startLine + 1,
      emptyLine = 0,
      token,
      blkIndentNew = state.sCount[startLine],
      blkIndentOld = state.blkIndent,
      parentTypeOld = state.parentType

  // Cycle through the succeeding lines to determine the end of the quote
  while (endQuote < endLine) {

    // IF the line is blank:
    if (state.isEmpty(endQuote)) {
      // IF the following line is also empty, it ends the blockquote
      if (state.isEmpty(endQuote + 1)) break
      // IF the following line is unindented, it ends the blockquote
      if (state.sCount[endQuote + 1] - state.blkIndent < 4) break
      // OTHERWISE, remember the line number in case the quote ends unexpectedly
      emptyLine = endQuote
    }

    // OTHERWISE, IF the line is unindented, this breaks the blockquote.
    else if (state.sCount[endQuote] - state.blkIndent < 4) {
      // IF there has been no empty line, then it's not a quote.
      if (!emptyLine) return false
      // OTHERWISE the quote ended at the last empty line
      endQuote = emptyLine
      break
    }

    // IF the line is NOT empty, set the block indent for the lower of the two
    // This allows for indented first lines of paragraphs
    else {
      blkIndentNew = Math.min(blkIndentNew, state.sCount[endQuote])
    }
    endQuote++
  }

  state.blkIndent = blkIndentNew
  state.parentType = 'blockquote'

  token = state.push('blockquote_open', 'blockquote', 1)
  token.markup = '    '
  token.map = [startLine, 0]

  state.md.block.tokenize(state, startLine, endQuote)

  token = state.push('blockquote_close', 'blockquote', -1)
  token.markup = '    '

  state.parentType = parentTypeOld
  state.blkIndent = blkIndentOld

  return true
}

module.exports = function plugin(md) {
  md.block.ruler.at('code', indented_quote)
  return md
}
