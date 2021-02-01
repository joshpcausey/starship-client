const config = {
  s3: {
    REGION: "us-east-1",
    BUCKET: "bullsofbrass-starship-upload",
  },
  apiGateway: {
    REGION: "us-east-1",
    URL: "https://l8o0xot7ng.execute-api.us-east-1.amazonaws.com/prod",
  },
  cognito: {
    REGION: "us-east-1",
    USER_POOL_ID: "us-east-1_nnZQ3B8po",
    APP_CLIENT_ID: "4f16bq2at4onjba9pa48mttc0v",
    IDENTITY_POOL_ID: "us-east-1:e1019949-c58c-4470-8a75-b7e3e60838b0",
  },
};

export default config;
