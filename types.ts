import { Server, Member, Profile } from "@prisma/client";
import { Server as NetServer, Socket } from "net";
import { NextApiRequest } from "next";
import { Server as SocketIO } from "socket.io";

export type ServerWithMembersWithProfiles = Server & {
  members: (Member & { profile: Profile })[];
};

export type NextApiResponseServerIo = NextApiRequest & {
  socket: Socket & {
    server: NetServer & {
      io?: SocketIO;
    };
  };
};
