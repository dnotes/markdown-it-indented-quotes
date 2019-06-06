'use strict'

function parseIndentedQuote(token, state) {
  let quotes = []
  token.content.split('\n\n').forEach(quoteContent => {
    let indent = 1
    if (quoteContent[0] === ' ') {
      const m = quoteContent.match(/^(\s+)/)
      if (m) {
        quoteContent = quoteContent.substr(m[0].length)
        indent = Math.floor(m[0].length / 4) + 1
      }
    }
    if (quoteContent.substr(-1) === '\n') {
      quoteContent = quoteContent.substr(0, quoteContent.length - 1)
    }
    let newToken = new state.Token('indentedquote', '', 0)
    newToken.content = quoteContent
    newToken.attrs = { indent }
    quotes.push(newToken)
  })
  return quotes
}

function addBlockquotes(state) {
  const tlen = state.tokens.length
  for (let i = tlen - 1; i >= 0; i--) {
    if (state.tokens[i].type === 'code_block') {
      let quotes = parseIndentedQuote(state.tokens[i], state)
      quotes.unshift(1)
      quotes.unshift(i)
      Array.prototype.splice.apply(state.tokens, quotes)
    }
  }
}

module.exports = function plugin(md) {
  md.renderer.rules.indentedquote = function (tokens, idx) {
    return '<blockquote' +
      (tokens[idx].attrs.indent > 1 ? ' class="indent-' + tokens[idx].attrs.indent + '"' : '') +
      '>' +
      tokens[idx].content + '</blockquote>\n'
  }

  md.core.ruler.push('indentedquote', addBlockquotes)
  return md
}
