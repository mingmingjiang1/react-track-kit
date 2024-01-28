// import template from '@babel/template';
// import types from '@babel/types';
const template = require('@babel/template');
const types = require('@babel/types');


/* 
  原事件名：埋点事件handler，埋点事件名
  track-params={{
    event: '',
    track: ['Handler', 'method'],
    params: {

    }
  }}
*/

              
let variableDeclaration;


const insertFunc = (placeholder) => `function report() {
  console.log('上报参数 =======>', test);

  customTrack(
    'ClickHandler',
    'confirm',
    {
      test,
    },
    {
      ${placeholder}
    }
  );
}`

const catchStatement = (placeholder) => { 
  return template.statement(insertFunc(placeholder))() 
};


const addNodeForFuncDec = (node, binding) => {
  // const lval = types.identifier('_key');
  // const variableDeclator = types.VariableDeclarator(lval, node?.params);

  // @chalk.green.bold(node.id);

  const addBody = catchStatement(node?.params.map(param => param?.name)?.join(',')).body;

  const func = types.functionDeclaration(
    node.id, // func name
    node?.params || [], // func params
    // types.blockStatement([types.BlockStatement([node.body].concat(addBody.body))]),
    types.blockStatement([variableDeclaration, ...node.body.body].concat(addBody.body)),
    false, // is Generator ?
    node.async // is Async ?
  );

  console.log(7777777778, node);

  binding.path.replaceWith(func);
};

const addNodeForFuncExpr = (node, binding) => {
  // const lval = types.identifier('_key');
  // const variableDeclator = types.VariableDeclarator(lval, node?.params);
  // @chalk.green.bold(node.id);

  const addBody = catchStatement(node?.params.map(param => param?.name)?.join(',')).body;

  const func = types.arrowFunctionExpression(
    node?.params || [],
    types.blockStatement([variableDeclaration, ...node.body.body].concat(addBody.body)),
    node?.async
  );

  console.log(7777777778, node);

  binding.path.get('init').replaceWith(func);
};

const addNodeForArrowFunc = (node, binding) => {

  const addBody = catchStatement(node?.params.map(param => param?.name)?.join(',')).body;

  // @chalk.green.bold(node.id, 'arrow function');

  const func = types.arrowFunctionExpression(
    node?.params || [],
    types.blockStatement([variableDeclaration, ...node.body.body].concat(addBody.body)),
    node?.async
  );

  console.log(7777777778, node);

  binding.path.get('init').replaceWith(func);
};

const addNodeForArrowFuncInline = (node, path) => {
  const addBody = catchStatement(node?.params.map(param => param?.name)?.join(',')).body;

  // @chalk.green.bold(node.name, 'inline arrow function');

  const func = types.arrowFunctionExpression(
    node?.params || [],
    types.blockStatement([variableDeclaration, node.body].concat(addBody.body)),
    node?.isAsync
  );

  node.body = types.blockStatement([...node.body.body].concat(addBody.body));
  node.id = '8888888';

  console.log(777777777, node);
  // inline special process
  // path.get('body').replaceWith(types.blockStatement([node.body].concat(addBody.body)));
};

/**
 *
 * @param {ast node} node node
 * @returns Is function ?
 */
const isFunction = (node, binding) => {
  if (!node) {
    return false;
  }

  types.isFunctionDeclaration(node) && addNodeForFuncDec(node, binding) && console.log('isFunctionDeclaration');
  types.isFunctionExpression(node) && addNodeForFuncExpr(node, binding) && console.log('isFunctionExpression');
  types.isArrowFunctionExpression(node) &&
    addNodeForArrowFunc(node, binding) &&
    console.log('isArrowFunctionExpression');

  return (
    types.isFunctionDeclaration(node) || // 函数声明: function name
    types.isFunctionExpression(node) || // 函数表达式 const name = function () {}
    types.isArrowFunctionExpression(node)
  ); // arrow func const name = () => {}
};

const isFunctionInLine = (node, binding) => {
  if (!node) {
    return false;
  }

  types.isArrowFunctionExpression(node) &&
    addNodeForArrowFuncInline(node, binding) &&
    console.log('isArrowFunctionExpression');

  return types.isArrowFunctionExpression(node); // arrow func const name = () => {}
};

