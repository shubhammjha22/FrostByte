import { currentProfile } from "@/lib/current-profile";
import prisma from "@/lib/db";
import { MemberRole } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: { channelId: string } }
) {
  try {
    const { searchParams } = new URL(req.url);
    const serverId = searchParams.get("serverId");
    const profile = await currentProfile();
    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    if (!serverId) {
      return new NextResponse("Server ID missing", { status: 400 });
    }

    const { channelId } = await params;
    if (!channelId) {
      return new NextResponse("Channel ID missing", { status: 400 });
    }
    console.log("Server id is =", serverId);

    const server = await prisma.server.update({
      where: {
        id: serverId,
        members: {
          some: {
            profileId: profile.id,
            role: {
              in: [MemberRole.MODERATOR, MemberRole.ADMIN],
            },
          },
        },
      },
      data: {
        channels: {
          delete: {
            id: channelId,
            name: {
              not: "general",
            },
          },
        },
      },
    });

    console.log("Server is this - ", server);

    return NextResponse.json(server);
  } catch (error) {
    console.log("[CHANNEL_ID_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { channelId: string } }
) {
  try {
    const { searchParams } = new URL(req.url);
    const serverId = searchParams.get("serverId");
    const { name, type } = await req.json();
    const profile = await currentProfile();
    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    if (!serverId) {
      return new NextResponse("Server ID missing", { status: 400 });
    }

    const { channelId } = await params;
    if (!channelId) {
      return new NextResponse("Channel ID missing", { status: 400 });
    }
    console.log("Server id is =", serverId);

    if (name === "general") {
      return new NextResponse("Name can't be 'general' ", { status: 400 });
    }

    const server = await prisma.server.update({
      where: {
        id: serverId,
        members: {
          some: {
            profileId: profile.id,
            role: {
              in: [MemberRole.MODERATOR, MemberRole.ADMIN],
            },
          },
        },
      },
      data: {
        channels: {
          update: {
            where: {
              id: channelId,
              NOT: {
                name: "general",
              },
            },
            data: {
              name,
              type,
            },
          },
        },
      },
    });

    console.log("Server is this - ", server);

    return NextResponse.json(server);
  } catch (error) {
    console.log("[CHANNEL_ID_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
