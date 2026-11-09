const path = require('bare-path')
const { spawn } = require('bare-subprocess')

const root = path.join(__dirname, '..')

exports.run = function run(name, args) {
  const bin = path.join(root, 'node_modules', name, 'bin.js')

  const subprocess = spawn('node', [bin, ...args], { stdio: ['ignore', 'ignore', 'inherit'] })

  return new Promise((resolve, reject) => {
    subprocess.on('exit', (code) => {
      if (code === 0) resolve()
      else reject(new Error(`${name} exited with ${code}`))
    })
  })
}