const jsxEleAttrFilter = (jsxOpeningElement, path, names) => {
  return jsxOpeningElement.attributes?.filter(attr => {

    
    const _expr = attr?.value?.expression;

    console.log(555555, attr.name.name, names)
    
    if (!names?.includes(attr.name.name)) {
      return false
    }

    console.log(55555566666, names, _expr?.name)

    const tmp = isFunctionInLine(_expr, path);

    tmp && console.log('process++++++>');

    return !tmp;
  });
};

/**
 *
 * @param {作用内关联的表达式} binding
 */
const isBindFunction = binding => {
  // 初始化为函数表达式
  const initExpr = binding.path.node?.init;

  // 初始化为usecallback，获取第一个参数
  const useCallbackExpr = binding.path.node.init?.arguments?.[0];

  return (
    isFunction(initExpr, binding) || isFunction(useCallbackExpr, binding) || isFunction(binding.path.node, binding)
  );
};

const traversejsxEleAttr = (path, names) => {

  // 获取函数标签
  const _jsxOpeningElement = types.JSXOpeningElement(
    path.node.openingElement.name,
    path.node.openingElement.attributes
  );

  const nonFuncAttrs = jsxEleAttrFilter(_jsxOpeningElement, path, names);

  nonFuncAttrs?.forEach(attr => {
    const _expr = attr?.value?.expression;

    console.log(22222, names)

    // console.log(555555, _expr, path.scope.getBinding(_expr?.name))
    if (types.isIdentifier(_expr) && names?.includes(attr?.name.name)) {
      const currentBinding = path.scope.getBinding(_expr?.name);

      isBindFunction(currentBinding) && console.log('process======>', currentBinding, _expr?.name);
    }
  });
};

// A plugin is just a function
module.exports = function ({ types: t }) {
  return {
    // pre(state) {
    //   console.log(9999, state.state);
    //   // Object.entries(state.opts).forEach(([key, value]) => {
    //   //   console.log(key, value);
    //   //   // const js = import('./config');
    //   // })
    // },
    visitor: {
      // ObjectExpression(path, state) {
      //   let report, flag;

      //   for (const [key, value] of Object.entries(state.opts)) {
      //     const js = require('./config');
      //     report = js.t?.[key];
      //     // console.log(33333, report, key, js);
      //     if (report) {
      //       break;
      //     }
      //   }

      //   const objectProperties = path.node.properties;
      //   types.isObjectProperty();


      //   let catchStatement = template.statement(`var tmp = ${report.toString()}`)();

      //   // 然后从AST节点中获取函数体 作为catch里面的内容

      //   let catchBody = catchStatement.declarations[0].init.body;

      //   const property = types.objectProperty(
      //     types.identifier('handleSelect'),
      //     types.functionExpression(null, [], types.blockStatement([catchBody]))
      //   );

      //   objectProperties?.forEach(prop => {
      //     if ([prop?.key?.name, prop?.key?.value].includes('tea-handle-change')) {
      //       flag = true;
      //       console.log(path.node);
      //       path.node.properties.push(property);
      //     }

      //     if (flag && prop?.key?.name === 'widgetProps') {
      //       // console.log(3333333, prop.value)
      //       const widgetProps = prop.value.properties;
      //       widgetProps.push(property);
      //       // console.log(widgetProps[0].properties);
      //       flag = false;
      //     }
      //   });
      // },
      JSXElement(path, state) {

        const { node } = path;

        const ifAttr = node.openingElement.attributes.find(
          ({ type, name }) => type === 'JSXAttribute' && name.name === state.opts?.trackProp
        );

        /* 
        
          先拿到所有属性判断是否为函数
        */

        if (ifAttr) {
          // @chalk.green.bold(node.name, '寻找到待插入节点');
          // console.log('寻找到待插入节点 ======>', ifAttr.value.expression.properties);

          const res = ifAttr.value.expression.properties.map(prop => {
            
            const { value } = prop;
          

            if (value?.type === 'StringLiteral') {
              return value.value;
            } else if (value?.type === 'ArrayExpression') {
              return value.elements?.map(item => item?.value);
            } else if (value?.type === 'ObjectExpression') {
              const lval = types.identifier('test');
              
              variableDeclaration = types.variableDeclaration('const', [
                types.VariableDeclarator(lval, value),
              ]);

              // variableDeclator = types.VariableDeclarator(lval, value);


              return value.properties?.map(item => item?.value);
            }

            return prop.value;
          });

          console.log('accept params =====> ', res); // res[1], 

          traversejsxEleAttr(path, res?.[0] || []);
        }
      },
    },
  };
};
