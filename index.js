// 代码引用于 github，在其基础上进行了修改：
// https://github.com/manyuanrong/setup-ossutil/blob/master/index.js

const core = require('@actions/core')
const { exec } = require('@actions/exec')
const toolCache = require('@actions/tool-cache')
const path = require('path')
const fs = require('fs')

const url = 'http://collection.b0.upaiyun.com/softwares/upx/upx-linux-amd64-v0.2.4'

async function main () {
  const bucket = core.getInput('bucket')
  const operator = core.getInput('operator')
  const password = core.getInput('password')

  let toolPath = toolCache.find('upx', '0.2.4')

  if (!toolPath) {
    core.info(`downloading from ${url}`)
    toolPath = await toolCache.downloadTool(url)
    core.info(`downloaded to ${toolPath}`)
  }

  const bin = path.join(__dirname, '.bin')
  if (!fs.existsSync(bin)) {
    fs.mkdirSync(bin, {
      recursive: true
    })
  }

  fs.copyFileSync(toolPath, path.join(bin, 'upx'))
  fs.chmodSync(path.join(bin, 'upx'), 0o755)

  core.addPath(bin)

  await exec('upx', ['login', bucket, operator, password])
}

main().catch(error => {
  core.setFailed(error.message)
})
