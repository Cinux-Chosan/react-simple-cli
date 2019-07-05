const types = require('@babel/types')
const def = require('@babel/types/lib/definitions/utils')
const generator = require('@babel/generator').default
const defineType = def.default

defineType("JmemberExpression", {
    builder: ["object", "property", "computed"],
    visitor: ["object", "property"],
    aliases: ["Expression", "LVal"],
    fields: {
        object: {
            validate: def.assertNodeType("Expression")
        },
        property: {
            validate(node, key, val) {
                let expectedType = node.computed ? "Expression" : "Identifier";
                def.assertNodeType(expectedType)(node, key, val);
            }
        },
        computed: {
            default: false
        }
    }
});

defineType("BinaryExpression", {
    builder: ["operator", "left", "right"],
    fields: {
      operator: {
        validate: def.assertValueType("string")
      },
      left: {
        validate: def.assertNodeType("Expression")
      },
      right: {
        validate: def.assertNodeType("Expression")
      }
    },
    visitor: ["left", "right"],
    aliases: ["Binary", "Expression"]
  });

const t2 = types.binaryExpression("*", types.identifier("a"), types.identifier("b"));

console.log(generator(t2))
const t = types.jmemberExpression(
    types.identifier('a'),
    types.identifier('b')
)

console.log(t.code())