import * as sst from "@serverless-stack/resources";

export default class StorageStack extends sst.Stack {
    // public reference to table
    bucket;
    table;

    constructor(scope, id, props) {
        super(scope, id, props);

        // Create s3 bucket
        this.bucket = new sst.Bucket(this, "Uploads", {
            s3Bucket: {
                cors: [
                    {
                        maxAge: 3000,
                        allowedOrigins: ["*"],
                        allowedHeaders: ["*"],
                        allowedMethods: ["GET", "PUT", "POST", "DELETE", "HEAD"],
                    },
                ],
            },
        });

        // Create DynamoDB table
        this.table = new sst.Table(this, "Notes", {
            fields: {
                userId: sst.TableFieldType.STRING,
                noteId: sst.TableFieldType.STRING,
            },
            primaryIndex: { partitionKey: "userId", sortKey: "noteId"},
        });
    }
}