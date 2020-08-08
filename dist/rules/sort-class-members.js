"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sortClassMembers = void 0;

var _schema = require("./schema");

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _createForOfIteratorHelper(o) { if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) { var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var it, normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var sortClassMembers = {
  getRule: function getRule() {
    var defaults = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    function sortClassMembersRule(context) {
      var options = context.options[0] || {};
      var stopAfterFirst = !!options.stopAfterFirstProblem;
      var accessorPairPositioning = options.accessorPairPositioning || 'getThenSet';
      var order = options.order || defaults.order || [];

      var groups = _objectSpread({}, builtInGroups, {}, defaults.groups, {}, options.groups);

      var orderedSlots = getExpectedOrder(order, groups);
      var groupAccessors = accessorPairPositioning !== 'any';
      var rules = {
        ClassDeclaration: function ClassDeclaration(node) {
          var members = getClassMemberInfos(node, context.getSourceCode(), orderedSlots); // check for out-of-order and separated get/set pairs

          var accessorPairProblems = findAccessorPairProblems(members, accessorPairPositioning);

          var _iterator = _createForOfIteratorHelper(accessorPairProblems),
              _step;

          try {
            for (_iterator.s(); !(_step = _iterator.n()).done;) {
              var problem = _step.value;
              var message = 'Expected {{ source }} to come immediately {{ expected }} {{ target }}.';
              reportProblem({
                problem: problem,
                context: context,
                message: message,
                stopAfterFirst: stopAfterFirst,
                problemCount: problemCount
              });

              if (stopAfterFirst) {
                break;
              }
            } // filter out the second accessor in each pair so we only detect one problem
            // for out-of-order	accessor pairs

          } catch (err) {
            _iterator.e(err);
          } finally {
            _iterator.f();
          }

          members = members.filter(function (m) {
            return !(m.matchingAccessor && !m.isFirstAccessor);
          }); // ignore members that don't match any slots

          members = members.filter(function (member) {
            return member.acceptableSlots.length;
          }); // check member positions against rule order

          var problems = findProblems(members);
          var problemCount = problems.length;

          var _iterator2 = _createForOfIteratorHelper(problems),
              _step2;

          try {
            for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
              var _problem = _step2.value;
              var _message = 'Expected {{ source }} to come {{ expected }} {{ target }}.';
              reportProblem({
                problem: _problem,
                message: _message,
                context: context,
                stopAfterFirst: stopAfterFirst,
                problemCount: problemCount,
                groupAccessors: groupAccessors
              });

              if (stopAfterFirst) {
                break;
              }
            }
          } catch (err) {
            _iterator2.e(err);
          } finally {
            _iterator2.f();
          }
        }
      };
      rules.ClassExpression = rules.ClassDeclaration;
      return rules;
    }

    sortClassMembersRule.schema = _schema.sortClassMembersSchema;
    sortClassMembersRule.fixable = 'code';
    return sortClassMembersRule;
  }
};
exports.sortClassMembers = sortClassMembers;

function reportProblem(_ref) {
  var problem = _ref.problem,
      message = _ref.message,
      context = _ref.context,
      stopAfterFirst = _ref.stopAfterFirst,
      problemCount = _ref.problemCount,
      groupAccessors = _ref.groupAccessors;
  var source = problem.source,
      target = problem.target,
      expected = problem.expected;
  var reportData = {
    source: getMemberDescription(source, {
      groupAccessors: groupAccessors
    }),
    target: getMemberDescription(target, {
      groupAccessors: groupAccessors
    }),
    expected: expected
  };

  if (stopAfterFirst && problemCount > 1) {
    message += ' ({{ more }} similar {{ problem }} in this class)';
    reportData.more = problemCount - 1;
    reportData.problem = problemCount === 2 ? 'problem' : 'problems';
  }

  context.report({
    node: source.node,
    message: message,
    data: reportData,
    fix: function fix(fixer) {
      var fixes = [];

      if (expected !== 'before') {
        return fixes; // after almost never occurs, and when it does it causes conflicts
      }

      var sourceCode = context.getSourceCode();
      var sourceAfterToken = sourceCode.getTokenAfter(source.node);
      var sourceJSDoc = sourceCode.getCommentsBefore(source.node).slice(-1).pop();
      var targetJSDoc = sourceCode.getCommentsBefore(target.node).slice(-1).pop();
      var decorators = target.node.decorators || [];
      var targetDecorator = decorators.slice(-1).pop() || {};
      var insertTargetNode = targetJSDoc || targetDecorator.node || target.node;
      var sourceText = [];

      if (sourceJSDoc) {
        fixes.push(fixer.remove(sourceJSDoc));
        sourceText.push("".concat(sourceCode.getText(sourceJSDoc)).concat(determineNodeSeperator(sourceJSDoc, source.node)));
      }

      fixes.push(fixer.remove(source.node));
      sourceText.push("".concat(sourceCode.getText(source.node)).concat(determineNodeSeperator(source.node, sourceAfterToken)));
      fixes.push(fixer.insertTextBefore(insertTargetNode, sourceText.join('')));
      return fixes;
    }
  });
}

