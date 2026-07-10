const fs = require('fs');
const path = require('path');
const os = require('os');
const { execSync } = require('child_process');
const { ESLint } = require('eslint');

// Analyze JavaScript/TypeScript code using ESLint
async function analyzeJavaScript(code) {
  const eslint = new ESLint({
    overrideConfigFile: path.join(__dirname, '../../eslint.analysis.config.js'),
  });

  const results = await eslint.lintText(code);
  const issues = [];

  for (const result of results) {
    for (const msg of result.messages) {
      issues.push({
        type: msg.ruleId || 'syntax-error',
        message: msg.message,
        severity: msg.severity === 2 ? 'high' : 'medium',
        line: msg.line || null,
      });
    }
  }

  return issues;
}

// Analyze Python code using Pylint
function analyzePython(code) {
  const tempDir = os.tmpdir();
  const tempFile = path.join(tempDir, `review_${Date.now()}.py`);
  fs.writeFileSync(tempFile, code);

  const issues = [];

  try {
    const output = execSync(
      `pylint "${tempFile}" --output-format=json --disable=C0114,C0116`,
      { encoding: 'utf-8' }
    );
    const parsed = JSON.parse(output);

    for (const item of parsed) {
      issues.push({
        type: item.symbol || item['message-id'],
        message: item.message,
        severity: item.type === 'error' ? 'high' : item.type === 'warning' ? 'medium' : 'low',
        line: item.line || null,
      });
    }
  } catch (err) {
    if (err.stdout) {
      try {
        const parsed = JSON.parse(err.stdout);
        for (const item of parsed) {
          issues.push({
            type: item.symbol || item['message-id'],
            message: item.message,
            severity: item.type === 'error' ? 'high' : item.type === 'warning' ? 'medium' : 'low',
            line: item.line || null,
          });
        }
      } catch (parseErr) {
        console.error('Failed to parse pylint output:', parseErr);
      }
    } else {
      console.error('Pylint execution error:', err.message);
    }
  } finally {
    fs.unlinkSync(tempFile);
  }

  return issues;
}

async function runStaticAnalysis(code, language) {
  const lang = language.toLowerCase();

  if (lang === 'javascript' || lang === 'typescript') {
    return await analyzeJavaScript(code);
  } else if (lang === 'python') {
    return analyzePython(code);
  } else {
    return [];
  }
}

module.exports = { runStaticAnalysis };