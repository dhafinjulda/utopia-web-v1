import {createCallerFactory, createTRPCRouter} from "~/server/api/trpc";
import {eventRouter} from "~/server/api/routers/event";
import {partnerRouter} from "~/server/api/routers/partner";
import {mailRouter} from "~/server/api/routers/mail";
import {userRouter} from "~/server/api/routers/users";
import {upcomingEventRouter} from "~/server/api/routers/upcoming-event";
import {newsRouter} from "~/server/api/routers/news";
import {appSettingsRouter} from "~/server/api/routers/setting";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  event: eventRouter,
  partner: partnerRouter,
  mail: mailRouter,
  user: userRouter,
  upcomingEvent: upcomingEventRouter,
  news: newsRouter,
  setting: appSettingsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
