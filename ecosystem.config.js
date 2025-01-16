module.exports = {
  apps: [{
    name: "rsbetc",
    cwd: "/var/www/html/rsbetc",
    script: "npm",
    args: "start",
    env: {
      PORT: 3000,
      NODE_ENV: "production"
    }
  }]
}
