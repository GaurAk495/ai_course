import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/api/webhooks/clerk",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/",
  "/course/tanstack-query-fundamentals/0bfe207e-84e7-4316-9756-a2be7b72677c",
  "/course/chatgpt-productivity-prompts/0714cc29-858b-4ebb-990f-7e051a9c629d",
  "/course/basic-devops/1664e03a-9823-410c-bd57-0bff303d7ddb",
  "/course/express-typescript-intermediate/73d34f6c-d062-419a-b131-b0192b01d9c4",
]);

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