function determineNodeSeperator(first, second) {
  return isTokenOnSameLine(first, second) ? ' ' : '\n';
}

function isTokenOnSameLine(left, right) {
  return left.loc.end.line === right.loc.start.line;
}

function getMemberDescription(member, _ref2) {
  var groupAccessors = _ref2.groupAccessors;

  if (member.kind === 'constructor') {
    return 'constructor';
  }

  var typeName;

  if (member.matchingAccessor && groupAccessors) {
    typeName = 'accessor pair';
  } else if (isAccessor(member)) {
    typeName = "".concat(member.kind, "ter");
  } else {
    typeName = member.type;
  }

  return "".concat(member["static"] ? 'static ' : '').concat(typeName, " ").concat(member.name);
}

function getClassMemberInfos(classDeclaration, sourceCode, orderedSlots) {
  var classMemberNodes = classDeclaration.body.body;
  var members = classMemberNodes.map(function (member, i) {
    return _objectSpread({}, getMemberInfo(member, sourceCode), {
      id: String(i)
    });
  }).map(function (memberInfo, i, memberInfos) {
    matchAccessorPairs(memberInfos);
    var acceptableSlots = getAcceptableSlots(memberInfo, orderedSlots);
    return _objectSpread({}, memberInfo, {
      acceptableSlots: acceptableSlots
    });
  });
  return members;
}

function getMemberInfo(node, sourceCode) {
  var name;
  var type;
  var propertyType;
  var async = false;
  var decorated = false;
  var decorators = [];

  if (node.type === 'ClassProperty') {
    type = 'property';

    var _sourceCode$getFirstT = sourceCode.getFirstTokens(node.key, 2),
        _sourceCode$getFirstT2 = _slicedToArray(_sourceCode$getFirstT, 2),
        first = _sourceCode$getFirstT2[0],
        second = _sourceCode$getFirstT2[1];

    name = second && second.type === 'Identifier' ? second.value : first.value;
    propertyType = node.value ? node.value.type : node.value;
    decorated = !!node.decorators;
    decorators = decorated && node.decorators.map(function (n) {
      return n.expression.name;
    });
  } else {
    name = node.key.name;
    type = 'method';
    async = node.value && node.value.async;
  }

  return {
    name: name,
    type: type,
    decorators: decorators,
    "static": node["static"],
    decorated: decorated,
    async: async,
    kind: node.kind,
    propertyType: propertyType,
    node: node
  };
}

function findAccessorPairProblems(members, positioning) {
  var problems = [];

  if (positioning === 'any') {
    return problems;
  }

  forEachPair(members, function (first, second, firstIndex, secondIndex) {
    if (first.matchingAccessor === second.id) {
      var outOfOrder = positioning === 'getThenSet' && first.kind !== 'get' || positioning === 'setThenGet' && first.kind !== 'set';
      var outOfPosition = secondIndex - firstIndex !== 1;

      if (outOfOrder || outOfPosition) {
        var expected = outOfOrder ? 'before' : 'after';
        problems.push({
          source: second,
          target: first,
          expected: expected
        });
      }
    }
  });
  return problems;
}

function findProblems(members) {
  var problems = [];
  forEachPair(members, function (first, second) {
    if (!areMembersInCorrectOrder(first, second)) {
      problems.push({
        source: second,
        target: first,
        expected: 'before'
      });
    }
  });
  return problems;
}

function forEachPair(list, callback) {
  list.forEach(function (first, firstIndex) {
    list.slice(firstIndex + 1).forEach(function (second, secondIndex) {
      callback(first, second, firstIndex, firstIndex + secondIndex + 1);
    });
  });
}

function areMembersInCorrectOrder(first, second) {
  return first.acceptableSlots.some(function (a) {
    return second.acceptableSlots.some(function (b) {
      return a.index === b.index && areSlotsAlphabeticallySorted(a, b) ? first.name.localeCompare(second.name) <= 0 : a.index <= b.index;
    });
  });
}

function areSlotsAlphabeticallySorted(a, b) {
  return a.sort === 'alphabetical' && b.sort === 'alphabetical';
}

function getAcceptableSlots(memberInfo, orderedSlots) {
  return orderedSlots.map(function (slot, index) {
    return {
      index: index,
      score: scoreMember(memberInfo, slot),
      sort: slot.sort
    };
  }) // check member against each slot
  .filter(function (_ref3) {
    var score = _ref3.score;
    return score > 0;
  }) // discard slots that don't match
  .sort(function (a, b) {
    return b.score - a.score;
  }) // sort best matching slots first
  .filter(function (_ref4, i, array) {
    var score = _ref4.score;
    return score === array[0].score;
  }) // take top scoring slots
  .sort(function (a, b) {
    return b.index - a.index;
  });
}

