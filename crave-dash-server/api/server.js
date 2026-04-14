import {
  app_default,
  config
} from "./chunk-WSNDWTMD.js";

// src/server.ts
app_default.listen(config.port, () => {
  console.log(`Server is running on port ${config.port}`);
});
