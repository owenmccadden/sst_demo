import ApiStack from "./ApiStack";
import StorageStack from "./StorageStack";
import AuthStack from "./AuthStack";
import FrontendStack from "./FrontendStack";

export default function main(app) {
  // Set default runtime for all functions
  app.setDefaultFunctionProps({
    runtime: "nodejs12.x"
  });

  const storageStack = new StorageStack(app, "storage");

  const apiStack = new ApiStack(app, "api", {
    table: storageStack.table,
  });
  
  const authStack = new AuthStack(app, "auth", {
    api: apiStack.api,
    bucket: storageStack.bucket
  });

  new FrontendStack(app, "frontend", {
    api: apiStack.api,
    auth: authStack.auth,
    bucket: storageStack.bucket,
  });
}
