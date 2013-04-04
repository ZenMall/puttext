// Generated by CoffeeScript 1.6.1
/*
# (c) 2013 Instant Communication Ltd.
# under terms of ISC License
*/

(function(define) {
  return define(function() {
    var format, parsePlural, pluralRe;
    pluralRe = /^Plural-Forms:\s*nplurals\s*=\s*(\d+);\s*plural\s*=\s*([^a-zA-Z0-9\$]*([a-zA-Z0-9\$]+).+)$/m;
    parsePlural = function(header) {
      var expr, match, rv, varName;
      rv = {
        pluralNum: 2,
        isPlural: function(n) {
          return n !== 1;
        }
      };
      if (!header) {
        return rv;
      }
      match = header.match(pluralRe);
      if (!match) {
        return rv;
      }
      rv.pluralNum = parseInt(match[1]);
      expr = match[2];
      varName = match[3];
      try {
        rv.isPlural = eval("function(" + varName + ") { return " + expr + " }");
      } catch (e) {
        true;
      }
      return rv;
    };
    format = function(s, ctx) {
      return s.replace(/(^|.)\{([^\}]+)\}/g, function(match, prev, k) {
        if (prev === '\\') {
          return '{' + k + '}';
        }
        return prev + ctx[k];
      });
    };
    return function(messages) {
      var __;
      __ = function(msg1, msg2, num, ctx) {
        var text, trans;
        if (typeof msg2 === 'object' && num === void 0 && ctx === void 0) {
          ctx = msg2;
          msg2 = void 0;
        }
        if (!__.messages || !__.messages[msg1]) {
          if (num !== void 0 && __.plural(num)) {
            text = msg2;
          } else {
            text = msg1;
          }
        } else {
          trans = __.messages[msg1];
          if (msg2 === void 0 && num === void 0) {
            text = typeof trans === 'string' ? trans : trans[0];
          } else {
            if (num !== void 0 && typeof trans === 'string') {
              throw ("Plural number (" + num + ") provided for '" + msg1 + "', ") + ("but only singular translation exists: " + trans);
            }
            text = trans[__.plural(num)];
          }
        }
        if (ctx) {
          return format(text, ctx);
        }
        return text;
      };
      __.format = format;
      __.setMessages = function(messages) {
        var isPlural, pluralNum, _ref;
        __.messages = messages;
        _ref = parsePlural(messages != null ? messages[""] : void 0), pluralNum = _ref.pluralNum, isPlural = _ref.isPlural;
        __.pluralNum = pluralNum;
        return __.plural = isPlural;
      };
      __.setMessages(messages);
      return __;
    };
  });
})(typeof define !== 'undefined' ? define : function(factory) {
  return window.puttext = factory();
});
