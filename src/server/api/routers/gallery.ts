import { type Prisma } from "@prisma/client";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";
import { partnerIdSchema } from "~/validation/partnerValidation";
import { gallerySchema } from "~/validation/galleryValidation";

export const galleryRouter = createTRPCRouter({
  get: publicProcedure.query(({ ctx }) => {
    return ctx.db.gallery.findMany({
      where: {
        status: {
          not: "DELETED",
        },
      },
      orderBy: { createdAt: "asc" },
      include: { image: true },
    });
  }),

  getFront: publicProcedure.query(({ ctx }) => {
    return ctx.db.gallery.findMany({
      where: {
        status: {
          not: "DELETED",
        },
      },
      orderBy: { createdAt: "desc" },
      include: { image: true },
      take: 3,
    });
  }),

  create: protectedProcedure.input(gallerySchema).mutation(async ({ ctx, input }) => {
    return ctx.db.gallery.create({
      data: {
        name: input.name,
        description: input.description,
        status: "ACTIVE",
        createdBy: { connect: { id: Number(ctx.session.user.id) } },
        image: {
          create: {
            path: input.image ?? "",
          },
        },
      },
    });
  }),

  update: protectedProcedure.input(gallerySchema).mutation(async ({ ctx, input }) => {
    return ctx.db.gallery.update({
      where: { id: input.id },
      data: {
        ...(input.name && { name: input.name }),
        ...(input.description && { description: input.description }),
        ...(input.image && {
          image: {
            create: {
              path: input.image,
            },
          },
        }),
      },
    });
  }),

  delete: protectedProcedure.input(partnerIdSchema).mutation(async ({ ctx, input }) => {
    return ctx.db.gallery.update({
      where: { id: input.id },
      data: {
        status: "DELETED",
      },
    });
  }),
});

export type GalleryWithImage = Prisma.GalleryGetPayload<{
  include: { image: true };
}>;
