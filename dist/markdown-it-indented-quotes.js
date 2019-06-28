/*! markdown-it-indented-quotes 1.0.1  @license MIT */(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.markdownItIndentedQuotes = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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

},{}]},{},[1])(1)
});
