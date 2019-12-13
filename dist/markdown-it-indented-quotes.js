/*! markdown-it-indented-quotes 3.0.0  @license MIT */(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.markdownItIndentedQuotes = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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

},{}]},{},[1])(1)
});
