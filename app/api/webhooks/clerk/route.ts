// app/api/webhooks/clerk/route.ts
import { Webhook } from "svix";
import { headers } from "next/headers";
import prisma from "@/lib/prisma";

const clerk_webhook_secret = process.env.CLERK_WEBHOOK_SECRET!;

if (!clerk_webhook_secret) {
  throw new Error("Missing CLERK_WEBHOOK_SECRET");
}

export async function POST(req: Request) {
  const payload = await req.text();
  const headerPayload = await headers();

  const wh = new Webhook(clerk_webhook_secret);

  let evt;
  try {
    evt = wh.verify(payload, {
      "svix-id": headerPayload.get("svix-id")!,
      "svix-timestamp": headerPayload.get("svix-timestamp")!,
      "svix-signature": headerPayload.get("svix-signature")!,
    });
  } catch (err) {
    console.error("Webhook verification failed", err);
    return new Response("Invalid signature", { status: 400 });
  }

  const { type, data } = evt as any;

  try {
    switch (type) {
      case "user.created":
        await handleUserCreated(data);
        break;

      case "user.updated":
        await handleUserUpdated(data);
        break;

      case "user.deleted":
        await handleUserDeleted(data);
        break;
    }
  } catch (error) {
    console.error(`Error handling ${type} event:`, error);
    return new Response("Internal server error", { status: 500 });
  }

  return new Response("OK");
}

async function handleUserCreated(data: any) {
  await prisma.user.create({
    data: {
      clerkId: data.id,
      email: data.email_addresses[0]?.email_address ?? null,
      name: `${data.first_name ?? ""} ${data.last_name ?? ""}`.trim(),
      avatar: data.image_url,
    },
  });
}

async function handleUserUpdated(data: any) {
  await prisma.user.update({
    where: { clerkId: data.id },
    data: {
      email: data.email_addresses[0]?.email_address ?? null,
      name: `${data.first_name ?? ""} ${data.last_name ?? ""}`.trim(),
      avatar: data.image_url,
    },
  });
}

async function handleUserDeleted(data: any) {
  await prisma.user.delete({
    where: { clerkId: data.id },
  });
}
