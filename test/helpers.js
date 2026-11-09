const path = require('bare-path')
const { spawn } = require('bare-subprocess')

const root = path.join(__dirname, '..')

exports.bin = function bin(name) {
  return path.join(root, 'node_modules', '.bin', name)
}

exports.run = function run(args) {
  const subprocess = spawn(args[0], args.slice(1), { stdio: ['ignore', 'ignore', 'inherit'] })

  return new Promise((resolve, reject) => {
    subprocess.on('exit', (code) => {
      if (code === 0) resolve()
      else reject(new Error(`${args[0]} exited with ${code}`))
    })
  })
}