function scoreMember(memberInfo, slot) {
  if (!Object.keys(slot).length) {
    return 1; // default/everything-else slot
  }

  var scores = comparers.map(function (_ref5) {
    var property = _ref5.property,
        value = _ref5.value,
        test = _ref5.test;

    if (slot[property] !== undefined) {
      return test(memberInfo, slot) ? value : -1;
    }

    return 0;
  });

  if (scores.indexOf(-1) !== -1) {
    return -1;
  }

  return scores.reduce(function (a, b) {
    return a + b;
  });
}

function getExpectedOrder(order, groups) {
  return flatten(order.map(function (s) {
    return expandSlot(s, groups);
  }));
}

function expandSlot(input, groups) {
  if (Array.isArray(input)) {
    return input.map(function (x) {
      return expandSlot(x, groups);
    });
  }

  var slot;

  if (typeof input === 'string') {
    slot = input[0] === '[' // check for [groupName] shorthand
    ? {
      group: input.substr(1, input.length - 2)
    } : {
      name: input
    };
  } else {
    slot = _objectSpread({}, input);
  }

  if (slot.group) {
    if (groups.hasOwnProperty(slot.group)) {
      return expandSlot(groups[slot.group], groups);
    } // ignore undefined groups


    return [];
  }

  var testName = slot.name && getNameComparer(slot.name);

  if (testName) {
    slot.testName = testName;
  }

  return [slot];
}

function isAccessor(_ref6) {
  var kind = _ref6.kind;
  return kind === 'get' || kind === 'set';
}

function matchAccessorPairs(members) {
  forEachPair(members, function (first, second) {
    var isMatch = first.name === second.name && first["static"] === second["static"];

    if (isAccessor(first) && isAccessor(second) && isMatch) {
      first.isFirstAccessor = true;
      first.matchingAccessor = second.id;
      second.matchingAccessor = first.id;
    }
  });
}

function getNameComparer(name) {
  if (name[0] === '/') {
    var namePattern = name.substr(1, name.length - 2);

    if (namePattern[0] !== '^') {
      namePattern = "^".concat(namePattern);
    }

    if (namePattern[namePattern.length - 1] !== '$') {
      namePattern += '$';
    }

    var re = new RegExp(namePattern);
    return function (n) {
      return re.test(n);
    };
  }

  return function (n) {
    return n === name;
  };
}

function flatten(collection) {
  var result = [];

  var _iterator3 = _createForOfIteratorHelper(collection),
      _step3;

  try {
    for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
      var item = _step3.value;

      if (Array.isArray(item)) {
        result.push.apply(result, _toConsumableArray(flatten(item)));
      } else {
        result.push(item);
      }
    }
  } catch (err) {
    _iterator3.e(err);
  } finally {
    _iterator3.f();
  }

  return result;
}

var builtInGroups = {
  constructor: {
    name: 'constructor',
    type: 'method'
  },
  properties: {
    type: 'property'
  },
  getters: {
    kind: 'get'
  },
  setters: {
    kind: 'set'
  },
  'accessor-pairs': {
    accessorPair: true
  },
  'static-properties': {
    type: 'property',
    "static": true
  },
  'conventional-private-properties': {
    type: 'property',
    name: '/_.+/'
  },
  'arrow-function-properties': {
    propertyType: 'ArrowFunctionExpression'
  },
  methods: {
    type: 'method'
  },
  'static-methods': {
    type: 'method',
    "static": true
  },
  'async-methods': {
    type: 'method',
    async: true
  },
  'conventional-private-methods': {
    type: 'method',
    name: '/_.+/'
  },
  'everything-else': {}
};
var comparers = [{
  property: 'name',
  value: 100,
  test: function test(m, s) {
    return s.testName(m.name);
  }
}, {
  property: 'type',
  value: 10,
  test: function test(m, s) {
    return s.type === m.type;
  }
}, {
  property: 'static',
  value: 10,
  test: function test(m, s) {
    return s["static"] === m["static"];
  }
}, {
  property: 'async',
  value: 10,
  test: function test(m, s) {
    return s.async === m.async;
  }
}, {
  property: 'kind',
  value: 10,
  test: function test(m, s) {
    return s.kind === m.kind;
  }
}, {
  property: 'groupByDecorator',
  value: 10,
  test: function test(m, s) {
    return m.decorated && m.decorators.includes(s.groupByDecorator);
  }
}, {
  property: 'accessorPair',
  value: 20,
  test: function test(m, s) {
    return s.accessorPair && m.matchingAccessor || s.accessorPair === false && !m.matchingAccessor;
  }
}, {
  property: 'propertyType',
  value: 11,
  test: function test(m, s) {
    return m.type === 'property' && s.propertyType === m.propertyType;
  }
}];