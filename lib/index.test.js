const { test } = require('ava')
const mock = require('mock-require')
const { spy } = require('simple-spy')
const requireUncached = require('require-uncached')

const defaultOpts = Symbol('defaultOpts')
const defaultFiles = Symbol('defaultFiles')
const defaultArgs = [defaultOpts, defaultFiles]
const executeOnFilesReturnValue = Symbol('executeOnFilesReturnValue')

test.beforeEach((t) => {
  t.context.executeOnFilesSpy = spy((files) => executeOnFilesReturnValue)
  const cliEngineSpy = { executeOnFiles: t.context.executeOnFilesSpy }
  t.context.CLIEngineSpy = spy(function (options) { return cliEngineSpy })
  mock('eslint', { CLIEngine: t.context.CLIEngineSpy })
  t.context.subject = requireUncached('.')
})

test('exports function of arity 2', (t) => {
  t.is(typeof t.context.subject, 'function')
  t.is(t.context.subject.length, 2)
})

test('calls `CLIEngine` once', (t) => {
  t.context.subject(...defaultArgs)
  t.is(t.context.CLIEngineSpy.args.length, 1)
})

test('`CLIEngine` call has single argument', (t) => {
  t.context.subject(...defaultArgs)
  t.is(t.context.CLIEngineSpy.args.length, 1)
})

test('`CLIEngine` call argument', (t) => {
  t.context.subject(...defaultArgs)
  t.is(t.context.CLIEngineSpy.args[0][0], defaultOpts)
})

test('instantiates `CLIEngine`', (t) => {
  const CLIEngineStub = function (options) {
    t.true(this instanceof CLIEngineStub)
    return { executeOnFiles: () => {} }
  }
  t.context.CLIEngineSpy = CLIEngineStub
  mock('eslint', { CLIEngine: t.context.CLIEngineSpy })
  const subject = requireUncached('.')
  subject(...defaultArgs)
})

test('calls `executeOnFiles` once', (t) => {
  t.context.subject(...defaultArgs)
  t.is(t.context.executeOnFilesSpy.args.length, 1)
})

test('`executeOnFiles` call has single argument', (t) => {
  t.context.subject(...defaultArgs)
  t.is(t.context.executeOnFilesSpy.args[0].length, 1)
})

test('`executeOnFiles` call argument', (t) => {
  t.context.subject(...defaultArgs)
  t.is(t.context.executeOnFilesSpy.args[0][0], defaultFiles)
})

test('returns what `executeOnFiles` returns', (t) => {
  const actual = t.context.subject(...defaultArgs)
  t.is(actual, executeOnFilesReturnValue)
})
