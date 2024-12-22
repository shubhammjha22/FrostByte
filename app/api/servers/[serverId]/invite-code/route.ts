import { currentProfile } from "@/lib/current-profile";
import prisma from "@/lib/db";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function PATCH(
  req: Request,
  { params }: { params: { serverId: string } }
) {
  try {
    const profile = await currentProfile();
    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { serverId } = await params;

    if (!serverId) {
      return new NextResponse("Server ID missing", { status: 400 });
    }

    const server = await prisma.server.update({
      where: {
        id: serverId,
        profileId: profile.id,
      },
      data: {
        inviteCode: uuidv4(),
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log("[Server_ID", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
