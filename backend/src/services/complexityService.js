const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');
const acorn = require('acorn');
const walk = require('acorn-walk');

// --- JavaScript / TypeScript complexity using acorn ---
function analyzeJavaScriptComplexity(code) {
  let ast;
  try {
    ast = acorn.parse(code, { ecmaVersion: 'latest', sourceType: 'module' });
  } catch (err) {
    return { cyclomaticComplexity: 0, functionCount: 0, classCount: 0, linesOfCode: code.split('\n').length };
  }

  let functionCount = 0;
  let classCount = 0;
  let complexity = 1;

  walk.simple(ast, {
    FunctionDeclaration() { functionCount++; },
    FunctionExpression() { functionCount++; },
    ArrowFunctionExpression() { functionCount++; },
    ClassDeclaration() { classCount++; },
    ClassExpression() { classCount++; },
    IfStatement() { complexity++; },
    ForStatement() { complexity++; },
    ForInStatement() { complexity++; },
    ForOfStatement() { complexity++; },
    WhileStatement() { complexity++; },
    DoWhileStatement() { complexity++; },
    ConditionalExpression() { complexity++; },
    LogicalExpression(node) {
      if (node.operator === '&&' || node.operator === '||') complexity++;
    },
    SwitchCase() { complexity++; },
    CatchClause() { complexity++; },
  });

  const linesOfCode = code.split('\n').filter((line) => line.trim().length > 0).length;

  return {
    cyclomaticComplexity: complexity,
    functionCount,
    classCount,
    linesOfCode,
  };
}

// --- Python complexity using Radon ---
function analyzePythonComplexity(code) {
  const tempDir = os.tmpdir();
  const tempFile = path.join(tempDir, `complexity_${Date.now()}.py`);
  fs.writeFileSync(tempFile, code);

  let functionCount = 0;
  let classCount = 0;
  let totalComplexity = 0;

  try {
    const output = execSync(`radon cc "${tempFile}" -j`, { encoding: 'utf-8' });
    const parsed = JSON.parse(output);
    const items = parsed[tempFile] || [];

    for (const item of items) {
      if (item.type === 'function' || item.type === 'method') functionCount++;
      if (item.type === 'class') classCount++;
      totalComplexity += item.complexity || 0;
    }
  } catch (err) {
    console.error('Radon execution error:', err.message);
  } finally {
    fs.unlinkSync(tempFile);
  }

  const linesOfCode = code.split('\n').filter((line) => line.trim().length > 0).length;

  return {
    cyclomaticComplexity: totalComplexity || 1,
    functionCount,
    classCount,
    linesOfCode,
  };
}

function analyzeComplexity(code, language) {
  const lang = language.toLowerCase();

  if (lang === 'javascript' || lang === 'typescript') {
    return analyzeJavaScriptComplexity(code);
  } else if (lang === 'python') {
    return analyzePythonComplexity(code);
  } else {
    const linesOfCode = code.split('\n').filter((line) => line.trim().length > 0).length;
    return { cyclomaticComplexity: 1, functionCount: 0, classCount: 0, linesOfCode };
  }
}

module.exports = { analyzeComplexity };