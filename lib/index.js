const { CLIEngine } = require('eslint')

const lintFiles = (options, files) => {
  const cliEngine = new CLIEngine(options)
  return cliEngine.executeOnFiles(files)
}

module.exports = lintFiles
