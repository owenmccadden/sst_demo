import ApiStack from "./ApiStack";
import StorageStack from "./StorageStack";
import AuthStack from "./AuthStack";

export default function main(app) {
  // Set default runtime for all functions
  app.setDefaultFunctionProps({
    runtime: "nodejs12.x"
  });

  const storageStack = new StorageStack(app, "storage");

  const apiStack = new ApiStack(app, "api", {
    table: storageStack.table,
  });
  
  new AuthStack(app, "auth", {
    api: apiStack.api,
    bucket: storageStack.bucket
  });
}
