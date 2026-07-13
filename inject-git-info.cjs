/**
 * author: Eric Bravo
 * email: eric@iterando.mx
 */

const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')
const dotenv = require('dotenv')

const envPath = path.join(__dirname, './.env')

let envConfig = {}
if (fs.existsSync(envPath)) {
	const envContents = fs.readFileSync(envPath, 'utf-8')
	envConfig = dotenv.parse(envContents)
 }
 
 let commitHash = 'unknown'
 try {
	commitHash = execSync('git rev-parse --short=8 HEAD').toString().trim()
 } catch (error) {
	console.log(`Failed to get Git commit hash:`, error.message)
 }
 
 let version = 'unknown'
 try {
	const packageJson = require('./package.json')
	version = packageJson.version
 } catch (error) {
	console.error(`Failed to get version from package.json:`, error.message)
 }
 
 // Update or add the necessary environment variables
 envConfig.VITE_APP_VERSION = version
 envConfig.VITE_APP_COMMIT_HASH = commitHash
 
 const updatedEnvContents = Object.entries(envConfig)
	.map(([key, value]) => `${key}=${value}`)
	.join('\n')
 
 fs.writeFileSync(envPath, updatedEnvContents)
 
 console.log(`Inject Git info and version info .env file`)