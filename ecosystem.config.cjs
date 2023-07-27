module.exports = {
  apps: [
    {
      name: "nest",
      script: "./dist/main.js",
      instances: 1,
      exec_mode: "cluster",
      restart_delay: 10000,
      listen_timeout: 10000,
      env: {
        NODE_ENV: "production",
      }
    },
  ],
};
