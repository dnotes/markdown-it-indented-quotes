/*! markdown-it-indented-quotes 1.0.1  @license MIT */(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.markdownItIndentedQuotes = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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

},{}]},{},[1])(1)
});
